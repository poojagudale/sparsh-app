import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiEdit, FiTrash2, FiArrowLeft } from 'react-icons/fi';
import { deleteService, getService } from '../../services/serviceApi';
import styles from './Services.module.scss';

const ServiceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const fetchService = async () => {
      console.debug('[ServiceDetails] fetchService start', id);
      setLoading(true);
      setApiError('');

      try {
        const response = await getService(id);
        console.debug('[ServiceDetails] received service:', response);
        setService(response);
      } catch (fetchError) {
        console.error('[ServiceDetails] fetchService error:', fetchError);
        setApiError(fetchError.message || 'Unable to load service details.');
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [id]);

  const handleDelete = async () => {
    setProcessing(true);
    setApiError('');

    try {
      console.debug('[ServiceDetails] deleting service', id);
      await deleteService(id);
      console.debug('[ServiceDetails] delete success');
      navigate('/services');
    } catch (deleteError) {
      console.error('[ServiceDetails] delete error:', deleteError);
      setApiError(deleteError.message || 'Unable to delete service.');
    } finally {
      setProcessing(false);
      setConfirmDelete(false);
    }
  };

  return (
    <div className={styles.sectionCard}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Service Details</h1>
          <p className={styles.pageSubtitle}>Review service information and manage the record from the details view.</p>
        </div>
      </div>

      {apiError && <div className={styles.errorBox}>{apiError}</div>}

      {loading ? (
        <div className={styles.loading}>
          <div className={styles.loadingSpinner}></div>
          Loading service details...
        </div>
      ) : service ? (
        <>
          <div className={styles.detailsGrid}>
            <div className={styles.detailsItem}>
              <span className={styles.detailsLabel}>Name</span>
              <span className={styles.detailsValue}>{service.serviceName}</span>
            </div>
            <div className={styles.detailsItem}>
              <span className={styles.detailsLabel}>Status</span>
              <span className={styles.detailsValue}>
                <span className={`${styles.statusBadge} ${service.isActive ? styles.active : styles.inactive}`}>
                  <span className={styles.statusDot}></span>
                  {service.isActive ? 'Active' : 'Inactive'}
                </span>
              </span>
            </div>
            <div className={styles.detailsItem}>
              <span className={styles.detailsLabel}>Service ID</span>
              <span className={styles.detailsValue}>{service.id}</span>
            </div>
          </div>

          <div className={styles.formActions}>
            <button type="button" className={styles.secondaryBtn} onClick={() => navigate('/services')}>
              <FiArrowLeft style={{ marginRight: 6, verticalAlign: 'middle' }} />
              Back to List
            </button>
            <button
              type="button"
              className={styles.secondaryBtn}
              onClick={() => navigate(`/services/${id}/edit`)}
            >
              <FiEdit style={{ marginRight: 6, verticalAlign: 'middle' }} />
              Edit
            </button>
            <button
              type="button"
              className={styles.deleteBtn}
              onClick={() => setConfirmDelete(true)}
            >
              <FiTrash2 style={{ marginRight: 6, verticalAlign: 'middle' }} />
              Delete
            </button>
          </div>
        </>
      ) : (
        <div className={styles.emptyState}>Service record not found.</div>
      )}

      {confirmDelete && (
        <div className={styles.confirmOverlay}>
          <div className={styles.confirmModal}>
            <div className={styles.confirmIconWrap}>
              <FiTrash2 size={28} />
            </div>
            <h2 className={styles.confirmTitle}>Delete Service</h2>
            <p className={styles.confirmText}>
              Confirm deletion of <strong>{service?.serviceName}</strong>.
            </p>
            <div className={styles.confirmActions}>
              <button type="button" className={styles.secondaryBtn} onClick={() => setConfirmDelete(false)}>
                Cancel
              </button>
              <button type="button" className={styles.deleteBtn} onClick={handleDelete} disabled={processing}>
                {processing ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceDetails;
