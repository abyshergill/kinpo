const mathHTML = `
<section id="math">
    <div class="section-header">
        <div class="section-badge"></div>
        <h2 class="section-title">Math Apps</h2>
    </div>

    <!-- Fixed: Only ONE project-grid wrapping ALL your cards -->
    <div class="project-grid">
        
        <!-- 1. Numbers -->
        <div class="project-card">
            <div>
                <div class="card-meta">🔢</div>
                <h3 class="card-title">Numbers</h3>
                <p class="card-desc">An interactive counting and recognition game designed to help kids grasp number sequences through playful visuals and hands-on activities.</p>
            </div>
            <a href="./math/1_to_20/1_to_20.html" target="_blank" rel="noopener noreferrer" class="btn-link">Launch Project ➔</a>
        </div>

        <!-- 2. Addition -->
        <div class="project-card">
            <div>
                <div class="card-meta">➕ </div>
                <h3 class="card-title">Addition</h3>
                <p class="card-desc">An interactive vertical stacked calculation layout game designed to help kids grasp addition through physical counting blocks.</p>
            </div>
            <a href="./math/addition/addition.html" target="_blank" rel="noopener noreferrer" class="btn-link">Launch Project ➔</a>
        </div>

        <!-- 3. Subtraction -->
        <div class="project-card">
            <div>
                <div class="card-meta">➖</div>
                <h3 class="card-title">Subtraction</h3>
                <p class="card-desc">An interactive vertical stacked calculation layout game designed to help kids grasp subtraction through physical counting blocks.</p>
            </div>
            <a href="./math/subtraction/subtraction.html" target="_blank" rel="noopener noreferrer" class="btn-link">Launch Project ➔</a>
        </div>

        <!-- 4. Multiplication -->
        <div class="project-card">
            <div>
                <div class="card-meta">✖️</div>
                <h3 class="card-title">Multiplication</h3>
                <p class="card-desc">An interactive vertical stacked calculation layout game designed to help kids grasp Multiplication through physical counting blocks.</p>
            </div>
            <a href="./math/multiplication/multiplication.html" target="_blank" rel="noopener noreferrer" class="btn-link">Launch Project ➔</a>
        </div>

        <!-- 5. Division -->
        <div class="project-card">
            <div>
                <div class="card-meta">➗</div>
                <h3 class="card-title">Division</h3>
                <p class="card-desc">An interactive vertical stacked calculation layout game designed to help kids grasp Division through physical counting blocks.</p>
            </div>
            <a href="./math/division/division.html" target="_blank" rel="noopener noreferrer" class="btn-link">Launch Project ➔</a>
        </div>

        <!-- 6. Tables -->
        <div class="project-card">
            <div>
                <div class="card-meta">📊</div>
                <h3 class="card-title">Tables</h3>
                <p class="card-desc">An interactive multiplication practice game designed to help kids master math tables through engaging patterns and progressive challenges.</p>
            </div>
            <a href="./math/division/division.html" target="_blank" rel="noopener noreferrer" class="btn-link">Launch Project ➔</a>
        </div>

    </div> <!-- project-grid ends here cleanly -->
</section>
`;

document.getElementById('math-placeholder').innerHTML = mathHTML;
