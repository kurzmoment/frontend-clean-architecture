import React from "react";
import { useNavigate } from "react-router";
import {
  useProjectService,
  useConfidentService,
  useTagService,
} from "../../infrastructure/di/ServiceProvider";
import { useAuth } from "../hooks/useAuth";
import type { Project } from "../../domain/entities/Project";
import Header from "../components/Header";
import TabNavigation from "../components/TabNavigation";
import type { TabType } from "../components/TabNavigation";
import ActionMessage from "../components/ActionMessage";
import ProjectForm from "../components/ProjectForm";
import ProjectList from "../components/ProjectList";
import ConfidentForm from "../components/ConfidentForm";
import ConfidentList from "../components/ConfidentList";
import TagForm from "../components/TagForm";
import TagList from "../components/TagList";

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

interface DashboardPageProps {
  user: any;
  projects: Project[];
  confidents: Confident[];
  tags: Tag[];
}

export default function DashboardPage({
  user,
  projects: initialProjects,
  confidents: initialConfidents,
  tags: initialTags,
}: DashboardPageProps) {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const projectService = useProjectService();
  const confidentService = useConfidentService();
  const tagService = useTagService();

  const [projects, setProjects] = React.useState<Project[]>(initialProjects);
  const [confidents, setConfidents] =
    React.useState<Confident[]>(initialConfidents);
  const [tags, setTags] = React.useState<Tag[]>(initialTags);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [actionMessage, setActionMessage] = React.useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [activeTab, setActiveTab] = React.useState<TabType>("projects");
  const [showProjectForm, setShowProjectForm] = React.useState(false);
  const [showConfidentForm, setShowConfidentForm] = React.useState(false);
  const [showTagForm, setShowTagForm] = React.useState(false);

  const handleCreateProject = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;

    if (!name) {
      setActionMessage({ type: "error", message: "Project name is required" });
      return;
    }

    try {
      const result = await projectService.createProject({ name, description });

      setActionMessage({
        type: "success",
        message: "Project created successfully",
      });

      // Refresh projects list
      const updatedProjects = await projectService.getAllProjects();
      setProjects(updatedProjects);

      if (form) {
        form.reset();
      }
      setShowProjectForm(false);
    } catch (error) {
      setActionMessage({ type: "error", message: "Failed to create project" });
    }
  };

  const handleCreateConfident = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;

    if (!name) {
      setActionMessage({
        type: "error",
        message: "Confident name is required",
      });
      return;
    }

    try {
      const result = await confidentService.createConfident({
        name,
        description,
      });

      setActionMessage({
        type: "success",
        message: "Confident created successfully",
      });

      // Refresh confidents list
      const updatedConfidents = await confidentService.getAllConfidents();
      setConfidents(updatedConfidents);

      if (form) {
        form.reset();
      }
      setShowConfidentForm(false);
    } catch (error) {
      setActionMessage({
        type: "error",
        message: "Failed to create confident",
      });
    }
  };

  const handleCreateTag = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const name = formData.get("name") as string;
    const color = formData.get("color") as string;

    if (!name) {
      setActionMessage({ type: "error", message: "Tag name is required" });
      return;
    }

    try {
      const result = await tagService.createTag({ name, color });

      setActionMessage({
        type: "success",
        message: "Tag created successfully",
      });

      // Refresh tags list
      const updatedTags = await tagService.getAllTags();
      setTags(updatedTags);

      if (form) {
        form.reset();
      }
      setShowTagForm(false);
    } catch (error) {
      setActionMessage({ type: "error", message: "Failed to create tag" });
    }
  };

  const handleAssignConfidentToProject = async (
    projectId: number,
    confidentId: number
  ) => {
    try {
      await projectService.addConfidentToProject(projectId, confidentId);
      setActionMessage({
        type: "success",
        message: "Confident assigned to project successfully",
      });

      // Refresh projects list
      const updatedProjects = await projectService.getAllProjects();
      setProjects(updatedProjects);
    } catch (error) {
      setActionMessage({
        type: "error",
        message: "Failed to assign confident to project",
      });
    }
  };

  const handleAssignTagToProject = async (projectId: number, tagId: number) => {
    try {
      await projectService.addTagToProject(projectId, tagId);
      setActionMessage({
        type: "success",
        message: "Tag assigned to project successfully",
      });

      // Refresh projects list
      const updatedProjects = await projectService.getAllProjects();
      setProjects(updatedProjects);
    } catch (error) {
      setActionMessage({
        type: "error",
        message: "Failed to assign tag to project",
      });
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    try {
      await projectService.deleteProject(parseInt(projectId));
      setActionMessage({
        type: "success",
        message: "Project deleted successfully",
      });

      // Refresh projects list
      const updatedProjects = await projectService.getAllProjects();
      setProjects(updatedProjects);
    } catch (error) {
      setActionMessage({ type: "error", message: "Failed to delete project" });
    }
  };

  const handleDeleteConfident = async (confidentId: string) => {
    if (!confirm("Are you sure you want to delete this confident?")) return;

    try {
      await confidentService.deleteConfident(parseInt(confidentId));
      setActionMessage({
        type: "success",
        message: "Confident deleted successfully",
      });

      // Refresh confidents list
      const updatedConfidents = await confidentService.getAllConfidents();
      setConfidents(updatedConfidents);
    } catch (error) {
      setActionMessage({
        type: "error",
        message: "Failed to delete confident",
      });
    }
  };

  const handleDeleteTag = async (tagId: string) => {
    if (!confirm("Are you sure you want to delete this tag?")) return;

    try {
      await tagService.deleteTag(parseInt(tagId));
      setActionMessage({
        type: "success",
        message: "Tag deleted successfully",
      });

      // Refresh tags list
      const updatedTags = await tagService.getAllTags();
      setTags(updatedTags);
    } catch (error) {
      setActionMessage({ type: "error", message: "Failed to delete tag" });
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-lg">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="text-lg text-red-600 mb-4">{error}</div>
          <button
            onClick={() => window.location.reload()}
            className="bg-indigo-600 text-white px-4 py-2 rounded"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "projects" as TabType, name: "Projects", count: projects.length },
    {
      id: "confidents" as TabType,
      name: "Confidents",
      count: confidents.length,
    },
    { id: "tags" as TabType, name: "Tags", count: tags.length },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <Header user={user} onLogout={handleLogout} />

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <ActionMessage message={actionMessage} />

          <TabNavigation
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />

          {/* Projects Tab */}
          {activeTab === "projects" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Your Projects
                </h2>
                <button
                  onClick={() => setShowProjectForm(true)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Create Project
                </button>
              </div>

              {showProjectForm && (
                <ProjectForm
                  onSubmit={handleCreateProject}
                  onCancel={() => setShowProjectForm(false)}
                />
              )}

              <ProjectList
                projects={projects}
                confidents={confidents}
                tags={tags}
                onDeleteProject={handleDeleteProject}
                onAssignConfident={handleAssignConfidentToProject}
                onAssignTag={handleAssignTagToProject}
              />
            </div>
          )}

          {/* Confidents Tab */}
          {activeTab === "confidents" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Your Confidents
                </h2>
                <button
                  onClick={() => setShowConfidentForm(true)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Create Confident
                </button>
              </div>

              {showConfidentForm && (
                <ConfidentForm
                  onSubmit={handleCreateConfident}
                  onCancel={() => setShowConfidentForm(false)}
                />
              )}

              <ConfidentList
                confidents={confidents}
                onDeleteConfident={handleDeleteConfident}
              />
            </div>
          )}

          {/* Tags Tab */}
          {activeTab === "tags" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Your Tags</h2>
                <button
                  onClick={() => setShowTagForm(true)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Create Tag
                </button>
              </div>

              {showTagForm && (
                <TagForm
                  onSubmit={handleCreateTag}
                  onCancel={() => setShowTagForm(false)}
                />
              )}

              <TagList tags={tags} onDeleteTag={handleDeleteTag} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
