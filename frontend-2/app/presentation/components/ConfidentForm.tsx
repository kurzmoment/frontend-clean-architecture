import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigation } from "react-router";
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
  CreateConfidentSchema,
  UpdateConfidentSchema,
  FormConfidentSchema,
} from "../../domain/model";
import type {
  CreateConfidentRequest,
  UpdateConfidentRequest,
} from "../../shared-kernel";

interface ConfidentFormProps {
  onSubmit: (
    data: CreateConfidentRequest | UpdateConfidentRequest,
    id?: number
  ) => void;
  onCancel: () => void;
  initialValue?: any;
}

export default function ConfidentForm({
  onSubmit,
  onCancel,
  initialValue,
}: ConfidentFormProps) {
  const isEditing = !!initialValue;
  const navigation = useNavigation();
  const schema = isEditing ? UpdateConfidentSchema : FormConfidentSchema;

  const form = useForm<CreateConfidentRequest | UpdateConfidentRequest>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: initialValue?.name || "",
      email: initialValue?.email || "",
      phone: initialValue?.phone || "",
      company: initialValue?.company || "",
      position: initialValue?.position || "",
      notes: initialValue?.notes || "",
    },
    mode: "onSubmit",
    reValidateMode: "onChange",
    criteriaMode: "all",
  });

  useEffect(() => {
    if (initialValue) {
      form.reset({
        name: initialValue.name || "",
        email: initialValue.email || "",
        phone: initialValue.phone || "",
        company: initialValue.company || "",
        position: initialValue.position || "",
        notes: initialValue.notes || "",
      });
    }
  }, [initialValue, form]);

  const handleSubmit = (
    data: CreateConfidentRequest | UpdateConfidentRequest
  ) => {
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
          <CardTitle>
            {initialValue ? "Edit Confident" : "Create New Confident"}
          </CardTitle>
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
                      <FormLabel>Confident Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter confident name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Enter email address"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input
                          type="tel"
                          placeholder="Enter phone number"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="company"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter company name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="position"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Position</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter position/title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <textarea
                          rows={3}
                          placeholder="Enter any additional notes"
                          className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive md:text-sm text-foreground"
                          {...field}
                        />
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
                    : "Create Confident"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
