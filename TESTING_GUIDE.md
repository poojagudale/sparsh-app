# Frontend Testing & Verification Guide

## Prerequisites

✅ **Backend running:** http://localhost:8080
✅ **Database:** MySQL with `sparsh` database (auto-created by Hibernate)
✅ **Dependencies installed:** `npm install` already done

---

## Step 1: Start the Frontend

```bash
cd d:\sparsh
npm run dev
```

Frontend should be available at: **http://localhost:5173**

---

## Step 2: Open Browser DevTools

Press **F12** or **Ctrl+Shift+I** to open DevTools and go to **Console** tab.

---

## Step 3: Test Each Operation

### Test 1: Load Service List (GET)
1. Navigate to **http://localhost:5173/services**
2. Expected: Services list loads with data
3. **Console check:**
   - Look for `[Service API] REQUEST GET /api/services`
   - Look for `[Service API] RESPONSE 200` with array of services
   - Look for `[ServiceList] received data [...]`

### Test 2: Create Service (POST)
1. Click **"+ Add Service"** button
2. Enter service name (e.g., "Hair Cut")
3. Toggle "Active service" if needed
4. Click **"Create Service"** button
5. Expected: Redirect back to services list, new service appears
6. **Console check:**
   - Look for `[ServiceForm] creating service with: {serviceName: "...", isActive: true}`
   - Look for `[Service API] REQUEST POST /api/services {serviceName: "...", isActive: true}`
   - Look for `[Service API] RESPONSE 201` with full service object including `serviceId`

### Test 3: Edit Service (GET then PUT)
1. Click **"Edit"** button on a service
2. Change service name (e.g., "Premium Hair Cut")
3. Toggle status if needed
4. Click **"Update Service"** button
5. Expected: Redirect back to list, updated service shows in table
6. **Console check:**
   - Look for `[ServiceForm] fetching service 1` (GET to fetch current data)
   - Look for `[ServiceForm] updating service 1 with: {serviceName: "...", isActive: ...}`
   - Look for `[Service API] REQUEST PUT /api/services/1`
   - Look for `[Service API] RESPONSE 200`

### Test 4: View Service Details (GET)
1. Click service name in the table
2. Expected: Details page loads with all service info
3. **Console check:**
   - Look for `[ServiceDetails] fetchService start 1`
   - Look for `[ServiceDetails] received service:` with full object

### Test 5: Delete Service (DELETE)
1. From Details page, click **"Delete"** button OR
2. From List page, click **"Delete"** button in Actions column
3. Confirm deletion in popup
4. Expected: Service removed from list, page redirects
5. **Console check:**
   - Look for `[ServiceList] deleting service 1` (or from Details)
   - Look for `[Service API] REQUEST DELETE /api/services/1`
   - Look for `[Service API] RESPONSE 200 /api/services/1 "Service deleted successfully..."`

---

## Network Tab Inspection

1. Open **DevTools → Network** tab
2. Perform any API operation (e.g., add service)
3. Look for requests to `/api/services` (or `/api/services/1` etc.)
4. Click each request and verify:
   - **Headers:** Method (POST, GET, PUT, DELETE), URL path
   - **Request body:** Contains `{serviceName: "...", isActive: true/false}`
   - **Response:** Status 200-201, contains `serviceId`, `serviceName`, `isActive`, timestamps

---

## Error Testing

### Test: Try to Create Service with Empty Name
1. Click "+ Add Service"
2. Leave service name empty
3. Click "Create Service"
4. Expected: Shows inline validation error "Service name is required"
5. **Console check:**
   - No API request should be made (client-side validation only)

### Test: Try to Create Service without Active Status
1. If validation also checks `isActive`, expected similar behavior
2. **Console check:**
   - Frontend should catch this before sending request

### Test: Backend Validation Error (if applicable)
1. This would be caught by backend 400 response
2. Expected: Error message displays in red box
3. **Console check:**
   - Look for `[Service API] RESPONSE ERROR` with status 400
   - Look for parsed error message showing which fields failed

---

## Expected Console Output Summary

After running all tests, console should show patterns like:

```
[Service API] REQUEST GET /api/services
[Service API] RESPONSE 200 /api/services [...]
[ServiceList] loadServices start
[ServiceList] received data [...]
[ServiceForm] creating service with: {serviceName: "Hair Cut", isActive: true}
[Service API] REQUEST POST /api/services {serviceName: "Hair Cut", isActive: true}
[Service API] RESPONSE 201 /api/services {serviceId: 1, serviceName: "Hair Cut", isActive: true, ...}
[ServiceForm] success, navigating to /services
...
```

---

## Troubleshooting

### Issue: Network Error appears
- Check backend is running: `http://localhost:8080` should load
- Check database exists: `sparsh` database in MySQL
- Check Vite dev proxy is working: should see `/api/services` in Network tab (not `http://localhost:8080/...`)

### Issue: 404 Error when loading service details
- Verify the service ID exists
- Check console shows correct `serviceId` being used
- Try clicking on a service that was recently created

### Issue: Form shows old data after editing
- Check browser cache (Ctrl+Shift+Delete)
- Verify PUT request was successful (console shows 200 response)
- Try hard refresh (Ctrl+Shift+R)

### Issue: CSV upload not working
- Verify file is `.csv` extension
- Check FormData is being sent (Network tab shows multipart/form-data)
- Check backend has `/api/services/upload` endpoint

---

## Success Criteria

✅ All services load correctly on list page
✅ Can create new service with proper response
✅ Can edit service and see updates
✅ Can view service details
✅ Can delete service with confirmation
✅ All console debug logs appear as expected
✅ Network requests show correct methods and URLs
✅ No "Network Error" or CORS errors in console

---

## Backend CORS Configuration

If you see CORS errors, ensure backend has this configuration added:

**CorsConfig.java** (place in `com.wit.salon.sparshlite.config` package):
```java
@Configuration
public class CorsConfig {
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins("http://localhost:5173")
                        .allowedMethods("*")
                        .allowedHeaders("*");
            }
        };
    }
}
```

Then restart Spring Boot.

---

## Files to Check

- Frontend API: [src/services/serviceApi.js](src/services/serviceApi.js)
- Services List: [src/pages/services/ServiceList.jsx](src/pages/services/ServiceList.jsx)
- Add/Edit Form: [src/pages/services/ServiceForm.jsx](src/pages/services/ServiceForm.jsx)
- Service Details: [src/pages/services/ServiceDetails.jsx](src/pages/services/ServiceDetails.jsx)
- Integration Ref: [INTEGRATION_REFERENCE.md](INTEGRATION_REFERENCE.md)
