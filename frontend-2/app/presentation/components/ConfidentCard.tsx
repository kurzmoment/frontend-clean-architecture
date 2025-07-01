import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Pencil, Trash } from "lucide-react";
import type { Confident } from "../../shared-kernel";

interface ConfidentCardProps {
  confident: Confident;
  onEdit: (confident: Confident) => void;
  onDelete: (id: number) => void;
}

const ConfidentCard: React.FC<ConfidentCardProps> = ({
  confident,
  onEdit,
  onDelete,
}) => (
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
        <Button variant="ghost" size="icon" onClick={() => onEdit(confident)}>
          <Pencil className="size-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(confident.id)}
        >
          <Trash className="size-4 text-destructive" />
        </Button>
      </div>
    </CardContent>
  </Card>
);

export default ConfidentCard;
