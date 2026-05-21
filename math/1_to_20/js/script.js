
// Numbers data mapping 1 to 20 with text forms and random fun matching emojis
const numberData = {
    1: { word: 'One', emoji: '🎈' },
    2: { word: 'Two', emoji: '🦆' },
    3: { word: 'Three', emoji: '🧸' },
    4: { word: 'Four', emoji: '🐸' },
    5: { word: 'Five', emoji: '⭐' },
    6: { word: 'Six', emoji: '🦀' },
    7: { word: 'Seven', emoji: '🍦' },
    8: { word: 'Eight', emoji: '🐙' },
    9: { word: 'Nine', emoji: '🐝' },
    10: { word: 'Ten', emoji: '🍎' },
    11: { word: 'Eleven', emoji: '🦖' },
    12: { word: 'Twelve', emoji: '🍩' },
    13: { word: 'Thirteen', emoji: '🚀' },
    14: { word: 'Fourteen', emoji: '🦋' },
    15: { word: 'Fifteen', emoji: '🍒' },
    16: { word: 'Sixteen', emoji: '🚗' },
    17: { word: 'Seventeen', emoji: '🌻' },
    18: { word: 'Eighteen', emoji: '🐠' },
    19: { word: 'Nineteen', emoji: '🎨' },
    20: { word: 'Twenty', emoji: '💎' }
};

let activeNumber = 1;

// Build the layout grid beautifully
function buildNumberGrid() {
    const container = document.getElementById('grid-container');
    
    for (let i = 1; i <= 20; i++) {
        const block = document.createElement('div');
        // Cycles color themes (0-4) to make the grid highly engaging
        block.className = `number-block color-${(i - 1) % 5}`;
        block.innerText = i;
        
        block.onclick = function() {
            selectNumber(i);
        };

        container.appendChild(block);
    }
}

// Handles picking a specific number block
function selectNumber(num) {
    activeNumber = num;
    const item = numberData[num];
    
    document.getElementById('big-number').innerText = num;
    document.getElementById('big-word').innerText = item.word;
    
    // Multiply the emoji character string to match the chosen number value
    document.getElementById('big-visuals').innerText = item.emoji.repeat(num);
    
    // Instantly read aloud
    speakCurrent();
}

// High Quality Audio playback via Web Speech API
function speakCurrent() {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel(); // Stop overlapping audio tracks
        
        const item = numberData[activeNumber];
        const phrase = `${activeNumber}... Let's count... ${item.word}`;
        
        const utterance = new SpeechSynthesisUtterance(phrase);
        utterance.rate = 0.85; // Slightly slower, clear pacing for younger users
        utterance.pitch = 1.25; // Warm, friendly pitch tone
        
        window.speechSynthesis.speak(utterance);
    }
}

// Initialize layout setup on page launch
window.onload = function() {
    buildNumberGrid();
    selectNumber(1); // Default showcase block value on launch
};
