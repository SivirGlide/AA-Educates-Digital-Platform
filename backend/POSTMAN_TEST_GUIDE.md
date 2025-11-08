# Postman Test Guide for User Permissions

This guide provides comprehensive test cases to verify the role-based permission system in the AA Educates backend.

## Prerequisites

1. **Base URL**: `http://127.0.0.1:8000/api`
2. **Postman Environment Variables** (create these):
   - `base_url`: `http://127.0.0.1:8000/api`
   - `student_token`: (will be set after login)
   - `parent_token`: (will be set after login)
   - `corporate_token`: (will be set after login)
   - `admin_token`: (will be set after login)
   - `school_token`: (will be set after login)
   - `student_user_id`: (will be set after login)
   - `parent_user_id`: (will be set after login)
   - `corporate_user_id`: (will be set after login)
   - `admin_user_id`: (will be set after login)
   - `student_profile_id`: (will be set after login)
   - `parent_profile_id`: (will be set after login)
   - `corporate_profile_id`: (will be set after login)

## Setup: Create Test Users

Before running tests, you need to create test users. Use the register endpoint or Django admin.

### Test Users Needed:
1. **Student User**
   - Email: `student@test.com`
   - Password: `testpass123`
   - Role: `STUDENT`

2. **Parent User**
   - Email: `parent@test.com`
   - Password: `testpass123`
   - Role: `PARENT`

3. **Corporate Partner User**
   - Email: `corporate@test.com`
   - Password: `testpass123`
   - Role: `CORPORATE_PARTNER`

4. **Admin User**
   - Email: `admin@test.com`
   - Password: `testpass123`
   - Role: `ADMIN`

5. **School User**
   - Email: `school@test.com`
   - Password: `testpass123`
   - Role: `SCHOOL`

---

## Test Category 1: Authentication Tests

### Test 1.1: Login as Student
**Request:**
- Method: `POST`
- URL: `{{base_url}}/users/auth/login/`
- Headers: `Content-Type: application/json`
- Body (raw JSON):
```json
{
  "email": "student@test.com",
  "password": "testpass123"
}
```

**Expected Response:**
- Status: `200 OK`
- Body contains: `access`, `refresh`, `user` object with `role: "STUDENT"`
- Save `access` token to `student_token` variable
- Save `user.id` to `student_user_id`
- Save `user.profile_id` to `student_profile_id`

---

### Test 1.2: Login as Parent
**Request:**
- Method: `POST`
- URL: `{{base_url}}/users/auth/login/`
- Body:
```json
{
  "email": "parent@test.com",
  "password": "testpass123"
}
```

**Expected Response:**
- Status: `200 OK`
- Save token to `parent_token`
- Save user ID and profile ID

---

### Test 1.3: Login as Corporate Partner
**Request:**
- Method: `POST`
- URL: `{{base_url}}/users/auth/login/`
- Body:
```json
{
  "email": "corporate@test.com",
  "password": "testpass123"
}
```

**Expected Response:**
- Status: `200 OK`
- Save token to `corporate_token`

---

### Test 1.4: Login as Admin
**Request:**
- Method: `POST`
- URL: `{{base_url}}/users/auth/login/`
- Body:
```json
{
  "email": "admin@test.com",
  "password": "testpass123"
}
```

**Expected Response:**
- Status: `200 OK`
- Save token to `admin_token`

---

### Test 1.5: Login with Invalid Credentials
**Request:**
- Method: `POST`
- URL: `{{base_url}}/users/auth/login/`
- Body:
```json
{
  "email": "student@test.com",
  "password": "wrongpassword"
}
```

**Expected Response:**
- Status: `401 Unauthorized`
- Body: `{"error": "Invalid email or password"}`

---

## Test Category 2: Unauthenticated Access Tests

### Test 2.1: Access Student Profiles Without Token
**Request:**
- Method: `GET`
- URL: `{{base_url}}/users/students/`
- Headers: (no Authorization header)

**Expected Response:**
- Status: `401 Unauthorized`

---

### Test 2.2: Access Parent Profiles Without Token
**Request:**
- Method: `GET`
- URL: `{{base_url}}/users/parents/`
- Headers: (no Authorization header)

**Expected Response:**
- Status: `401 Unauthorized`

---

### Test 2.3: Access Corporate Profiles Without Token
**Request:**
- Method: `GET`
- URL: `{{base_url}}/users/corporate-partners/`
- Headers: (no Authorization header)

**Expected Response:**
- Status: `401 Unauthorized`

---

## Test Category 3: Student Access Tests

### Test 3.1: Student - Access Own Student Profile
**Request:**
- Method: `GET`
- URL: `{{base_url}}/users/students/{{student_profile_id}}/`
- Headers: `Authorization: Bearer {{student_token}}`

**Expected Response:**
- Status: `200 OK`
- Body contains student's own profile data

---

### Test 3.2: Student - List Student Profiles
**Request:**
- Method: `GET`
- URL: `{{base_url}}/users/students/`
- Headers: `Authorization: Bearer {{student_token}}`

**Expected Response:**
- Status: `200 OK`
- Body contains only the student's own profile (1 result)

---

### Test 3.3: Student - Access Parent Profiles (Should Fail)
**Request:**
- Method: `GET`
- URL: `{{base_url}}/users/parents/`
- Headers: `Authorization: Bearer {{student_token}}`

**Expected Response:**
- Status: `403 Forbidden`
- Body: `{"detail": "You do not have permission to perform this action."}`

---

### Test 3.4: Student - Access Specific Parent Profile (Should Fail)
**Request:**
- Method: `GET`
- URL: `{{base_url}}/users/parents/{{parent_profile_id}}/`
- Headers: `Authorization: Bearer {{student_token}}`

**Expected Response:**
- Status: `403 Forbidden` OR `404 Not Found` (depending on queryset filtering)

---

### Test 3.5: Student - Access Corporate Partner Profiles (Should Fail)
**Request:**
- Method: `GET`
- URL: `{{base_url}}/users/corporate-partners/`
- Headers: `Authorization: Bearer {{student_token}}`

**Expected Response:**
- Status: `403 Forbidden`

---

### Test 3.6: Student - Access Specific Corporate Profile (Should Fail)
**Request:**
- Method: `GET`
- URL: `{{base_url}}/users/corporate-partners/{{corporate_profile_id}}/`
- Headers: `Authorization: Bearer {{student_token}}`

**Expected Response:**
- Status: `403 Forbidden` OR `404 Not Found`

---

### Test 3.7: Student - Access Admin Profiles (Should Fail)
**Request:**
- Method: `GET`
- URL: `{{base_url}}/users/admins/`
- Headers: `Authorization: Bearer {{student_token}}`

**Expected Response:**
- Status: `403 Forbidden`

---

### Test 3.8: Student - Access Own User Profile
**Request:**
- Method: `GET`
- URL: `{{base_url}}/users/users/{{student_user_id}}/`
- Headers: `Authorization: Bearer {{student_token}}`

**Expected Response:**
- Status: `200 OK`
- Body contains student's own user data

---

### Test 3.9: Student - Access Another User Profile (Should Fail)
**Request:**
- Method: `GET`
- URL: `{{base_url}}/users/users/{{admin_user_id}}/`
- Headers: `Authorization: Bearer {{student_token}}`

**Expected Response:**
- Status: `403 Forbidden` OR `404 Not Found`

---

### Test 3.10: Student - List All Users (Should Only See Self)
**Request:**
- Method: `GET`
- URL: `{{base_url}}/users/users/`
- Headers: `Authorization: Bearer {{student_token}}`

**Expected Response:**
- Status: `200 OK`
- Body contains only the student's own user object (1 result)

---

### Test 3.11: Student - Access /users/me/ Endpoint
**Request:**
- Method: `GET`
- URL: `{{base_url}}/users/users/me/`
- Headers: `Authorization: Bearer {{student_token}}`

**Expected Response:**
- Status: `200 OK`
- Body contains current user's data

---

### Test 3.12: Student - Update Own Student Profile
**Request:**
- Method: `PATCH`
- URL: `{{base_url}}/users/students/{{student_profile_id}}/`
- Headers: 
  - `Authorization: Bearer {{student_token}}`
  - `Content-Type: application/json`
- Body:
```json
{
  "bio": "Updated bio from student"
}
```

**Expected Response:**
- Status: `200 OK`
- Body contains updated profile

---

### Test 3.13: Student - Update Another Student Profile (Should Fail)
**Request:**
- Method: `PATCH`
- URL: `{{base_url}}/users/students/2/` (assuming ID 2 exists and is not the student's profile)
- Headers: 
  - `Authorization: Bearer {{student_token}}`
  - `Content-Type: application/json`
- Body:
```json
{
  "bio": "Trying to update another student's profile"
}
```

**Expected Response:**
- Status: `403 Forbidden` OR `404 Not Found`

---

## Test Category 4: Corporate Partner Access Tests

### Test 4.1: Corporate - Access Own Corporate Profile
**Request:**
- Method: `GET`
- URL: `{{base_url}}/users/corporate-partners/{{corporate_profile_id}}/`
- Headers: `Authorization: Bearer {{corporate_token}}`

**Expected Response:**
- Status: `200 OK`
- Body contains corporate partner's own profile

---

### Test 4.2: Corporate - List Corporate Profiles (Should Only See Self)
**Request:**
- Method: `GET`
- URL: `{{base_url}}/users/corporate-partners/`
- Headers: `Authorization: Bearer {{corporate_token}}`

**Expected Response:**
- Status: `200 OK`
- Body contains only the corporate partner's own profile (1 result)

---

### Test 4.3: Corporate - Access Student Profiles (Should Fail)
**Request:**
- Method: `GET`
- URL: `{{base_url}}/users/students/`
- Headers: `Authorization: Bearer {{corporate_token}}`

**Expected Response:**
- Status: `200 OK` BUT empty results `[]` (queryset filtering returns none)

---

### Test 4.4: Corporate - Access Parent Profiles (Should Fail)
**Request:**
- Method: `GET`
- URL: `{{base_url}}/users/parents/`
- Headers: `Authorization: Bearer {{corporate_token}}`

**Expected Response:**
- Status: `403 Forbidden`

---

### Test 4.5: Corporate - Access Admin Profiles (Should Fail)
**Request:**
- Method: `GET`
- URL: `{{base_url}}/users/admins/`
- Headers: `Authorization: Bearer {{corporate_token}}`

**Expected Response:**
- Status: `403 Forbidden`

---

### Test 4.6: Corporate - Update Own Corporate Profile
**Request:**
- Method: `PATCH`
- URL: `{{base_url}}/users/corporate-partners/{{corporate_profile_id}}/`
- Headers: 
  - `Authorization: Bearer {{corporate_token}}`
  - `Content-Type: application/json`
- Body:
```json
{
  "company_name": "Updated Company Name"
}
```

**Expected Response:**
- Status: `200 OK`

---

## Test Category 5: Parent Access Tests

### Test 5.1: Parent - Access Own Parent Profile
**Request:**
- Method: `GET`
- URL: `{{base_url}}/users/parents/{{parent_profile_id}}/`
- Headers: `Authorization: Bearer {{parent_token}}`

**Expected Response:**
- Status: `200 OK`

---

### Test 5.2: Parent - List Parent Profiles (Should Only See Self)
**Request:**
- Method: `GET`
- URL: `{{base_url}}/users/parents/`
- Headers: `Authorization: Bearer {{parent_token}}`

**Expected Response:**
- Status: `200 OK`
- Body contains only the parent's own profile (1 result)

---

### Test 5.3: Parent - Access Student Profiles (Should See Linked Students Only)
**Request:**
- Method: `GET`
- URL: `{{base_url}}/users/students/`
- Headers: `Authorization: Bearer {{parent_token}}`

**Expected Response:**
- Status: `200 OK`
- Body contains only linked students (if any are linked), otherwise empty array

---

### Test 5.4: Parent - Access Corporate Profiles (Should Fail)
**Request:**
- Method: `GET`
- URL: `{{base_url}}/users/corporate-partners/`
- Headers: `Authorization: Bearer {{parent_token}}`

**Expected Response:**
- Status: `403 Forbidden`

---

### Test 5.5: Parent - Access Admin Profiles (Should Fail)
**Request:**
- Method: `GET`
- URL: `{{base_url}}/users/admins/`
- Headers: `Authorization: Bearer {{parent_token}}`

**Expected Response:**
- Status: `403 Forbidden`

---

## Test Category 6: Admin Access Tests

### Test 6.1: Admin - Access All Student Profiles
**Request:**
- Method: `GET`
- URL: `{{base_url}}/users/students/`
- Headers: `Authorization: Bearer {{admin_token}}`

**Expected Response:**
- Status: `200 OK`
- Body contains ALL student profiles

---

### Test 6.2: Admin - Access All Parent Profiles
**Request:**
- Method: `GET`
- URL: `{{base_url}}/users/parents/`
- Headers: `Authorization: Bearer {{admin_token}}`

**Expected Response:**
- Status: `200 OK`
- Body contains ALL parent profiles

---

### Test 6.3: Admin - Access All Corporate Profiles
**Request:**
- Method: `GET`
- URL: `{{base_url}}/users/corporate-partners/`
- Headers: `Authorization: Bearer {{admin_token}}`

**Expected Response:**
- Status: `200 OK`
- Body contains ALL corporate partner profiles

---

### Test 6.4: Admin - Access All Admin Profiles
**Request:**
- Method: `GET`
- URL: `{{base_url}}/users/admins/`
- Headers: `Authorization: Bearer {{admin_token}}`

**Expected Response:**
- Status: `200 OK`
- Body contains ALL admin profiles

---

### Test 6.5: Admin - Access All Users
**Request:**
- Method: `GET`
- URL: `{{base_url}}/users/users/`
- Headers: `Authorization: Bearer {{admin_token}}`

**Expected Response:**
- Status: `200 OK`
- Body contains ALL users

---

### Test 6.6: Admin - Access Any User by ID
**Request:**
- Method: `GET`
- URL: `{{base_url}}/users/users/{{student_user_id}}/`
- Headers: `Authorization: Bearer {{admin_token}}`

**Expected Response:**
- Status: `200 OK`
- Body contains the user's data

---

### Test 6.7: Admin - Update Any Student Profile
**Request:**
- Method: `PATCH`
- URL: `{{base_url}}/users/students/{{student_profile_id}}/`
- Headers: 
  - `Authorization: Bearer {{admin_token}}`
  - `Content-Type: application/json`
- Body:
```json
{
  "bio": "Updated by admin"
}
```

**Expected Response:**
- Status: `200 OK`

---

### Test 6.8: Admin - Delete Any Profile (if DELETE is allowed)
**Request:**
- Method: `DELETE`
- URL: `{{base_url}}/users/students/{{student_profile_id}}/`
- Headers: `Authorization: Bearer {{admin_token}}`

**Expected Response:**
- Status: `204 No Content` (if delete is implemented)

---

## Test Category 7: School Access Tests

### Test 7.1: School - Access Own School Profile
**Request:**
- Method: `GET`
- URL: `{{base_url}}/users/schools/{{school_profile_id}}/`
- Headers: `Authorization: Bearer {{school_token}}`

**Expected Response:**
- Status: `200 OK`

---

### Test 7.2: School - Access Student Profiles (Should See Own Students Only)
**Request:**
- Method: `GET`
- URL: `{{base_url}}/users/students/`
- Headers: `Authorization: Bearer {{school_token}}`

**Expected Response:**
- Status: `200 OK`
- Body contains only students linked to the school

---

### Test 7.3: School - Access Corporate Profiles (Should Fail)
**Request:**
- Method: `GET`
- URL: `{{base_url}}/users/corporate-partners/`
- Headers: `Authorization: Bearer {{school_token}}`

**Expected Response:**
- Status: `403 Forbidden`

---

## Test Category 8: Edge Cases and Error Handling

### Test 8.1: Invalid Token
**Request:**
- Method: `GET`
- URL: `{{base_url}}/users/students/`
- Headers: `Authorization: Bearer invalid_token_here`

**Expected Response:**
- Status: `401 Unauthorized`

---

### Test 8.2: Expired Token
**Request:**
- Method: `GET`
- URL: `{{base_url}}/users/students/`
- Headers: `Authorization: Bearer <expired_token>`

**Expected Response:**
- Status: `401 Unauthorized`

---

### Test 8.3: Malformed Authorization Header
**Request:**
- Method: `GET`
- URL: `{{base_url}}/users/students/`
- Headers: `Authorization: InvalidFormat token`

**Expected Response:**
- Status: `401 Unauthorized`

---

### Test 8.4: Access Non-Existent Resource
**Request:**
- Method: `GET`
- URL: `{{base_url}}/users/students/99999/`
- Headers: `Authorization: Bearer {{student_token}}`

**Expected Response:**
- Status: `404 Not Found`

---

### Test 8.5: Student Trying to Create Parent Profile (Should Fail)
**Request:**
- Method: `POST`
- URL: `{{base_url}}/users/parents/`
- Headers: 
  - `Authorization: Bearer {{student_token}}`
  - `Content-Type: application/json`
- Body:
```json
{
  "user": {{student_user_id}},
  "students": []
}
```

**Expected Response:**
- Status: `403 Forbidden`

---

### Test 8.6: Corporate Trying to Create Student Profile (Should Fail)
**Request:**
- Method: `POST`
- URL: `{{base_url}}/users/students/`
- Headers: 
  - `Authorization: Bearer {{corporate_token}}`
  - `Content-Type: application/json`
- Body:
```json
{
  "user": {{corporate_user_id}},
  "bio": "Trying to create student profile as corporate"
}
```

**Expected Response:**
- Status: `403 Forbidden` OR `200 OK` with empty queryset (depending on implementation)

---

## Test Category 9: Token Refresh Tests

### Test 9.1: Refresh Token
**Request:**
- Method: `POST`
- URL: `{{base_url}}/users/auth/refresh/`
- Headers: `Content-Type: application/json`
- Body:
```json
{
  "refresh": "{{refresh_token_from_login}}"
}
```

**Expected Response:**
- Status: `200 OK`
- Body contains new `access` token

---

### Test 9.2: Verify Token
**Request:**
- Method: `POST`
- URL: `{{base_url}}/users/auth/verify/`
- Headers: `Content-Type: application/json`
- Body:
```json
{
  "token": "{{student_token}}"
}
```

**Expected Response:**
- Status: `200 OK` (if token is valid)

---

## Postman Collection Setup

### Creating Environment Variables Automatically

You can create a Pre-request Script in Postman to automatically extract tokens from login responses:

**Script for Login Requests:**
```javascript
// Add this to the "Tests" tab of login requests
if (pm.response.code === 200) {
    const jsonData = pm.response.json();
    pm.environment.set("student_token", jsonData.access);
    pm.environment.set("student_user_id", jsonData.user.id);
    pm.environment.set("student_profile_id", jsonData.user.profile_id);
}
```

### Postman Test Assertions

Add these assertions to your requests:

```javascript
// Check status code
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

// Check response time
pm.test("Response time is less than 500ms", function () {
    pm.expect(pm.response.responseTime).to.be.below(500);
});

// Check for permission denied
pm.test("Permission denied for unauthorized access", function () {
    pm.expect(pm.response.code).to.be.oneOf([403, 404]);
});

// Check response contains user data
pm.test("Response contains user data", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property('id');
    pm.expect(jsonData).to.have.property('role');
});
```

---

## Quick Test Checklist

Use this checklist to quickly verify all permission scenarios:

- [ ] Student can access own student profile
- [ ] Student cannot access parent profiles
- [ ] Student cannot access corporate profiles
- [ ] Student cannot access admin profiles
- [ ] Corporate can access own corporate profile
- [ ] Corporate cannot access student profiles (or gets empty results)
- [ ] Corporate cannot access parent profiles
- [ ] Parent can access own parent profile
- [ ] Parent can access linked student profiles
- [ ] Parent cannot access corporate profiles
- [ ] Admin can access all profiles
- [ ] Admin can access all users
- [ ] Unauthenticated requests are denied
- [ ] Invalid tokens are rejected
- [ ] Users can only see their own data in list views

---

## Expected Results Summary

| Role | Students | Parents | Corporate | Admin | School |
|------|----------|---------|-----------|-------|--------|
| **Student** | ✅ Own only | ❌ 403 | ❌ 403 | ❌ 403 | ❌ 403 |
| **Parent** | ✅ Linked only | ✅ Own only | ❌ 403 | ❌ 403 | ❌ 403 |
| **Corporate** | ❌ Empty/403 | ❌ 403 | ✅ Own only | ❌ 403 | ❌ 403 |
| **Admin** | ✅ All | ✅ All | ✅ All | ✅ All | ✅ All |
| **School** | ✅ Own students | ❌ 403 | ❌ 403 | ❌ 403 | ✅ Own only |

---

## Notes

1. **403 Forbidden**: User is authenticated but doesn't have permission
2. **401 Unauthorized**: User is not authenticated or token is invalid
3. **404 Not Found**: Resource doesn't exist or user can't see it (due to queryset filtering)
4. Some endpoints may return empty arrays `[]` instead of 403 if queryset filtering is applied before permission checks

---

## Troubleshooting

If tests fail:
1. Verify users exist in the database
2. Verify users have correct roles assigned
3. Verify profiles are created for each user
4. Check token expiration (tokens expire after 1 hour)
5. Verify base URL is correct
6. Check Django server logs for detailed error messages

