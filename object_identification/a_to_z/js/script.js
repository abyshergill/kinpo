    // Kid-friendly vocabulary data mapping for A to Z
    const alphabetData = {
        'A': { word: 'Apple', icon: '🍎' },
        'B': { word: 'Butterfly', icon: '🦋' },
        'C': { word: 'Cat', icon: '🐱' },
        'D': { word: 'Dolphin', icon: '🐬' },
        'E': { word: 'Elephant', icon: '🐘' },
        'F': { word: 'Frog', icon: '🐸' },
        'G': { word: 'Giraffe', icon: '🦒' },
        'H': { word: 'Hat', icon: '👒' },
        'I': { word: 'Ice Cream', icon: '🍦' },
        'J': { word: 'Jellyfish', icon: '🪼' },
        'K': { word: 'Kangaroo', icon: '🦘' },
        'L': { word: 'Lion', icon: '🦁' },
        'M': { word: 'Monkey', icon: '🐵' },
        'N': { word: 'Nest', icon: '🪹' },
        'O': { word: 'Owl', icon: '🦉' },
        'P': { word: 'Penguin', icon: '🐧' },
        'Q': { word: 'Queen Bee', icon: '🐝' },
        'R': { word: 'Rainbow', icon: '🌈' },
        'S': { word: 'Sun', icon: '☀️' },
        'T': { word: 'Turtle', icon: '🐢' },
        'U': { word: 'Umbrella', icon: '⛱️' },
        'V': { word: 'Violin', icon: '🎻' },
        'W': { word: 'Whale', icon: '🐋' },
        'X': { word: 'Xylophone', icon: '🪘' },
        'Y': { word: 'Yo-yo', icon: '🪀' },
        'Z': { word: 'Zebra', icon: '🦓' }
    };

    let activeLetter = 'A';

    // Build the layout grid beautifully
    function buildAlphabetGrid() {
        const container = document.getElementById('grid-container');
        let index = 0;

        for (let letter in alphabetData) {
            const block = document.createElement('div');
            // Cycles color themes (0-4) so the grid is vibrant and kid-friendly
            block.className = `letter-block color-${index % 5}`;
            block.innerText = letter;
            
            // Set up interactions
            block.onclick = function() {
                selectLetter(letter);
            };

            container.appendChild(block);
            index++;
        }
    }

    // Handles picking a specific letter
    function selectLetter(letter) {
        activeLetter = letter;
        const item = alphabetData[letter];
        
        // Update dashboard elements
        document.getElementById('big-letter').innerText = `${letter} ${letter.toLowerCase()}`;
        document.getElementById('big-word').innerText = `${item.icon} ${item.word}`;
        
        // Instantly trigger sound feedback
        speakCurrent();
    }

    // High Quality Audio Phonics simulation using Web Speech API
    function speakCurrent() {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel(); // Stop any overlapping audio immediately
            
            const item = alphabetData[activeLetter];
            // Format voice string nicely for children: "A is for Apple"
            const phrase = `${activeLetter}... is for... ${item.word}`;
            
            const utterance = new SpeechSynthesisUtterance(phrase);
            utterance.rate = 0.85; // Speak slightly slower for young learners
            utterance.pitch = 1.2; // Set a cheerful pitch tone
            
            window.speechSynthesis.speak(utterance);
        }
    }

    // Kickstart app load execution
    window.onload = function() {
        buildAlphabetGrid();
    };
