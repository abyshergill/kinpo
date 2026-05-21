
        // Web Audio Kid Synthesizer FX
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
            pop() { this.play(800, 'sine', 0.08, 0.15); },
            scratch() { this.play(240, 'sawtooth', 0.07, 0.12); },
            remove() { this.play(340, 'sine', 0.05, 0.1); },
            correct() {
                this.play(523.25, 'triangle', 0.12, 0.25);
                setTimeout(() => this.play(659.25, 'triangle', 0.12, 0.25), 80);
                setTimeout(() => this.play(783.99, 'triangle', 0.25, 0.25), 160);
            },
            wrong() { this.play(180, 'sawtooth', 0.25, 0.2); }
        };

        // Core Game Logic Vectors
        let currentQuestion = 1;
        let totalQuestions = 10;
        let score = 0;
        let currentEmoji = "🍎";
        let valA = 0;
        let valB = 0;
        let correctAnswer = 0;
        let childName = "Superstar";

        // Element Node Mapping
        const emojiBoard = document.getElementById('emoji-board');
        const qTracker = document.getElementById('q-tracker');
        const scoreTracker = document.getElementById('score-tracker');
        const greetingBanner = document.getElementById('greeting-banner');
        const playerInput = document.getElementById('player-input');
        
        const numDisplayA = document.getElementById('num-display-a');
        const numDisplayB = document.getElementById('num-display-b');
        const sandboxMain = document.getElementById('sandbox-main');

        const parentChildName = document.getElementById('parent-child-name');
        const parentInputA = document.getElementById('parent-input-a');
        const parentInputB = document.getElementById('parent-input-b');
        const parentLoadBtn = document.getElementById('parent-load-btn');
        
        const victoryModal = document.getElementById('victory-modal');
        const modalTitle = document.getElementById('modal-title');
        const modalDesc = document.getElementById('modal-desc');
        const btnNext = document.getElementById('action-next');

        // Dynamic Name Synchronizer
        parentChildName.addEventListener('input', (e) => {
            let val = e.target.value.trim();
            childName = val.length > 0 ? val : "Superstar";
            greetingBanner.innerText = `Let's subtract, ${childName}!`;
        });

        // Problem Sheet Dispatcher
        function generateMathProblem(customA = null, customB = null) {
            playerInput.value = "";
            sandboxMain.innerHTML = ""; // Wipe canvas clean

            if (customA !== null && customB !== null) {
                valA = customA;
                valB = customB;
            } else {
                valA = Math.floor(Math.random() * 8) + 4; // 4 to 11 Range
                valB = Math.floor(Math.random() * valA) + 1; // Always smaller than A to keep result positive
            }
            
            correctAnswer = valA - valB;

            numDisplayA.innerText = valA;
            numDisplayB.innerText = valB;
            qTracker.innerText = `Question: ${currentQuestion} / ${totalQuestions}`;
        }

        // Active Mutation Drivers
        document.getElementById('action-add').addEventListener('click', () => {
            SoundFX.pop();
            let el = document.createElement('span');
            el.classList.add('sandbox-emoji');
            el.innerText = currentEmoji;
            sandboxMain.appendChild(el);
            sandboxMain.scrollTop = sandboxMain.scrollHeight;
        });

        document.getElementById('action-cross').addEventListener('click', () => {
            // Find the last added emoji element that is NOT yet crossed out
            let uncrossed = sandboxMain.querySelectorAll('.sandbox-emoji:not(.crossed)');
            if (uncrossed.length > 0) {
                SoundFX.scratch();
                let target = uncrossed[uncrossed.length - 1];
                target.classList.add('crossed');
            }
        });

        document.getElementById('action-undo').addEventListener('click', () => {
            let items = sandboxMain.querySelectorAll('.sandbox-emoji');
            if (items.length === 0) return;

            SoundFX.remove();
            let lastItem = items[items.length - 1];
            
            // If the last item is crossed out, un-cross it. Otherwise, remove it entirely.
            if (lastItem.classList.contains('crossed')) {
                lastItem.classList.remove('crossed');
            } else {
                sandboxMain.removeChild(lastItem);
            }
        });

        // Parent Override Dispatch Handler
        parentLoadBtn.addEventListener('click', () => {
            let pA = parseInt(parentInputA.value);
            let pB = parseInt(parentInputB.value);

            if (isNaN(pA) || isNaN(pB) || pA < 0 || pB < 0) {
                SoundFX.wrong();
                alert("Parents, please submit valid positive parameters!");
                return;
            }

            if (pB > pA) {
                SoundFX.wrong();
                alert("Top number (A) must be equal to or bigger than bottom number (B) to avoid negative metrics!");
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
                
                let oldEmoji = currentEmoji;
                currentEmoji = e.target.getAttribute('data-emoji');
                
                // Real-time replacement layout algorithm scanning nodes
                sandboxMain.querySelectorAll('.sandbox-emoji').forEach(el => {
                    el.innerText = currentEmoji;
                });
            }
        });

        // Answer Verification Engine
        document.getElementById('action-check').addEventListener('click', () => {
            let guess = parseInt(playerInput.value);

            if (isNaN(guess)) { SoundFX.wrong(); return; }

            if (guess === correctAnswer) {
                SoundFX.correct();
                score++;
                scoreTracker.innerText = `Stars: ⭐ ${score}`;
                
                modalTitle.innerText = "Correct! 🎉";
                modalDesc.innerText = `Sensational math, ${childName}!`;
                victoryModal.style.display = "flex";
            } else {
                SoundFX.wrong();
                modalTitle.innerText = "Try Again! 🤔";
                modalDesc.innerText = "Count only the fruits that do NOT have a cross over them!";
                victoryModal.style.display = "flex";
            }
        });

        btnNext.addEventListener('click', () => {
            victoryModal.style.display = "none";
            
            if (modalTitle.innerText.includes("Correct")) {
                currentQuestion++;
                if (currentQuestion > totalQuestions) {
                    alert(`Superb concentration session, ${childName}! Final Stats: ⭐ ${score} Stars!`);
                    currentQuestion = 1;
                    score = 0;
                    scoreTracker.innerText = `Stars: ⭐ ${score}`;
                }
                generateMathProblem();
            }
        });

        playerInput.addEventListener('keydown', (e) => { if(e.key === 'Enter') document.getElementById('action-check').click(); });

        // Bootstrap Core Loop Ingestion Trigger
        generateMathProblem();
