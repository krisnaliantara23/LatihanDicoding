import test from 'node:test';
import assert from 'node:assert';
import sum from './index.js';

test('Mengembalikan jumlah dari dua angka positif', () => {
  assert.strictEqual(sum(3, 5), 8);
  assert.strictEqual(sum(10, 20), 30);
});

test('Mengembalikan 0 jika salah satu angka negatif atau bukan angka', () => {
  const invalidInputs = [
    [-3, 5], [3, -5], [-3, -5],   // Kasus negatif
    ['3', 5], [3, '5'], ['3', '5'], // Kasus non-numeric
    [null, 5], [3, undefined], [{}, []] // Kasus tipe data aneh
  ];

  invalidInputs.forEach(([a, b]) => {
    assert.strictEqual(sum(a, b), 0);
  });
});

test('Menjumlahkan angka dengan 0 dengan benar', () => {
  assert.strictEqual(sum(0, 5), 5);
  assert.strictEqual(sum(5, 0), 5);
  assert.strictEqual(sum(0, 0), 0);
});
