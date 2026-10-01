import { fireEvent, render, screen } from '@testing-library/react';
import { NumberField } from './NumberField';

const noop = () => undefined;

const setup = (value = 2) => {
  const onCommit = vi.fn();
  render(<NumberField label="Minutos" value={value} min={0} max={30} onCommit={onCommit} />);
  return { onCommit, input: screen.getByLabelText('Minutos') as HTMLInputElement };
};

describe('NumberField', () => {
  it('commits valid values as they are typed, clamped to the range', () => {
    const { input, onCommit } = setup();
    fireEvent.change(input, { target: { value: '45' } });
    expect(onCommit).toHaveBeenLastCalledWith(30);
  });

  it('does not commit an empty draft until blur, then falls back to the minimum', () => {
    const { input, onCommit } = setup();
    fireEvent.change(input, { target: { value: '' } });
    expect(onCommit).not.toHaveBeenCalled();
    fireEvent.blur(input);
    expect(onCommit).toHaveBeenCalledWith(0);
    expect(input.value).toBe('0');
  });

  it('follows external value changes', () => {
    const { rerender } = render(
      <NumberField label="Segundos" value={10} min={0} max={59} onCommit={noop} />,
    );
    rerender(<NumberField label="Segundos" value={30} min={0} max={59} onCommit={noop} />);
    expect(screen.getByLabelText('Segundos')).toHaveValue(30);
  });
});
