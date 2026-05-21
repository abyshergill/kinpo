
    let currentMode = 'learn'; 
    let selectedNumber = 1;
    let quizMultiplier = 1;
    let score = 0;

    // Populates dropdown selections from 1 up to 20 safely
    const selectEl = document.getElementById('table-select');
    for (let i = 1; i <= 20; i++) {
        let opt = document.createElement('option');
        opt.value = i;
        opt.innerText = `Table of ${i}`;
        selectEl.appendChild(opt);
    }

    // Handles layout refreshing
    function updateView() {
        selectedNumber = parseInt(document.getElementById('table-select').value);
        if (currentMode === 'learn') {
            generateVerticalTable();
        } else {
            generateQuizQuestion();
        }
    }

    // Dynamic mode switcher layout toggle elements
    function switchMode(mode) {
        currentMode = mode;
        document.getElementById('btn-learn').classList.toggle('active', mode === 'learn');
        document.getElementById('btn-quiz').classList.toggle('active', mode === 'quiz');

        if (mode === 'learn') {
            document.getElementById('study-view').style.display = 'flex';
            document.getElementById('quiz-view').style.display = 'none';
            generateVerticalTable();
        } else {
            document.getElementById('study-view').style.display = 'none';
            document.getElementById('quiz-view').style.display = 'block';
            generateQuizQuestion();
        }
    }

    // Creates the clean vertical equation block rows (1 down to 10)
    function generateVerticalTable() {
        const studyView = document.getElementById('study-view');
        studyView.innerHTML = ''; 
        
        for (let i = 1; i <= 10; i++) {
            const row = document.createElement('div');
            row.className = 'vertical-row';
            row.innerHTML = `<span>${selectedNumber} × ${i}</span> <span>=</span> <span class="answer">${selectedNumber * i}</span>`;
            studyView.appendChild(row);
        }
    }

    // Sets up custom equation targets
    function generateQuizQuestion() {
        quizMultiplier = Math.floor(Math.random() * 10) + 1; 
        document.getElementById('quiz-question').innerText = `${selectedNumber} × ${quizMultiplier} = ?`;
        document.getElementById('quiz-answer').value = '';
        document.getElementById('feedback').innerHTML = '';
        document.getElementById('quiz-answer').focus();
    }

    // Verification engine logic
    function checkQuizAnswer() {
        const inputField = document.getElementById('quiz-answer');
        const userAnswer = parseInt(inputField.value);
        const correctAnswer = selectedNumber * quizMultiplier;
        const feedbackEl = document.getElementById('feedback');

        if (isNaN(userAnswer)) return;

        if (userAnswer === correctAnswer) {
            feedbackEl.className = "feedback correct";
            feedbackEl.innerHTML = "🎉 Splendid! That is correct! 🌈";
            score++;
            document.getElementById('score').innerText = score;
            setTimeout(generateQuizQuestion, 1500);
        } else {
            feedbackEl.className = "feedback wrong";
            feedbackEl.innerHTML = `❌ Not quite! Give it another try!`;
        }
    }

    function handleKeyPress(event) {
        if (event.key === 'Enter') {
            checkQuizAnswer();
        }
    }

    // Run setup immediately on window check conditions
    window.onload = updateView;
