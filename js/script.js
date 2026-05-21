
// Smooth Active Class Router highlighting the Navigation items during scrolling
const sections = document.querySelectorAll('section');
const navItems = document.querySelectorAll('.nav-item');

window.addEventListener('scroll', () => {
    let currentActiveSectionId = "";
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100; // Account navbar cushion padding 
        if (window.scrollY >= sectionTop) {
            currentActiveSectionId = section.getAttribute('id');
        }
    });

    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href') === `#${currentActiveSectionId}`) {
            item.classList.add('active');
        }
    });
});
