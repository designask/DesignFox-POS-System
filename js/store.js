/* ============================================
   DesignFox POS - Data Store (LocalStorage)
   ============================================ */

const Store = {
    KEYS: {
        INVOICES: 'designfox_invoices',
        CLIENTS: 'designfox_clients',
        SETTINGS: 'designfox_settings',
        QUOTATIONS: 'designfox_quotations',
        PAYMENTS: 'designfox_payments'
    },

    // Initialize with sample data if empty
    init() {
        if (!localStorage.getItem(this.KEYS.INVOICES)) {
            localStorage.setItem(this.KEYS.INVOICES, JSON.stringify([]));
        }
        if (!localStorage.getItem(this.KEYS.CLIENTS)) {
            localStorage.setItem(this.KEYS.CLIENTS, JSON.stringify([]));
        }
        if (!localStorage.getItem(this.KEYS.QUOTATIONS)) {
            localStorage.setItem(this.KEYS.QUOTATIONS, JSON.stringify([]));
        }
        if (!localStorage.getItem(this.KEYS.PAYMENTS)) {
            localStorage.setItem(this.KEYS.PAYMENTS, JSON.stringify([]));
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
                invoicePrefix: 'DF',
                paymentTerms: 14,
                defaultNotes: 'Thank you for your business!\nPayment is due within 14 days of invoice date.',
                darkMode: false
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

    // Quotations
    getQuotations() {
        return JSON.parse(localStorage.getItem(this.KEYS.QUOTATIONS) || '[]');
    },

    getQuotation(id) {
        return this.getQuotations().find(q => q.id === id);
    },

    saveQuotation(quotation) {
        const quotations = this.getQuotations();
        const idx = quotations.findIndex(q => q.id === quotation.id);
        if (idx >= 0) quotations[idx] = quotation;
        else quotations.push(quotation);
        localStorage.setItem(this.KEYS.QUOTATIONS, JSON.stringify(quotations));
        return quotation;
    },

    deleteQuotation(id) {
        const quotations = this.getQuotations().filter(q => q.id !== id);
        localStorage.setItem(this.KEYS.QUOTATIONS, JSON.stringify(quotations));
    },

    getNextQuotationNumber() {
        const quotations = this.getQuotations();
        const settings = this.getSettings();
        const year = new Date().getFullYear();
        const count = quotations.length + 1;
        return `QT-${year}-${String(count).padStart(4, '0')}`;
    },

    // Payments
    getPayments(invoiceId) {
        const payments = JSON.parse(localStorage.getItem(this.KEYS.PAYMENTS) || '[]');
        if (invoiceId) return payments.filter(p => p.invoiceId === invoiceId);
        return payments;
    },

    savePayment(payment) {
        const payments = JSON.parse(localStorage.getItem(this.KEYS.PAYMENTS) || '[]');
        payments.push(payment);
        localStorage.setItem(this.KEYS.PAYMENTS, JSON.stringify(payments));
        return payment;
    },

    deletePayment(paymentId) {
        const payments = JSON.parse(localStorage.getItem(this.KEYS.PAYMENTS) || '[]').filter(p => p.id !== paymentId);
        localStorage.setItem(this.KEYS.PAYMENTS, JSON.stringify(payments));
    },

    getTotalPaid(invoiceId) {
        return this.getPayments(invoiceId).reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);
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
