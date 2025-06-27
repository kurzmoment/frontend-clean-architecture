# Backend API

A Node.js/Express backend with SQLite database for project management with authentication, projects, confidents, and tags.

## Features

- **Authentication**: JWT-based authentication with user registration and login
- **Projects**: CRUD operations for projects
- **Confidents**: CRUD operations for confidents (people/resources)
- **Tags**: CRUD operations for tags with color support
- **Relationships**: Projects can have multiple confidents and tags
- **SQLite Database**: Lightweight, file-based database

## Tech Stack

- Node.js
- Express.js
- SQLite3
- JWT for authentication
- bcryptjs for password hashing
- CORS enabled

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create environment file:

```bash
cp config.env.example config.env
```

3. Update the environment variables in `config.env`:

```
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
DB_PATH=./database.sqlite
PORT=5000
```

4. Start the development server:

```bash
npm run dev
```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Projects

- `GET /api/projects` - Get all projects (protected)
- `GET /api/projects/:id` - Get single project (protected)
- `POST /api/projects` - Create project (protected)
- `PUT /api/projects/:id` - Update project (protected)
- `DELETE /api/projects/:id` - Delete project (protected)
- `POST /api/projects/:id/confidents` - Add confident to project (protected)
- `DELETE /api/projects/:id/confidents/:confident_id` - Remove confident from project (protected)
- `POST /api/projects/:id/tags` - Add tag to project (protected)
- `DELETE /api/projects/:id/tags/:tag_id` - Remove tag from project (protected)

### Confidents

- `GET /api/confidents` - Get all confidents (protected)
- `GET /api/confidents/:id` - Get single confident (protected)
- `POST /api/confidents` - Create confident (protected)
- `PUT /api/confidents/:id` - Update confident (protected)
- `DELETE /api/confidents/:id` - Delete confident (protected)

### Tags

- `GET /api/tags` - Get all tags (protected)
- `GET /api/tags/:id` - Get single tag (protected)
- `POST /api/tags` - Create tag (protected)
- `PUT /api/tags/:id` - Update tag (protected)
- `DELETE /api/tags/:id` - Delete tag (protected)

## Database Schema

The application uses SQLite with the following tables:

- `users` - User accounts
- `projects` - Projects
- `confidents` - People/resources
- `tags` - Tags with colors
- `project_confidents` - Many-to-many relationship between projects and confidents
- `project_tags` - Many-to-many relationship between projects and tags

## Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
