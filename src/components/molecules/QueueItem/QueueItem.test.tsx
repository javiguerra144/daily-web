import { render, screen } from '@testing-library/react';
import type { ComponentProps } from 'react';
import type { Member } from '@/types';
import { QueueItem } from './QueueItem';

const member: Member = { id: 'x', name: 'Lucía', role: 'QA', img: '' };
const base = { member, index: 0, current: false, speaking: false, masked: false, started: true };

const ui = (props: Partial<ComponentProps<typeof QueueItem>> = {}) => (
  <ul>
    <QueueItem {...base} {...props} />
  </ul>
);

describe('QueueItem', () => {
  it('shows the waiting state', () => {
    render(ui());
    expect(screen.getByText('en cola')).toBeInTheDocument();
  });

  it('shows who is speaking', () => {
    render(ui({ current: true, speaking: true }));
    expect(screen.getByText('Hablando')).toBeInTheDocument();
  });

  it('shows time used, flagged when over the limit', () => {
    const { rerender } = render(ui({ result: { used: 95, limit: 120 } }));
    expect(screen.getByText('1:35').className).toMatch(/ok/);
    rerender(ui({ result: { used: 130, limit: 120 } }));
    expect(screen.getByText('2:10').className).toMatch(/over/);
  });

  it('shows absences', () => {
    render(ui({ result: { absent: true } }));
    expect(screen.getByText('Ausente')).toBeInTheDocument();
  });
});
