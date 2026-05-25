import { useState, useEffect, useMemo } from "react";
import {
  PhilippinePeso,
  ShoppingCart,
  Users,
  AlertTriangle,
  Package,
  TrendingUp,
  LayoutDashboard,
  Loader2,
  Clock3,
  CheckCircle,
  Truck,
  X,
  RefreshCw
} from "lucide-react";
import { Button } from "../../../components/common/Button/Button";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { productsService } from "../../../api/productService";
import { orderService } from "../../../api/orderService";
import { customerService } from "../../../api/customerService";
import "./Dashboard.css";

const currencyFormatter = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
  minimumFractionDigits: 2,
});

const formatCurrency = (value) => currencyFormatter.format(Number(value || 0));

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p className="label">{label}</p>
        <p className="value">{formatCurrency(payload[0].value)}</p>
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  const [data, setData] = useState({ products: [], orders: [], customers: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [products, orders, customers] = await Promise.all([
        productsService.getProducts(),
        orderService.getOrders(),
        customerService.getCustomers(),
      ]);

      setData({ products, orders, customers });
      setError("");
    } catch (err) {
      console.error("Dashboard data fetch error", err);
      setError("Failed to load dashboard data. Backend might be unreachable.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const metrics = useMemo(() => {
    const { products, orders, customers } = data;
    
    const totalRevenue = orders
      .filter((o) => o.status !== "Cancelled")
      .reduce((sum, o) => sum + Number(o.total_amount || 0), 0);
    
    const totalOrders = orders.length;
    const totalCustomers = customers.length;
    
    const lowStockAlerts = products.filter(
      (p) => Number(p.stock_quantity || 0) <= 10
    ).length;

    return { totalRevenue, totalOrders, totalCustomers, lowStockAlerts };
  }, [data]);

  const chartData = useMemo(() => {
    const { orders } = data;
    if (!orders.length) return [];

    // Group valid orders by date
    const grouped = orders
      .filter(o => o.status !== "Cancelled" && o.created_at)
      .reduce((acc, order) => {
        const date = new Date(order.created_at);
        const key = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
        acc[key] = (acc[key] || 0) + Number(order.total_amount || 0);
        return acc;
      }, {});

    // Sort by actual date to ensure timeline is correct
    return Object.entries(grouped)
      .map(([date, revenue]) => ({ date, revenue }))
      .slice(-14); // Show up to last 14 unique active days
  }, [data]);

  const recentOrders = useMemo(() => {
    return [...data.orders]
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 10); // Show last 10
  }, [data]);

  const renderStatusIcon = (status) => {
    switch (status) {
      case "Pending": return <Clock3 size={12} />;
      case "Completed": return <CheckCircle size={12} />;
      case "Shipped": return <Truck size={12} />;
      case "Processing": return <Loader2 size={12} className="spin" />;
      default: return <X size={12} />;
    }
  };

  return (
    <div className="view-container">
      <div className="sticky-header">
        <header className="page-header">
          <h1>Dashboard</h1>
          <div className="page-header-actions">
            <Button variant="admin-secondary" onClick={fetchData} disabled={isLoading}>
              <RefreshCw size={16} className={isLoading ? "spin" : ""} /> Refresh
            </Button>
          </div>
        </header>
      </div>

      <div className="view-content dashboard-content">
        {error && (
          <div className="utilities-inline-alert" style={{ marginBottom: 16 }}>
            <AlertTriangle size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* METRICS ROW */}
        <div className="dashboard-metrics">
          <div className="dashboard-metric-card">
            <div className="metric-icon-wrap revenue">
              <PhilippinePeso size={24} />
            </div>
            <div className="metric-info">
              <span className="metric-label">Total Revenue</span>
              <span className="metric-value">
                {isLoading ? "..." : formatCurrency(metrics.totalRevenue)}
              </span>
              <span className="metric-sub">From active orders</span>
            </div>
          </div>

          <div className="dashboard-metric-card">
            <div className="metric-icon-wrap orders">
              <ShoppingCart size={24} />
            </div>
            <div className="metric-info">
              <span className="metric-label">Total Orders</span>
              <span className="metric-value">
                {isLoading ? "..." : metrics.totalOrders}
              </span>
              <span className="metric-sub">All-time transactions</span>
            </div>
          </div>

          <div className="dashboard-metric-card">
            <div className="metric-icon-wrap customers">
              <Users size={24} />
            </div>
            <div className="metric-info">
              <span className="metric-label">Total Customers</span>
              <span className="metric-value">
                {isLoading ? "..." : metrics.totalCustomers}
              </span>
              <span className="metric-sub">Registered accounts</span>
            </div>
          </div>

          <div className="dashboard-metric-card">
            <div className="metric-icon-wrap alerts">
              <AlertTriangle size={24} />
            </div>
            <div className="metric-info">
              <span className="metric-label">Low Stock</span>
              <span className="metric-value">
                {isLoading ? "..." : metrics.lowStockAlerts}
              </span>
              <span className="metric-sub">Items &le; 10 remaining</span>
            </div>
          </div>
        </div>

        {/* MAIN PANELS ROW */}
        <div className="dashboard-main-row">
          {/* CHART PANEL */}
          <div className="dashboard-panel">
            <div className="panel-header">
              <h2><TrendingUp size={18} /> Revenue Overview</h2>
            </div>
            <div className="panel-content">
              {isLoading ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--admin-muted)' }}>
                  <Loader2 className="spin" size={24} />
                </div>
              ) : chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="date" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 11, fill: 'var(--admin-muted)' }} 
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 11, fill: 'var(--admin-muted)' }}
                      tickFormatter={(val) => `₱${(val / 1000).toFixed(0)}k`}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#10b981" 
                      strokeWidth={2}
                      fillOpacity={1} 
                      fill="url(#colorRevenue)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--admin-muted)' }}>
                  <p>No revenue data available.</p>
                </div>
              )}
            </div>
          </div>

          {/* RECENT ORDERS PANEL */}
          <div className="dashboard-panel">
            <div className="panel-header">
              <h2><ShoppingCart size={18} /> Recent Orders</h2>
            </div>
            <div className="panel-content">
              <div className="recent-orders-list">
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="recent-order-item" style={{ opacity: 0.5 }}>
                      <div className="roi-left">
                        <div className="roi-icon"><Loader2 size={16} className="spin" /></div>
                        <div className="roi-details">
                          <span className="roi-id">Loading...</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : recentOrders.length > 0 ? (
                  recentOrders.map((order) => (
                    <div key={order.order_id} className="recent-order-item">
                      <div className="roi-left">
                        <div className="roi-icon"><Package size={16} /></div>
                        <div className="roi-details">
                          <span className="roi-id">#{order.order_id}</span>
                          <span className="roi-customer">
                            {order.first_name} {order.last_name}
                          </span>
                        </div>
                      </div>
                      <div className="roi-right">
                        <span className="roi-amount">{formatCurrency(order.total_amount)}</span>
                        <span className={`roi-status ${String(order.status || '').toLowerCase()}`}>
                          {renderStatusIcon(order.status)}
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--admin-muted)' }}>
                    <p>No orders yet.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
