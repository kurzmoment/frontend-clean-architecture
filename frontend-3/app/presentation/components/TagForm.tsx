import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigation, useSubmit } from "react-router";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form";
import { motion } from "motion/react";
import {
  CreateTagSchema,
  UpdateTagSchema,
  FormTagSchema,
} from "../../shared-kernel";
import type { CreateTagRequest, UpdateTagRequest } from "../../shared-kernel";

interface TagFormProps {
  onSubmit: (data: CreateTagRequest | UpdateTagRequest, id?: number) => void;
  onCancel: () => void;
  initialValue?: any;
}

export default function TagForm({
  onSubmit,
  onCancel,
  initialValue,
}: TagFormProps) {
  const isEditing = !!initialValue;
  const navigation = useNavigation();
  const schema = isEditing ? UpdateTagSchema : FormTagSchema;

  const form = useForm<CreateTagRequest | UpdateTagRequest>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: initialValue?.name || "",
      color: initialValue?.color || "#007bff",
    },
  });

  useEffect(() => {
    if (initialValue) {
      form.reset({
        name: initialValue.name || "",
        color: initialValue.color || "#007bff",
      });
    }
  }, [initialValue, form]);

  const handleSubmit = (data: CreateTagRequest | UpdateTagRequest) => {
    // For SSR actions, we'll use the form submission instead of calling onSubmit
    // The form will be submitted via method="post" and handled by the action
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
    >
      <Card className="max-w-2xl mx-auto mb-6">
        <CardHeader>
          <CardTitle>{initialValue ? "Edit Tag" : "Create New Tag"}</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form method="post" className="space-y-6">
              {/* Hidden inputs for SSR action */}
              <input
                type="hidden"
                name="intent"
                value={isEditing ? "update" : "create"}
              />
              {isEditing && (
                <input type="hidden" name="id" value={initialValue.id} />
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tag Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter tag name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="color"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Color</FormLabel>
                      <FormControl>
                        <Input type="color" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="secondary" onClick={onCancel}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="default"
                  disabled={navigation.state === "submitting"}
                >
                  {navigation.state === "submitting"
                    ? "Saving..."
                    : initialValue
                    ? "Save Changes"
                    : "Create Tag"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
