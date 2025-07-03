import React from "react";
import { Link } from "react-router";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="max-w-4xl mx-auto text-center px-6">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Project Manager
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          A modern project management application built with clean architecture
          principles
        </p>
        <div className="space-x-4">
          <Link
            to="/login"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="inline-block bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}
