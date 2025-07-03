import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("dashboard", "routes/dashboard.tsx"),
  route("login", "routes/login.tsx"),
  route("register", "routes/register.tsx"),
  route("projects", "routes/projects.tsx"),
  route("projects/:projectId", "routes/projects.$projectId.tsx"),
  route("confidents", "routes/confidents.tsx"),
  route("confidents/:confidentId", "routes/confidents.$confidentId.tsx"),
  route("tags", "routes/tags.tsx"),
  route("tags/:tagId", "routes/tags.$tagId.tsx"),
] satisfies RouteConfig;
