 const main_navbarHTML = `
 <header>
        <a href="#" class="logo">Kinpo Kids Workspace</a>
        <button class="hamburger" id="hamburger-menu">
            <span></span>
            <span></span>
            <span></span>
        </button>
        <nav id="navbar">
            <!-- Math Dropdown -->
            <div class="nav-item">
                <a href="#math">Mathematics ▾</a>
                <div class="dropdown-content">
                    <a href="./math/1_to_20/1_to_20.html" target="_blank" rel="noopener noreferrer">🔢 Numbers</a>
                    <a href="./math/addition/addition.html" target="_blank" rel="noopener noreferrer">➕ Addition</a>
                    <a href="./math/subtraction/subtraction.html" target="_blank" rel="noopener noreferrer">➖ Subtraction</a>
                    <a href="./math/multiplication/multiplication.html" target="_blank" rel="noopener noreferrer">✖️ Multiplication</a>
                    <a href="./math/division/division.html" target="_blank" rel="noopener noreferrer">➗ Division</a>
                    <a href="./math/tables/tables.html" target="_blank" rel="noopener noreferrer">📊 Table</a>
                </div>
            </div>

            <!-- Utility Dropdown -->
            <div class="nav-item">
                <a href="#utility">Utility ▾</a>
                <div class="dropdown-content">
                    <a href="./abacus_and_utility/abacus/abacus.html" target="_blank" rel="noopener noreferrer">🧮 Abacus</a>
                    <a href="http://typewriter.kinpo.ai" target="_blank" rel="noopener noreferrer">⌨️ Type Writer</a>
                    <a href="http://periodictable.kinpo.ai" target="_blank" rel="noopener noreferrer">🧪 Periodic Table</a>
                    <a href="http://periodictable.kinpo.ai" target="_blank" rel="noopener noreferrer">🔐 Enigma Machine</a>
                </div>
            </div>

            <!-- Object Identification Dropdown -->
            <div class="nav-item">
                <a href="#object">Object Identification ▾</a>
                <div class="dropdown-content">
                    <a href="./object_identification/a_to_z/a_to_z.html" target="_blank" rel="noopener noreferrer">🔤 Alphabets</a>
                    <a href="./object_identification/fruits/fruits.html" target="_blank" rel="noopener noreferrer">🍎 Fruits</a>
                    <a href="./object_identification/vegetables/vegetables.html" target="_blank" rel="noopener noreferrer">🥦 Vegetables</a>
                    <a href="./object_identification/animals/animal.html" target="_blank" rel="noopener noreferrer">🦁 Animals</a>
                    <a href="./object_identification/colors/colors.html" target="_blank" rel="noopener noreferrer">🎨 Colors</a>
                </div>
            </div>

            <!-- Games Dropdown -->
            <div class="nav-item">
                <a href="#games">Games ▾</a>
                <div class="dropdown-content">
                    <a href="http://pacman.kinpo.ai" target="_blank" rel="noopener noreferrer">🟡 Pac-Man</a>
                    <a href="http://dxball.kinpo.ai" target="_blank" rel="noopener noreferrer">🕹️ DX-Ball</a>
                </div>
            </div>

            <a href="#about" class="nav-item">About</a>
        </nav>
    </header>
`

document.getElementById('main_navbar-placeholder').innerHTML = main_navbarHTML;

// Add toggle logic
const hamburger = document.getElementById('hamburger-menu');
const nav = document.getElementById('navbar');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    nav.classList.toggle('active');
});

// Close menu when clicking a link
document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        nav.classList.remove('active');
    });
});