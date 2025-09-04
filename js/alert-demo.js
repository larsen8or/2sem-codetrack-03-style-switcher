document.addEventListener('DOMContentLoaded', function() {
    // Close button functionality
    document.querySelectorAll('.alert-close').forEach(button => {
        button.addEventListener('click', function() {
            this.closest('.alert').style.opacity = '0';
            setTimeout(() => {
                this.closest('.alert').style.display = 'none';
            }, 300);
        });
    });

    // Show random alert button
    const showAlertBtn = document.getElementById('show-alert');
    if (showAlertBtn) {
        showAlertBtn.addEventListener('click', function() {
            const alerts = [
                {
                    type: 'info',
                    title: 'Information',
                    message: 'Dette er en informationsbesked. Den er nyttig til at give brugeren vigtige oplysninger.'
                },
                {
                    type: 'success',
                    title: 'Succes!',
                    message: 'Din handling blev gennemført korrekt. Alt gik efter hensigten.'
                },
                {
                    type: 'warning',
                    title: 'Advarsel!',
                    message: 'Dette er en advarsel. Fortsætter du, kan det have uønskede konsekvenser.'
                },
                {
                    type: 'error',
                    title: 'Fejl!',
                    message: 'Der opstod en fejl. Prøv igen senere eller kontakt support.'
                }
            ];

            const randomAlert = alerts[Math.floor(Math.random() * alerts.length)];
            showCustomAlert(randomAlert.title, randomAlert.message, randomAlert.type);
        });
    }

    // Function to create and show a custom alert
    function showCustomAlert(title, message, type = 'info') {
        // Create alert element
        const alert = document.createElement('div');
        alert.className = `alert alert-${type}`;
        alert.innerHTML = `
            <h3>${title}</h3>
            <p>${message}</p>
            <button class="alert-close">×</button>
        `;

        // Add close functionality
        const closeBtn = alert.querySelector('.alert-close');
        closeBtn.addEventListener('click', function() {
            alert.style.opacity = '0';
            setTimeout(() => {
                alert.remove();
            }, 300);
        });

        // Add to DOM
        const container = document.querySelector('.demo-section');
        container.insertBefore(alert, container.firstChild);

        // Animate in
        setTimeout(() => {
            alert.style.opacity = '1';
        }, 10);

        // Don't auto-remove the theme alert
        if (!alert.id || alert.id !== 'themeAlert') {
            // Auto-remove disabled - alert will stay visible until manually closed
        }
    }
});
