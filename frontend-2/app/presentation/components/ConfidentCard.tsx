import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Pencil, Trash, Eye } from "lucide-react";
import { useNavigation } from "react-router";
import type { Confident } from "../../shared-kernel";

interface ConfidentCardProps {
  confident: Confident;
  onEdit?: (confident: Confident) => void;
  onDelete?: (id: number) => void;
  onView?: (confident: Confident) => void;
}

const ConfidentCard: React.FC<ConfidentCardProps> = ({
  confident,
  onEdit,
  onDelete,
  onView,
}) => {
  const navigation = useNavigation();

  return (
    <Card className="bg-card border rounded-xl shadow-lg p-5 transition-all duration-200 hover:shadow-xl flex flex-col gap-2 min-h-[180px]">
      <CardHeader>
        <CardTitle>{confident.name}</CardTitle>
      </CardHeader>
      <CardContent>
        {confident.company && (
          <p className="text-muted-foreground text-sm mb-1">
            {confident.company}
          </p>
        )}
        {confident.position && (
          <p className="text-xs text-muted-foreground">{confident.position}</p>
        )}
        {confident.email && (
          <p className="text-xs text-primary mt-1">{confident.email}</p>
        )}
        <div className="flex justify-end mt-2 gap-2">
          {onView && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onView(confident)}
            >
              <Eye className="size-4" />
            </Button>
          )}
          {onEdit && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(confident)}
            >
              <Pencil className="size-4" />
            </Button>
          )}
          {onDelete && (
            <form method="post" className="inline">
              <input type="hidden" name="intent" value="delete" />
              <input type="hidden" name="id" value={confident.id} />
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

export default ConfidentCard;
