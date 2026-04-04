// Navbar Toggle
const menuToggle = document.getElementById('menuToggle');
const menu = document.getElementById('menu');

if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        menu.classList.toggle('active');
    });

    // Close menu when a link is clicked
    const menuLinks = menu.querySelectorAll('a');
    menuLinks.forEach(link => {
        link.addEventListener('click', () => {
            menu.classList.remove('active');
        });
    });
}

// Quick Converter Functionality (on Homepage)
if (document.getElementById('quickAmount')) {
    const quickAmount = document.getElementById('quickAmount');
    const quickFrom = document.getElementById('quickFrom');
    const quickTo = document.getElementById('quickTo');
    const quickResult = document.getElementById('quickResult');
    const swapQuick = document.getElementById('swapQuick');

    // Populate currency dropdowns
    for (let code in country_list) {
        let option1 = `<option value="${code}" ${code === 'USD' ? 'selected' : ''}>${code}</option>`;
        let option2 = `<option value="${code}" ${code === 'INR' ? 'selected' : ''}>${code}</option>`;
        quickFrom.insertAdjacentHTML('beforeend', option1);
        quickTo.insertAdjacentHTML('beforeend', option2);
    }

    // Function to get exchange rate
    function getQuickExchangeRate() {
        const amount = quickAmount.value || 1;
        const from = quickFrom.value;
        const to = quickTo.value;

        quickResult.innerText = 'Getting exchange rate...';

        let url = `https://v6.exchangerate-api.com/v6/daf691a2827995b7529604bc/latest/${from}`;
        fetch(url)
            .then(response => response.json())
            .then(result => {
                let rate = result.conversion_rates[to];
                let total = (amount * rate).toFixed(2);
                quickResult.innerText = `${amount} ${from} = ${total} ${to}`;
            })
            .catch(() => {
                quickResult.innerText = 'Unable to get rate';
            });
    }

    quickAmount.addEventListener('input', getQuickExchangeRate);
    quickFrom.addEventListener('change', getQuickExchangeRate);
    quickTo.addEventListener('change', getQuickExchangeRate);

    // Swap currencies
    if (swapQuick) {
        swapQuick.addEventListener('click', () => {
            let temp = quickFrom.value;
            quickFrom.value = quickTo.value;
            quickTo.value = temp;
            getQuickExchangeRate();
        });
    }

    // Initial load
    window.addEventListener('load', getQuickExchangeRate);
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add active class to nav links based on current page
function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.menu a');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
}

setActiveNavLink();

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.feature-card, .value-card, .service-card, .team-card, .pricing-card').forEach(el => {
    observer.observe(el);
});

// Form validation helper
function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// Add animation classes
const style = document.createElement('style');
style.innerHTML = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);
