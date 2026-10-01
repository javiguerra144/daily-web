import { generateArt, imageFor, initialsOf } from './art';

describe('initialsOf', () => {
  it('uses the first letters of up to two words', () => {
    expect(initialsOf('Lucía Pérez Gómez')).toBe('LP');
  });

  it('ignores parenthesised notes', () => {
    expect(initialsOf('Marcos (ejemplo)')).toBe('M');
  });

  it('falls back to a question mark', () => {
    expect(initialsOf('   ')).toBe('?');
  });
});

describe('imageFor', () => {
  it('prefers the uploaded picture', () => {
    expect(imageFor({ img: 'data:image/png;base64,AAA', name: 'A', role: 'QA' })).toBe(
      'data:image/png;base64,AAA',
    );
  });

  it('falls back to generated art (empty without a canvas)', () => {
    expect(imageFor({ img: '', name: 'A', role: 'QA' })).toBe(generateArt('A', 'QA'));
  });
});
