import React from "react";
import type { Project } from "../../domain/entities/Project";

interface Confident {
  id: number;
  name: string;
  description?: string;
  user_id: number;
  created_at: string;
}

interface Tag {
  id: number;
  name: string;
  color: string;
  user_id: number;
  created_at: string;
}

interface ProjectListProps {
  projects: Project[];
  confidents: Confident[];
  tags: Tag[];
  onDeleteProject: (projectId: string) => void;
  onAssignConfident: (projectId: number, confidentId: number) => void;
  onAssignTag: (projectId: number, tagId: number) => void;
}

export default function ProjectList({
  projects,
  confidents,
  tags,
  onDeleteProject,
  onAssignConfident,
  onAssignTag,
}: ProjectListProps) {
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      {projects.length === 0 ? (
        <div className="p-6 text-center text-gray-500">
          No projects yet. Create your first project!
        </div>
      ) : (
        <ul className="divide-y divide-gray-200">
          {projects.map((project) => (
            <li key={project.id} className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-900">
                    {project.name}
                  </h3>
                  {project.description && (
                    <p className="text-sm text-gray-600 mt-1">
                      {project.description}
                    </p>
                  )}
                  {/* Show confidents and tags if they exist */}
                  {((project.confidents && project.confidents.length > 0) ||
                    (project.tags && project.tags.length > 0)) && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {project.confidents?.map((confident) => (
                        <span
                          key={confident.id}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {confident.name}
                        </span>
                      ))}
                      {project.tags?.map((tag) => (
                        <span
                          key={tag.id}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                          style={{
                            backgroundColor: tag.color + "20",
                            color: tag.color,
                          }}
                        >
                          {tag.name}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Assignment Controls */}
                  <div className="mt-3 flex flex-wrap gap-2">
                    {/* Assign Confident */}
                    {confidents.length > 0 && (
                      <select
                        onChange={(e) => {
                          if (e.target.value) {
                            onAssignConfident(
                              project.id,
                              parseInt(e.target.value)
                            );
                            e.target.value = "";
                          }
                        }}
                        className="text-xs border border-gray-300 rounded px-2 py-1 text-gray-900 bg-white focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        <option value="">+ Add Confident</option>
                        {confidents.map((confident) => (
                          <option key={confident.id} value={confident.id}>
                            {confident.name}
                          </option>
                        ))}
                      </select>
                    )}

                    {/* Assign Tag */}
                    {tags.length > 0 && (
                      <select
                        onChange={(e) => {
                          if (e.target.value) {
                            onAssignTag(project.id, parseInt(e.target.value));
                            e.target.value = "";
                          }
                        }}
                        className="text-xs border border-gray-300 rounded px-2 py-1 text-gray-900 bg-white focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        <option value="">+ Add Tag</option>
                        {tags.map((tag) => (
                          <option key={tag.id} value={tag.id}>
                            {tag.name}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => onDeleteProject(project.id.toString())}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm ml-4"
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
