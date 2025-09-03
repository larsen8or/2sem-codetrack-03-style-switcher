/**
 * Adds interactivity to the product card demo
 */

document.addEventListener('DOMContentLoaded', function () {
    // Color selector functionality
    const colorSelectors = document.querySelectorAll('.color-selector');

    colorSelectors.forEach(selector => {
        selector.addEventListener('click', function () {
            // Remove active class from all selectors
            colorSelectors.forEach(s => s.classList.remove('active'));

            // Add active class to clicked selector
            this.classList.add('active');
        });
    });

    // Size selector functionality
    const sizeSelectors = document.querySelectorAll('.size-selector');

    sizeSelectors.forEach(selector => {
        selector.addEventListener('click', function () {
            // Remove active class from all selectors
            sizeSelectors.forEach(s => s.classList.remove('active'));

            // Add active class to clicked selector
            this.classList.add('active');
        });
    });

    // Add to cart button animation
    const addToCartButton = document.querySelector('button');

    if (addToCartButton) {
        addToCartButton.addEventListener('click', function () {
            const originalText = this.textContent;
            this.textContent = '✓ Tilføjet!';
            this.style.backgroundColor = '#48bb78';

            setTimeout(() => {
                this.textContent = originalText;
                this.style.backgroundColor = '';
            }, 1500);
        });
    }
});
