# Hikvision API Integration Guide for Gym Management System

This document describes how to integrate Hikvision access controllers (face, fingerprint, card-based) into a Gym Management System built with Next.js and Supabase.

---

## 1. Authentication

**Endpoint:**

```
POST /api/hpcgw/v1/token/get
```

**Request Body:**

```json
{
  "appKey": "your_app_key",
  "secretKey": "your_secret_key"
}
```

**Response:** Returns an `accessToken` to be used in the `Authorization` header for all subsequent API calls:

```
Authorization: Bearer <accessToken>
```

Tokens expire in 7 days. Implement auto-refresh logic in your backend.

---

## 2. Site & Device Management

### Site APIs

* **Add Site:** `POST /api/hpcgw/v1/site/add`
* **List Sites:** `POST /api/hpcgw/v1/site/search`
* **Update Site Info:** `POST /api/hpcgw/v1/site/{id}/update`

### Device APIs

* **Add Device to Site:** `POST /api/hpcgw/v2/device/add`
* **List Devices:** `POST /api/hpcgw/v1/device/list`
* **Update Device Info:** `POST /api/hpcgw/v1/device/update`
* **Delete Device:** `POST /api/hpcgw/v1/device/delete`

---

## 3. Member (Person) Management

### Add Member:

```
POST /api/hpcgw/v1/person/add
```

**Body:**

```json
{
  "name": "John Doe",
  "gender": "male",
  "cardNo": "1234567890",
  "phone": "9876543210",
  "email": "john@example.com",
  "personType": 1,
  "pictures": ["<base64image>"]
}
```

### Update Member:

```
POST /api/hpcgw/v1/person/update
```

### Delete Member:

```
POST /api/hpcgw/v1/person/delete
```

### Sync Member to Devices:

* `POST /api/hpcgw/v1/person/synchronize`
* `POST /api/hpcgw/v1/person/synchronize/progress`
* `POST /api/hpcgw/v1/person/synchronize/details`

---

## 4. Access Control (Door Privileges)

### Assign Access:

```
POST /api/hpcgw/v1/acs/privilege/config
```

**Body:**

```json
{
  "personId": "uuid",
  "deviceSerialNo": "device_sn",
  "doorList": [1],
  "validStartTime": "2024-01-01T00:00:00Z",
  "validEndTime": "2024-12-31T23:59:59Z"
}
```

### Remove Access:

```
POST /api/hpcgw/v1/acs/privilege/delete
```

### Check Access Status:

```
POST /api/hpcgw/v1/acs/privilege/status
```

---

## 5. Event & Attendance Logging

### Event Streaming

* **Subscribe to Events:** `POST /api/hpcgw/v1/mq/subscribe`
* **Fetch Events:** `POST /api/hpcgw/v1/mq/messages`
* **Acknowledge Events:** `POST /api/hpcgw/v1/mq/offset`

Use this to track member check-ins via access logs.

---

## 6. Supabase Integration (Recommended Tables)

| Table          | Purpose                                 |
| -------------- | --------------------------------------- |
| members        | Core member data                        |
| hikvision\_map | Map member\_id ↔ personId, deviceSerial |
| access\_zones  | Door/zone definitions for the gym       |
| device\_logs   | Member check-in logs (via API events)   |

---

## 7. Frontend Integration (Next.js)

* Use server-side API routes to securely call Hikvision endpoints
* Call chain during member registration:

  1. `POST /person/add`
  2. `POST /person/synchronize`
  3. `POST /acs/privilege/config`
* Store `personId`, `deviceSerialNo` in Supabase
* Include biometric (face image base64) upload in member registration form

---

## 8. Additional Recommendations

* Ensure each site and device are correctly registered before assigning members
* Face/Fingerprint/Card setup must be synchronized post-registration
* Use background queues or async workers for sync progress polling
* Handle token expiration (7-day lifespan)
* Log all Hikvision API response codes and handle failures gracefully

---

## 9. Optional Advanced Features

* **Remote Door Unlock (ISAPI Call)**: For manual override via software trigger
* **Face Template Upload via Binary ISAPI** (if needed)

---

## 10. Security

* Never expose `appKey` or `secretKey` to the frontend
* All biometric/image uploads should be securely handled via API routes
* Token should be stored securely and rotated before expiry

---

For full parameter definitions and workflows, refer to the official Hik-Partner Pro OpenAPI Developer Guide (v2.11.800).
