/* ============================================
   DesignFox POS - Main Application Controller
   ============================================ */

const App = {
    currentPage: 'dashboard',
    currentParam: null,

    init() {
        this.setupNavigation();
        this.setupMobileMenu();
        this.updateDate();
        this.navigate('dashboard');
    },

    setupNavigation() {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const page = item.dataset.page;
                this.navigate(page);
            });
        });
    },

    setupMobileMenu() {
        const toggle = document.getElementById('menuToggle');
        const sidebar = document.getElementById('sidebar');
        
        toggle.addEventListener('click', () => {
            sidebar.classList.toggle('open');
        });

        // Close sidebar on page navigate (mobile)
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 1024 && !sidebar.contains(e.target) && !toggle.contains(e.target)) {
                sidebar.classList.remove('open');
            }
        });
    },

    updateDate() {
        const dateEl = document.getElementById('currentDate');
        if (dateEl) {
            const now = new Date();
            dateEl.textContent = now.toLocaleDateString('en-US', { 
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
            });
        }
    },

    navigate(page, param = null) {
        this.currentPage = page;
        this.currentParam = param;

        // Update active nav
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.toggle('active', item.dataset.page === page);
        });

        // Update page title
        const titles = {
            'dashboard': 'Dashboard',
            'create-invoice': param ? 'Edit Invoice' : 'New Invoice',
            'invoices': 'Invoices',
            'clients': 'Clients',
            'view-invoice': 'Invoice Details'
        };
        document.getElementById('pageTitle').textContent = titles[page] || 'Dashboard';

        // Render page
        const content = document.getElementById('contentArea');
        let html = '';

        switch (page) {
            case 'dashboard':
                html = renderDashboard();
                break;
            case 'create-invoice':
                html = renderCreateInvoice(param);
                break;
            case 'invoices':
                html = renderInvoices();
                break;
            case 'clients':
                html = renderClients();
                break;
            case 'view-invoice':
                html = renderViewInvoice(param);
                break;
            default:
                html = renderDashboard();
        }

        content.innerHTML = html;
        content.scrollTop = 0;

        // Close mobile sidebar
        document.getElementById('sidebar').classList.remove('open');

        // Recalculate totals if on invoice page
        if (page === 'create-invoice') {
            setTimeout(calculateTotals, 50);
        }
    }
};

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
