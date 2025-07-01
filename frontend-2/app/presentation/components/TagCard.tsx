import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Pencil, Trash } from "lucide-react";
import type { Tag } from "../../shared-kernel";

interface TagCardProps {
  tag: Tag;
  onEdit: (tag: Tag) => void;
  onDelete: (id: number) => void;
}

const TagCard: React.FC<TagCardProps> = ({ tag, onEdit, onDelete }) => (
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
        <Button variant="ghost" size="icon" onClick={() => onEdit(tag)}>
          <Pencil className="size-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => onDelete(tag.id)}>
          <Trash className="size-4 text-destructive" />
        </Button>
      </div>
    </CardContent>
  </Card>
);

export default TagCard;
