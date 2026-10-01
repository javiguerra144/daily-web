import type { Role } from '@/types';

export const ROLE_COLORS: Record<Role, string> = {
  Frontend: '#58b8f0',
  Backend: '#9b7bf5',
  QA: '#5fd3a4',
  Design: '#ff8fb3',
  Product: '#f2c14e',
  Data: '#4fd0d6',
  DevOps: '#ff6b5e',
  Scrum: '#c9a36b',
};

export const ROLE_TYPES: Record<Role, string> = {
  Frontend: 'Pixel type',
  Backend: 'Server type',
  QA: 'Detective type',
  Design: 'Canvas type',
  Product: 'Compass type',
  Data: 'Query type',
  DevOps: 'Pipeline type',
  Scrum: 'Facilitator type',
};

export const ROLES = Object.keys(ROLE_COLORS) as Role[];

export const DEFAULT_ROLE_COLOR = '#f2c14e';
