import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Pencil, Trash, Eye } from "lucide-react";
import { useNavigation } from "react-router";
import type { Project, Confident, Tag } from "../../shared-kernel";

interface ProjectCardProps {
  project: Project;
  onEdit?: (project: Project) => void;
  onView?: (project: Project) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onEdit,
  onView,
}) => {
  const navigation = useNavigation();
  const visibleConfidents = (project.confidents || [])
    .filter((c) => c && c.name)
    .slice(0, 3);
  const hiddenConfidents =
    (project.confidents || []).filter((c) => c && c.name).length -
    visibleConfidents.length;
  const visibleTags = (project.tags || [])
    .filter((t) => t && t.name)
    .slice(0, 3);
  const hiddenTags =
    (project.tags || []).filter((t) => t && t.name).length - visibleTags.length;

  return (
    <Card className="bg-card border rounded-xl shadow-lg p-5 transition-all duration-200 hover:shadow-xl flex flex-col gap-2 min-h-[260px]">
      <CardHeader>
        <CardTitle>{project.name}</CardTitle>
      </CardHeader>
      <CardContent>
        {project.description && (
          <p className="text-muted-foreground text-sm mb-2">
            {project.description}
          </p>
        )}
        {visibleConfidents.length > 0 && (
          <div className="mb-2">
            <span className="font-medium text-sm">Confidents:</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {visibleConfidents.map((confident) => (
                <Badge key={confident.id} variant="secondary">
                  {confident.name}
                  {confident.company && ` (${confident.company})`}
                </Badge>
              ))}
              {hiddenConfidents > 0 && (
                <span className="text-xs text-muted-foreground ml-1">
                  +{hiddenConfidents} more
                </span>
              )}
            </div>
          </div>
        )}
        {visibleTags.length > 0 && (
          <div className="mb-2">
            <span className="font-medium text-sm">Tags:</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {visibleTags.map((tag) => (
                <Badge
                  key={tag.id}
                  style={{
                    backgroundColor: tag.color || undefined,
                    color: "#fff",
                  }}
                >
                  {tag.name}
                </Badge>
              ))}
              {hiddenTags > 0 && (
                <span className="text-xs text-muted-foreground ml-1">
                  +{hiddenTags} more
                </span>
              )}
            </div>
          </div>
        )}
        <div className="flex justify-between items-center mt-3 text-xs text-muted-foreground">
          <span>
            {project.confidents?.filter((c) => c && c.name).length || 0}{" "}
            confidents
          </span>
          <span>
            {project.tags?.filter((t) => t && t.name).length || 0} tags
          </span>
        </div>
        <div className="flex justify-end mt-2 gap-2">
          {onView && (
            <Button variant="ghost" size="icon" onClick={() => onView(project)}>
              <Eye className="size-4" />
            </Button>
          )}
          {onEdit && (
            <Button variant="ghost" size="icon" onClick={() => onEdit(project)}>
              <Pencil className="size-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;
