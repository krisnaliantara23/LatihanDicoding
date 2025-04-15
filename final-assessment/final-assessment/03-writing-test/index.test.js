import test from 'node:test';
import assert from 'node:assert';
import { sum } from './index.js';

test('sum function should return the correct sum of two numbers', () => {
  assert.strictEqual(sum(2, 3), 5);
  assert.strictEqual(sum(-1, 1), 0);
  assert.strictEqual(sum(2, 7), 9);
  assert.strictEqual(sum(10, -5), 5);
});

