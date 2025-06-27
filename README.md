# Project Manager - Full Stack Application

A modern project management application built with React Router v7 (SSR), Express.js, and SQLite.

## Features

- **Server-Side Rendering (SSR)** with React Router v7
- **Authentication** with JWT tokens and cookies
- **Project Management** - Create, edit, and delete projects
- **Confident Management** - Manage confident items
- **Tag System** - Organize projects with tags
- **Modern UI** with Tailwind CSS

## Architecture

### Frontend (React Router v7 + SSR)

- **Framework**: React Router v7 with built-in SSR
- **Styling**: Tailwind CSS
- **API Client**: Custom fetch-based client with SSR support
- **State Management**: React hooks with server-side data loading

### Backend (Express.js)

- **Framework**: Express.js
- **Database**: SQLite with better-sqlite3
- **Authentication**: JWT tokens with httpOnly cookies
- **CORS**: Configured for both development and SSR

## Getting Started

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

   # Install frontend dependencies
   cd ../frontend
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
   ```

   The backend will run on `http://localhost:5001`

2. **Start the frontend development server**

   ```bash
   cd frontend
   npm run dev
   ```

   The frontend will run on `http://localhost:5173`

3. **Build and run in production mode**

   ```bash
   # Build the frontend
   cd frontend
   npm run build

   # Start the production server
   npm start
   ```

## SSR Configuration

The application is configured for Server-Side Rendering with the following setup:

### API Client Configuration

- **Server-side requests**: Direct calls to `http://localhost:5001/api`
- **Client-side requests**: Proxy through Vite dev server to `/api`

### Route Loaders

- **Dashboard**: Loads user data, projects, confidents, and tags on the server
- **Authentication**: Handles login/register with proper redirects
- **Error Handling**: Proper error boundaries for SSR

### Development vs Production

- **Development**: Uses Vite dev server with API proxy
- **Production**: Uses React Router's built-in SSR server

## API Endpoints

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

## Database Schema

The application uses SQLite with the following tables:

- `users` - User accounts
- `projects` - Project data
- `confidents` - Confident items
- `tags` - Tag definitions
- `project_confidents` - Many-to-many relationship
- `project_tags` - Many-to-many relationship

## Development

### Adding New Routes

1. Create a new route file in `frontend/app/routes/`
2. Add the route to `frontend/app/routes.ts`
3. Implement loader function for SSR data loading
4. Add proper error handling

### Adding New API Endpoints

1. Create route handler in `backend/routes/`
2. Add middleware for authentication if needed
3. Update frontend API client
4. Add proper error handling

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure backend CORS is configured for both dev and SSR ports
2. **Authentication Issues**: Check JWT secret and cookie settings
3. **SSR Data Loading**: Verify API client configuration for server vs client
4. **Port Conflicts**: Ensure backend runs on 5001 and frontend dev on 5173

### Debug Mode

The application includes debug information in the login page to help troubleshoot API connectivity issues.

## License

This project is licensed under the MIT License.
