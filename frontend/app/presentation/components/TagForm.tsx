import React from "react";

interface TagFormProps {
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
}

export default function TagForm({ onSubmit, onCancel }: TagFormProps) {
  return (
    <form onSubmit={onSubmit} className="mb-6 bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Create New Tag</h3>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label
            htmlFor="tagName"
            className="block text-sm font-medium text-gray-700"
          >
            Tag Name
          </label>
          <input
            type="text"
            id="tagName"
            name="name"
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
            placeholder="Enter tag name"
          />
        </div>
        <div>
          <label
            htmlFor="tagColor"
            className="block text-sm font-medium text-gray-700"
          >
            Color
          </label>
          <input
            type="color"
            id="tagColor"
            name="color"
            defaultValue="#007bff"
            className="mt-1 block w-full h-10 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
      </div>
      <div className="mt-4 flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md text-sm font-medium"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
        >
          Create Tag
        </button>
      </div>
    </form>
  );
}
