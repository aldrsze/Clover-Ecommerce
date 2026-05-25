import React from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "../../../components/common/Button/Button";
import "./ProductModal.css";

export const DeleteConfirmModal = ({ product, onConfirm, onCancel }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content delete-confirm-modal">
        <div className="delete-confirm-icon">
          <AlertTriangle size={40} />
        </div>
        <h2>Delete Product</h2>
        <p className="delete-confirm-text">
          Are you sure you want to delete{" "}
          <strong>{product?.name}</strong>? This action cannot be undone.
        </p>
        <div className="modal-footer delete-confirm-footer">
          <Button type="button" variant="admin-secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            type="button"
            variant="admin-primary"
            className="btn-danger"
            onClick={() => onConfirm(product?.id)}
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};
