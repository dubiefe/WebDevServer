# Intermediate Practice: User Management — BildyApp

## Description

Develop the backend of **BildyApp**, a REST API built with Node.js and Express for delivery note management. In this intermediate practice you will implement the complete **user management module**, including registration, authentication, onboarding, and account administration.

This practice evaluates the knowledge acquired in **topics T1 to T7** of the course.

---

## Required Technologies

|    Category     |                 Technology                |  Topic  |
|-----------------|-------------------------------------------|---------|
| Runtime         | Node.js 22+ with ESM (`"type": "module"`) | T1      |
| Async patterns  | async/await, Promises                     | T2      |
| Protocol        | HTTP, status codes, headers               | T3      |
| Framework       | Express 5, middleware                     | T4      |
| Validation      | Zod                                       | T4, T6  |
| Database        | MongoDB Atlas + Mongoose                  | T5      |
| Architecture    | MVC (models, controllers, routes)         | T5      |
| File uploads    | Multer                                    | T5      |
| Errors          | AppError class, centralized middleware    | T6      |
| Security        | Helmet, rate limiting, NoSQL sanitization | T6      |
| Soft delete     | Logical deletion with Mongoose            | T6      |
| Authentication  | JWT (jsonwebtoken) + bcryptjs             | T7      |
| Roles           | Role system (admin, guest)                | T7      |

---

## Data Models

### Entity Relationship

```
┌──────────┐          ┌──────────┐
│ Company  │◄──owner──│   User   │
│          │──1:N────►│          │
└──────────┘          └──────────┘
     │
     │  (in the final practice)
     ├──1:N──► Client
     ├──1:N──► Project
     └──1:N──► DeliveryNote
```
A **Company** can have **N users**. The user who creates it becomes the `owner` (role `admin`). Users who join an existing company (because the CIF already exists) or invited users are associated with the same company with role `guest`. A freelancer simply creates a Company where they are the only member, with `isFreelance: true` and the CIF equal to their NIF.

### Company Model

```javascript
{
  owner: ObjectId,           // ref: 'User' — admin who created the company
  name: String,              // Company name
  cif: String,               // Company CIF
  address: {
    street: String,
    number: String,
    postal: String,
    city: String,
    province: String
  },
  logo: String,              // Logo URL (uploaded with Multer)
  isFreelance: Boolean,      // true if freelancer
  deleted: Boolean,          // Soft delete
  createdAt: Date,
  updatedAt: Date
}
```

### User Model

```javascript
{
  email: String,             // Unique (index: unique), validation with Zod
  password: String,          // Encrypt with bcrypt
  name: String,              
  lastName: String,          
  nif: String,               // ID domcument
  role: 'admin' | 'guest',            // By default: 'admin'
  status: 'pending' | 'verified',     // Verification status of the email (index)
  verificationCode: String,  //Random code of 6 digits
  verificationAttempts: Number, // Remaining tries (max 3)
  company: ObjectId,         // ref: 'Company' — assigned during onboarding (index)
  address: {
    street: String,
    number: String,
    postal: String,
    city: String,
    province: String
  },
  deleted: Boolean,          // Soft delete
  createdAt: Date,
  updatedAt: Date
}

// Virtual
// fullName → name + ' ' + lastName
```

> **Recommended Indexes:** `email` (unique), `company`, `status`, `role`. Indexes speed up frequent queries (T5).

> **Virtual `fullName`:** Define a virtual property in Mongoose returning: `name + ' ' + lastName`. Ensure the schema includes (T5): `toJSON: { virtuals: true }`.

> **Freelancer note:** When a user is a freelancer, create a company with `isFreelance: true`. The company data (nombre, CIF, dirección) are the same than the user's personnal data. The relation remains `User.company → Company._id`, the Company simply has only one member.

---

## Endpoints to Implement

### 1) User Registration — `POST /api/user/register` (1 point)

Technical specifications:
- Validate with **Zod** that the email is a valid email. Use `.transform()` to normalize the email to lowercase.
- Validate with **Zod** that the password contains at least 8 characters.
- You cannot register with an email address that already exists (and is validated) in the database (returns a **409 Conflict** error).
- The password will be stored **encrypted** in the database with **bcryptjs**.
- A **random 6-digit code** and a maximum number of attempts (3) will be generated in the database for subsequent email validation.
- The user is created with the default role **`admin`** (can be changed to `guest` during company onboarding; see point 4).
- The response will return the user's data (email, status, and role), a **JWT access token** (short duration, e.g., 15 min), and a **refresh token** (long duration, e.g., 7 days).

### 2) Email validation — `PUT /api/user/validation` (1 point)

Technical specifications:
- Requires the **JWT token** received in the registration response (header `Authorization: Bearer <token>`).
- Validate with **Zod** that the code has exactly 6 digits.
- The `code` will be sent in the body of the request (in theory it would arrive by email; for now, check it directly in the database for that user).
- If the code received is correct (it matches the one stored in the database for the user identified by the JWT token), the `status` is changed to `verified` and an ACK is returned.
- If the code is incorrect, the attempt counter is decremented and a **4XX** client error is returned.
- If the attempts are exhausted, a **429 Too Many Requests** error is returned.

### 3) Login — `POST /api/user/login` (1 point)

Technical specifications:
- Validate the email and password sent in the request body with **Zod**.
- If the credentials are valid, return the user's data, an **access token**, and a **refresh token**.
- If the credentials are incorrect, return a **401 Unauthorized** error.

### 4) Onboarding — Personal and company data

**Personal data** — `PUT /api/user/register` (1 point):
- Requires JWT token.
- Validate the body data (first name, last name, and tax ID number) with **Zod**.
- Update the user with this data.

**Company data** — `PATCH /api/user/company` (1 point):
- Requires JWT token.
- Validate the data (name, tax ID, address, `isFreelance`) with **Zod**.
- **Assignment logic according to the tax ID number:**
  - If there is no company with that tax ID number → a new Company document is created, the user is assigned as owner and retains their admin role.
  - If a company with that tax ID number already exists → the user joins that existing company and their role changes to guest.
- If the user indicates that they are self-employed (isFreelance: true), the company's CIF will be their own NIF and the company's details will be automatically filled in with their personal details (name, NIF, address).

### 5) Company logo — `PATCH /api/user/logo` (1 point)

Technical specifications:
- Requires JWT token. The user must have an associated company.
- Receives an image as a logo via `multipart/form-data` (uses **Multer**).
- Controls the maximum file size (e.g., 5 MB).
- Saves the logo to disk (`uploads/` folder) or to the cloud, and stores the URL in the `logo` field of the user's **Company** document.

### 6) Get user — `GET /api/user` (1 point)

Technical specifications:
- Requires JWT token.
- Returns the authenticated user's data.
- Use **`populate`** to include the complete data of the associated Company (not just the ObjectId).
- The virtual `fullName` must appear in the JSON response.

### 7) Session management — `POST /api/user/refresh` and `POST /api/user/logout` (1 point)

**Refresh token** — `POST /api/user/refresh`:
- Receives the `refreshToken` in the request body.
- If the refresh token is valid and has not expired, return a new **access token** (and optionally rotate the refresh token).
- If the refresh token is invalid or has expired, return a **401 Unauthorized** error.

**Logout** — `POST /api/user/logout`:
- Requires JWT token.
- Invalidates the user's refresh token (e.g., by removing it from the database or adding it to a blacklist).
- Returns an ACK confirming the logout.

### 8) Delete user — `DELETE /api/user` (1 point)

Technical specifications:
- Requires JWT token.
- Supports hard or soft delete depending on the query parameter `?soft=true`.
- Soft delete uses the logical deletion pattern (T6).

### 9) Change password — `PUT /api/user/password` (1 point)

Technical specifications:
- Requires JWT token.
- Receives the current password and the new password in the body.
- Use **Zod `.refine()`** to validate that the new password is different from the current one.
- Verify that the current password is correct before updating it.

10) Invite colleagues — `POST /api/user/invite` (1 point)

Technical specifications:
- Requires JWT token. Only users with the `admin` role can invite others.
- A new user is created with the provided data and assigned the same company (ObjectId) as the inviting user, with the guest role.
- A user:invited event is emitted via EventEmitter (see technical requirements).

---

## Mandatory technical requirements

These requirements reflect the concepts learned in T1-T7 and are **mandatory**:

|     Requirement     |  Topic  |                                           Description                                             |
|---------------------|---------|---------------------------------------------------------------------------------------------------|
| ESM                 | T1      | Use `“type”: “module”` in `package.json` and `import`/`export` statements                         |
| Node.js 22+         | T1      | Use `--watch` and `--env-file=.env` in development scripts                                        |
| Async/await         | T2      | All asynchronous operations must use `async`/`await`                                              |
| EventEmitter        | T2      | Implement an event service that emits notifications in the user lifecycle: `user:registered`,     |
|                     |         | `user:verified`, `user:invited`,`user:deleted`. Register listeners that log each event to the     |
|                     |         | console (in the final practice, they will be sent to Slack)                                       |
| MVC Architecture    | T5      | Organize code into `models/`, `controllers/`, `routes/`, `middleware/`, `validators/`             |
| Zod Validation      | T4, T6  | All request bodies must be validated with Zod schemas. Use `.transform()` to normalize data       |
|                     |         | (e.g., lowercase email, trim strings) and `.refine()` for cross-validations (e.g., new password   |
|                     |         | ≠ current password)                                                                               |
| MongoDB + Mongoose  | T5      | Use MongoDB Atlas as the database and Mongoose as the ODM                                         |
| Populate            | T5      | Use `populate` in queries that return references to other models (e.g., User → Company)           |
| Virtuals            | T5      | Define at least one virtual (`fullName`) in the User model. Configure `toJSON: { virtuals: true }`|
| Indexes             | T5      | Define indexes on frequently queried fields: `email` (unique), `company`, `status`, `role`        |
| AppError            | T6      | Implement the `AppError` class with factory methods and centralized error middleware              |
| Security            | T6      | Include Helmet, rate limiting (`express-rate-limit`) and sanitization (`express-mongo-sanitize`)  |
| JWT + bcrypt        | T7      | Short-lived access token + long-lived refresh token. Passwords encrypted with bcryptjs            |
| Roles               | T7      | Role-based authorization middleware                                                               |

---

## Estructura esperada del proyecto

```
bildyapp-api/
├── src/
│   ├── config/
│   │   └── index.js            # Centralized configuration
│   ├── controllers/
│   │   └── user.controller.js
│   ├── middleware/
│   │   ├── auth.middleware.js   # JWT verification
│   │   ├── error-handler.js    # Centralized error middleware
│   │   ├── role.middleware.js   # Role-based authorization
│   │   ├── upload.js           # Multer configuration
│   │   └── validate.js         # Zod validation middleware
│   ├── models/
│   │   ├── User.js             # Mongoose model (with virtuals and indexes)
│   │   └── Company.js          # Mongoose model
│   ├── routes/
│   │   └── user.routes.js
│   ├── services/
│   │   └── notification.service.js  # EventEmitter for events from the usuario
│   ├── utils/
│   │   └── AppError.js         # Custom error class
│   ├── validators/
│   │   └── user.validator.js   # Zod schemas (with transform and refine)
│   ├── app.js                  # Express configuration
│   └── index.js                # Entry point
├── uploads/                    # Uploaded files (logo)
├── .env
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

---

## Delivery

- **GitHub repository** with the source code.
- Include a **`.env.example`** file with the necessary environment variables (without actual values).
- Include **`.http`** files or a Postman/Thunder Client collection with examples of each endpoint.
- Make **progressive commits** (do not upload all the code at once).
- Include a **`README.md`** with installation and execution instructions.

---

## Rubric (10 points)

|                  Endpoint / Functionality               |  Score  |
|---------------------------------------------------------|---------|
| User registration (`POST /api/user/register`)           | 1 point |
| Email validation (`PUT /api/user/validation`)           | 1 point |
| Login (`POST /api/user/login`)                          | 1 point |
| Onboarding: personal data (`PUT /api/user/register`)    | 1 point |
| Onboarding: create company (`PATCH /api/user/company`)  | 1 point |
| Company logo (`PATCH /api/user/logo`)                   | 1 point |
| Get user with populate (`GET /api/user`)                | 1 point |
| Session management: refresh + logout                    | 1 point |
| Delete user hard/soft (`DELETE /api/user`)              | 1 point |
| Invite colleagues (`POST /api/user/invite`)             | 1 point |

> In addition to the functionality of each endpoint, compliance with the **mandatory technical requirements** will be evaluated: ESM, async/await, EventEmitter, MVC, Zod (transform/refine), Mongoose (populate/virtuals/indexes), AppError, security, JWT (access + refresh tokens). Failure to comply with these requirements may result in a **penalty of up to 30%** on the total score.

Bonus (extra points)

|                                        Functionality                                          | Extra points |
|-----------------------------------------------------------------------------------------------|--------------|
| Change password (`PUT /api/user/password`) with `.refine()` to validate that new ≠ current    | +0.5 points  |
| Zod `discriminatedUnion` for conditional validation of onboarding according to `isFreelance`  | +0.5 points  |

---

## Resources

- [Theory T1: Introduction to Node.js](../theory/T1.md)
- [Theory T2: Events and Asynchrony](../theory/T2.md)
- [Theory T3: HTTP and Routing](../theory/T3.md)
- [Theory T4: Express Framework](../theory/T4.md)
- [Theory T5: MVC and MongoDB with Mongoose](../theory/T5.md)
- [Theory T6: Advanced Validation and Error Handling](../theory/T6.md)
- [Theory T7: Authentication and Authorization with JWT](../theory/T7.md)
- [Code Examples](../code/)
