# Quick Test Reference - Permission System

## 🚀 Quick Start

1. **Create test users:**
   ```bash
   cd backend
   python manage.py shell < create_test_users.py
   ```

2. **Import Postman collection:**
   - Import `AA_Educates_Permissions_Tests.postman_collection.json` into Postman
   - Create environment variable: `base_url = http://127.0.0.1:8000/api`

3. **Run tests in order:**
   - First, run all login requests to get tokens
   - Then run permission tests

## 📋 Critical Tests (Must Pass)

### ✅ Student Access Tests

| Test | Endpoint | Expected | Why |
|------|----------|----------|-----|
| Get own student profile | `GET /users/students/{id}/` | 200 OK | Student can see own data |
| List students | `GET /users/students/` | 200 OK (1 result) | Only sees own profile |
| Get parent profiles | `GET /users/parents/` | **403 Forbidden** | ❌ Not a parent |
| Get corporate profiles | `GET /users/corporate-partners/` | **403 Forbidden** | ❌ Not corporate |
| Get admin profiles | `GET /users/admins/` | **403 Forbidden** | ❌ Not admin |
| Get own user | `GET /users/users/{id}/` | 200 OK | Can see own user |
| Get other user | `GET /users/users/{other_id}/` | 403/404 | ❌ Cannot see others |

### ✅ Corporate Partner Access Tests

| Test | Endpoint | Expected | Why |
|------|----------|----------|-----|
| Get own corporate profile | `GET /users/corporate-partners/{id}/` | 200 OK | Can see own data |
| List corporate profiles | `GET /users/corporate-partners/` | 200 OK (1 result) | Only sees own |
| Get student profiles | `GET /users/students/` | 200 OK (empty) | Queryset returns none |
| Get parent profiles | `GET /users/parents/` | **403 Forbidden** | ❌ Not a parent |
| Get admin profiles | `GET /users/admins/` | **403 Forbidden** | ❌ Not admin |

### ✅ Parent Access Tests

| Test | Endpoint | Expected | Why |
|------|----------|----------|-----|
| Get own parent profile | `GET /users/parents/{id}/` | 200 OK | Can see own data |
| List parent profiles | `GET /users/parents/` | 200 OK (1 result) | Only sees own |
| Get student profiles | `GET /users/students/` | 200 OK | Sees linked students |
| Get corporate profiles | `GET /users/corporate-partners/` | **403 Forbidden** | ❌ Not corporate |

### ✅ Admin Access Tests

| Test | Endpoint | Expected | Why |
|------|----------|----------|-----|
| Get all students | `GET /users/students/` | 200 OK (all) | Admin sees all |
| Get all parents | `GET /users/parents/` | 200 OK (all) | Admin sees all |
| Get all corporate | `GET /users/corporate-partners/` | 200 OK (all) | Admin sees all |
| Get all admins | `GET /users/admins/` | 200 OK (all) | Admin sees all |
| Get all users | `GET /users/users/` | 200 OK (all) | Admin sees all |
| Update any profile | `PATCH /users/students/{id}/` | 200 OK | Admin can edit all |

### ✅ Authentication Tests

| Test | Endpoint | Expected | Why |
|------|----------|----------|-----|
| No token - get students | `GET /users/students/` | **401 Unauthorized** | ❌ Not authenticated |
| Invalid token | `GET /users/students/` | **401 Unauthorized** | ❌ Invalid token |
| Valid token | `GET /users/students/` | 200 OK | ✅ Authenticated |

## 🎯 Test Credentials

```
Student:   student@test.com / testpass123
Parent:    parent@test.com / testpass123
Corporate: corporate@test.com / testpass123
Admin:     admin@test.com / testpass123
School:    school@test.com / testpass123
```

## 📊 Expected Results Matrix

| Action | Student | Parent | Corporate | Admin | School |
|--------|---------|--------|-----------|-------|--------|
| **View own profile** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **View other role profiles** | ❌ 403 | ❌ 403 | ❌ 403 | ✅ All | ❌ 403 |
| **View students** | Own only | Linked only | Empty | All | Own only |
| **View parents** | ❌ 403 | Own only | ❌ 403 | All | ❌ 403 |
| **View corporate** | ❌ 403 | ❌ 403 | Own only | All | ❌ 403 |
| **View admins** | ❌ 403 | ❌ 403 | ❌ 403 | All | ❌ 403 |
| **Update own profile** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Update other profiles** | ❌ 403 | ❌ 403 | ❌ 403 | ✅ | ❌ 403 |

## 🔍 Key Test Scenarios

### Scenario 1: Student tries to access corporate dashboard data
1. Login as student → Get token
2. `GET /users/corporate-partners/` → **Expected: 403 Forbidden** ✅

### Scenario 2: Student tries to access parent dashboard data
1. Login as student → Get token
2. `GET /users/parents/` → **Expected: 403 Forbidden** ✅

### Scenario 3: Student can only see own data
1. Login as student → Get token
2. `GET /users/students/` → **Expected: 200 OK, only 1 result (own profile)** ✅
3. `GET /users/users/` → **Expected: 200 OK, only 1 result (own user)** ✅

### Scenario 4: Corporate partner cannot access student/parent data
1. Login as corporate → Get token
2. `GET /users/students/` → **Expected: 200 OK, but empty array** ✅
3. `GET /users/parents/` → **Expected: 403 Forbidden** ✅

### Scenario 5: Admin can access everything
1. Login as admin → Get token
2. `GET /users/students/` → **Expected: 200 OK, all students** ✅
3. `GET /users/parents/` → **Expected: 200 OK, all parents** ✅
4. `GET /users/corporate-partners/` → **Expected: 200 OK, all corporate** ✅
5. `GET /users/admins/` → **Expected: 200 OK, all admins** ✅

### Scenario 6: Unauthenticated requests are blocked
1. No login
2. `GET /users/students/` → **Expected: 401 Unauthorized** ✅

## 🐛 Common Issues & Solutions

### Issue: Getting 401 instead of 403
- **Cause**: Token not set or expired
- **Solution**: Re-login and update token in Postman

### Issue: Getting 404 instead of 403
- **Cause**: Queryset filtering returns empty before permission check
- **Solution**: This is expected behavior - queryset filtering happens first

### Issue: Student can see all students
- **Cause**: Queryset filtering not working
- **Solution**: Check `get_queryset()` method in `StudentProfileViewSet`

### Issue: Admin cannot access profiles
- **Cause**: Admin user not set as staff or role not ADMIN
- **Solution**: Verify admin user has `is_staff=True` and `role='ADMIN'`

## 📝 Postman Environment Variables

After logging in, these variables should be set automatically:
- `student_token`
- `parent_token`
- `corporate_token`
- `admin_token`
- `student_user_id`
- `parent_user_id`
- `corporate_user_id`
- `student_profile_id`
- `parent_profile_id`
- `corporate_profile_id`

## ✅ Success Criteria

All tests pass if:
1. ✅ Students cannot access parent/corporate/admin endpoints (403)
2. ✅ Students can only see their own data
3. ✅ Corporate partners cannot access student/parent endpoints (403)
4. ✅ Parents can see linked students
5. ✅ Admins can access all endpoints
6. ✅ Unauthenticated requests are blocked (401)
7. ✅ Invalid tokens are rejected (401)

