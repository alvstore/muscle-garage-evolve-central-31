# Hikvision Access Controller API Integration Guide for Gym System

This document outlines the essential API endpoints and commands required to integrate Hikvision Access Controllers with the Muscle Garaage Gym Management System. It includes APIs for authentication, user management, access control, and event monitoring.

## 1. Authentication

### API: `POST /openapi/v1/authenticate`
Authenticate the client to receive an access token.

**Headers**:
- `Content-Type: application/json`

**Body**:
```json
{
  "clientId": "your_client_id",
  "clientSecret": "your_client_secret"
}
```

**Response**:
```json
{
  "accessToken": "token_value",
  "expiresIn": 7200
}
```

---

## 2. Add Person/Card/Face to Controller

### API: `POST /openapi/v1/person/add`
Add a gym member as a person.

```json
{
  "personId": "123456",
  "personName": "John Doe",
  "gender": "male",
  "orgIndexCode": "organization_code"
}
```

### API: `POST /openapi/v1/card/add`
Add a physical card for access.

```json
{
  "cardNo": "CARD123456",
  "personId": "123456",
  "cardType": "normal",
  "doorRight": true
}
```

### API: `POST /openapi/v1/face/add`
Bind face data to a person.

```json
{
  "personId": "123456",
  "faceData": "base64_encoded_image",
  "faceLibType": "blackFD"
}
```

---

## 3. Control Door (Open Door Remotely)

### API: `POST /openapi/v1/acsDoor/remoteControl`
Unlock the door from the system (e.g., check-in).

```json
{
  "doorIndexCode": "door_code",
  "controlType": "open"
}
```

---

## 4. Get Access Events (Attendance Logs)

### API: `POST /openapi/v1/event/acsEvent`
Retrieve access events, useful for logging attendance.

```json
{
  "startTime": "2025-05-01T00:00:00Z",
  "endTime": "2025-05-01T23:59:59Z",
  "pageNo": 1,
  "pageSize": 50
}
```

---

## 5. Delete Person/Card/Face

- `POST /openapi/v1/person/delete`
- `POST /openapi/v1/card/delete`
- `POST /openapi/v1/face/delete`

---

## 6. Get Device Info (Validation)

### API: `POST /openapi/v1/acsDevice/search`
To validate device connection and retrieve device codes.

---

## Notes

- All requests require the `Authorization: Bearer <access_token>` header.
- Time format should be ISO 8601: `YYYY-MM-DDTHH:MM:SSZ`.

---

## References

All APIs are documented in **Hik-Partner Pro OpenAPI Developer Guide V2.11.800**.
