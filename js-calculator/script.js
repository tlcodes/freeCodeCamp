/* The calculator uses the operation order of precedence,
so multiplication and division are treated separately.
We parse numbers from strings (input), so + or - before 
a number parse positive or negative numbers accoringly.
We use reduce to get the final result, after multiplying
and dividing the correct parts of our expression. */


document.addEventListener('keydown', getInput);
const buttons = [...document.getElementById('calculator').children];
buttons.forEach(button => button.addEventListener('click', getInput));

let mathInput = []; // to hold the values of our expression, and get final result
let typed = ''; // the string holding each subpart, to be pushed to mathInput array
let display = ''; // the string displaying the full input
let result = null;

function getInput(event) {
    let input = (event.type === 'click') ? event.target.innerText : event.key;
    // validate input first
    if (!/[-+/*0-9.=(Clear|Enter)]/.test(input) || event.target.id === 'display') {return};           
    if (/[0-9.]/.test(input)) {                
        // display is '0' when pressing Clear, 
        // if we type a number, we remove the 0                
        if (display === '0') {
            display = ''
        };
        // No '.' twice in a number
        if (input === '.' && typed.includes(input)) {                    
            return;
        }
        if (result) { // if a result was previously computed, reset
            typed = ''; 
            display = ''; 
            result = null;
        }                     
        typed += input;
    } else if (/[-+]/.test(input)) { // if input is + or -
    if (result) {result = null;}
        if (/[0-9]/.test(display[display.length-1])) { // last input was a number
            mathInput.push(parseFloat(typed));  // push number to mathInput array
        } else if (/[-+*/]/.test(display[display.length-1])) { // if last input was another operator
            display = display.slice(0, -1); // remove the last input
            if (/[*/]/.test(mathInput[mathInput.length-1])) { // if previous operator was * or /
                mathInput.pop(); // remove it from 
            }                  
        }        
        typed = input;
    } else if (/[*/]/.test(input)) {
        if (result) {result = null;}
        // or only * and /, add each to the array
        if (/[-+*/]/.test(display[display.length-1])) {
            display = display.slice(0, -1);
            typed = '';
            if (/[*/]/.test(mathInput[mathInput.length-1])) {
                mathInput.pop();
            }
            mathInput.push(input);
        } else {
            mathInput.push(parseFloat(typed));
            typed = '';
            mathInput.push(input);
        }
    } else if (input === 'Clear') { // reset the calculator
        typed = '';
        mathInput = [];
        display = '0';
        result = null;
        document.getElementById('display').innerText = display;
        return;
    } else if (input === 'Enter' || input === '=') { // getting the final result
        if (/[-+*/.]/.test(display[display.length-1])) { // last input can't be an operator
            alert("Last input can't be " + display[display.length-1] )                    
            return;
        } else {
            input = '';
            mathInput.push(parseFloat(typed)); // parse last input         
            result = parseFloat(getResult(mathInput).toFixed(5)).toPrecision(); // get result

            mathInput = [];
            typed = result; // keep the result if next input is an operator, for further operation
            display = result;
        }
    } else {return};
    // in case our first input is an operator, 
    // we'd parse an empty string to NaN, so we remove it
    if (isNaN(mathInput[0])) {mathInput.shift()};
    display += input;
    document.getElementById('display').innerText = display;
    console.log('typed: ', typed, 'mathInput: ', mathInput);
}

function getResult(mathExp) {            
    while (mathExp.findIndex(op => /[*/]/.test(op)) > 0) {
        let opIdx = mathExp.findIndex(op => /[*/]/.test(op));
        if (mathExp[opIdx] === '*') {
            mathExp.splice(opIdx - 1, 3, multiply(mathExp[opIdx - 1], mathExp[opIdx + 1]));
        } else {
            mathExp.splice(opIdx - 1, 3, divide(mathExp[opIdx - 1], mathExp[opIdx + 1]));
        }
    }
    return mathExp.reduce((a,b) => a+b);
}
function subtract(a, b) { return a - b };
function multiply(a, b) { return a * b };
function divide(a, b) { return a / b };
