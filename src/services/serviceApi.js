import axios from 'axios';

const BACKEND_BASE_URL = 'http://localhost:8080/api/services';
const API_BASE_URL = import.meta.env.DEV ? '/api/services' : BACKEND_BASE_URL;

console.log('[API CONFIG] using baseURL:', API_BASE_URL);

const API = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

// ================= REQUEST INTERCEPTOR =================

API.interceptors.request.use(
  (config) => {
    console.log(
      '[API REQUEST]',
      config.method?.toUpperCase(),
      `${config.baseURL}${config.url}`,
      config.data
    );

    return config;
  },
  (error) => {
    console.error('[REQUEST ERROR]', error);
    return Promise.reject(error);
  }
);

// ================= RESPONSE INTERCEPTOR =================

API.interceptors.response.use(
  (response) => {
    console.log(
      '[API RESPONSE]',
      response.status,
      response.config.url,
      response.data
    );

    return response;
  },
  (error) => {
    console.error('[API ERROR]', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });

    return Promise.reject(error);
  }
);

// ================= ERROR PARSER =================

function parseAxiosError(error) {
  // Backend responded with error
  if (error.response) {
    const data = error.response.data;

    if (data?.errors) {
      const validationErrors = Object.entries(data.errors)
        .map(([field, msg]) => `${field}: ${msg}`)
        .join(', ');

      return new Error(validationErrors);
    }

    return new Error(
      data?.message ||
        `Request failed with status ${error.response.status}`
    );
  }

  // No response received
  if (error.request) {
    return new Error(
      'No response received from backend. Check Spring Boot server and CORS.'
    );
  }

  return new Error(error.message || 'Unknown API Error');
}

// ================= GET ALL SERVICES =================

export async function getServices() {
  try {
    const response = await API.get('');
    return response.data;
  } catch (error) {
    throw parseAxiosError(error);
  }
}

// ================= GET SERVICE BY ID =================

export async function getService(serviceId) {
  try {
    const response = await API.get(`/${serviceId}`);
    return response.data;
  } catch (error) {
    throw parseAxiosError(error);
  }
}

// ================= CREATE SERVICE =================

export async function createService(service) {
  try {
    const payload = {
      serviceName: service.serviceName,
      isActive: service.isActive,
    };

    console.log('[CREATE PAYLOAD]', payload);

    const response = await API.post('', payload);

    return response.data;
  } catch (error) {
    throw parseAxiosError(error);
  }
}

// ================= UPDATE SERVICE =================

export async function updateService(serviceId, service) {
  try {
    const payload = {
      serviceName: service.serviceName,
      isActive: service.isActive,
    };

    console.log('[UPDATE PAYLOAD]', payload);

    const response = await API.put(`/${serviceId}`, payload);

    return response.data;
  } catch (error) {
    throw parseAxiosError(error);
  }
}

// ================= DELETE SERVICE =================

export async function deleteService(serviceId) {
  try {
    const response = await API.delete(`/${serviceId}`);

    return response.data;
  } catch (error) {
    throw parseAxiosError(error);
  }
}

// ================= CSV UPLOAD =================

export async function uploadServicesCsv(file, onProgress) {
  try {
    if (!file) {
      throw new Error('Please select a CSV file');
    }

    const formData = new FormData();

    // IMPORTANT
    // Must match backend @RequestParam("file")
    formData.append('file', file);

    const response = await API.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },

      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percent = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );

          onProgress(percent);
        }
      },
    });

    return response.data;
  } catch (error) {
    throw parseAxiosError(error);
  }
}