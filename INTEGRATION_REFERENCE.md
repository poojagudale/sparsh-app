# Frontend-Backend Integration - Complete Reference

## API Contract (from Backend)

### Base URL
```
http://localhost:8080/api/services
```

### Core Field Names
- Response ID field: **`serviceId`** (NOT `id`)
- Service name: **`serviceName`**
- Status: **`isActive`** (boolean)
- Timestamps: `createdAt`, `updatedAt`

---

## API Endpoints - Updated Integration

### 1. List All Services
**Endpoint:** `GET /api/services`

**Frontend call:**
```javascript
import { getServices } from '../../services/serviceApi';
const data = await getServices();
```

**Expected response:**
```json
[
  {
    "serviceId": 1,
    "serviceName": "Hair Cut",
    "isActive": true,
    "createdAt": "2026-05-11T00:10:00",
    "updatedAt": "2026-05-11T00:10:00"
  }
]
```

**Component usage:** [ServiceList.jsx](src/pages/services/ServiceList.jsx)
- Maps over services using `service.serviceId` as key
- Navigates using `service.serviceId`

---

### 2. Get Service by ID
**Endpoint:** `GET /api/services/{id}`

**Frontend call:**
```javascript
const service = await getService(serviceId);
```

**Expected response:**
```json
{
  "serviceId": 1,
  "serviceName": "Hair Cut",
  "isActive": true,
  "createdAt": "2026-05-11T00:10:00",
  "updatedAt": "2026-05-11T00:10:00"
}
```

**Error on 404:**
```json
{
  "timestamp": "2026-05-11T00:12:00",
  "status": 404,
  "message": "Service not found with serviceId : '99'",
  "path": "uri=/api/services/99"
}
```

**Component usage:** [ServiceForm.jsx](src/pages/services/ServiceForm.jsx), [ServiceDetails.jsx](src/pages/services/ServiceDetails.jsx)

---

### 3. Create Service
**Endpoint:** `POST /api/services`

**Request body:**
```json
{
  "serviceName": "Hair Cut",
  "isActive": true
}
```

**Frontend call:**
```javascript
const result = await createService({
  serviceName: "Hair Cut",
  isActive: true
});
```

**Expected response (201 Created):**
```json
{
  "serviceId": 1,
  "serviceName": "Hair Cut",
  "isActive": true,
  "createdAt": "2026-05-11T00:10:00",
  "updatedAt": "2026-05-11T00:10:00"
}
```

**Validation error (400):**
```json
{
  "timestamp": "2026-05-11T00:14:00",
  "status": 400,
  "message": "Validation failed",
  "path": "uri=/api/services",
  "errors": {
    "serviceName": "Service name is required",
    "isActive": "isActive status is required"
  }
}
```

**Component usage:** [ServiceForm.jsx](src/pages/services/ServiceForm.jsx)

---

### 4. Update Service
**Endpoint:** `PUT /api/services/{id}`

**Request body:**
```json
{
  "serviceName": "Premium Hair Cut",
  "isActive": false
}
```

**Frontend call:**
```javascript
const result = await updateService(serviceId, {
  serviceName: "Premium Hair Cut",
  isActive: false
});
```

**Expected response (200):**
```json
{
  "serviceId": 1,
  "serviceName": "Premium Hair Cut",
  "isActive": false,
  "createdAt": "2026-05-11T00:10:00",
  "updatedAt": "2026-05-11T00:13:00"
}
```

**Component usage:** [ServiceForm.jsx](src/pages/services/ServiceForm.jsx)

---

### 5. Delete Service
**Endpoint:** `DELETE /api/services/{id}`

**Frontend call:**
```javascript
await deleteService(serviceId);
```

**Expected response (200 OK - Plain Text):**
```
Service deleted successfully with id: 1
```

**Component usage:** [ServiceList.jsx](src/pages/services/ServiceList.jsx), [ServiceDetails.jsx](src/pages/services/ServiceDetails.jsx)

---

## Frontend Files Updated

### 1. [src/services/serviceApi.js](src/services/serviceApi.js)
**Changes:**
- ✅ All functions use axios with Vite proxy in dev
- ✅ Error parsing handles backend validation errors
- ✅ DELETE response handled as plain text
- ✅ Request/response logging for debugging
- ✅ Proper error messages with field-level validation details

### 2. [src/pages/services/ServiceList.jsx](src/pages/services/ServiceList.jsx)
**Changes:**
- ✅ Changed `key={service.id}` → `key={service.serviceId}`
- ✅ Changed `navigate(\`${service.id}\`)` → `navigate(\`${service.serviceId}\`)`
- ✅ Changed `to={\`${service.id}/edit\`}` → `to={\`${service.serviceId}/edit\`}`
- ✅ Changed `setProcessingId(confirmDelete.id)` → `setProcessingId(confirmDelete.serviceId)`
- ✅ Changed delete button condition to use `confirmDelete.serviceId`
- ✅ Enhanced logging

### 3. [src/pages/services/ServiceForm.jsx](src/pages/services/ServiceForm.jsx)
**Changes:**
- ✅ Proper getService call logging
- ✅ Enhanced error logging in fetch
- ✅ Better form submission logging
- ✅ Request payload validation before submit

### 4. [src/pages/services/ServiceDetails.jsx](src/pages/services/ServiceDetails.jsx)
**Changes:**
- ✅ Enhanced service fetch logging
- ✅ Better delete operation logging
- ✅ Improved error display

---

## Browser Console - Expected Debug Output

### Loading Service List
```
[Service API] REQUEST GET /api/services (dev) or http://localhost:8080/api/services (prod)
[Service API] RESPONSE 200 /api/services [{...}]
[ServiceList] loadServices start
[ServiceList] received data [...]
```

### Creating a Service
```
[ServiceForm] submitting create {...}
[ServiceForm] creating service with: {serviceName: "...", isActive: true}
[Service API] REQUEST POST /api/services {...}
[Service API] RESPONSE 201 /api/services {...}
[ServiceForm] success, navigating to /services
```

### Updating a Service
```
[ServiceForm] submitting update {...}
[ServiceForm] updating service 1 with: {serviceName: "...", isActive: false}
[Service API] REQUEST PUT /api/services/1 {...}
[Service API] RESPONSE 200 /api/services/1 {...}
[ServiceForm] success, navigating to /services
```

### Deleting a Service
```
[ServiceList] deleting service 1
[Service API] REQUEST DELETE /api/services/1
[Service API] RESPONSE 200 /api/services/1 Service deleted successfully with id: 1
```

---

## Debugging Checklist

- [ ] Backend running on http://localhost:8080
- [ ] Frontend running on http://localhost:5173
- [ ] Check browser Network tab for requests going to `/api/services` (dev proxy)
- [ ] Check browser Console for debug logs starting with `[Service API]`
- [ ] Verify response contains `serviceId` (not `id`)
- [ ] For errors, check error message parsing in browser console
- [ ] CSV upload uses FormData with file field

---

## Quick Test Flow

1. **Load List:** Go to Services tab → should see console logs for GET request
2. **Add Service:** Click "Add Service" → enter name → submit → should navigate back to list
3. **Edit Service:** Click "Edit" → modify name → submit → should navigate back
4. **Delete Service:** Click "Delete" → confirm → should remove from list
5. **Check Console:** Verify each action logs request/response details

---

## Common Errors & Fixes

| Error | Cause | Fix |
|-------|-------|-----|
| Network Error | Backend not running | Start Spring Boot on port 8080 |
| 404 Not Found | Wrong service ID | Verify `serviceId` field from API |
| Validation failed | Wrong request body | Check payload matches DTO: `{serviceName, isActive}` |
| CORS blocked | Missing backend CORS config | Add CorsConfig.java to backend |
| State update issue | Using `id` instead of `serviceId` | Already fixed in components |

