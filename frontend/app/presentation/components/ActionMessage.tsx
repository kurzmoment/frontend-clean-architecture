import React from "react";

interface ActionMessageProps {
  message: {
    type: "success" | "error";
    message: string;
  } | null;
}

export default function ActionMessage({ message }: ActionMessageProps) {
  if (!message) return null;

  return (
    <div
      className={`mb-4 p-4 rounded-md ${
        message.type === "success"
          ? "bg-green-50 text-green-700"
          : "bg-red-50 text-red-700"
      }`}
    >
      {message.message}
    </div>
  );
}
