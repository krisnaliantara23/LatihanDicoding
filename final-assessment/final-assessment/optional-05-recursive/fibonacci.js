// fibonacci.js
function fibonacci(n, sequence = [0, 1]) {
    if (n <= 1) {
      return sequence.slice(0, n + 1);
    }
    
    sequence.push(sequence[sequence.length - 1] + sequence[sequence.length - 2]);
    return fibonacci(n - 1, sequence);
  }
  
  // Jangan hapus kode di bawah ini!
  export default fibonacci;