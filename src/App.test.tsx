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
    expect(screen.getByText('Nadie todavía')).toBeInTheDocument();
    expect(screen.getByRole('timer')).toHaveTextContent('2:00');
    expect(screen.getByRole('button', { name: 'Empezar daily' })).toBeEnabled();
    expect(screen.getByText('2 personas')).toBeInTheDocument();
  });

  it('opens the first pack, runs the timer and moves on to the next person', async () => {
    render(<App />);
    click('Empezar daily');
    expect(screen.queryByRole('button', { name: 'Empezar daily' })).not.toBeInTheDocument();

    await advance(3500);
    expect(screen.getByText('Hablando')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Siguiente sobre' })).toBeEnabled();

    await advance(10_000);
    expect(screen.getByRole('timer')).toHaveTextContent('1:50');

    click('Siguiente sobre');
    await advance(3500);
    expect(screen.getByText('1 de 2 hablaron')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Terminar daily' })).toBeEnabled();
  });

  it('finishes the daily after the last person', async () => {
    render(<App />);
    click('Empezar daily');
    await advance(3500);
    click('Siguiente sobre');
    await advance(3500);
    click('Terminar daily');

    expect(screen.getByText('Todos han pasado')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Daily terminada' })).toBeDisabled();
  });

  it('marks a person absent', async () => {
    render(<App />);
    click('Empezar daily');
    await advance(3500);
    click('Ausente');
    await advance(3500);
    expect(screen.getByText('Ausente', { selector: 'span' })).toBeInTheDocument();
  });

  it('pauses and resumes with the keyboard', async () => {
    render(<App />);
    click('Empezar daily');
    await advance(3500);
    fireEvent.keyDown(document.body, { key: 'p' });
    expect(screen.getByRole('button', { name: 'Seguir' })).toBeInTheDocument();
    fireEvent.keyDown(document.body, { key: 'p' });
    expect(screen.getByRole('button', { name: 'Pausa' })).toBeInTheDocument();
  });

  it('applies and persists settings edits', () => {
    render(<App />);
    click(/Equipo y tiempo/);
    expect(screen.getByRole('heading', { name: 'Configura la daily' })).toBeVisible();

    fireEvent.change(screen.getByLabelText('Minutos'), { target: { value: '3' } });
    click('Guardar y volver');

    expect(screen.getByRole('timer')).toHaveTextContent('3:00');
    expect(JSON.parse(localStorage.getItem('daily-pack-v1')!).minutes).toBe(3);
  });

  it('adds and removes people', () => {
    render(<App />);
    click(/Equipo y tiempo/);
    click('+ Añadir persona');
    expect(screen.getAllByLabelText('Nombre')).toHaveLength(3);
    click('Quitar Ana');
    expect(screen.getAllByLabelText('Nombre')).toHaveLength(2);
  });
});
