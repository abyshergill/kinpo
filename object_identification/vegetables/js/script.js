
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

        // Master Vegetable Database 
        const masterVegetables = [
            { name: "Broccoli", emoji: "🥦" }, { name: "Carrot", emoji: "🥕" },
            { name: "Corn", emoji: "🌽" },     { name: "Tomato", emoji: "🍅" },
            { name: "Potato", emoji: "🥔" },   { name: "Onion", emoji: "🧅" },
            { name: "Cucumber", emoji: "🥒" }, { name: "Eggplant", emoji: "🍆" },
            { name: "Pepper", emoji: "𫠊" },   { name: "Mushroom", emoji: "🍄" }
        ];

        // Core State Anchors
        let currentMode = "type"; // type | pick
        let childName = "Superstar";
        let score = 0;
        let targetQuestionVeggie = null;
        let activePool = [...masterVegetables];

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
        
        const typeVeggieFlash = document.getElementById('type-veggie-flash');
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
            masterVegetables.forEach((veg) => {
                let label = document.createElement('label');
                label.classList.add('check-item');
                
                let check = document.createElement('input');
                check.type = "checkbox";
                check.checked = true; 
                check.value = veg.name;
                
                check.addEventListener('change', () => {
                    SoundFX.pop();
                    rebuildActivePool();
                });

                label.appendChild(check);
                label.appendChild(document.createTextNode(" " + veg.emoji + " " + veg.name));
                parentChecklistBox.appendChild(label);
            });
        }

        function rebuildActivePool() {
            let checkedInputs = Array.from(parentChecklistBox.querySelectorAll('input:checked'));
            let checkedNames = checkedInputs.map(i => i.value);
            
            activePool = masterVegetables.filter(v => checkedNames.includes(v.name));
            
            if (activePool.length === 0) {
                activePool = [masterVegetables[0]]; 
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
            targetQuestionVeggie = activePool[Math.floor(Math.random() * activePool.length)];

            if (currentMode === "type") {
                typeVeggieFlash.innerText = targetQuestionVeggie.emoji;
                if(parentDashboard.style.display === 'none') playerTypeInput.focus();
            } else {
                pickTextPrompt.innerText = targetQuestionVeggie.name;
                
                let choices = [targetQuestionVeggie];
                let distractorPool = masterVegetables.filter(v => v.name !== targetQuestionVeggie.name);
                
                while (choices.length < Math.min(4, masterVegetables.length)) {
                    let randVeg = distractorPool[Math.floor(Math.random() * distractorPool.length)];
                    if(!choices.includes(randVeg)) {
                        choices.push(randVeg);
                    }
                }
                choices.sort(() => Math.random() - 0.5);

                pickPaletteOptions.innerHTML = "";
                choices.forEach(veg => {
                    let circle = document.createElement('div');
                    circle.classList.add('veggie-choice-swatch');
                    circle.innerText = veg.emoji;
                    circle.setAttribute('data-veg-name', veg.name);
                    
                    circle.addEventListener('click', function() {
                        evaluatePickChoice(this.getAttribute('data-veg-name'));
                    });
                    pickPaletteOptions.appendChild(circle);
                });
            }
        }

        // Validation Routing Logic Blocks
        btnCheckType.addEventListener('click', () => {
            let typedAnswer = playerTypeInput.value.trim().toLowerCase();
            let correctAnswer = targetQuestionVeggie.name.toLowerCase();

            if (typedAnswer === correctAnswer) {
                triggerSuccessCelebration();
            } else {
                triggerRetryNotification();
            }
        });

        function evaluatePickChoice(clickedName) {
            if (clickedName === targetQuestionVeggie.name) {
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
            modalDesc.innerText = `Awesome job recognizing vegetables, ${childName}!`;
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