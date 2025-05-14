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

Here's a breakdown of the API guidelines based on your requirements, incorporating information from the Hik-Partner Pro OpenAPI Developer Guide:

***Detail Guide****
Here's an enhanced version of the API guidelines, with detailed information on error codes to help with debugging:
1. Get Token with Domain Area
(Same as before - API Key, Get Token API, Domain Area)
2. Handle Token in 7 Days
(Same as before - Token Expiration, Token Refresh, Recommendation)
3. Person Management
(Same as before - Add Person, Update Person, Delete Person, Apply/Delete Person Info to/from Device, Synchronize Person Information, etc.)
4. Person Pre Villages
(Same as before - Site Management, Person Assignment to Sites, Workflow Suggestion)
5. Everything to Handle API Request
(Same as before - Base URL, Content Type, Authentication, Request Methods, Request Parameters, Response Format)
Error Handling (Enhanced):
Check the errorCode in the response to determine if the request was successful.
Device-Specific Error Codes: Pay close attention to error codes that are specific to device operations. These often provide granular details about failures.
Refer to "Appendix A.1 Status or Error Code" and "A.7 Error Codes Categorized by Functional Modules" in the document for comprehensive lists.
Implement detailed error logging and handling based on these codes.
Provide informative error messages to the user when appropriate.
Example Error Scenarios and Codes (from the document):
EVZ20002: Device does not exist. [cite: 60]
EVZ20007: The device is offline. [cite: 61]
EVZ0012: Adding device failed.
EVZ20014: Incorrect device serial No. [cite: 63]
0x400019F1: The maximum number of devices reached. [cite: 332]
Sub Status Codes: Some APIs, like POST /api/hpcgw/v1/acs/privilege/status (for access control privilege status), may return a subStatus code within the error field for more specific errors. [cite: 603] Handle these with the same care as errorCode.
0x30000010: Searching in the database failed. [cite: 83]
0x30001000: HBP Exception. [cite: 86]
Error Code Categories (with examples): The document categorizes error codes by functional modules. Here are some examples to illustrate how this can help you in your code:
Time Function Module (0x00300001 to 0x003007FF):
0x00300001: Time synchronization failed.
0x00300002: Invalid NTP server address.
0x00300003: Incorrect time format.
Network Function Module (0x00400001 to 0x00400FFF):
0x00400001: Parsing domain name failed.
0x00400004: IP addresses of devices conflicted.
0x00400006: Uploading failed.
Device Function Module (0x01400001 to 0x01400FFF):
0x01400003: Certificates mismatched.
0x01400004: Device is not activated.
0x01400006: IP address is banned.
Face Management Module (0x40001000 to 0x40001FFF):
0x4000109C: The library name already exists.
0x4000109D: No record found.
Security Control Module (0x40008000 to 0x40008FFF):
0x40008000: Arming failed.
0x40008001: Disarming failed.
0x40008007: Registering timed out.
(Same as before - OTAP, Important Notes)
Additional Notes on Error Handling
Retry Logic: For certain errors (e.g., network errors), consider implementing retry logic with exponential backoff.
Rate Limiting: Be aware of API rate limits and handle errors related to exceeding those limits (e.g., EVZ10029: The API calling frequency exceeded limit). [cite: 60]
Logging: Log API requests, responses, and errors thoroughly for debugging and monitoring. Include relevant details like timestamps, request parameters, and error codes.
User Feedback: Translate error codes into user-friendly messages, but avoid exposing sensitive technical details.
By incorporating this detailed error handling, your Windsurf API integration will be more stable, reliable, and easier to maintain. Use the error code categories and specific examples to structure your error handling code. Always refer to the latest "Hik-Partner Pro OpenAPI Developer Guide" for the most accurate and complete list of error codes.
