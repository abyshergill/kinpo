
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
            pop() { this.play(850, 'sine', 0.08, 0.15); },
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
        let valA = 0; // Total Objects Pool
        let valB = 0; // Divider Baskets Count
        let correctAnswer = 0;
        let childName = "Superstar";
        let supplyRemaining = 0;

        // DOM Elements
        const emojiBoard = document.getElementById('emoji-board');
        const qTracker = document.getElementById('q-tracker');
        const scoreTracker = document.getElementById('score-tracker');
        const greetingBanner = document.getElementById('greeting-banner');
        const playerInput = document.getElementById('player-input');
        
        const numDisplayA = document.getElementById('num-display-a');
        const numDisplayB = document.getElementById('num-display-b');
        const supplyContainer = document.getElementById('supply-container');
        const supplyCountTxt = document.getElementById('supply-count-txt');
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
            greetingBanner.innerText = `Let's share equally, ${childName}!`;
        });

        // Clean Generation Matrix Pools (Ensuring no messy fractions for children!)
        const divisionPairs = [
            { a: 6, b: 2 }, { a: 6, b: 3 }, { a: 8, b: 2 }, { a: 8, b: 4 },
            { a: 9, b: 3 }, { a: 10, b: 2 }, { a: 12, b: 3 }, { a: 12, b: 4 },
            { a: 12, b: 2 }, { a: 15, b: 3 }, { a: 16, b: 4 }, { a: 18, b: 3 }
        ];

        // Question Problem Builder Framework
        function generateMathProblem(customA = null, customB = null) {
            playerInput.value = "";
            supplyContainer.innerHTML = "";
            basketsContainer.innerHTML = "";

            if (customA !== null && customB !== null) {
                valA = customA;
                valB = customB;
            } else {
                let pair = divisionPairs[Math.floor(Math.random() * divisionPairs.length)];
                valA = pair.a;
                valB = pair.b;
            }
            
            correctAnswer = valA / valB;
            supplyRemaining = valA;

            numDisplayA.innerText = valA;
            numDisplayB.innerText = valB;
            supplyCountTxt.innerText = supplyRemaining;
            qTracker.innerText = `Question: ${currentQuestion} / ${totalQuestions}`;

            // Populate the Main Starting Supply Pile Canvas
            for(let i = 0; i < valA; i++) {
                let item = document.createElement('span');
                item.classList.add('sandbox-emoji');
                item.innerText = currentEmoji;
                supplyContainer.appendChild(item);
            }

            // Build Empty Target Shared Baskets matching Number B!
            for (let i = 1; i <= valB; i++) {
                let basket = document.createElement('div');
                basket.classList.add('group-basket');
                
                let label = document.createElement('span');
                label.classList.add('basket-label');
                label.innerText = `Basket ${i}`;
                
                basket.appendChild(label);
                basketsContainer.appendChild(basket);
            }
        }

        // Active Fair Sharing Mutation Mechanics Row
        document.getElementById('action-share').addEventListener('click', () => {
            let baskets = basketsContainer.querySelectorAll('.group-basket');
            let supplyItems = supplyContainer.querySelectorAll('.sandbox-emoji');
            
            // Confirm there are enough items left in supply to share across all baskets evenly
            if(supplyItems.length >= baskets.length) {
                SoundFX.pop();
                
                baskets.forEach(basket => {
                    // Pull out 1 from supply canvas pile
                    supplyContainer.removeChild(supplyContainer.lastChild);
                    
                    // Drop 1 inside the target basket canvas box
                    let el = document.createElement('span');
                    el.classList.add('sandbox-emoji');
                    el.innerText = currentEmoji;
                    basket.appendChild(el);
                });

                supplyRemaining -= baskets.length;
                supplyCountTxt.innerText = supplyRemaining;
            } else {
                if (supplyRemaining > 0) {
                    SoundFX.wrong();
                    alert("Not enough left in the pile to give a full equal piece to every single basket!");
                }
            }
        });

        // Reset Workspace Loop Handler
        document.getElementById('action-reset').addEventListener('click', () => {
            SoundFX.remove();
            generateMathProblem(valA, valB);
        });

        // Parent Custom Input Processor Loader
        parentLoadBtn.addEventListener('click', () => {
            let pA = parseInt(parentInputA.value);
            let pB = parseInt(parentInputB.value);

            if (isNaN(pA) || isNaN(pB) || pA <= 0 || pB <= 0) {
                SoundFX.wrong();
                alert("Parents, please submit numbers greater than 0!");
                return;
            }
            if (pA % pB !== 0) {
                SoundFX.wrong();
                alert(`To keep it perfectly fair for your child, Number A must be perfectly divisible by Number B! (e.g., 12 ÷ 3 works, but 10 ÷ 3 leaves remainders).`);
                return;
            }
            if (pB > 6 || pA > 24) {
                SoundFX.wrong();
                alert("To fit comfortably inside the display, choose a total up to 24 items and up to 6 baskets!");
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
                supplyContainer.querySelectorAll('.sandbox-emoji').forEach(el => el.innerText = currentEmoji);
                basketsContainer.querySelectorAll('.sandbox-emoji').forEach(el => el.innerText = currentEmoji);
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
                modalDesc.innerText = `Wonderful dividing work, ${childName}!`;
                victoryModal.style.display = "flex";
            } else {
                SoundFX.wrong();
                modalTitle.innerText = "Try Again! 🤔";
                modalDesc.innerText = `Look closely at just ONE single basket. How many objects are inside it?`;
                victoryModal.style.display = "flex";
            }
        });

        btnNext.addEventListener('click', () => {
            victoryModal.style.display = "none";
            
            if (modalTitle.innerText.includes("Correct")) {
                currentQuestion++;
                if (currentQuestion > totalQuestions) {
                    alert(`Superb job! You finished the fair sharing round, ${childName}! Final Stars: ⭐ ${score}`);
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