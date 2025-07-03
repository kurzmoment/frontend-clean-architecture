import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigation, useSubmit } from "react-router";
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
import { CreateProjectSchema, UpdateProjectSchema } from "../../shared-kernel";
import type {
  CreateProjectRequest,
  UpdateProjectRequest,
} from "../../shared-kernel";

interface ProjectFormProps {
  onCancel: () => void;
  confidents: Confident[];
  tags: Tag[];
  initialValue?: Project;
}

export default function ProjectForm({
  onCancel,
  confidents,
  tags,
  initialValue,
}: ProjectFormProps) {
  const isEditing = !!initialValue;
  const navigation = useNavigation();
  const submit = useSubmit();
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
    // Create FormData to submit to the action

    const formData = new FormData();
    formData.append("intent", isEditing ? "update" : "create");

    if (isEditing && initialValue) {
      formData.append("id", initialValue.id.toString());
    }

    if (data.name !== undefined) {
      formData.append("name", data.name);
    }

    if (data.description !== undefined) {
      formData.append("description", data.description);
    }

    // Add confident IDs
    if (data.confident_ids) {
      data.confident_ids.forEach((id) => {
        formData.append("confident_ids", id.toString());
      });
    }

    // Add tag IDs
    if (data.tag_ids) {
      data.tag_ids.forEach((id) => {
        formData.append("tag_ids", id.toString());
      });
    }

    // Submit the form data using React Router's submit
    submit(formData, { method: "post", action: "/projects" });
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
                        <div className="space-y-2">
                          {confidents.map((confident) => (
                            <div
                              key={confident.id}
                              className="flex items-center gap-2"
                            >
                              <Checkbox
                                id={`confident-${confident.id}`}
                                checked={
                                  field.value?.includes(confident.id) || false
                                }
                                onCheckedChange={(checked) => {
                                  const currentValue = field.value || [];
                                  if (checked) {
                                    field.onChange([
                                      ...currentValue,
                                      confident.id,
                                    ]);
                                  } else {
                                    field.onChange(
                                      currentValue.filter(
                                        (id) => id !== confident.id
                                      )
                                    );
                                  }
                                }}
                              />
                              <label
                                htmlFor={`confident-${confident.id}`}
                                className="cursor-pointer text-sm"
                              >
                                {confident.name}
                                {confident.company && ` (${confident.company})`}
                              </label>
                            </div>
                          ))}
                        </div>
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
                        <div className="space-y-2">
                          {tags.map((tag) => (
                            <div
                              key={tag.id}
                              className="flex items-center gap-2"
                            >
                              <Checkbox
                                id={`tag-${tag.id}`}
                                checked={field.value?.includes(tag.id) || false}
                                onCheckedChange={(checked) => {
                                  const currentValue = field.value || [];
                                  if (checked) {
                                    field.onChange([...currentValue, tag.id]);
                                  } else {
                                    field.onChange(
                                      currentValue.filter((id) => id !== tag.id)
                                    );
                                  }
                                }}
                              />
                              <label
                                htmlFor={`tag-${tag.id}`}
                                className="cursor-pointer text-sm"
                              >
                                <Badge
                                  style={{
                                    backgroundColor: tag.color || undefined,
                                    color: "#fff",
                                  }}
                                >
                                  {tag.name}
                                </Badge>
                              </label>
                            </div>
                          ))}
                        </div>
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
                <Button
                  type="submit"
                  variant="default"
                  className="px-6"
                  disabled={navigation.state === "submitting"}
                >
                  {navigation.state === "submitting"
                    ? initialValue
                      ? "Saving..."
                      : "Creating..."
                    : initialValue
                    ? "Save Changes"
                    : "Create Project"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
