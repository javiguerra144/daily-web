import { act, fireEvent, render, screen } from '@testing-library/react';
import { App } from './App';

const advance = (ms: number) => act(() => vi.advanceTimersByTimeAsync(ms));
const click = (name: string | RegExp) => fireEvent.click(screen.getByRole('button', { name }));

describe('App', () => {
  beforeEach(() => {
    vi.useFakeTimers({
      toFake: [
        'setTimeout',
        'clearTimeout',
        'setInterval',
        'clearInterval',
        'requestAnimationFrame',
        'cancelAnimationFrame',
        'performance',
      ],
    });
    localStorage.setItem(
      'daily-pack-v1',
      JSON.stringify({
        minutes: 2,
        seconds: 0,
        warnAt: 20,
        shuffle: false,
        autoNext: false,
        sound: false,
        team: [
          { id: 'a', name: 'Ana', role: 'QA', img: '' },
          { id: 'b', name: 'Beto', role: 'Backend', img: '' },
        ],
      }),
    );
  });

  afterEach(() => vi.useRealTimers());

  it('renders the idle table with the configured team', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: 'Daily Pack' })).toBeInTheDocument();
    expect(screen.getByText('Nobody yet')).toBeInTheDocument();
    expect(screen.getByRole('timer')).toHaveTextContent('2:00');
    expect(screen.getByRole('button', { name: 'Start stand-up' })).toBeEnabled();
    expect(screen.getByText('2 people')).toBeInTheDocument();
  });

  it('opens the first pack, runs the timer and moves on to the next person', async () => {
    render(<App />);
    click('Start stand-up');
    expect(screen.queryByRole('button', { name: 'Start stand-up' })).not.toBeInTheDocument();

    await advance(3500);
    expect(screen.getByText('Speaking')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Next pack' })).toBeEnabled();

    await advance(10_000);
    expect(screen.getByRole('timer')).toHaveTextContent('1:50');

    click('Next pack');
    await advance(3500);
    expect(screen.getByText('1 of 2 spoke')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Finish stand-up' })).toBeEnabled();
  });

  it('finishes the daily after the last person', async () => {
    render(<App />);
    click('Start stand-up');
    await advance(3500);
    click('Next pack');
    await advance(3500);
    click('Finish stand-up');

    expect(screen.getByText('Everyone has gone')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Stand-up done' })).toBeDisabled();
  });

  it('marks a person absent', async () => {
    render(<App />);
    click('Start stand-up');
    await advance(3500);
    click('Absent');
    await advance(3500);
    expect(screen.getByText('Absent', { selector: 'span' })).toBeInTheDocument();
  });

  it('pauses and resumes with the keyboard', async () => {
    render(<App />);
    click('Start stand-up');
    await advance(3500);
    fireEvent.keyDown(document.body, { key: 'p' });
    expect(screen.getByRole('button', { name: 'Resume' })).toBeInTheDocument();
    fireEvent.keyDown(document.body, { key: 'p' });
    expect(screen.getByRole('button', { name: 'Pause' })).toBeInTheDocument();
  });

  it('applies and persists settings edits', () => {
    render(<App />);
    click(/Team & time/);
    expect(screen.getByRole('heading', { name: 'Set up the stand-up' })).toBeVisible();

    fireEvent.change(screen.getByLabelText('Minutes'), { target: { value: '3' } });
    click('Save and go back');

    expect(screen.getByRole('timer')).toHaveTextContent('3:00');
    expect(JSON.parse(localStorage.getItem('daily-pack-v1')!).minutes).toBe(3);
  });

  it('adds and removes people', () => {
    render(<App />);
    click(/Team & time/);
    click('+ Add person');
    expect(screen.getAllByLabelText('Name')).toHaveLength(3);
    click('Quitar Ana');
    expect(screen.getAllByLabelText('Name')).toHaveLength(2);
  });
});
