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
import type { Tag } from "../../shared-kernel";

interface TagCardProps {
  tag: Tag;
  onEdit?: (tag: Tag) => void;
  onDelete?: (id: number) => void;
  onView?: (tag: Tag) => void;
}

const TagCard: React.FC<TagCardProps> = ({ tag, onEdit, onDelete, onView }) => {
  const navigation = useNavigation();

  return (
    <Card className="bg-card border rounded-xl shadow-lg p-5 transition-all duration-200 hover:shadow-xl flex flex-col gap-2 min-h-[120px]">
      <CardHeader>
        <CardTitle>
          <Badge
            style={{ backgroundColor: tag.color || undefined, color: "#fff" }}
          >
            {tag.name}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-end mt-2 gap-2">
          {onView && (
            <Button variant="ghost" size="icon" onClick={() => onView(tag)}>
              <Eye className="size-4" />
            </Button>
          )}
          {onEdit && (
            <Button variant="ghost" size="icon" onClick={() => onEdit(tag)}>
              <Pencil className="size-4" />
            </Button>
          )}
          {onDelete && (
            <form method="post" className="inline">
              <input type="hidden" name="intent" value="delete" />
              <input type="hidden" name="id" value={tag.id} />
              <Button
                type="submit"
                variant="ghost"
                size="icon"
                disabled={navigation.state === "submitting"}
              >
                <Trash className="size-4 text-destructive" />
              </Button>
            </form>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TagCard;
