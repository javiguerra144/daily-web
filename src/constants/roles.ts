import type { Role } from '@/types';

export const ROLE_COLORS: Record<Role, string> = {
  Frontend: '#58b8f0',
  Backend: '#9b7bf5',
  QA: '#5fd3a4',
  Diseño: '#ff8fb3',
  Producto: '#f2c14e',
  Data: '#4fd0d6',
  DevOps: '#ff6b5e',
  Scrum: '#c9a36b',
};

export const ROLE_TYPES: Record<Role, string> = {
  Frontend: 'Tipo Píxel',
  Backend: 'Tipo Servidor',
  QA: 'Tipo Detective',
  Diseño: 'Tipo Lienzo',
  Producto: 'Tipo Brújula',
  Data: 'Tipo Consulta',
  DevOps: 'Tipo Tubería',
  Scrum: 'Tipo Facilitador',
};

export const ROLES = Object.keys(ROLE_COLORS) as Role[];

export const DEFAULT_ROLE_COLOR = '#f2c14e';
