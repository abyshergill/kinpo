
        // Web Audio Synthesizer Engine
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
            pop() { this.play(750, 'sine', 0.06, 0.12); },
            win() {
                this.play(523.25, 'triangle', 0.12, 0.25);
                setTimeout(() => this.play(659.25, 'triangle', 0.12, 0.25), 80);
                setTimeout(() => this.play(783.99, 'triangle', 0.25, 0.25), 160);
            },
            wrong() { this.play(160, 'sawtooth', 0.25, 0.2); }
        };

        // Master Fruit Database 
        const masterFruits = [
            { name: "Apple", emoji: "🍎" },      { name: "Banana", emoji: "🍌" },
            { name: "Grapes", emoji: "🍇" },     { name: "Watermelon", emoji: "🍉" },
            { name: "Strawberry", emoji: "🍓" }, { name: "Cherries", emoji: "🍒" },
            { name: "Pineapple", emoji: "🍍" },  { name: "Peach", emoji: "🍑" },
            { name: "Mango", emoji: "🥭" },      { name: "Kiwi", emoji: "🥝" }
        ];

        // Core State Anchors
        let currentMode = "type"; // type | pick
        let childName = "Superstar";
        let score = 0;
        let targetQuestionFruit = null;
        let activePool = [...masterFruits];

        // Component Target Selectors
        const parentDashboard = document.getElementById('parent-dashboard');
        const btnLockSettings = document.getElementById('btn-lock-settings');
        const btnUnlockSettings = document.getElementById('btn-unlock-settings');

        const parentChildName = document.getElementById('parent-child-name');
        const parentChecklistBox = document.getElementById('parent-checklist-box');
        const greetingBanner = document.getElementById('greeting-banner');
        const scoreTracker = document.getElementById('score-tracker');
        
        const containerModeType = document.getElementById('container-mode-type');
        const containerModePick = document.getElementById('container-mode-pick');
        
        const typeFruitFlash = document.getElementById('type-fruit-flash');
        const playerTypeInput = document.getElementById('player-type-input');
        const btnCheckType = document.getElementById('btn-check-type');
        
        const pickTextPrompt = document.getElementById('pick-text-prompt');
        const pickPaletteOptions = document.getElementById('pick-palette-options');
        
        const celebrateModal = document.getElementById('celebrate-modal');
        const modalTitle = document.getElementById('modal-title');
        const modalDesc = document.getElementById('modal-desc');
        const btnModalNext = document.getElementById('btn-modal-next');

        // Dashboard Privacy Visibility Controls
        btnLockSettings.addEventListener('click', () => {
            SoundFX.pop();
            parentDashboard.style.display = 'none';
            btnUnlockSettings.style.display = 'block';
            nextChallengeCycle(); 
        });

        btnUnlockSettings.addEventListener('click', () => {
            SoundFX.pop();
            parentDashboard.style.display = 'block';
            btnUnlockSettings.style.display = 'none';
        });

        // Checklist Rendering Engine
        function buildParentChecklist() {
            parentChecklistBox.innerHTML = "";
            masterFruits.forEach((fruit) => {
                let label = document.createElement('label');
                label.classList.add('check-item');
                
                let check = document.createElement('input');
                check.type = "checkbox";
                check.checked = true; 
                check.value = fruit.name;
                
                check.addEventListener('change', () => {
                    SoundFX.pop();
                    rebuildActivePool();
                });

                label.appendChild(check);
                label.appendChild(document.createTextNode(" " + fruit.emoji + " " + fruit.name));
                parentChecklistBox.appendChild(label);
            });
        }

        function rebuildActivePool() {
            let checkedInputs = Array.from(parentChecklistBox.querySelectorAll('input:checked'));
            let checkedNames = checkedInputs.map(i => i.value);
            
            activePool = masterFruits.filter(f => checkedNames.includes(f.name));
            
            if (activePool.length === 0) {
                activePool = [masterFruits[0]]; 
                parentChecklistBox.querySelector('input').checked = true;
            }
        }

        // Realtime Input Event Watcher
        parentChildName.addEventListener('input', (e) => {
            let val = e.target.value.trim();
            childName = val.length > 0 ? val : "Superstar";
            greetingBanner.innerText = `Let's play, ${childName}!`;
        });

        // Routine Mode Tab Navigation Drivers
        document.querySelectorAll('.parent-config .btn-mode').forEach(btn => {
            btn.addEventListener('click', function() {
                SoundFX.pop();
                document.querySelectorAll('.parent-config .btn-mode').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
                currentMode = this.getAttribute('data-mode');
                if (currentMode === "type") {
                    containerModeType.classList.add('active');
                    containerModePick.classList.remove('active');
                } else {
                    containerModePick.classList.add('active');
                    containerModeType.classList.remove('active');
                }
                nextChallengeCycle();
            });
        });

        // Question Iteration Dispatch Loop
        function nextChallengeCycle() {
            playerTypeInput.value = "";
            targetQuestionFruit = activePool[Math.floor(Math.random() * activePool.length)];

            if (currentMode === "type") {
                typeFruitFlash.innerText = targetQuestionFruit.emoji;
                if(parentDashboard.style.display === 'none') playerTypeInput.focus();
            } else {
                pickTextPrompt.innerText = targetQuestionFruit.name;
                
                let choices = [targetQuestionFruit];
                let distractorPool = masterFruits.filter(f => f.name !== targetQuestionFruit.name);
                
                while (choices.length < Math.min(4, masterFruits.length)) {
                    let randFruit = distractorPool[Math.floor(Math.random() * distractorPool.length)];
                    if(!choices.includes(randFruit)) {
                        choices.push(randFruit);
                    }
                }
                choices.sort(() => Math.random() - 0.5);

                pickPaletteOptions.innerHTML = "";
                choices.forEach(fruit => {
                    let circle = document.createElement('div');
                    circle.classList.add('fruit-choice-swatch');
                    circle.innerText = fruit.emoji;
                    circle.setAttribute('data-fruit-name', fruit.name);
                    
                    circle.addEventListener('click', function() {
                        evaluatePickChoice(this.getAttribute('data-fruit-name'));
                    });
                    pickPaletteOptions.appendChild(circle);
                });
            }
        }

        // Validation Routing Logic Blocks
        btnCheckType.addEventListener('click', () => {
            let typedAnswer = playerTypeInput.value.trim().toLowerCase();
            let correctAnswer = targetQuestionFruit.name.toLowerCase();

            if (typedAnswer === correctAnswer) {
                triggerSuccessCelebration();
            } else {
                triggerRetryNotification();
            }
        });

        function evaluatePickChoice(clickedName) {
            if (clickedName === targetQuestionFruit.name) {
                triggerSuccessCelebration();
            } else {
                triggerRetryNotification();
            }
        }

        function triggerSuccessCelebration() {
            SoundFX.win();
            score++;
            scoreTracker.innerText = `Stars: ⭐ ${score}`;
            modalTitle.innerText = "Correct! 🎉";
            modalDesc.innerText = `Awesome job recognizing fruits, ${childName}!`;
            celebrateModal.style.display = "flex";
        }

        function triggerRetryNotification() {
            SoundFX.wrong();
            modalTitle.innerText = "Try Again! 🤔";
            modalDesc.innerText = currentMode === "type" 
                ? "Check your spelling and try writing it one more time!"
                : "Look closely at the word, and select a different option!";
            celebrateModal.style.display = "flex";
        }

        btnModalNext.addEventListener('click', () => {
            celebrateModal.style.display = "none";
            if (modalTitle.innerText.includes("Correct")) {
                nextChallengeCycle();
            }
        });

        playerTypeInput.addEventListener('keydown', (e) => { if(e.key === 'Enter') btnCheckType.click(); });

        // System Cold Start Hook Bootloader
        buildParentChecklist();
        nextChallengeCycle();
