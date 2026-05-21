
    // Numbers to Words logic tools
    const ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
    const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
    const scales = ['', 'thousand', 'million'];

    function numberToWords(num) {
        if (num === 0) return 'zero';
        
        function convertLessThanOneThousand(n) {
            let str = '';
            if (n >= 100) {
                str += ones[Math.floor(n / 100)] + ' hundred ';
                n %= 100;
            }
            if (n >= 20) {
                str += tens[Math.floor(n / 10)] + ' ';
                n %= 10;
            }
            if (n > 0) {
                str += ones[n] + ' ';
            }
            return str.trim();
        }

        let wordResult = '';
        let scaleIndex = 0;

        while (num > 0) {
            let chunk = num % 1000;
            if (chunk !== 0) {
                let chunkStr = convertLessThanOneThousand(chunk);
                wordResult = chunkStr + (scales[scaleIndex] ? ' ' + scales[scaleIndex] : '') + ' ' + wordResult;
            }
            num = Math.floor(num / 1000);
            scaleIndex++;
        }

        return wordResult.trim();
    }

    // State Variables
    let currentMode = 'N2W'; 
    let currentNumber = 0;
    let currentWordString = "";
    let score = 0;
    let isCustomTarget = false;

    // Game Core Engine
    function displayQuestion() {
        currentWordString = numberToWords(currentNumber);

        const questionEl = document.getElementById('question');
        const inputEl = document.getElementById('user-answer');
        const customIndicator = document.getElementById('custom-indicator');
        
        inputEl.value = "";
        document.getElementById('feedback').innerHTML = "";

        // Show/Hide Parent choice badge
        customIndicator.style.display = isCustomTarget ? "block" : "none";

        if (currentMode === 'N2W') {
            questionEl.innerText = currentNumber.toLocaleString();
            inputEl.placeholder = "Type the words (e.g., twenty one)";
            inputEl.type = "text";
        } else {
            questionEl.innerText = currentWordString;
            inputEl.placeholder = "Type the numbers (e.g., 21)";
            inputEl.type = "number";
        }
    }

    function generateRandomQuestion() {
        isCustomTarget = false;
        const maxRange = parseInt(document.getElementById('max-range').value);
        currentNumber = Math.floor(Math.random() * maxRange) + 1;
        displayQuestion();
    }

    // Parent Command Action
    function injectCustomNumber() {
        const customInput = document.getElementById('custom-number');
        const val = parseInt(customInput.value);

        if (isNaN(val) || val < 1 || val > 1000000) {
            alert("Parents: Please enter a valid number between 1 and 1,000,000!");
            return;
        }

        currentNumber = val;
        isCustomTarget = true;
        displayQuestion();
        customInput.value = ""; // Clear parent input box after sending
    }

    function checkAnswer() {
        const userInput = document.getElementById('user-answer').value.trim().toLowerCase();
        const feedbackEl = document.getElementById('feedback');
        let isCorrect = false;

        if (currentMode === 'N2W') {
            const cleanUser = userInput.replace(/-/g, ' ').replace(/\s+/g, ' ');
            const cleanTarget = currentWordString.toLowerCase().replace(/-/g, ' ').replace(/\s+/g, ' ');
            if (cleanUser === cleanTarget) isCorrect = true;
        } else {
            if (userInput === currentNumber.toString()) isCorrect = true;
        }

        if (isCorrect) {
            feedbackEl.className = "feedback correct";
            feedbackEl.innerHTML = "🎉 Awesome Job! That is Correct! 🌈";
            score++;
            document.getElementById('score').innerText = score;
            
            // If it was a custom parent question, generate a fresh random one next
            setTimeout(generateRandomQuestion, 2000);
        } else {
            feedbackEl.className = "feedback wrong";
            feedbackEl.innerHTML = `❌ Not quite! Give it another try!`;
        }
    }

    function setMode(mode) {
        currentMode = mode;
        document.getElementById('btn-n2w').classList.toggle('active', mode === 'N2W');
        document.getElementById('btn-w2n').classList.toggle('active', mode === 'W2N');
        displayQuestion();
    }

    function resetToRandomGame() {
        generateRandomQuestion();
    }

    function handleKeyPress(event) {
        if (event.key === 'Enter') {
            checkAnswer();
        }
    }

    window.onload = generateRandomQuestion;
