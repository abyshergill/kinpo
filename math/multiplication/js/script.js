
    // Web Audio Kid Synthesizer Node FX Engine
    const SoundFX = {
        ctx: null,
        init() { if (!this.ctx) this.ctx = new (window.AudioContext || window.webkitAudioContext)(); },
        play(freq, type, duration, volume) {
            this.init();
            let osc = this.ctx.createOscillator();
            let gain = this.ctx.createGain();
            osc.type = type;
            osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
            gain.gain.setValueAtTime(volume, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start();
            osc.stop(this.ctx.currentTime + duration);
        },
        click() { this.play(500, 'sine', 0.05, 0.1); },
        pop() { this.play(820, 'sine', 0.08, 0.15); },
        remove() { this.play(340, 'sine', 0.05, 0.1); },
        correct() {
            this.play(523.25, 'triangle', 0.12, 0.25);
            setTimeout(() => this.play(659.25, 'triangle', 0.12, 0.25), 80);
            setTimeout(() => this.play(783.99, 'triangle', 0.25, 0.25), 160);
        },
        wrong() { this.play(180, 'sawtooth', 0.25, 0.2); }
    };

    // Core Game Variables
    let currentQuestion = 1;
    let totalQuestions = 10;
    let score = 0;
    let currentEmoji = "🍎";
    let valA = 0; // Number of Groups
    let valB = 0; // Items per Group
    let correctAnswer = 0;
    let childName = "Superstar";

    // DOM Elements
    const emojiBoard = document.getElementById('emoji-board');
    const qTracker = document.getElementById('q-tracker');
    const scoreTracker = document.getElementById('score-tracker');
    const greetingBanner = document.getElementById('greeting-banner');
    const playerInput = document.getElementById('player-input');
    
    const numDisplayA = document.getElementById('num-display-a');
    const numDisplayB = document.getElementById('num-display-b');
    const basketsContainer = document.getElementById('baskets-container');

    const parentChildName = document.getElementById('parent-child-name');
    const parentInputA = document.getElementById('parent-input-a');
    const parentInputB = document.getElementById('parent-input-b');
    const parentLoadBtn = document.getElementById('parent-load-btn');
    
    const victoryModal = document.getElementById('victory-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalDesc = document.getElementById('modal-desc');
    const btnNext = document.getElementById('action-next');

    // Parent Dashboard Name sync
    parentChildName.addEventListener('input', (e) => {
        let val = e.target.value.trim();
        childName = val.length > 0 ? val : "Superstar";
        greetingBanner.innerText = `Let's multiply, ${childName}!`;
    });

    // Question Problem Builder
    function generateMathProblem(customA = null, customB = null) {
        playerInput.value = "";
        basketsContainer.innerHTML = ""; // Empty out old baskets

        if (customA !== null && customB !== null) {
            valA = customA;
            valB = customB;
        } else {
            // Keep limits comfortable for rendering child baskets (Max 5 baskets, Max 6 items)
            valA = Math.floor(Math.random() * 4) + 2; // 2 to 5 baskets
            valB = Math.floor(Math.random() * 5) + 2; // 2 to 6 items per basket
        }
        
        correctAnswer = valA * valB;

        numDisplayA.innerText = valA;
        numDisplayB.innerText = valB;
        qTracker.innerText = `Question: ${currentQuestion} / ${totalQuestions}`;

        // Build empty group baskets dynamically based on number A!
        for (let i = 1; i <= valA; i++) {
            let basket = document.createElement('div');
            basket.classList.add('group-basket');
            
            let label = document.createElement('span');
            label.classList.add('basket-label');
            label.innerText = `Group ${i}`;
            
            basket.appendChild(label);
            basketsContainer.appendChild(basket);
        }
    }

    // Active Mutation Add / Remove Hooks
    document.getElementById('action-add').addEventListener('click', () => {
        let baskets = basketsContainer.querySelectorAll('.group-basket');
        if(baskets.length === 0) return;
        
        SoundFX.pop();
        baskets.forEach(basket => {
            let el = document.createElement('span');
            el.classList.add('sandbox-emoji');
            el.innerText = currentEmoji;
            basket.appendChild(el);
        });
    });

    document.getElementById('action-remove').addEventListener('click', () => {
        let baskets = basketsContainer.querySelectorAll('.group-basket');
        if(baskets.length === 0) return;

        // Check if there are emojis inside the first basket to remove
        let firstBasketEmojis = baskets[0].querySelectorAll('.sandbox-emoji');
        if (firstBasketEmojis.length > 0) {
            SoundFX.remove();
            baskets.forEach(basket => {
                let emojis = basket.querySelectorAll('.sandbox-emoji');
                if(emojis.length > 0) {
                    basket.removeChild(emojis[emojis.length - 1]);
                }
            });
        }
    });

    // Parent Custom Input Dispatcher Loader
    parentLoadBtn.addEventListener('click', () => {
        let pA = parseInt(parentInputA.value);
        let pB = parseInt(parentInputB.value);

        if (isNaN(pA) || isNaN(pB) || pA <= 0 || pB <= 0) {
            SoundFX.wrong();
            alert("Parents, please submit numbers greater than 0!");
            return;
        }
        if (pA > 5 || pB > 10) {
            SoundFX.wrong();
            alert("To keep everything nicely visible, choose up to 5 Groups and up to 10 Items!");
            return;
        }

        SoundFX.correct();
        generateMathProblem(pA, pB);
        parentInputA.value = "";
        parentInputB.value = "";
    });

    // Dashboard Theme Ingest Engine
    emojiBoard.addEventListener('click', (e) => {
        if (e.target.classList.contains('emoji-opt')) {
            SoundFX.click();
            document.querySelectorAll('.emoji-opt').forEach(opt => opt.classList.remove('selected'));
            e.target.classList.add('selected');
            currentEmoji = e.target.getAttribute('data-emoji');
            
            // Real-time replacement of any emojis currently on screen
            basketsContainer.querySelectorAll('.sandbox-emoji').forEach(el => {
                el.innerText = currentEmoji;
            });
        }
    });

    // Answer Verification Action
    document.getElementById('action-check').addEventListener('click', () => {
        let guess = parseInt(playerInput.value);

        if (isNaN(guess)) { SoundFX.wrong(); return; }

        if (guess === correctAnswer) {
            SoundFX.correct();
            score++;
            scoreTracker.innerText = `Stars: ⭐ ${score}`;
            
            modalTitle.innerText = "Correct! 🎉";
            modalDesc.innerText = `Wonderful math multiplication, ${childName}!`;
            victoryModal.style.display = "flex";
        } else {
            SoundFX.wrong();
            modalTitle.innerText = "Try Again! 🤔";
            modalDesc.innerText = `Count all the objects hiding inside the ${valA} baskets!`;
            victoryModal.style.display = "flex";
        }
    });

    btnNext.addEventListener('click', () => {
        victoryModal.style.display = "none";
        
        if (modalTitle.innerText.includes("Correct")) {
            currentQuestion++;
            if (currentQuestion > totalQuestions) {
                alert(`Superb job! You finished the multiplication round, ${childName}! Final Stars: ⭐ ${score}`);
                currentQuestion = 1;
                score = 0;
                scoreTracker.innerText = `Stars: ⭐ ${score}`;
            }
            generateMathProblem();
        }
    });

    playerInput.addEventListener('keydown', (e) => { if(e.key === 'Enter') document.getElementById('action-check').click(); });

    // Initial Launch Bootloader Run Command
    generateMathProblem();
