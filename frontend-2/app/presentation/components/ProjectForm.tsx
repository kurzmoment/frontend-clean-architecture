import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Confident, Tag, Project } from "../../shared-kernel";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/popover";
import { Checkbox } from "../../components/ui/checkbox";
import { Badge } from "../../components/ui/badge";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form";
import { motion } from "motion/react";
import { CreateProjectSchema, UpdateProjectSchema } from "../../domain/model";
import type {
  CreateProjectRequest,
  UpdateProjectRequest,
} from "../../shared-kernel";

interface ProjectFormProps {
  onSubmit: (
    data: CreateProjectRequest | UpdateProjectRequest,
    id?: number
  ) => void;
  onCancel: () => void;
  confidents: Confident[];
  tags: Tag[];
  initialValue?: Project;
}

export default function ProjectForm({
  onSubmit,
  onCancel,
  confidents,
  tags,
  initialValue,
}: ProjectFormProps) {
  const isEditing = !!initialValue;
  const schema = isEditing ? UpdateProjectSchema : CreateProjectSchema;

  const form = useForm<CreateProjectRequest | UpdateProjectRequest>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: initialValue?.name || "",
      description: initialValue?.description || "",
      confident_ids: initialValue?.confidents?.map((c) => c.id) || [],
      tag_ids: initialValue?.tags?.map((t) => t.id) || [],
    },
  });

  useEffect(() => {
    if (initialValue) {
      form.reset({
        name: initialValue.name || "",
        description: initialValue.description || "",
        confident_ids: initialValue.confidents?.map((c) => c.id) || [],
        tag_ids: initialValue.tags?.map((t) => t.id) || [],
      });
    }
  }, [initialValue, form]);

  const handleSubmit = (data: CreateProjectRequest | UpdateProjectRequest) => {
    onSubmit(data, initialValue?.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 24 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      <Card className="max-w-3xl mx-auto mb-10 shadow-2xl border border-gray-100 bg-background/90 backdrop-blur-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold tracking-tight">
            {initialValue ? "Edit Project" : "Create New Project"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-10"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter project name"
                          className="mt-2"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter project description"
                          className="mt-2"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confident_ids"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confidents</FormLabel>
                      <FormControl>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              type="button"
                              variant="outline"
                              className="w-full justify-between"
                            >
                              {field.value && field.value.length > 0 ? (
                                <span className="flex flex-wrap gap-1">
                                  {field.value.map((id) => {
                                    const c = confidents.find(
                                      (c) => c.id === id
                                    );
                                    return c ? (
                                      <Badge key={id} variant="secondary">
                                        {c.name}
                                      </Badge>
                                    ) : null;
                                  })}
                                </span>
                              ) : (
                                <span className="text-muted-foreground">
                                  Select confidents
                                </span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-64 max-h-60 overflow-y-auto p-2">
                            {confidents.map((confident) => (
                              <div
                                key={confident.id}
                                className="flex items-center gap-2 py-1 px-2 rounded-md transition-colors hover:bg-accent/40 cursor-pointer"
                              >
                                <Checkbox
                                  id={`confident-${confident.id}`}
                                  checked={
                                    field.value?.includes(confident.id) || false
                                  }
                                  onCheckedChange={(checked) => {
                                    const currentIds = field.value || [];
                                    if (checked) {
                                      field.onChange([
                                        ...currentIds,
                                        confident.id,
                                      ]);
                                    } else {
                                      field.onChange(
                                        currentIds.filter(
                                          (id) => id !== confident.id
                                        )
                                      );
                                    }
                                  }}
                                />
                                <label
                                  htmlFor={`confident-${confident.id}`}
                                  className="cursor-pointer"
                                >
                                  {confident.name}
                                  {confident.company &&
                                    ` (${confident.company})`}
                                </label>
                              </div>
                            ))}
                          </PopoverContent>
                        </Popover>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="tag_ids"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tags</FormLabel>
                      <FormControl>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              type="button"
                              variant="outline"
                              className="w-full justify-between"
                            >
                              {field.value && field.value.length > 0 ? (
                                <span className="flex flex-wrap gap-1">
                                  {field.value.map((id) => {
                                    const t = tags.find((t) => t.id === id);
                                    return t ? (
                                      <Badge
                                        key={id}
                                        style={{
                                          backgroundColor: t.color || undefined,
                                          color: "#fff",
                                        }}
                                      >
                                        {t.name}
                                      </Badge>
                                    ) : null;
                                  })}
                                </span>
                              ) : (
                                <span className="text-muted-foreground">
                                  Select tags
                                </span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-64 max-h-60 overflow-y-auto p-2">
                            {tags.map((tag) => (
                              <div
                                key={tag.id}
                                className="flex items-center gap-2 py-1 px-2 rounded-md transition-colors hover:bg-accent/40 cursor-pointer"
                              >
                                <Checkbox
                                  id={`tag-${tag.id}`}
                                  checked={
                                    field.value?.includes(tag.id) || false
                                  }
                                  onCheckedChange={(checked) => {
                                    const currentIds = field.value || [];
                                    if (checked) {
                                      field.onChange([...currentIds, tag.id]);
                                    } else {
                                      field.onChange(
                                        currentIds.filter((id) => id !== tag.id)
                                      );
                                    }
                                  }}
                                />
                                <label
                                  htmlFor={`tag-${tag.id}`}
                                  className="cursor-pointer"
                                >
                                  {tag.name}
                                </label>
                              </div>
                            ))}
                          </PopoverContent>
                        </Popover>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={onCancel}
                  className="px-6"
                >
                  Cancel
                </Button>
                <Button type="submit" variant="default" className="px-6">
                  {initialValue ? "Save Changes" : "Create Project"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
