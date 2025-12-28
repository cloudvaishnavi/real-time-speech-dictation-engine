import { cleanText } from '../../backend/services/cleaningService.js';

describe('cleanText', () => {
  test('removes filler words and fixes punctuation', () => {
    const input = 'Um I was like going to the store you know';
    const expected = 'I was going to the store.';
    expect(cleanText(input)).toBe(expected);
  });

  test('adds period if missing', () => {
    const input = 'This is a test';
    const expected = 'This is a test.';
    expect(cleanText(input)).toBe(expected);
  });

  test('capitalizes first letter of sentences', () => {
    const input = 'hello. how are you? i am fine!';
    const expected = 'Hello. How are you? I am fine!';
    expect(cleanText(input)).toBe(expected);
  });

  test('removes repeated words', () => {
    const input = 'I I I want to to go go home home.';
    const expected = 'I want to go home.';
    expect(cleanText(input)).toBe(expected);
  });

  test('handles empty and whitespace input', () => {
    expect(cleanText('')).toBe('');
    expect(cleanText('   ')).toBe('');
  });

  test('removes filler words with punctuation', () => {
    const input = 'Uh, I, uh, think like, it is good.';
    const expected = 'I think it is good.';
    expect(cleanText(input)).toBe(expected);
  });

  test('complex sentence with filler words and repeated words', () => {
    const input = 'You know you know, I I think that that is um um good good';
    const expected = 'I think that is good.';
    expect(cleanText(input)).toBe(expected);
  });
});
