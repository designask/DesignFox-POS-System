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
        this.loadDarkMode();
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

    loadDarkMode() {
        const settings = Store.getSettings();
        if (settings.darkMode) {
            document.body.classList.add('dark-mode');
        }
    },

    toggleDarkMode() {
        document.body.classList.toggle('dark-mode');
        const settings = Store.getSettings();
        settings.darkMode = document.body.classList.contains('dark-mode');
        Store.saveSettings(settings);
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
            'view-invoice': 'Invoice Details',
            'quotations': 'Quotations',
            'create-quotation': param ? 'Edit Quotation' : 'New Quotation',
            'reports': 'Reports & Analytics',
            'settings': 'Settings'
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
            case 'quotations':
                html = renderQuotations();
                break;
            case 'create-quotation':
                html = renderCreateQuotation(param);
                break;
            case 'reports':
                html = renderReports();
                break;
            case 'settings':
                html = renderSettings();
                break;
            default:
                html = renderDashboard();
        }

        content.innerHTML = html;
        content.scrollTop = 0;

        // Close mobile sidebar
        document.getElementById('sidebar').classList.remove('open');

        // Recalculate totals if on invoice/quotation page
        if (page === 'create-invoice') {
            setTimeout(calculateTotals, 50);
        }
        if (page === 'create-quotation') {
            setTimeout(calculateQTotals, 50);
        }
    }
};

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
