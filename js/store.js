/* ============================================
   DesignFox POS - Data Store (LocalStorage)
   ============================================ */

const Store = {
    KEYS: {
        INVOICES: 'designfox_invoices',
        CLIENTS: 'designfox_clients',
        SETTINGS: 'designfox_settings'
    },

    // Initialize with sample data if empty
    init() {
        if (!localStorage.getItem(this.KEYS.INVOICES)) {
            localStorage.setItem(this.KEYS.INVOICES, JSON.stringify([]));
        }
        if (!localStorage.getItem(this.KEYS.CLIENTS)) {
            localStorage.setItem(this.KEYS.CLIENTS, JSON.stringify([]));
        }
        if (!localStorage.getItem(this.KEYS.SETTINGS)) {
            localStorage.setItem(this.KEYS.SETTINGS, JSON.stringify({
                company: {
                    name: 'DesignFox Pvt Ltd',
                    address: 'No. 45, Galle Road, Colombo 03, Sri Lanka',
                    phone: '+94 11 234 5678',
                    email: 'hello@designfox.lk',
                    website: 'www.designfox.lk'
                },
                taxRate: 0,
                currency: 'LKR',
                invoicePrefix: 'DF'
            }));
        }
    },

    // Invoices
    getInvoices() {
        return JSON.parse(localStorage.getItem(this.KEYS.INVOICES) || '[]');
    },

    getInvoice(id) {
        const invoices = this.getInvoices();
        return invoices.find(inv => inv.id === id);
    },

    saveInvoice(invoice) {
        const invoices = this.getInvoices();
        const existingIndex = invoices.findIndex(inv => inv.id === invoice.id);
        if (existingIndex >= 0) {
            invoices[existingIndex] = invoice;
        } else {
            invoices.push(invoice);
        }
        localStorage.setItem(this.KEYS.INVOICES, JSON.stringify(invoices));
        return invoice;
    },

    deleteInvoice(id) {
        const invoices = this.getInvoices().filter(inv => inv.id !== id);
        localStorage.setItem(this.KEYS.INVOICES, JSON.stringify(invoices));
    },

    getNextInvoiceNumber() {
        const invoices = this.getInvoices();
        const settings = this.getSettings();
        const year = new Date().getFullYear();
        const count = invoices.length + 1;
        return `${settings.invoicePrefix}-${year}-${String(count).padStart(4, '0')}`;
    },

    // Clients
    getClients() {
        return JSON.parse(localStorage.getItem(this.KEYS.CLIENTS) || '[]');
    },

    getClient(id) {
        const clients = this.getClients();
        return clients.find(c => c.id === id);
    },

    saveClient(client) {
        const clients = this.getClients();
        const existingIndex = clients.findIndex(c => c.id === client.id);
        if (existingIndex >= 0) {
            clients[existingIndex] = client;
        } else {
            clients.push(client);
        }
        localStorage.setItem(this.KEYS.CLIENTS, JSON.stringify(clients));
        return client;
    },

    deleteClient(id) {
        const clients = this.getClients().filter(c => c.id !== id);
        localStorage.setItem(this.KEYS.CLIENTS, JSON.stringify(clients));
    },

    // Settings
    getSettings() {
        return JSON.parse(localStorage.getItem(this.KEYS.SETTINGS) || '{}');
    },

    saveSettings(settings) {
        localStorage.setItem(this.KEYS.SETTINGS, JSON.stringify(settings));
    }
};

// Initialize store
Store.init();
