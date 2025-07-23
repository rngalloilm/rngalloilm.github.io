// Wait until the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Get references to UI elements
  const display = document.getElementById('calc-display');
  const buttons = document.querySelectorAll('.btn');
  const historyList = document.getElementById('history-list');
  const clearHistoryBtn = document.getElementById('clear-history');

  // Calculator state variables
  let currentInput = '0';       // string representation of the current number
  let previousValue = null;     // number
  let currentOperator = null;   // string: '+', '-', '*', '/'
  let waitingForOperand = false;
  let errorState = false;       // when true, only clear (C) is accepted
  let lastButtonEquals = false; // flag to avoid repeated "=" entries

  // Update the display
  function updateDisplay() {
    display.value = currentInput;
  }

  // Add an entry to the history list
  function addHistoryEntry(result) {
    const li = document.createElement('li');
    li.textContent = result;
    // Add click event to allow history reuse (if in the appropriate state)
    li.addEventListener('click', () => {
      // Only accept history input when starting a new calculation or waiting for the second operand with no digits entered yet
      if ((previousValue === null && !waitingForOperand) || (waitingForOperand && currentInput === '')) {
        currentInput = result.toString();
        updateDisplay();
        waitingForOperand = false;
      }
    });
    historyList.appendChild(li);
  }

  // Clear all calculator state
  function clearCalculator() {
    currentInput = '0';
    previousValue = null;
    currentOperator = null;
    waitingForOperand = false;
    errorState = false;
    lastButtonEquals = false;
    updateDisplay();
  }

  // Append a digit (or replace if starting fresh)
  function inputDigit(digit) {
    if (errorState) return; // ignore if error

    if (waitingForOperand || currentInput === '0' || lastButtonEquals) {
      currentInput = digit;
      waitingForOperand = false;
      lastButtonEquals = false;
    } else {
      currentInput += digit;
    }
    updateDisplay();
  }

  // Append a decimal point if not already present
  function inputDecimal() {
    if (errorState) return;
    if (waitingForOperand) {
      // Start a new operand with "0."
      currentInput = '0.';
      waitingForOperand = false;
    } else if (!currentInput.includes('.')) {
      currentInput += '.';
    }
    updateDisplay();
  }

  // Toggle the sign of the current input
  function toggleSign() {
    if (errorState) return;
    if (currentInput === '0') return;
    if (currentInput.startsWith('-')) {
      currentInput = currentInput.substring(1);
    } else {
      currentInput = '-' + currentInput;
    }
    updateDisplay();
  }

  // Perform the pending calculation (if any)
  function performCalculation() {
    if (errorState) return;
    if (currentOperator === null || previousValue === null) return;

    const currentValue = parseFloat(currentInput);
    let result = 0;

    switch (currentOperator) {
      case '+':
        result = previousValue + currentValue;
        break;
      case '-':
        result = previousValue - currentValue;
        break;
      case '*':
        result = previousValue * currentValue;
        break;
      case '/':
        // Handle division by zero
        if (currentValue === 0) {
          errorState = true;
          currentInput = 'Error';
          updateDisplay();
          return;
        }
        result = previousValue / currentValue;
        break;
      default:
        return;
    }

    // Round result
    result = +result.toFixed(10); // remove floating point imprecision

    // Add to history if this is a completed operation
    addHistoryEntry(result);

    // Prepare for next input
    currentInput = result.toString();
    previousValue = result;
    currentOperator = null;
    waitingForOperand = true; // ready for a new operand
    lastButtonEquals = true;
    updateDisplay();
  }

  // Handle an operator button press
  function handleOperator(nextOperator) {
    if (errorState) return;

    const inputValue = parseFloat(currentInput);

    // If an operator is pressed consecutively (waiting for operand), update operator
    if (waitingForOperand && currentOperator !== null) {
      currentOperator = nextOperator;
      return;
    }

    // If there's no previous value, store the current one
    if (previousValue === null) {
      previousValue = inputValue;
    } else if (currentOperator) {
      // Perform the pending calculation before setting new operator
      performCalculation();
      // After calculation, currentInput and previousValue have been updated.
    }

    currentOperator = nextOperator;
    waitingForOperand = true;
    lastButtonEquals = false;
  }

  // Handle the equals (=) button
  function handleEquals() {
    if (errorState) return;
    if (currentOperator === null) return;

    // Avoid repeated equals if no new operand was entered.
    if (waitingForOperand && lastButtonEquals) return;
    performCalculation();
  }

  // Process input from buttons or keyboard
  function processInput(value) {
    if (errorState && value !== 'C') return;

    if (!isNaN(value)) {
      // A digit was pressed
      inputDigit(value);
    } else {
      switch (value) {
        case '.':
          inputDecimal();
          break;
        case '+/-':
          toggleSign();
          break;
        case 'C':
          clearCalculator();
          break;
        case '+':
        case '-':
        case '*':
        case '/':
          handleOperator(value);
          break;
        case '=':
          handleEquals();
          break;
        default:
          // Ignore any invalid input
          break;
      }
    }
  }

  // Attach click events to all buttons
  buttons.forEach(button => {
    button.addEventListener('click', () => {
      const value = button.getAttribute('data-value');
      processInput(value);
    });
  });

  // Allow keyboard input. Valid keys: digits, period, operators, Backspace (C) and Enter (=)
  document.addEventListener('keydown', (e) => {
    // Prevent default behavior for keys we handle
    const validKeys = '0123456789.+-*/';
    if (validKeys.includes(e.key)) {
      e.preventDefault();
      // For '*' or '/', these are directly supported
      processInput(e.key);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      processInput('=');
    } else if (e.key === 'Backspace') {
      e.preventDefault();
      processInput('C');
    }
  });

  // Clear history button
  clearHistoryBtn.addEventListener('click', () => {
    historyList.innerHTML = '';
  });

  // Initialize display
  updateDisplay();
});
  