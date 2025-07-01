# Project Manager - Full Stack Application

A modern project management application built with React Router v7 (SSR), Express.js, and SQLite. This project demonstrates a clean architecture with multiple frontend implementations.

## 🚀 Features

- **Server-Side Rendering (SSR)** with React Router v7
- **Authentication** with JWT tokens and httpOnly cookies
- **Project Management** - Create, edit, and delete projects
- **Confident Management** - Manage confident items with rich metadata
- **Tag System** - Organize projects and confidents with tags
- **Modern UI** with Tailwind CSS and Radix UI components
- **Clean Architecture** with domain-driven design principles
- **Comprehensive Testing** with Vitest and React Testing Library

## 🏗️ Architecture

### Project Structure

```
ft-be/
├── backend/           # Express.js API server
├── frontend/          # React Router v7 implementation (original)
├── frontend-2/        # Enhanced implementation with clean architecture
└── README.md
```

### Backend (Express.js)

- **Framework**: Express.js with middleware architecture
- **Database**: SQLite with better-sqlite3
- **Authentication**: JWT tokens with httpOnly cookies
- **Security**: bcryptjs for password hashing, CORS configuration
- **API**: RESTful endpoints with proper error handling

### Frontend Implementations

#### Frontend (Original)

- **Framework**: React Router v7 with built-in SSR
- **Styling**: Tailwind CSS
- **API Client**: Axios with SSR support
- **State Management**: React hooks with server-side data loading

#### Frontend-2 (Enhanced)

- **Framework**: React Router v7 with advanced SSR
- **Architecture**: Clean Architecture with domain-driven design
- **UI Components**: Radix UI primitives with custom styling
- **Form Handling**: React Hook Form with Zod validation
- **Testing**: Comprehensive test suite with Vitest
- **State Management**: Custom hooks with repository pattern

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd ft-be
   ```

2. **Install dependencies**

   ```bash
   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies (choose one)
   cd ../frontend
   npm install

   # OR for the enhanced version
   cd ../frontend-2
   npm install
   ```

3. **Configure environment**
   ```bash
   # Copy and edit the backend config
   cd ../backend
   cp config.env.example config.env
   # Edit config.env with your JWT secret
   ```

### Running the Application

1. **Start the backend server**

   ```bash
   cd backend
   npm start
   # or for development with auto-reload
   npm run dev
   ```

   The backend will run on `http://localhost:5001`

2. **Start the frontend development server**

   ```bash
   # For original frontend
   cd frontend
   npm run dev

   # OR for enhanced frontend
   cd frontend-2
   npm run dev
   ```

   The frontend will run on `http://localhost:5173`

3. **Build and run in production mode**

   ```bash
   # Build the frontend
   cd frontend  # or frontend-2
   npm run build

   # Start the production server
   npm start
   ```

## 🧪 Testing

The enhanced frontend (`frontend-2`) includes comprehensive testing:

```bash
cd frontend-2

# Run tests
npm test

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

## 📡 API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user

### Projects

- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create new project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Confidents

- `GET /api/confidents` - Get all confidents
- `POST /api/confidents` - Create new confident
- `PUT /api/confidents/:id` - Update confident
- `DELETE /api/confidents/:id` - Delete confident

### Tags

- `GET /api/tags` - Get all tags
- `POST /api/tags` - Create new tag
- `PUT /api/tags/:id` - Update tag
- `DELETE /api/tags/:id` - Delete tag

## 🗄️ Database Schema

The application uses SQLite with the following tables:

- `users` - User accounts with encrypted passwords
- `projects` - Project data with metadata
- `confidents` - Confident items with rich attributes
- `tags` - Tag definitions for organization
- `project_confidents` - Many-to-many relationship
- `project_tags` - Many-to-many relationship

## 🏛️ Architecture Patterns

### Clean Architecture (Frontend-2)

The enhanced frontend implements clean architecture principles:

- **Domain Layer**: Core business logic and entities
- **Application Layer**: Use cases and application services
- **Infrastructure Layer**: External concerns (API, storage)
- **Presentation Layer**: UI components and hooks

### Repository Pattern

- Abstract repositories for data access
- Implementation-specific repositories
- Dependency injection for testability

### Domain-Driven Design

- Rich domain models with business logic
- Value objects and entities
- Domain services for complex operations

## 🔧 Development

### Adding New Routes

1. Create a new route file in `frontend/app/routes/` (or `frontend-2/app/routes/`)
2. Add the route to the routes configuration
3. Implement loader function for SSR data loading
4. Add proper error handling and loading states

### Adding New API Endpoints

1. Create route handler in `backend/routes/`
2. Add middleware for authentication if needed
3. Update frontend API client and repositories
4. Add proper error handling and validation

### Testing New Features

1. Write unit tests for domain logic
2. Add integration tests for API endpoints
3. Create component tests for UI elements
4. Ensure proper test coverage

## 🐛 Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure backend CORS is configured for both dev and SSR ports
2. **Authentication Issues**: Check JWT secret and cookie settings
3. **SSR Data Loading**: Verify API client configuration for server vs client
4. **Port Conflicts**: Ensure backend runs on 5001 and frontend dev on 5173
5. **Database Issues**: Check SQLite file permissions and schema migrations

### Debug Mode

The application includes debug information in the login page to help troubleshoot API connectivity issues.

### Environment Variables

Ensure your `backend/config.env` file contains:

```env
JWT_SECRET=your-secret-key-here
PORT=5001
NODE_ENV=development
```

## 📚 Additional Resources

- [React Router v7 Documentation](https://reactrouter.com/)
- [Express.js Documentation](https://expressjs.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [Radix UI Documentation](https://www.radix-ui.com/)

## 📄 License

This project is licensed under the MIT License.
