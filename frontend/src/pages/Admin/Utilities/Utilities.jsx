import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  Download,
  HardDrive,
  Loader2,
  RefreshCw,
  RotateCcw,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  Users,
  Package,
} from "lucide-react";
import { Button } from "../../../components/common/Button/Button";
import { productsService } from "../../../api/productService";
import { orderService } from "../../../api/orderService";
import { customerService } from "../../../api/customerService";
import toast from "react-hot-toast";
import "./Utilities.css";

const currencyFormatter = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
  minimumFractionDigits: 2,
});

const formatCurrency = (value) => currencyFormatter.format(Number(value || 0));

const buildSnapshot = ({ products, orders, customers }) => {
  const totalProducts = products.length;
  const inStockProducts = products.filter((product) => Number(product.stock_quantity || 0) > 0).length;
  const lowStockProducts = products.filter((product) => Number(product.stock_quantity || 0) > 0 && Number(product.stock_quantity || 0) <= 10).length;
  const outOfStockProducts = products.filter((product) => Number(product.stock_quantity || 0) === 0).length;

  const totalOrders = orders.length;
  const pendingOrders = orders.filter((order) => order.status === "Pending").length;
  const completedOrders = orders.filter((order) => order.status === "Completed").length;
  const totalRevenue = orders.reduce((sum, order) => sum + Number(order.total_amount || 0), 0);

  const totalCustomers = customers.length;
  const activeCustomers = customers.filter((customer) => Number(customer.order_count || 0) > 0).length;

  return {
    generatedAt: new Date().toISOString(),
    products: {
      totalProducts,
      inStockProducts,
      lowStockProducts,
      outOfStockProducts,
    },
    orders: {
      totalOrders,
      pendingOrders,
      completedOrders,
      totalRevenue,
    },
    customers: {
      totalCustomers,
      activeCustomers,
      dormantCustomers: totalCustomers - activeCustomers,
    },
  };
};

export default function Utilities() {
  const [snapshot, setSnapshot] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isClearingCart, setIsClearingCart] = useState(false);
  const [statusMessage, setStatusMessage] = useState("Ready to run maintenance actions.");

  const loadSnapshot = async (showSpinner = true) => {
    try {
      if (showSpinner) setIsLoading(true);
      else setIsRefreshing(true);

      const [productsResult, ordersResult, customersResult] = await Promise.allSettled([
        productsService.getProducts(),
        orderService.getOrders(),
        customerService.getCustomers(),
      ]);

      const products = productsResult.status === "fulfilled" && Array.isArray(productsResult.value) ? productsResult.value : [];
      const orders = ordersResult.status === "fulfilled" && Array.isArray(ordersResult.value) ? ordersResult.value : [];
      const customers = customersResult.status === "fulfilled" && Array.isArray(customersResult.value) ? customersResult.value : [];

      setSnapshot(buildSnapshot({ products, orders, customers }));

      const failures = [productsResult, ordersResult, customersResult].filter((result) => result.status === "rejected");
      if (failures.length > 0) {
        toast.error("Some source data could not be loaded. The snapshot shows whatever was available.");
      }

      setStatusMessage("System snapshot refreshed.");
      if (!showSpinner) {
        toast.success("System snapshot refreshed.");
      }
    } catch (err) {
      toast.error(err?.message || "Failed to load utilities snapshot.");
      setSnapshot(null);
      setStatusMessage("Unable to refresh snapshot.");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadSnapshot(true);
  }, []);

  const summaryCards = useMemo(() => {
    if (!snapshot) return [];

    return [
      {
        label: "Products",
        value: snapshot.products.totalProducts,
        detail: `${snapshot.products.inStockProducts} in stock · ${snapshot.products.lowStockProducts} low stock`,
        icon: Package,
      },
      {
        label: "Orders",
        value: snapshot.orders.totalOrders,
        detail: `${snapshot.orders.pendingOrders} pending · ${snapshot.orders.completedOrders} completed`,
        icon: ShoppingCart,
      },
      {
        label: "Revenue",
        value: formatCurrency(snapshot.orders.totalRevenue),
        detail: "Total gross sales from the current order set",
        icon: HardDrive,
      },
      {
        label: "Customers",
        value: snapshot.customers.totalCustomers,
        detail: `${snapshot.customers.activeCustomers} active · ${snapshot.customers.dormantCustomers} dormant`,
        icon: Users,
      },
    ];
  }, [snapshot]);

  const downloadReport = async () => {
    if (!snapshot) return;

    try {
      setIsDownloading(true);
      setStatusMessage("Preparing report download...");

      const blob = new Blob([JSON.stringify(snapshot, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `clover-admin-utilities-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);

      setStatusMessage("Snapshot downloaded.");
      toast.success("Snapshot downloaded.");
    } finally {
      setIsDownloading(false);
    }
  };

  const clearCartCache = () => {
    setIsClearingCart(true);
    try {
      localStorage.removeItem("clover_cart");
      setStatusMessage("Saved cart cache cleared from this browser.");
      toast.success("Cart cache cleared.");
    } finally {
      setIsClearingCart(false);
    }
  };

  return (
    <div className="view-container">
      <div className="sticky-header">
        <header className="page-header utilities-header">
          <div>
            <p className="page-kicker">Maintenance center</p>
            <h1>Utilities</h1>
          </div>

          <div className="page-header-actions">
            <Button variant="admin-secondary" onClick={() => loadSnapshot(false)} disabled={isRefreshing}>
              {isRefreshing ? <Loader2 size={16} className="spin" /> : <RefreshCw size={16} />}
              <span>{isRefreshing ? "Refreshing" : "Refresh data"}</span>
            </Button>
          </div>
        </header>
      </div>

      <div className="view-content utilities-content">
        <section className="utilities-panel utilities-panel-single">
          <div className="utilities-panel-top">
            <div>
              <div className="utilities-badge">
                <ShieldCheck size={14} />
                <span>System tools</span>
              </div>
              <h2>Compact admin maintenance hub</h2>
              <p>
                Snapshot the store, export a report, and clear the local cart cache from one focused panel.
              </p>
            </div>

            <div className="utilities-status-card compact">
              <div className="utilities-status-head">
                <Sparkles size={16} />
                <span>Current status</span>
              </div>
              <strong>{isLoading ? "Loading snapshot" : "Ready"}</strong>
              <span className="utilities-status-time">
                {snapshot ? `Updated ${new Date(snapshot.generatedAt).toLocaleString()}` : "Waiting for first snapshot"}
              </span>
            </div>
          </div>

          <div className="utilities-metrics-grid">
            {summaryCards.map((card) => {
              const Icon = card.icon;
              return (
                <article key={card.label} className="utility-metric-card compact">
                  <div className="utility-metric-icon">
                    <Icon size={16} />
                  </div>
                  <div className="utility-metric-copy">
                    <span>{card.label}</span>
                    <strong>{card.value}</strong>
                    <p>{card.detail}</p>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="utilities-actions-grid">
            <div className="utility-action-card compact">
              <div className="utility-action-icon">
                <Package size={16} />
              </div>
              <div className="utility-action-copy">
                <strong>Live inventory</strong>
                <p>Flags low and out-of-stock products from the latest admin data.</p>
              </div>
            </div>

            <div className="utility-action-card compact">
              <div className="utility-action-icon">
                <ShoppingCart size={16} />
              </div>
              <div className="utility-action-copy">
                <strong>Order snapshot</strong>
                <p>Shows pending orders, completed orders, and total revenue.</p>
              </div>
            </div>

            <div className="utility-action-card compact">
              <div className="utility-action-icon">
                <Users size={16} />
              </div>
              <div className="utility-action-copy">
                <strong>Customer activity</strong>
                <p>Summarizes active and dormant customers in a glance.</p>
              </div>
            </div>

            <div className="utility-action-card compact">
              <div className="utility-action-icon">
                <RotateCcw size={16} />
              </div>
              <div className="utility-action-copy">
                <strong>Local maintenance</strong>
                <p>Removes the saved storefront cart from this browser.</p>
              </div>
            </div>
          </div>

          <div className="utilities-footer-row">
            <Button variant="admin-primary" onClick={downloadReport} disabled={isDownloading || !snapshot}>
              {isDownloading ? <Loader2 size={16} className="spin" /> : <Download size={16} />}
              <span>{isDownloading ? " Downloading" : " Download snapshot"}</span>
            </Button>

            <Button variant="admin-secondary" onClick={clearCartCache} disabled={isClearingCart}>
              {isClearingCart ? <Loader2 size={16} className="spin" /> : <RotateCcw size={16} />}
              <span>{isClearingCart ? " Clearing" : " Clear cart cache"}</span>
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
