
        // Web Audio Kid Sound Synthesizer Node Engine
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
            clack() { this.play(700, 'sine', 0.04, 0.12); },
            win() {
                this.play(523.25, 'triangle', 0.1, 0.2);
                setTimeout(() => this.play(659.25, 'triangle', 0.1, 0.2), 70);
                setTimeout(() => this.play(783.99, 'triangle', 0.2, 0.2), 140);
            },
            wrong() { this.play(170, 'sawtooth', 0.25, 0.15); }
        };

        // Fallback Default Challenge Sheets Database
        const defaultProblemBank = {
            "+": [{a: 4, b: 3}, {a: 12, b: 6}, {a: 15, b: 11}, {a: 7, b: 8}, {a: 22, b: 5}],
            "-": [{a: 9, b: 4}, {a: 18, b: 6}, {a: 25, b: 12}, {a: 14, b: 7}, {a: 30, b: 15}],
            "*": [{a: 3, b: 4}, {a: 5, b: 5}, {a: 2, b: 9}, {a: 6, b: 3}, {a: 7, b: 4}],
            "/": [{a: 12, b: 3}, {a: 20, b: 4}, {a: 15, b: 5}, {a: 18, b: 2}, {a: 24, b: 6}]
        };

        // Application Control Parameters
        let activeOp = "+";
        let currentQuestion = 1;
        let score = 0;
        let childName = "Superstar";
        let activeProblemSet = [...defaultProblemBank["+"]];
        let problemIdx = 0;
        let valA = 0, valB = 0, correctAns = 0;

        // Element DOM Mapping Selectors
        const qTracker = document.getElementById('q-tracker');
        const scoreTracker = document.getElementById('score-tracker');
        const greetingBanner = document.getElementById('greeting-banner');
        const mathProblemDisplay = document.getElementById('math-problem-display');
        const playerInput = document.getElementById('player-input');
        const abacusTotalDisplay = document.getElementById('abacus-total');
        
        const parentChildName = document.getElementById('parent-child-name');
        const customNumA = document.getElementById('custom-num-a');
        const customNumB = document.getElementById('custom-num-b');
        const customOpSymbol = document.getElementById('custom-op-symbol');
        const filePicker = document.getElementById('file-picker');
        
        const victoryModal = document.getElementById('victory-modal');
        const modalTitle = document.getElementById('modal-title');
        const modalDesc = document.getElementById('modal-desc');

        // Dynamic Soroban Counter Calculator System
        function evaluateAbacusTotal() {
            let total = 0;
            document.querySelectorAll('.rod').forEach(rod => {
                let weight = parseInt(rod.getAttribute('data-weight'));
                let rodValue = 0;
                
                // Read Upper deck bead (Value = 5)
                let topBead = rod.querySelector('.top-deck');
                if(topBead.classList.contains('active')) rodValue += 5;
                
                // Read Lower deck beads (Value = 1 each, must stack sequentially from top)
                let bottomBeads = rod.querySelectorAll('.bottom-deck');
                let lowerCount = 0;
                for (let i = 0; i < bottomBeads.length; i++) {
                    if (bottomBeads[i].classList.contains('active')) {
                        lowerCount++;
                    } else {
                        break; // Stop matching if alignment path breaks
                    }
                }
                rodValue += lowerCount;
                total += (rodValue * weight);
            });
            abacusTotalDisplay.innerText = total;
        }

        // Mechanical Soroban Drag and Click Mapping Handlers
        document.querySelectorAll('.bead').forEach(bead => {
            bead.addEventListener('click', function() {
                SoundFX.clack();
                const isTop = this.classList.contains('top-deck');
                
                if (isTop) {
                    this.classList.toggle('active');
                } else {
                    // Logic forcing proper lower deck bead cascade behavior
                    const row = this.parentElement;
                    const allBottom = Array.from(row.querySelectorAll('.bottom-deck'));
                    const clickedIndex = allBottom.indexOf(this);
                    const isCurrentlyActive = this.classList.contains('active');

                    if (!isCurrentlyActive) {
                        // Activate clicked bead and all above it
                        for(let i = 0; i <= clickedIndex; i++) {
                            allBottom[i].classList.add('active');
                        }
                    } else {
                        // Deactivate clicked bead and all below it
                        for(let i = clickedIndex; i < allBottom.length; i++) {
                            allBottom[i].classList.remove('active');
                        }
                    }
                }
                evaluateAbacusTotal();
            });
        });

        // Question Despatch Machinery Routine
        function deployEquation() {
            playerInput.value = "";
            if (problemIdx >= activeProblemSet.length) problemIdx = 0; // Rotate assignments buffer safely

            let currentChallenge = activeProblemSet[problemIdx];
            valA = currentChallenge.a;
            valB = currentChallenge.b;

            // Mathematical calculation routers
            if (activeOp === "+") { correctAns = valA + valB; symbol = "+"; }
            else if (activeOp === "-") { correctAns = valA - valB; symbol = "-"; }
            else if (activeOp === "*") { correctAns = valA * valB; symbol = "×"; }
            else if (activeOp === "/") { correctAns = valB !== 0 ? Math.floor(valA / valB) : 0; symbol = "÷"; }

            mathProblemDisplay.innerText = `${valA} ${symbol} ${valB} = ?`;
            qTracker.innerText = `Question: ${currentQuestion} / 10`;
        }

        // Right Hand Tab Selection Interceptors
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                SoundFX.clack();
                document.querySelectorAll('.tab-btn').forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                activeOp = this.getAttribute('data-op');
                customOpSymbol.innerText = activeOp;

                activeProblemSet = defaultProblemBank[activeOp];
                problemIdx = 0;
                deployEquation();
            });
        });

        // Verification Evaluator Execution Logic
        document.getElementById('action-check').addEventListener('click', () => {
            let userGuess = parseInt(playerInput.value);
            if (isNaN(userGuess)) { SoundFX.wrong(); return; }

            if (userGuess === correctAns) {
                SoundFX.win();
                score++;
                scoreTracker.innerText = `Stars: ⭐ ${score}`;
                modalTitle.innerText = "Correct! 🎉";
                modalDesc.innerText = `Awesome calculating power, ${childName}!`;
                victoryModal.style.display = "flex";
            } else {
                SoundFX.wrong();
                modalTitle.innerText = "Try Again! 🤔";
                modalDesc.innerText = "Slide your abacus beads carefully to count up the answer!";
                victoryModal.style.display = "flex";
            }
        });

        document.getElementById('action-next').addEventListener('click', () => {
            victoryModal.style.display = "none";
            if (modalTitle.innerText.includes("Correct")) {
                currentQuestion++;
                problemIdx++;
                deployEquation();
            }
        });

        // Personalization Sync Listeners
        parentChildName.addEventListener('input', (e) => {
            let input = e.target.value.trim();
            childName = input.length > 0 ? input : "Superstar";
            greetingBanner.innerText = `Let's solve, ${childName}!`;
        });

        // Parent Manual Custom Single Formula Injector
        document.getElementById('btn-inject-custom').addEventListener('click', () => {
            let nA = parseInt(customNumA.value);
            let nB = parseInt(customNumB.value);

            if(isNaN(nA) || isNaN(nB)) { SoundFX.wrong(); alert("Please fill parameters into both equation spaces!"); return; }

            SoundFX.clack();
            activeProblemSet = [{a: nA, b: nB}];
            problemIdx = 0;
            deployEquation();
            customNumA.value = "";
            customNumB.value = "";
        });

        // Parent File Stream Exporter (Text File Format Template Generator)
        document.getElementById('btn-download-template').addEventListener('click', () => {
            SoundFX.clack();
            const sampleConfigurationData = 
`# INSTRUCTIONS FOR PARENTS:
# Write one problem per line in this format: Number Operator Number
# Allowed operators: + , - , * , /
# Do not mix spaces inside formulas. Lines starting with # are skipped.

12 + 8
24 - 9
7 * 6
36 / 4
15 + 12`;

            const blob = new Blob([sampleConfigurationData], { type: 'text/plain;charset=utf-8' });
            const tempUrl = URL.createObjectURL(blob);
            const trigger = document.createElement('a');
            trigger.href = tempUrl;
            trigger.download = 'abacus_math_template.txt';
            document.body.appendChild(trigger);
            trigger.click();
            document.body.removeChild(trigger);
            URL.revokeObjectURL(tempUrl);
        });

        // Parent Spreadsheet/Text File Stream Importer Engine
        filePicker.addEventListener('change', (e) => {
            const uploadedFile = e.target.files[0];
            if (!uploadedFile) return;

            const reader = new FileReader();
            reader.onload = function(evt) {
                const textContent = evt.target.result;
                const lines = textContent.split('\n');
                let customUploadedList = [];

                lines.forEach(line => {
                    let text = line.trim();
                    if(text.length === 0 || text.startsWith('#')) return; // Skip comments/breaks

                    // Match components inside equation configurations text strings
                    let match = text.match(/^(\d+)\s*([\+\-\*\/])\s*(\d+)$/);
                    if (match) {
                        customUploadedList.push({
                            a: parseInt(match[1]),
                            op: match[2],
                            b: parseInt(match[3])
                        });
                    }
                });

                if (customUploadedList.length > 0) {
                    SoundFX.win();
                    alert(`Success! Loaded ${customUploadedList.length} custom math assignments into your profile bank.`);
                    
                    // Filter the custom list down to match whatever operator is currently clicked
                    let currentSetForOp = customUploadedList.filter(q => q.op === activeOp);
                    if (currentSetForOp.length > 0) {
                        activeProblemSet = currentSetForOp;
                    } else {
                        // Fall back to the whole file if the current tab filter returns zero items
                        activeProblemSet = customUploadedList;
                        // Match the UI tab highlight to whatever operation the first file problem has
                        let firstOp = customUploadedList[0].op;
                        const correctTab = document.querySelector(`[data-op="${firstOp}"]`);
                        if (correctTab) correctTab.click();
                    }
                    
                    problemIdx = 0;
                    currentQuestion = 1;
                    deployEquation();
                } else {
                    SoundFX.wrong();
                    alert("Could not find any valid problems inside the file. Ensure you use the exact download template structure format!");
                }
            };
            reader.readAsText(uploadedFile);
        });

        // Key shortcuts
        playerInput.addEventListener('keydown', (e) => { if(e.key === 'Enter') document.getElementById('action-check').click(); });

        // Game Ingestion Lifecycle Bootstrap Trigger Command
        deployEquation();
