# VolunteerHub — Documentation

Covers the remaining capstone deliverables: API endpoints, data model & database design, business rules, the aggregation report, seed data, screenshots, demo, and notes on assumptions/limitations/bonus features. Setup and run instructions live separately in `README.md`.

---

## 1. API Endpoints

### Auth (`/api/auth`) — public

| Method | Path | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new account (always created as VOLUNTEER) |
| POST | `/api/auth/login` | Login, returns a JWT |

### Users (`/api/users`) — ADMIN only

| Method | Path | Description |
|---|---|---|
| GET | `/api/users` | List all users |

### Activities (`/api/activities`) — authenticated

| Method | Path | Access | Description |
|---|---|---|---|
| GET | `/api/activities/paged` | ADMIN, VOLUNTEER | Paged list with `keyword`, `status`, `category`, `location`, `page`, `size`, `sortBy`, `direction` filters |
| GET | `/api/activities/{id}` | ADMIN, VOLUNTEER | Get one activity |
| POST | `/api/activities` | ADMIN | Create an activity |
| PUT | `/api/activities/{id}` | ADMIN | Update an activity |
| DELETE | `/api/activities/{id}` | ADMIN | Deactivate an activity (soft delete — sets `status` to `INACTIVE`) |

### Registrations (`/api/registrations`) — authenticated

| Method | Path | Access | Description |
|---|---|---|---|
| POST | `/api/registrations` | ADMIN, VOLUNTEER | Register for an activity (enforces capacity, deadline, and no-duplicate rules) |
| GET | `/api/registrations/{id}` | Owner or ADMIN | Get one registration |
| GET | `/api/registrations/my` | ADMIN, VOLUNTEER | List the current user's own registrations |
| GET | `/api/registrations` | ADMIN | List all registrations |
| DELETE | `/api/registrations/{id}` | Owner or ADMIN | Cancel a registration (frees up the capacity slot) |

### Reports (`/api/reports`) — ADMIN only

| Method | Path | Description |
|---|---|---|
| GET | `/api/reports/popular-activities?limit=5` | MongoDB aggregation: most popular activities by registration count |

---

## 2. Data Model & Database Design

**User** — `name`, `email` (unique, indexed), `passwordHash` (BCrypt), `role` (ADMIN/VOLUNTEER), `createdAt`

**Activity** — `title` (indexed), `description`, `category` (indexed), `location`, `activityDate`, `activityTime` (kept as a separate `String` field rather than merged into date), `registrationDeadline`, `capacity`, `registeredCount`, `status` (ACTIVE/INACTIVE, indexed), `createdBy`

**Registration** — `userId` (indexed), `activityId` (indexed), `status` (REGISTERED/CANCELLED), `registeredAt`, `cancelledAt`

**Indexing decisions:**
- `User.email` — unique index, since it's the login identifier and must never collide
- `Activity.title`, `Activity.category`, `Activity.status` — indexed because the activity listing page filters/searches on all three constantly
- `Registration.userId`, `Registration.activityId` — indexed because every registration check (duplicate check, "my registrations", cancellation) filters on one or both

**Relationships:** `Registration` references `User` and `Activity` by ID rather than embedding — registrations change independently of the user/activity they point to, so normalization keeps updates cheap and avoids duplicated data.

---

## 3. Business Rules

Enforced server-side in `RegistrationService`, checked in this order on every registration attempt:

1. **No duplicate registration** — a user can't hold two active (`REGISTERED`) registrations for the same activity
2. **Deadline check** — rejected once `now > registrationDeadline`
3. **Capacity check** — rejected once `registeredCount >= capacity`
4. **Save & increment** — only if all three pass, the registration is saved and `registeredCount` goes up by one

On cancellation: only the registration's owner or an ADMIN may cancel it (`ForbiddenActionException` → 403 otherwise), and `registeredCount` is decremented with a `Math.max(count - 1, 0)` floor so it can never go negative.

---

## 4. Aggregation Report — Most Popular Activities

`GET /api/reports/popular-activities?limit=N`, built with `MongoTemplate`:

1. **`$match`** — keep only registrations with `status: "REGISTERED"` (cancelled ones excluded)
2. **`$group`** — group by `activityId`, count registrations per activity
3. **`$sort`** — descending by count, most popular first
4. **`$limit`** — top N results
5. **`$addFields`** — convert the grouped `_id` string back to an `ObjectId` (required before `$lookup` can match it against the `Activity` collection)
6. **`$lookup`** + **`$unwind`** — join in the activity's details (title, category)
7. **`$project`** — shape the final response

---

## 5. Seed Data

Seeded automatically on first run if the collections are empty (see `UserDataSeeder`, `ActivityDataSeeder`, `RegistrationDataSeeder`):

- **Users** — 2 ADMIN accounts (`admin1`, `admin2`) and 5 VOLUNTEER accounts (`user1`–`user5`), all `@volunteerhub.com`. Passwords are defined in `UserDataSeeder.java` and are not published in documentation — request them separately if needed for grading.
- **Activities** — a handful of sample activities (e.g. Beach Cleanup Drive, Blood Donation Camp, Charity Run for Clean Water) with varied capacities and deadlines.
- **Registrations** — a mix of `REGISTERED` and `CANCELLED` records across the seeded volunteers, so the popular-activities report has real data to display.

---

## 6. Screenshots

_Add screenshots here before final submission._

| Feature | Screenshot |
|---|---|
| Login | `screenshots/01_login.png` |
| Activity Listing (search/filter/sort/pagination) | `screenshots/02_activities.png` |
| Activity Details | `screenshots/03_activity_details.png` |
| Registration Confirmation | `screenshots/04_registration.png` |
| My Registrations | `screenshots/05_my_registrations.png` |
| Admin Manage Activities | `screenshots/06_admin_activities.png` |
| Admin Reports Dashboard | `screenshots/07_admin_reports.png` |

---

## 7. Demo

_Add a short demo video/GIF link here before final submission (e.g. Loom, YouTube unlisted, or a `.gif` in `/screenshots`)._

---

## 8. Assumptions

- Self-registration always creates a `VOLUNTEER` account — `ADMIN` accounts are seed-only and not assignable through the public register endpoint.
- `activityTime` is stored as a separate `String` field rather than combined into a single `DateTime`, matching the brief's entity pattern which lists it separately from `activityDate`.
- "Deactivating" an activity (`DELETE /api/activities/{id}`) sets its status to `INACTIVE` rather than removing it, so historical registrations tied to it remain valid.

## 9. Known Limitations

- None outstanding — the ownership check on `GET /api/registrations/{id}` (previously missing) has been added, so only the registration's owner or an ADMIN can view it.

## 10. Bonus / Stretch Features

- Admin-only "all registrations" view (`GET /api/registrations`) beyond the minimum required pages.
- Admin actions are handled through role-gated `/api/activities`, `/api/registrations`, and `/api/reports` endpoints rather than a separate `/api/admin` route group — a deliberate design choice, since all admin actions map cleanly onto the existing resource endpoints.