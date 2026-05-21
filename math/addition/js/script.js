
// Integrated Sound Synthesizer Node Engine
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
    remove() { this.play(350, 'sine', 0.06, 0.1); },
    correct() {
        this.play(523.25, 'triangle', 0.12, 0.25);
        setTimeout(() => this.play(659.25, 'triangle', 0.12, 0.25), 80);
        setTimeout(() => this.play(783.99, 'triangle', 0.25, 0.25), 160);
    },
    wrong() { this.play(180, 'sawtooth', 0.25, 0.2); }
};

// Core Game States
let currentQuestion = 1;
let totalQuestions = 10;
let score = 0;
let currentEmoji = "🍎";
let valA = 0;
let valB = 0;
let correctAnswer = 0;
let childName = "Superstar";

// Element UI Document Object Links
const emojiBoard = document.getElementById('emoji-board');
const qTracker = document.getElementById('q-tracker');
const scoreTracker = document.getElementById('score-tracker');
const greetingBanner = document.getElementById('greeting-banner');
const playerInput = document.getElementById('player-input');

const numDisplayA = document.getElementById('num-display-a');
const numDisplayB = document.getElementById('num-display-b');
const sandboxA = document.getElementById('sandbox-a');
const sandboxB = document.getElementById('sandbox-b');

const parentChildName = document.getElementById('parent-child-name');
const parentInputA = document.getElementById('parent-input-a');
const parentInputB = document.getElementById('parent-input-b');
const parentLoadBtn = document.getElementById('parent-load-btn');

const victoryModal = document.getElementById('victory-modal');
const modalTitle = document.getElementById('modal-title');
const modalDesc = document.getElementById('modal-desc');
const btnNext = document.getElementById('action-next');

// Personalization Live Sync Listener
parentChildName.addEventListener('input', (e) => {
    let val = e.target.value.trim();
    childName = val.length > 0 ? val : "Superstar";
    greetingBanner.innerText = `Let's count, ${childName}!`;
});

// Dynamic Worksheet Engine Problem Loader
function generateMathProblem(customA = null, customB = null) {
    playerInput.value = "";
    sandboxA.innerHTML = ""; 
    sandboxB.innerHTML = ""; 

    if (customA !== null && customB !== null) {
        valA = customA;
        valB = customB;
    } else {
        valA = Math.floor(Math.random() * 6) + 1; // 1 to 6
        valB = Math.floor(Math.random() * 6) + 1; // 1 to 6
    }
    
    correctAnswer = valA + valB;

    numDisplayA.innerText = valA;
    numDisplayB.innerText = valB;
    qTracker.innerText = `Question: ${currentQuestion} / ${totalQuestions}`;
}

function appendEmoji(targetSandbox) {
    let el = document.createElement('span');
    el.classList.add('sandbox-emoji');
    el.innerText = currentEmoji;
    targetSandbox.appendChild(el);
    targetSandbox.scrollTop = targetSandbox.scrollHeight;
}

// Mutation Listeners bound to Split Boxes
document.getElementById('add-a').addEventListener('click', () => { SoundFX.pop(); appendEmoji(sandboxA); });
document.getElementById('add-b').addEventListener('click', () => { SoundFX.pop(); appendEmoji(sandboxB); });

document.getElementById('remove-a').addEventListener('click', () => {
    if (sandboxA.children.length > 0) { SoundFX.remove(); sandboxA.removeChild(sandboxA.lastChild); }
});
document.getElementById('remove-b').addEventListener('click', () => {
    if (sandboxB.children.length > 0) { SoundFX.remove(); sandboxB.removeChild(sandboxB.lastChild); }
});

// Parent Custom Input Processor
parentLoadBtn.addEventListener('click', () => {
    let pA = parseInt(parentInputA.value);
    let pB = parseInt(parentInputB.value);

    if (isNaN(pA) || isNaN(pB) || pA < 0 || pB < 0) {
        SoundFX.wrong();
        alert("Parents, please insert a valid number into both custom spaces!");
        return;
    }

    SoundFX.correct();
    generateMathProblem(pA, pB);
    parentInputA.value = "";
    parentInputB.value = "";
});

// Emoji Workspace Object Swapper
emojiBoard.addEventListener('click', (e) => {
    if (e.target.classList.contains('emoji-opt')) {
        SoundFX.click();
        document.querySelectorAll('.emoji-opt').forEach(opt => opt.classList.remove('selected'));
        e.target.classList.add('selected');
        currentEmoji = e.target.getAttribute('data-emoji');
        
        let countA = sandboxA.children.length;
        let countB = sandboxB.children.length;
        
        sandboxA.innerHTML = "";
        sandboxB.innerHTML = "";
        
        for(let i=0; i<countA; i++) appendEmoji(sandboxA);
        for(let i=0; i<countB; i++) appendEmoji(sandboxB);
    }
});

// Score Validation Processor
document.getElementById('action-check').addEventListener('click', () => {
    let guess = parseInt(playerInput.value);

    if (isNaN(guess)) { SoundFX.wrong(); return; }

    if (guess === correctAnswer) {
        SoundFX.correct();
        score++;
        scoreTracker.innerText = `Stars: ⭐ ${score}`;
        
        modalTitle.innerText = "Correct! 🎉";
        modalDesc.innerText = `Superb math work, ${childName}!`;
        victoryModal.style.display = "flex";
    } else {
        SoundFX.wrong();
        modalTitle.innerText = "Try Again! 🤔";
        modalDesc.innerText = "Count the total emojis stacking the worksheet rows carefully!";
        victoryModal.style.display = "flex";
    }
});

btnNext.addEventListener('click', () => {
    victoryModal.style.display = "none";
    
    if (modalTitle.innerText.includes("Correct")) {
        currentQuestion++;
        if (currentQuestion > totalQuestions) {
            alert(`Amazing! You completed all questions, ${childName}! Final Stars: ⭐ ${score}`);
            currentQuestion = 1;
            score = 0;
            scoreTracker.innerText = `Stars: ⭐ ${score}`;
        }
        generateMathProblem();
    }
});

playerInput.addEventListener('keydown', (e) => { if(e.key === 'Enter') document.getElementById('action-check').click(); });

// App Initial Launch Sequence Command
generateMathProblem();