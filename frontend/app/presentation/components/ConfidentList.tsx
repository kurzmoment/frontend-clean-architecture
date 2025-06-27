import React from "react";

interface Confident {
  id: number;
  name: string;
  description?: string;
  user_id: number;
  created_at: string;
}

interface ConfidentListProps {
  confidents: Confident[];
  onDeleteConfident: (confidentId: string) => void;
}

export default function ConfidentList({
  confidents,
  onDeleteConfident,
}: ConfidentListProps) {
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      {confidents.length === 0 ? (
        <div className="p-6 text-center text-gray-500">
          No confidents yet. Create your first confident!
        </div>
      ) : (
        <ul className="divide-y divide-gray-200">
          {confidents.map((confident) => (
            <li key={confident.id} className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {confident.name}
                  </h3>
                  {confident.description && (
                    <p className="text-sm text-gray-600 mt-1">
                      {confident.description}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => onDeleteConfident(confident.id.toString())}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
