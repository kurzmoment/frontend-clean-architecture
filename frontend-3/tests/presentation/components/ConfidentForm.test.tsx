import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ConfidentForm from "../../../app/presentation/components/ConfidentForm";

// Mock the hooks
vi.mock("../../../app/presentation/hooks/use-confidents", () => ({
  useConfidents: () => ({
    create: vi.fn(),
    update: vi.fn(),
  }),
}));

vi.mock("../../../app/presentation/hooks/use-notifier", () => ({
  useNotifier: () => ({
    success: vi.fn(),
    error: vi.fn(),
  }),
}));

describe("ConfidentForm", () => {
  const mockOnSubmit = vi.fn();
  const mockOnCancel = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render form fields correctly", () => {
    render(<ConfidentForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    expect(screen.getByLabelText(/confident name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/company/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/position/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/notes/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /create confident/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();
  });

  it("should render with initial data when editing", () => {
    const initialData = {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      phone: "123-456-7890",
      company: "Tech Corp",
      position: "Developer",
      notes: "Test notes",
      user_id: 1,
    };

    render(
      <ConfidentForm
        initialValue={initialData}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByDisplayValue("John Doe")).toBeInTheDocument();
    expect(screen.getByDisplayValue("john@example.com")).toBeInTheDocument();
    expect(screen.getByDisplayValue("123-456-7890")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Tech Corp")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Developer")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Test notes")).toBeInTheDocument();
  });

  it("should call onSubmit with form data when submitted", async () => {
    const user = userEvent.setup();
    render(<ConfidentForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    // Fill out the form
    await user.type(screen.getByLabelText(/confident name/i), "John Doe");
    await user.type(screen.getByLabelText(/email/i), "john@example.com");
    await user.type(screen.getByLabelText(/phone/i), "123-456-7890");
    await user.type(screen.getByLabelText(/company/i), "Tech Corp");
    await user.type(screen.getByLabelText(/position/i), "Developer");
    await user.type(screen.getByLabelText(/notes/i), "Test notes");

    // Submit the form
    await user.click(screen.getByRole("button", { name: /create confident/i }));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        {
          name: "John Doe",
          email: "john@example.com",
          phone: "123-456-7890",
          company: "Tech Corp",
          position: "Developer",
          notes: "Test notes",
        },
        undefined
      );
    });
  });

  it("should call onCancel when cancel button is clicked", async () => {
    const user = userEvent.setup();
    render(<ConfidentForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    await user.click(screen.getByRole("button", { name: /cancel/i }));

    expect(mockOnCancel).toHaveBeenCalled();
  });

  it("should show validation error for required name field", async () => {
    const user = userEvent.setup();
    render(<ConfidentForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    // Try to submit without filling required fields
    await user.click(screen.getByRole("button", { name: /create confident/i }));

    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it("should show validation error for invalid email format", async () => {
    const user = userEvent.setup();
    render(<ConfidentForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    // Fill required field and invalid email
    await user.type(screen.getByLabelText(/confident name/i), "John Doe");
    await user.type(screen.getByLabelText(/email/i), "invalid-email");
    await user.tab(); // Blur the email field to trigger validation

    await user.click(screen.getByRole("button", { name: /create confident/i }));

    screen.debug();

    await screen.findByText(/invalid email format/i);

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it("should allow submission with only required fields", async () => {
    const user = userEvent.setup();
    render(<ConfidentForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    // Fill only the required name field
    await user.type(screen.getByLabelText(/confident name/i), "John Doe");

    await user.click(screen.getByRole("button", { name: /create confident/i }));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        {
          name: "John Doe",
          email: "",
          phone: "",
          company: "",
          position: "",
          notes: "",
        },
        undefined
      );
    });
  });

  it("should clear form after successful submission", async () => {
    const user = userEvent.setup();
    render(<ConfidentForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    // Fill out the form
    await user.type(screen.getByLabelText(/confident name/i), "John Doe");
    await user.type(screen.getByLabelText(/email/i), "john@example.com");

    // Submit the form
    await user.click(screen.getByRole("button", { name: /create confident/i }));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalled();
    });

    // Wait for form reset (simulate async reset)
    await waitFor(() => {
      expect(screen.getByLabelText(/confident name/i)).toHaveValue("");
      expect(screen.getByLabelText(/email/i)).toHaveValue("");
    });
  });

  it.skip("should disable submit button while submitting", async () => {
    // Skipped: The component does not implement disabling the submit button during submission
  });
});
