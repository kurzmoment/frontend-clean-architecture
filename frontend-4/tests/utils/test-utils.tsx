import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router';
import { NotificationProvider } from '../../app/presentation/context/NotificationContext';
import { vi } from 'vitest';

// Custom render function that includes providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <BrowserRouter>
      <NotificationProvider>
        {children}
      </NotificationProvider>
    </BrowserRouter>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

// Re-export everything
export * from '@testing-library/react';

// Override render method
export { customRender as render };

// Mock data factories
export const createMockUser = (overrides = {}) => ({
  id: 1,
  email: 'test@example.com',
  name: 'Test User',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
  ...overrides,
});

export const createMockConfident = (overrides = {}) => ({
  id: 1,
  title: 'Test Confident',
  description: 'Test Description',
  user_id: 1,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
  ...overrides,
});

export const createMockProject = (overrides = {}) => ({
  id: 1,
  name: 'Test Project',
  description: 'Test Project Description',
  user_id: 1,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
  ...overrides,
});

export const createMockTag = (overrides = {}) => ({
  id: 1,
  name: 'Test Tag',
  color: '#000000',
  user_id: 1,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
  ...overrides,
});

// Mock API responses
export const createMockApiResponse = <T>(data: T, ok = true) => ({
  ok,
  data,
  status: ok ? 200 : 400,
  statusText: ok ? 'OK' : 'Bad Request',
});

// Mock repository implementations
export const createMockConfidentRepository = () => ({
  getAll: vi.fn(),
  getById: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
});

export const createMockProjectRepository = () => ({
  getAll: vi.fn(),
  getById: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
});

export const createMockTagRepository = () => ({
  getAll: vi.fn(),
  getById: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
});

export const createMockNotificationService = () => ({
  success: vi.fn(),
  error: vi.fn(),
  warning: vi.fn(),
  info: vi.fn(),
});

export const createMockUserStorageService = () => ({
  getUser: vi.fn(),
  setUser: vi.fn(),
  clearUser: vi.fn(),
}); 