import React, { useEffect, useState, useCallback, memo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import { deleteService, getServices, updateService } from '../../services/serviceApi';
import styles from './Services.module.scss';

// ===========================
// MEMOIZED SERVICE ROW
// Only re-renders when its own props change.
// ===========================
const ServiceRow = memo(({ service, onToggle, onDelete, onNavigate }) => {
  return (
    <tr className={styles.tableRow}>
      <td>
        <button
          type="button"
          className={styles.linkBtn}
          onClick={() => onNavigate(service.serviceId)}
        >
          {service.serviceName}
        </button>
      </td>
      <td>
        <div className={styles.toggleContainer}>
          <button
            type="button"
            className={`${styles.toggleSwitch} ${service.isActive ? styles.toggleActive : styles.toggleInactive}`}
            onClick={() => onToggle(service)}
            aria-label={`Toggle ${service.serviceName} status`}
            title={service.isActive ? 'Active — click to deactivate' : 'Inactive — click to activate'}
          >
            <span className={styles.toggleKnob}></span>
          </button>
        </div>
      </td>
      <td className={styles.actionsCell}>
        <div className={styles.iconBtnGroup}>
          <Link
            className={styles.iconBtn}
            to={`${service.serviceId}/edit`}
            title="Edit service"
          >
            <FiEdit className={styles.editIcon} />
            <span className={styles.tooltip}>Edit</span>
          </Link>
          <button
            type="button"
            className={`${styles.iconBtn} ${styles.iconBtnDanger}`}
            onClick={() => onDelete(service)}
            title="Delete service"
          >
            <FiTrash2 className={styles.deleteIcon} />
            <span className={styles.tooltip}>Delete</span>
          </button>
        </div>
      </td>
    </tr>
  );
});

ServiceRow.displayName = 'ServiceRow';

// ===========================
// SERVICE LIST
// ===========================
const ServiceList = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [processingId, setProcessingId] = useState(null);
  const navigate = useNavigate();

  // ---- Initial fetch (runs once) ----
  const loadServices = useCallback(async () => {
    console.debug('[ServiceList] loadServices start');
    setLoading(true);
    setError('');

    try {
      const data = await getServices();
      console.debug('[ServiceList] received data', data);
      setServices(Array.isArray(data) ? data : []);
    } catch (fetchError) {
      console.error('[ServiceList] loadServices error', fetchError);
      setError(fetchError.message || 'Unable to load services.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadServices();
  }, [loadServices]);

  // ---- Optimistic Toggle ----
  // 1. Flip the local state immediately (no flicker).
  // 2. Fire the API call in the background.
  // 3. Revert only if the API call fails.
  const handleToggleStatus = useCallback(async (service) => {
    const { serviceId, serviceName, isActive } = service;
    const newStatus = !isActive;

    // Optimistic update — flip instantly in local state
    setServices((prev) =>
      prev.map((s) =>
        s.serviceId === serviceId ? { ...s, isActive: newStatus } : s
      )
    );
    setError('');

    try {
      console.debug('[ServiceList] toggling status for', serviceId);
      await updateService(serviceId, {
        serviceName,
        isActive: newStatus,
      });
      // API succeeded — nothing else to do, state is already correct
    } catch (toggleError) {
      console.error('[ServiceList] toggle error', toggleError);

      // Revert the optimistic update
      setServices((prev) =>
        prev.map((s) =>
          s.serviceId === serviceId ? { ...s, isActive } : s
        )
      );
      setError(toggleError.message || 'Unable to update service status.');
    }
  }, []);

  // ---- Navigate to details ----
  const handleNavigate = useCallback(
    (serviceId) => {
      navigate(`${serviceId}`);
    },
    [navigate]
  );

  // ---- Delete flow ----
  const openDeleteDialog = useCallback((service) => {
    setConfirmDelete(service);
  }, []);

  const closeDeleteDialog = useCallback(() => {
    setConfirmDelete(null);
  }, []);

  const handleDelete = useCallback(async () => {
    if (!confirmDelete) {
      return;
    }

    setProcessingId(confirmDelete.serviceId);
    setError('');

    try {
      console.debug('[ServiceList] deleting service', confirmDelete.serviceId);
      await deleteService(confirmDelete.serviceId);

      // Remove the deleted service from local state (no full refetch)
      setServices((prev) =>
        prev.filter((s) => s.serviceId !== confirmDelete.serviceId)
      );
      setConfirmDelete(null);
    } catch (deleteError) {
      setError(deleteError.message || 'Unable to remove service.');
    } finally {
      setProcessingId(null);
    }
  }, [confirmDelete]);

  return (
    <div className={styles.sectionCard}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Services</h1>
        </div>
        <Link className={styles.primaryBtn} to="add">
          + Add Service
        </Link>
      </div>

      {error && <div className={styles.errorBox}>{error}</div>}

      {loading ? (
        <div className={styles.loading}>
          <div className={styles.loadingSpinner}></div>
          Loading services...
        </div>
      ) : services.length === 0 ? (
        <div className={styles.emptyState}>
          No services are available yet. Click Add Service to create the first record.
        </div>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.listTable}>
            <thead>
              <tr>
                <th>Service</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.map((service) => (
                <ServiceRow
                  key={service.serviceId}
                  service={service}
                  onToggle={handleToggleStatus}
                  onDelete={openDeleteDialog}
                  onNavigate={handleNavigate}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

      {confirmDelete && (
        <div className={styles.confirmOverlay}>
          <div className={styles.confirmModal}>
            <div className={styles.confirmIconWrap}>
              <FiTrash2 size={28} />
            </div>
            <h2 className={styles.confirmTitle}>Delete Service</h2>
            <p className={styles.confirmText}>
              Are you sure you want to delete <strong>{confirmDelete.serviceName}</strong>? This action cannot be undone.
            </p>
            <div className={styles.confirmActions}>
              <button type="button" className={styles.secondaryBtn} onClick={closeDeleteDialog}>
                Cancel
              </button>
              <button
                type="button"
                className={styles.deleteBtn}
                onClick={handleDelete}
                disabled={Boolean(processingId)}
              >
                {processingId === confirmDelete.serviceId ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceList;
