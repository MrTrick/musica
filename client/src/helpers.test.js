import {hhmmss} from './helpers';

it('hhmmss formats normal durations correctly', () => {
  expect(hhmmss(0)).toBe('00:00');
  expect(hhmmss(59)).toBe('00:59');

  expect(hhmmss(60)).toBe('01:00');
  expect(hhmmss(61)).toBe('01:01');
  expect(hhmmss(754)).toBe('12:34');

  expect(hhmmss(3599)).toBe('59:59');
  expect(hhmmss(3600)).toBe('1:00:00');
  expect(hhmmss(3601)).toBe('1:00:01');
  expect(hhmmss(3661)).toBe('1:01:01');

  expect(hhmmss(36000)).toBe('10:00:00');
});

it('hhmmss handles floats by flooring', () => {
  expect(hhmmss(187.1293)).toEqual(hhmmss(187));
  expect(hhmmss(307.9028)).toEqual(hhmmss(307));
});

it('hmmmss handles invalid values', () => {
  expect(hhmmss(undefined)).toBe('-');
  expect(hhmmss("hhmmss")).toBe('-');
  expect(hhmmss({})).toBe('-');
  expect(hhmmss([])).toBe('-');
  expect(hhmmss(-1)).toBe('-');
  expect(hhmmss(-0.1)).toBe('-');
});
