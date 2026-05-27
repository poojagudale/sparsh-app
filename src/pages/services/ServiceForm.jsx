import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createService, getService, updateService, uploadServicesCsv } from '../../services/serviceApi';
import styles from './Services.module.scss';

const initialFormState = {
  serviceName: '',
  isActive: true,
};

const ServiceForm = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const [formValues, setFormValues] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [apiError, setApiError] = useState('');
  const [csvFile, setCsvFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadMessage, setUploadMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchService = async () => {
      setLoading(true);
      setApiError('');

      try {
        console.debug('[ServiceForm] fetching service', id);
        const service = await getService(id);
        console.debug('[ServiceForm] received service:', service);
        setFormValues({
          serviceName: service.serviceName || '',
          isActive: Boolean(service.isActive),
        });
      } catch (fetchError) {
        console.error('[ServiceForm] fetch error:', fetchError);
        setApiError(fetchError.message || 'Unable to load service details.');
      } finally {
        setLoading(false);
      }
    };

    if (isEditMode) {
      fetchService();
    }
  }, [id, isEditMode]);

  const validate = () => {
    const validationErrors = {};

    if (!formValues.serviceName.trim()) {
      validationErrors.serviceName = 'Service name is required.';
    } else if (formValues.serviceName.trim().length < 2) {
      validationErrors.serviceName = 'Please enter at least 2 characters.';
    }

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormValues((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) {
      return;
    }

    const payload = {
      serviceName: formValues.serviceName.trim(),
      isActive: formValues.isActive,
    };

    console.debug('[ServiceForm] submitting', isEditMode ? 'update' : 'create', payload);
    setSaving(true);
    setApiError('');

    try {
      if (isEditMode) {
        console.debug('[ServiceForm] updating service', id, 'with:', payload);
        await updateService(id, payload);
      } else {
        console.debug('[ServiceForm] creating service with:', payload);
        await createService(payload);
      }

      console.debug('[ServiceForm] success, navigating to /services');
      navigate('/services');
    } catch (submitError) {
      console.error('[ServiceForm] submit error:', submitError);
      setApiError(submitError.message || 'Unable to save service.');
    } finally {
      setSaving(false);
    }
  };

  const pageTitle = isEditMode ? 'Edit Service' : 'Add Service';

  return (
    <div className={styles.sectionCard}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>{pageTitle}</h1>
          <p className={styles.pageSubtitle}>
            {isEditMode
              ? 'Update service settings and status.'
              : 'Add a new service record to the backend catalog.'}
          </p>
        </div>
      </div>

      {apiError && <div className={styles.errorBox}>{apiError}</div>}

      {loading ? (
        <div className={styles.loading}>Loading service details...</div>
      ) : (
        <form className={styles.formGrid} onSubmit={handleSubmit} noValidate>
            {!isEditMode && (
              <div className={styles.formRow}>
                <label htmlFor="csvFile">Upload CSV (optional)</label>
                <input
                  id="csvFile"
                  name="csvFile"
                  type="file"
                  accept=".csv,text/csv"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    console.debug('[ServiceForm] CSV file selected', f);
                    setCsvFile(f || null);
                    setUploadMessage('');
                  }}
                  className={styles.textInput}
                />
                {uploadMessage && <div className={styles.errorBox}>{uploadMessage}</div>}
                {uploading && (
                  <div className={styles.loading}>Uploading CSV... {uploadProgress}%</div>
                )}
              </div>
            )}
          <div className={styles.formRow}>
            <label htmlFor="serviceName">Service Name</label>
            <input
              id="serviceName"
              name="serviceName"
              type="text"
              className={styles.textInput}
              value={formValues.serviceName}
              onChange={handleChange}
              placeholder="Enter service name"
              autoComplete="off"
            />
            {errors.serviceName && <span className={styles.errorBox}>{errors.serviceName}</span>}
          </div>

          <div className={styles.formRow}>
            <label className={styles.fieldLabel}>Service Status</label>
            <div className={styles.toggleRow}>
              <button
                type="button"
                id="isActive"
                className={`${styles.toggleSwitch} ${formValues.isActive ? styles.toggleActive : styles.toggleInactive}`}
                onClick={() => setFormValues(current => ({ ...current, isActive: !current.isActive }))}
                aria-label="Toggle service status"
                title={formValues.isActive ? 'Active — click to deactivate' : 'Inactive — click to activate'}
              >
                <span className={styles.toggleKnob}></span>
              </button>
              <span className={`${styles.toggleStatusLabel} ${formValues.isActive ? styles.toggleStatusActive : styles.toggleStatusInactive}`}>
                {formValues.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>

          <div className={styles.formActions}>
            {!isEditMode && (
              <button
                type="button"
                className={styles.secondaryBtn}
                onClick={async () => {
                  // Upload CSV handler
                  if (!csvFile) {
                    setUploadMessage('Please select a CSV file to upload.');
                    return;
                  }
                  if (!csvFile.name.toLowerCase().endsWith('.csv')) {
                    setUploadMessage('Only .csv files are allowed.');
                    return;
                  }

                  setUploading(true);
                  setUploadProgress(0);
                  setUploadMessage('');
                  console.debug('[ServiceForm] Starting CSV upload', csvFile.name);

                  try {
                    await uploadServicesCsv(csvFile, (pct) => setUploadProgress(pct));
                    setUploadMessage('CSV uploaded successfully.');
                    console.debug('[ServiceForm] CSV upload success');
                    // After successful upload, navigate back to list to refresh
                    navigate('/services');
                  } catch (uploadErr) {
                    console.error('[ServiceForm] CSV upload error', uploadErr);
                    setUploadMessage(uploadErr.message || 'CSV upload failed.');
                  } finally {
                    setUploading(false);
                  }
                }}
                disabled={uploading}
              >
                {uploading ? `Uploading ${uploadProgress}%` : 'Upload CSV'}
              </button>
            )}
            <button type="button" className={styles.secondaryBtn} onClick={() => navigate('/services')}>
              Cancel
            </button>
            <button type="submit" className={styles.primaryBtn} disabled={saving}>
              {saving ? 'Saving…' : isEditMode ? 'Update Service' : 'Create Service'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ServiceForm;
