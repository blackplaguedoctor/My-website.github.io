document.addEventListener('DOMContentLoaded', () => {

    // Simple Real-Time Client Search Filter
    const searchInput = document.getElementById('wikiSearch');
    const searchableElements = document.querySelectorAll('.team-card, .article-card, .circuit-card');

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();

            searchableElements.forEach(el => {
                const text = el.textContent.toLowerCase();
                if (text.includes(query)) {
                    el.style.display = '';
                } else {
                    el.style.display = 'none';
                }
            });
        });
    }

});