import { useEffect, useMemo, useState } from "react";
import {
  Loader2,
  Mail,
  RefreshCw,
  Search,
  Trash,
  X,
  MessageSquare
} from "lucide-react";
import { Button } from "../../../components/common/Button/Button";
import { contactService } from "../../../api/contactService";
import toast from "react-hot-toast";
import "./ManageMessages.css";

const formatDate = (value) =>
  value
    ? new Date(value).toLocaleString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "-";

function DeleteMessageModal({ message, onClose, onConfirm, isDeleting }) {
  return (
    <div className="admin-modal-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="admin-modal delete-modal">
        <div className="admin-modal-header">
          <div>
            <p className="admin-modal-eyebrow danger">Delete message</p>
            <h2>From {message.name}</h2>
          </div>
          <Button variant="none" className="admin-modal-close" onClick={onClose} aria-label="Close dialog">
            <X size={18} />
          </Button>
        </div>

        <div className="admin-modal-body">
          <p className="delete-warning">
            This will permanently remove the contact message. Only do this if the inquiry has been resolved.
          </p>
          <div className="delete-preview">
            <strong>{message.email}</strong>
            <span className="truncate-text">{message.message}</span>
          </div>
        </div>

        <div className="admin-modal-actions">
          <Button variant="admin-secondary" onClick={onClose} disabled={isDeleting}>
            Cancel
          </Button>
          <Button variant="admin-danger" onClick={onConfirm} disabled={isDeleting}>
            {isDeleting ? <Loader2 size={16} className="spin" /> : <Trash size={16} />}
            <span>{isDeleting ? "Deleting" : "Delete message"}</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

function ViewMessageModal({ message, onClose }) {
  return (
    <div className="admin-modal-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="admin-modal message-modal">
        <div className="admin-modal-header">
          <div>
            <p className="admin-modal-eyebrow">Message Details</p>
            <h2>{message.name}</h2>
          </div>
          <Button variant="none" className="admin-modal-close" onClick={onClose} aria-label="Close dialog">
            <X size={18} />
          </Button>
        </div>

        <div className="admin-modal-body">
          <div className="message-detail-header">
            <div>
              <strong>Email:</strong> {message.email}
            </div>
            <div>
              <strong>Date:</strong> {formatDate(message.created_at)}
            </div>
          </div>
          <div className="message-detail-content">
            {message.message}
          </div>
        </div>

        <div className="admin-modal-actions">
          <Button variant="admin-primary" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function ManageMessages() {
  const [messages, setMessages] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [deletingMessage, setDeletingMessage] = useState(null);
  const [viewingMessage, setViewingMessage] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadMessages = async (showSpinner = true) => {
    try {
      if (showSpinner) setIsLoading(true);
      else setIsRefreshing(true);

      const data = await contactService.getMessages();
      setMessages(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error(err?.message || "Failed to load messages.");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadMessages(true);
  }, []);

  const filteredMessages = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return messages;
    }

    return messages.filter((msg) => {
      const searchable = [msg.name, msg.email, msg.message]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchable.includes(query);
    });
  }, [messages, searchQuery]);

  const totalMessages = messages.length;

  const handleDeleteMessage = async () => {
    if (!deletingMessage) return;

    try {
      setIsDeleting(true);
      await contactService.deleteMessage(deletingMessage.message_id);
      setMessages((prev) => prev.filter((msg) => msg.message_id !== deletingMessage.message_id));
      setDeletingMessage(null);
      toast.success("Message deleted successfully.");
    } catch (err) {
      toast.error(err?.message || "Failed to delete message.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="view-container">
      <div className="sticky-header">
        <header className="page-header">
          <h1>Messages</h1>

          <div className="quick-stats-bar" style={{ padding: 0 }}>
            <div className="stat-card">
              <div className="stat-icon"><Mail size={14} /></div>
              <div className="stat-info">
                <span className="stat-value">{totalMessages}</span>
                <span className="stat-label">Total Inquiries</span>
              </div>
            </div>
          </div>

          <div className="page-header-actions">
            <Button variant="admin-secondary" onClick={() => loadMessages(false)} disabled={isRefreshing}>
              {isRefreshing ? <Loader2 size={16} className="spin" /> : <RefreshCw size={16} />}
              <span>{isRefreshing ? "Refreshing" : "Refresh"}</span>
            </Button>
          </div>
        </header>
      </div>

      <div className="view-content">
        <div className="table-search-bar message-toolbar">
          <div className="search-container">
            <Search size={16} />
            <input
              type="text"
              placeholder="Search messages by name, email, or content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="table-container">
          <table className="admin-table messages-table">
            <thead>
              <tr>
                <th style={{ width: "60px" }}>ID</th>
                <th style={{ width: "250px" }}>Sender</th>
                <th>Message Snippet</th>
                <th style={{ width: "200px" }}>Received</th>
                <th style={{ width: "120px" }}></th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="5">
                    <div className="table-state">
                      <Loader2 size={18} className="spin" />
                      <span>Loading messages...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredMessages.length === 0 ? (
                <tr>
                  <td colSpan="5">
                    <div className="table-state empty">
                      <MessageSquare size={18} />
                      <div>
                        <strong>No messages found</strong>
                        <p>No contact inquiries match your search.</p>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredMessages.map((msg) => (
                  <tr key={msg.message_id} className="cursor-pointer" onClick={() => setViewingMessage(msg)}>
                    <td><span className="sku">#{msg.message_id}</span></td>
                    <td>
                      <div className="sender-info">
                        <strong>{msg.name}</strong>
                        <span className="sender-email">{msg.email}</span>
                      </div>
                    </td>
                    <td>
                      <div className="message-snippet">
                        {msg.message}
                      </div>
                    </td>
                    <td>{formatDate(msg.created_at)}</td>
                    <td onClick={(e) => e.stopPropagation()}>
                      <div className="table-actions">
                        <Button 
                          variant="text" 
                          className="action-delete" 
                          title="Delete message" 
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeletingMessage(msg);
                          }}
                        >
                          <Trash size={16} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {viewingMessage && (
        <ViewMessageModal
          message={viewingMessage}
          onClose={() => setViewingMessage(null)}
        />
      )}

      {deletingMessage && (
        <DeleteMessageModal
          message={deletingMessage}
          onClose={() => setDeletingMessage(null)}
          onConfirm={handleDeleteMessage}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
}
