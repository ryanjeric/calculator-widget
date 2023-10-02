document.addEventListener("DOMContentLoaded", function () {
  const calculator = document.getElementById("calculator");
  const openBtnContainer = document.getElementById("openBtnContainer");
  const openBtn = document.getElementById("openBtn");
  const closeBtn = document.getElementById("closeBtn");
  const display = document.getElementById("display");
  const buttons = document.querySelectorAll("button");
  const clearBtn = document.getElementById("clear");

  let currentValue = "";
  let operator = "";
  let firstValue = null;
  let awaitingNextValue = false;
  let isDraggingCalculator = false;
  let isDraggingButton = false;
  let offsetX, offsetY;

  clearBtn.addEventListener("click", function () {
    resetCalculator();
  });

  openBtnContainer.addEventListener("mousedown", function (e) {
    isDraggingButton = true;
    offsetX = e.clientX - openBtnContainer.getBoundingClientRect().left;
    offsetY = e.clientY - openBtnContainer.getBoundingClientRect().top;
  });

  calculator.addEventListener("mousedown", function (e) {
    isDraggingCalculator = true;
    offsetX = e.clientX - calculator.getBoundingClientRect().left;
    offsetY = e.clientY - calculator.getBoundingClientRect().top;
  });

  document.addEventListener("mousemove", function (e) {
    if (isDraggingCalculator) {
      calculator.style.left = e.clientX - offsetX + "px";
      calculator.style.top = e.clientY - offsetY + "px";
    } else if (isDraggingButton) {
      openBtnContainer.style.left = e.clientX - offsetX + "px";
      openBtnContainer.style.top = e.clientY - offsetY + "px";
    }
  });

  document.addEventListener("mouseup", function () {
    isDraggingCalculator = false;
    isDraggingButton = false;
  });

  openBtn.addEventListener("click", function () {
    if (!isDraggingButton) {
      calculator.style.display = "block";
      // Calculate center position
      const centerX = window.innerWidth / 2 - calculator.offsetWidth / 2;
      const centerY = window.innerHeight / 2 - calculator.offsetHeight / 2;
      // Set the calculator position to the center
      calculator.style.left = centerX + "px";
      calculator.style.top = centerY + "px";
    }
  });

  closeBtn.addEventListener("click", function () {
    calculator.style.display = "none";
    resetCalculator();
  });

  buttons.forEach(function (button) {
    button.addEventListener("click", function () {
      const value = button.value;

      if (awaitingNextValue) {
        currentValue = value;
        display.value = currentValue;
        awaitingNextValue = false;
      } else {
        if (value === "=") {
          calculateResult();
        } else if (value === "C") {
          resetCalculator();
        } else if (
          value === "+" ||
          value === "-" ||
          value === "*" ||
          value === "/"
        ) {
          operator = value;
          firstValue = parseFloat(currentValue);
          awaitingNextValue = true;
        } else {
          currentValue += value;
          display.value = currentValue;
        }
      }
    });
  });

  function calculateResult() {
    if (operator && firstValue !== null) {
      const secondValue = parseFloat(currentValue);
      let result;

      switch (operator) {
        case "+":
          result = firstValue + secondValue;
          break;
        case "-":
          result = firstValue - secondValue;
          break;
        case "*":
          result = firstValue * secondValue;
          break;
        case "/":
          if (secondValue === 0) {
            display.value = "Error";
            resetCalculator();
            return;
          }
          result = firstValue / secondValue;
          break;
        default:
          break;
      }

      display.value = result;
      currentValue = result.toString();
      firstValue = null;
      operator = "";
    }
  }

  function resetCalculator() {
    currentValue = "";
    operator = "";
    firstValue = null;
    awaitingNextValue = false;
    display.value = "";
  }
});
