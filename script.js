const input = document.getElementById("input-box");
const buttons = document.querySelectorAll('button');

let string = "";
let lastInput = "";
const maxDigits = 12;

// Add button press animation
function addButtonAnimation(button) {
    button.classList.add('button-press');
    setTimeout(() => {
        button.classList.remove('button-press');
    }, 150);
}

// Format number with commas
function formatNumber(num) {
    let parts = num.toString().split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join('.');
}

// Handle calculation errors
function calculateResult(expression) {
    try {
        const result = eval(expression);
        if (!isFinite(result)) {
            return "Error";
        }
        return result.toString().length > maxDigits ? 
            result.toExponential(7) : result;
    } catch (error) {
        return "Error";
    }
}

buttons.forEach(button => {
    button.addEventListener('click', (e) => {
        // Add button press animation
        addButtonAnimation(e.target);
        
        const buttonText = e.target.innerHTML;
        
        switch(buttonText) {
            case '=':
                if (string) {
                    string = calculateResult(string);
                    if (string !== "Error") {
                        string = formatNumber(string);
                    }
                    input.value = string;
                }
                break;
                
            case 'AC':
                string = "";
                input.value = string;
                break;
                
            case 'DEL':
                string = string.slice(0, -1);
                input.value = string;
                break;
                
            default:
                // Prevent multiple operators in sequence
                if (['+', '-', '*', '/', '%'].includes(buttonText)) {
                    if (['+', '-', '*', '/', '%'].includes(lastInput)) {
                        string = string.slice(0, -1);
                    }
                }
                
                // Prevent multiple decimal points in a number
                if (buttonText === '.' && lastInput === '.') {
                    return;
                }
                
                // Limit input length
                if (string.length < maxDigits) {
                    string += buttonText;
                    input.value = string;
                }
                break;
        }
        
        lastInput = buttonText;
    });
});

// Add keyboard support
document.addEventListener('keydown', (e) => {
    const key = e.key;
    const validKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '+', '-', '*', '/', '%', 'Enter', 'Backspace', 'Delete', 'Escape'];
    
    if (validKeys.includes(key)) {
        e.preventDefault();
        
        if (key === 'Enter') {
            document.querySelector('.equal-btn').click();
        } else if (key === 'Backspace' || key === 'Delete') {
            document.querySelector('button:nth-child(2)').click();
        } else if (key === 'Escape') {
            document.querySelector('button:nth-child(1)').click();
        } else {
            const button = Array.from(buttons).find(btn => btn.textContent === key);
            if (button) button.click();
        }
    }
});