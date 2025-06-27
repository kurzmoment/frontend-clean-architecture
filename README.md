# Full-Stack Project Manager with DDD Frontend

A complete full-stack application with an Express.js backend and a React frontend built using Domain-Driven Design (DDD) principles and React Router v7's modern data loading patterns.

## Project Structure

```
ft-be/
├── backend/                 # Express.js API server
│   ├── config.env          # Environment configuration
│   ├── database.js         # SQLite database setup
│   ├── middleware/         # Authentication middleware
│   ├── routes/             # API routes (auth, projects, confidents, tags)
│   └── server.js           # Express server
└── frontend/               # React Router v7 frontend with DDD
    ├── app/
    │   ├── domain/         # Domain layer (entities, business rules)
    │   ├── application/    # Application layer (services, use cases)
    │   ├── infrastructure/ # Infrastructure layer (repositories, API client)
    │   └── routes/         # React Router v7 file-based routes with loaders/actions
    └── package.json
```

## Backend Features

- **Express.js 4.x** with SQLite database
- **JWT Authentication** with bcrypt password hashing
- **Cookie-based Authentication** with httpOnly cookies for security
- **CORS Configuration** with credentials support
- **CRUD Operations** for:
  - Projects (with relationships to confidents and tags)
  - Confidents (people/resources)
  - Tags (categorization)
- **RESTful API** with proper error handling

## Frontend Features (DDD Architecture + React Router v7)

### Domain Layer (`app/domain/`)

- **Entities**: User, Project, Confident, Tag with TypeScript interfaces
- **Domain Objects**: Immutable entities with business logic
- **Value Objects**: Request/Response DTOs

### Application Layer (`app/application/`)

- **Services**: Business logic orchestration
  - AuthService: Authentication and user management with cookie handling
  - ProjectService: Project operations
  - ConfidentService: Confident management
  - TagService: Tag operations

### Infrastructure Layer (`app/infrastructure/`)

- **API Client**: Native fetch-based HTTP client with cookie support
- **Repositories**: Data access abstraction
  - AuthRepository: Authentication API calls
  - ProjectRepository: Project CRUD operations
  - ConfidentRepository: Confident management
  - TagRepository: Tag operations

### Routes Layer (`app/routes/`)

- **React Router v7**: File-based routing with modern data patterns
- **Loaders**: Server-side data fetching before route rendering
- **Actions**: Form submissions and mutations
- **Authentication Guards**: Automatic redirects for unauthenticated users

## React Router v7 Modern Patterns

The application uses React Router v7's modern data loading patterns:

### **Loaders** - Server-side data fetching

```typescript
export async function loader({ request }: LoaderFunctionArgs) {
  // Fetch data before rendering
  const projects = await apiClient.get("/projects");
  return { projects: projects.data };
}
```

### **Actions** - Form submissions and mutations

```typescript
export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  // Handle form submission
  const result = await apiClient.post("/projects", data);
  return redirect("/dashboard");
}
```

### **Benefits:**

- **Server-side rendering** ready
- **Automatic loading states**
- **Optimistic updates**
- **Error boundaries**
- **Type-safe data flow**

## Authentication System

The application uses a **secure cookie-based authentication system**:

- **JWT Tokens**: Stored in httpOnly cookies for security
- **User Data**: Stored in client-accessible cookies for UI state
- **Automatic Token Handling**: Cookies are automatically sent with requests
- **Secure Logout**: Both client and server-side cookie cleanup
- **CORS Configuration**: Properly configured for cross-origin requests

### Security Features:

- `httpOnly: true` for auth tokens (prevents XSS)
- `secure: true` in production (HTTPS only)
- `sameSite: 'strict'` (CSRF protection)
- 7-day token expiration
- Automatic token refresh handling

## Setup Instructions

### Backend Setup

```bash
cd backend
npm install
npm start
```

The backend will run on `http://localhost:5001`

### Frontend Setup

```bash
cd frontend
npm run dev
```

The frontend will run on `http://localhost:5173`

## API Endpoints

### Authentication

- `POST /api/auth/register` - User registration (sets cookies)
- `POST /api/auth/login` - User login (sets cookies)
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - User logout (clears cookies)

### Projects

- `GET /api/projects` - Get all projects
- `GET /api/projects/:id` - Get single project
- `POST /api/projects` - Create project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Confidents

- `GET /api/confidents` - Get all confidents
- `GET /api/confidents/:id` - Get single confident
- `POST /api/confidents` - Create confident
- `PUT /api/confidents/:id` - Update confident
- `DELETE /api/confidents/:id` - Delete confident

### Tags

- `GET /api/tags` - Get all tags
- `GET /api/tags/:id` - Get single tag
- `POST /api/tags` - Create tag
- `PUT /api/tags/:id` - Update tag
- `DELETE /api/tags/:id` - Delete tag

## DDD Benefits Implemented

1. **Separation of Concerns**: Clear boundaries between domain, application, infrastructure, and routes layers
2. **Domain Entities**: Rich domain objects with business logic
3. **Repository Pattern**: Abstracted data access
4. **Service Layer**: Business logic orchestration
5. **Dependency Inversion**: High-level modules don't depend on low-level modules
6. **Type Safety**: Full TypeScript implementation

## Features

- ✅ **Modern React Router v7** with loaders and actions
- ✅ **Native Fetch API** (no external HTTP libraries)
- ✅ **Secure Cookie-based Authentication** (no localStorage)
- ✅ **Server-side data fetching** with loaders
- ✅ **Form handling** with actions
- ✅ **User authentication** (login/register/logout)
- ✅ **JWT token management** with httpOnly cookies
- ✅ **Project CRUD operations**
- ✅ **Responsive UI** with Tailwind CSS
- ✅ **Error handling** and loading states
- ✅ **Clean DDD architecture**
- ✅ **TypeScript** throughout
- ✅ **File-based routing**

## Security Improvements

- **No localStorage**: All sensitive data stored in secure cookies
- **httpOnly Cookies**: Prevents XSS attacks on authentication tokens
- **SameSite Protection**: Prevents CSRF attacks
- **Secure Headers**: Proper CORS and security configurations
- **Automatic Token Handling**: No manual token management required
- **Server-side Authentication**: Loaders verify authentication before rendering

## Next Steps

To complete the setup:

1. Start both servers:

   ```bash
   # Terminal 1 - Backend
   cd backend && npm start

   # Terminal 2 - Frontend
   cd frontend && npm run dev
   ```

2. Access the application at `http://localhost:5173`

The application will automatically redirect to the login page, where you can register a new account or sign in. Once authenticated, you'll be taken to the dashboard to manage your projects. The authentication system uses secure cookies and React Router v7's modern data loading patterns for optimal performance and security.
# clean-architecure-frontend
