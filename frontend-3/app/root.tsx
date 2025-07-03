import React, { useEffect } from "react";
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
} from "react-router";
import {
  NotificationProvider,
  useNotificationContext,
} from "./presentation/context/NotificationContext";
import { PlocProvider } from "./presentation/context/PlocProvider";
import { setNotificationHandler } from "./infrastructure/services/notification-service-impl";
import { QueryProvider } from "./infrastructure/query/query-provider";
import { HydrationBoundary } from "@tanstack/react-query";
import { NotificationToast } from "./presentation/components/NotificationToast";

import "./app.css";

function NotificationConnector() {
  const { showNotification } = useNotificationContext();

  useEffect(() => {
    setNotificationHandler(showNotification);
  }, [showNotification]);

  return null;
}

export function meta() {
  return [
    { title: "Project Manager - Clean Architecture" },
    {
      name: "description",
      content:
        "A modern project management application built with clean architecture",
    },
  ];
}

export function links() {
  return [{ rel: "icon", href: "/favicon.ico" }];
}

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <QueryProvider>
          <HydrationBoundary>
            <PlocProvider>
              <NotificationProvider>
                <NotificationConnector />
                <NotificationToast />
                <Outlet />
              </NotificationProvider>
            </PlocProvider>
          </HydrationBoundary>
        </QueryProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <html>
        <head>
          <title>Oops!</title>
          <Meta />
          <Links />
        </head>
        <body>
          <div className="error-container">
            <h1>
              {error.status} {error.statusText}
            </h1>
            <p>{error.data}</p>
          </div>
          <Scripts />
        </body>
      </html>
    );
  }

  return (
    <html>
      <head>
        <title>Oops!</title>
        <Meta />
        <Links />
      </head>
      <body>
        <div className="error-container">
          <h1>Unexpected Error</h1>
          <p>Something went wrong.</p>
        </div>
        <Scripts />
      </body>
    </html>
  );
}
