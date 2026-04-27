// Calculator State
let current = '0';
let previous = '';
let operator = null;
let shouldReset = false;

// DOM Elements
const resultEl = document.getElementById('result');
const exprEl = document.getElementById('expression');

// Update display
function updateDisplay() {
  resultEl.textContent = current.length > 12
    ? parseFloat(current).toExponential(4)
    : current;
}

// Number input
function input(val) {
  if (shouldReset) {
    current = val;
    shouldReset = false;
  } else if (current === '0') {
    current = val;
  } else if (current.length < 12) {
    current += val;
  }
  updateDisplay();
}

// Decimal point
function inputDot() {
  if (shouldReset) {
    current = '0.';
    shouldReset = false;
    updateDisplay();
    return;
  }
  if (!current.includes('.')) {
    current += '.';
    updateDisplay();
  }
}

// Set operator
function setOp(op) {
  if (operator && !shouldReset) calculate(true);
  previous = current;
  operator = op;
  shouldReset = true;
  const opSymbols = { '+': '+', '-': '−', '*': '×', '/': '÷' };
  exprEl.textContent = previous + ' ' + opSymbols[op];
}

// Calculate result
function calculate(chain = false) {
  if (!operator || !previous) return;
  const a = parseFloat(previous);
  const b = parseFloat(current);
  let res;
  switch (operator) {
    case '+': res = a + b; break;
    case '-': res = a - b; break;
    case '*': res = a * b; break;
    case '/': res = b === 0 ? 'Error' : a / b; break;
  }
  const opSymbols = { '+': '+', '-': '−', '*': '×', '/': '÷' };
  if (!chain) {
    exprEl.textContent = previous + ' ' + opSymbols[operator] + ' ' + current + ' =';
  }
  current = res === 'Error' ? 'Error' : String(parseFloat(res.toFixed(10)));
  if (!chain) { operator = null; previous = ''; }
  shouldReset = true;
  updateDisplay();
  if (!chain) {
    resultEl.classList.add('flash');
    setTimeout(() => resultEl.classList.remove('flash'), 300);
  }
}

// Clear all
function clearAll() {
  current = '0';
  previous = '';
  operator = null;
  shouldReset = false;
  exprEl.textContent = '';
  updateDisplay();
}

// Delete last character
function deleteLast() {
  if (shouldReset || current === 'Error') { clearAll(); return; }
  current = current.length > 1 ? current.slice(0, -1) : '0';
  updateDisplay();
}

// Toggle positive/negative
function toggleSign() {
  if (current !== '0' && current !== 'Error') {
    current = current.startsWith('-') ? current.slice(1) : '-' + current;
    updateDisplay();
  }
}

// Percentage
function percentage() {
  if (current !== 'Error') {
    current = String(parseFloat(current) / 100);
    updateDisplay();
  }
}

// Keyboard support
document.addEventListener('keydown', e => {
  if (e.key >= '0' && e.key <= '9') input(e.key);
  else if (e.key === '.') inputDot();
  else if (e.key === '+') setOp('+');
  else if (e.key === '-') setOp('-');
  else if (e.key === '*') setOp('*');
  else if (e.key === '/') { e.preventDefault(); setOp('/'); }
  else if (e.key === 'Enter' || e.key === '=') calculate();
  else if (e.key === 'Backspace') deleteLast();
  else if (e.key === 'Escape') clearAll();
  else if (e.key === '%') percentage();
});

// Ripple effect
document.querySelectorAll('button').forEach(btn => {
  btn.addEventListener('click', function(e) {
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    const rect = this.getBoundingClientRect();
    ripple.style.left = (e.clientX - rect.left - 30) + 'px';
    ripple.style.top  = (e.clientY - rect.top  - 30) + 'px';
    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 400);
  });
});