import React from "react";

interface Tag {
  id: number;
  name: string;
  color: string;
  user_id: number;
  created_at: string;
}

interface TagListProps {
  tags: Tag[];
  onDeleteTag: (tagId: string) => void;
}

export default function TagList({ tags, onDeleteTag }: TagListProps) {
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      {tags.length === 0 ? (
        <div className="p-6 text-center text-gray-500">
          No tags yet. Create your first tag!
        </div>
      ) : (
        <ul className="divide-y divide-gray-200">
          {tags.map((tag) => (
            <li key={tag.id} className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: tag.color }}
                  ></div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {tag.name}
                  </h3>
                </div>
                <button
                  onClick={() => onDeleteTag(tag.id.toString())}
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
