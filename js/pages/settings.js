/* ============================================
   DesignFox POS - Settings Page
   ============================================ */

function renderSettings() {
    const settings = Store.getSettings();

    return `
        <div class="settings-page">
            <div class="card" style="margin-bottom: 24px;">
                <div class="card-header">
                    <h3>Company Information</h3>
                </div>
                <div class="card-body">
                    <form id="companyForm" onsubmit="handleSaveCompany(event)">
                        <div class="form-row">
                            <div class="form-group">
                                <label class="form-label">Company Name</label>
                                <input type="text" class="form-input" id="settCompanyName" value="${settings.company.name || ''}" placeholder="Your company name">
                            </div>
                            <div class="form-group">
                                <label class="form-label">Email</label>
                                <input type="email" class="form-input" id="settCompanyEmail" value="${settings.company.email || ''}" placeholder="company@email.com">
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label class="form-label">Phone</label>
                                <input type="text" class="form-input" id="settCompanyPhone" value="${settings.company.phone || ''}" placeholder="+94 XX XXX XXXX">
                            </div>
                            <div class="form-group">
                                <label class="form-label">Website</label>
                                <input type="text" class="form-input" id="settCompanyWebsite" value="${settings.company.website || ''}" placeholder="www.yourcompany.com">
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Address</label>
                            <textarea class="form-textarea" id="settCompanyAddress" style="min-height: 70px;">${settings.company.address || ''}</textarea>
                        </div>
                        <div style="display: flex; justify-content: flex-end;">
                            <button type="submit" class="btn btn-primary">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                                    <polyline points="17,21 17,13 7,13 7,21"/>
                                    <polyline points="7,3 7,8 15,8"/>
                                </svg>
                                Save Company Info
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <div class="card" style="margin-bottom: 24px;">
                <div class="card-header">
                    <h3>Invoice Settings</h3>
                </div>
                <div class="card-body">
                    <form id="invoiceSettingsForm" onsubmit="handleSaveInvoiceSettings(event)">
                        <div class="form-row">
                            <div class="form-group">
                                <label class="form-label">Invoice Prefix</label>
                                <input type="text" class="form-input" id="settInvoicePrefix" value="${settings.invoicePrefix || 'DF'}" placeholder="DF">
                                <small style="color: var(--text-light); font-size: 11px;">Example: DF-2026-0001</small>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Currency</label>
                                <select class="form-select" id="settCurrency">
                                    <option value="LKR" ${settings.currency === 'LKR' ? 'selected' : ''}>LKR - Sri Lankan Rupee</option>
                                    <option value="USD" ${settings.currency === 'USD' ? 'selected' : ''}>USD - US Dollar</option>
                                    <option value="EUR" ${settings.currency === 'EUR' ? 'selected' : ''}>EUR - Euro</option>
                                    <option value="GBP" ${settings.currency === 'GBP' ? 'selected' : ''}>GBP - British Pound</option>
                                    <option value="AUD" ${settings.currency === 'AUD' ? 'selected' : ''}>AUD - Australian Dollar</option>
                                    <option value="INR" ${settings.currency === 'INR' ? 'selected' : ''}>INR - Indian Rupee</option>
                                    <option value="SGD" ${settings.currency === 'SGD' ? 'selected' : ''}>SGD - Singapore Dollar</option>
                                    <option value="AED" ${settings.currency === 'AED' ? 'selected' : ''}>AED - UAE Dirham</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Tax Rate (%)</label>
                                <input type="number" class="form-input" id="settTaxRate" value="${settings.taxRate || 0}" min="0" max="100" step="0.5" placeholder="0">
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Default Payment Terms</label>
                            <select class="form-select" id="settPaymentTerms" style="max-width: 300px;">
                                <option value="7" ${settings.paymentTerms == 7 ? 'selected' : ''}>Net 7 (7 days)</option>
                                <option value="14" ${settings.paymentTerms == 14 || !settings.paymentTerms ? 'selected' : ''}>Net 14 (14 days)</option>
                                <option value="30" ${settings.paymentTerms == 30 ? 'selected' : ''}>Net 30 (30 days)</option>
                                <option value="60" ${settings.paymentTerms == 60 ? 'selected' : ''}>Net 60 (60 days)</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Default Invoice Notes</label>
                            <textarea class="form-textarea" id="settDefaultNotes" style="min-height: 80px;">${settings.defaultNotes || 'Thank you for your business!\nPayment is due within 14 days of invoice date.'}</textarea>
                        </div>
                        <div style="display: flex; justify-content: flex-end;">
                            <button type="submit" class="btn btn-primary">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                                    <polyline points="17,21 17,13 7,13 7,21"/>
                                    <polyline points="7,3 7,8 15,8"/>
                                </svg>
                                Save Invoice Settings
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <div class="card" style="margin-bottom: 24px;">
                <div class="card-header">
                    <h3>Email Settings</h3>
                    <span style="font-size: 12px; color: var(--text-light);">Configure email for sending invoices</span>
                </div>
                <div class="card-body">
                    <form id="emailSettingsForm" onsubmit="handleSaveEmailSettings(event)">
                        <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: var(--radius-md); padding: 14px 18px; margin-bottom: 20px;">
                            <p style="font-size: 13px; color: #1e40af; line-height: 1.6;">
                                <strong>How it works:</strong> When you click "Send via Email" on an invoice, your default email app (Gmail, Outlook, etc.) will open with the client's email, subject, and invoice details pre-filled. You just review and hit send.
                            </p>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label class="form-label">Your Email Address</label>
                                <input type="email" class="form-input" id="settSenderEmail" value="${settings.emailSettings?.senderEmail || settings.company.email || ''}" placeholder="your@email.com">
                                <small style="color: var(--text-light); font-size: 11px;">This will appear as the sender</small>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Reply-To Name</label>
                                <input type="text" class="form-input" id="settSenderName" value="${settings.emailSettings?.senderName || settings.company.name || ''}" placeholder="Your Name / Company">
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Default Email Subject</label>
                            <input type="text" class="form-input" id="settEmailSubject" value="${settings.emailSettings?.defaultSubject || 'Invoice {invoice_number} from {company_name}'}" placeholder="Invoice {invoice_number} from {company_name}">
                            <small style="color: var(--text-light); font-size: 11px;">Variables: {invoice_number}, {company_name}, {client_name}, {total}, {due_date}</small>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Default Email Body</label>
                            <textarea class="form-textarea" id="settEmailBody" style="min-height: 140px;">${settings.emailSettings?.defaultBody || `Dear {client_name},\n\nPlease find below the details of your invoice.\n\nInvoice Number: {invoice_number}\nAmount Due: {total}\nDue Date: {due_date}\n\nIf you have any questions regarding this invoice, please don't hesitate to contact us.\n\nThank you for your business!\n\nBest regards,\n{company_name}`}</textarea>
                            <small style="color: var(--text-light); font-size: 11px;">Variables: {invoice_number}, {company_name}, {client_name}, {total}, {due_date}</small>
                        </div>
                        <div style="display: flex; justify-content: flex-end;">
                            <button type="submit" class="btn btn-primary">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                                    <polyline points="17,21 17,13 7,13 7,21"/>
                                    <polyline points="7,3 7,8 15,8"/>
                                </svg>
                                Save Email Settings
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <div class="card">
                <div class="card-header">
                    <h3>Data Management</h3>
                </div>
                <div class="card-body">
                    <div style="display: flex; gap: 12px; flex-wrap: wrap;">
                        <button class="btn btn-outline" onclick="exportData()">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                                <polyline points="7,10 12,15 17,10"/>
                                <line x1="12" y1="15" x2="12" y2="3"/>
                            </svg>
                            Export All Data (JSON)
                        </button>
                        <button class="btn btn-outline" onclick="document.getElementById('importFile').click()">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                                <polyline points="17,8 12,3 7,8"/>
                                <line x1="12" y1="3" x2="12" y2="15"/>
                            </svg>
                            Import Data
                        </button>
                        <input type="file" id="importFile" accept=".json" style="display:none;" onchange="importData(event)">
                        <button class="btn btn-danger" onclick="confirmClearData()">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                                <polyline points="3,6 5,6 21,6"/>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                            </svg>
                            Clear All Data
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function handleSaveCompany(event) {
    event.preventDefault();
    const settings = Store.getSettings();
    settings.company = {
        name: document.getElementById('settCompanyName').value,
        email: document.getElementById('settCompanyEmail').value,
        phone: document.getElementById('settCompanyPhone').value,
        website: document.getElementById('settCompanyWebsite').value,
        address: document.getElementById('settCompanyAddress').value
    };
    Store.saveSettings(settings);
    Utils.showToast('Company info saved!');
}

function handleSaveInvoiceSettings(event) {
    event.preventDefault();
    const settings = Store.getSettings();
    settings.invoicePrefix = document.getElementById('settInvoicePrefix').value;
    settings.currency = document.getElementById('settCurrency').value;
    settings.taxRate = parseFloat(document.getElementById('settTaxRate').value) || 0;
    settings.paymentTerms = parseInt(document.getElementById('settPaymentTerms').value) || 14;
    settings.defaultNotes = document.getElementById('settDefaultNotes').value;
    Store.saveSettings(settings);
    Utils.showToast('Invoice settings saved!');
}

function handleSaveEmailSettings(event) {
    event.preventDefault();
    const settings = Store.getSettings();
    settings.emailSettings = {
        senderEmail: document.getElementById('settSenderEmail').value,
        senderName: document.getElementById('settSenderName').value,
        defaultSubject: document.getElementById('settEmailSubject').value,
        defaultBody: document.getElementById('settEmailBody').value
    };
    Store.saveSettings(settings);
    Utils.showToast('Email settings saved!');
}

function exportData() {
    const data = {
        invoices: Store.getInvoices(),
        clients: Store.getClients(),
        settings: Store.getSettings(),
        exportDate: new Date().toISOString(),
        version: '1.0'
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `designfox-pos-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    Utils.showToast('Data exported successfully!');
}

function importData(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            if (data.invoices) localStorage.setItem(Store.KEYS.INVOICES, JSON.stringify(data.invoices));
            if (data.clients) localStorage.setItem(Store.KEYS.CLIENTS, JSON.stringify(data.clients));
            if (data.settings) localStorage.setItem(Store.KEYS.SETTINGS, JSON.stringify(data.settings));
            Utils.showToast('Data imported successfully!');
            App.navigate('settings');
        } catch (err) {
            Utils.showToast('Invalid file format!', 'error');
        }
    };
    reader.readAsText(file);
    event.target.value = '';
}

function confirmClearData() {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `
        <div class="modal">
            <div class="modal-header">
                <h3>Clear All Data</h3>
                <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20">
                        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                </button>
            </div>
            <div class="modal-body">
                <p style="color: var(--danger); font-weight: 600;">⚠️ Warning: This will permanently delete all data!</p>
                <p style="color: var(--text-secondary); margin-top: 8px; font-size: 13px;">All invoices, clients, and settings will be removed. This cannot be undone.</p>
            </div>
            <div class="modal-footer">
                <button class="btn btn-outline" onclick="this.closest('.modal-overlay').remove()">Cancel</button>
                <button class="btn btn-danger" onclick="clearAllData()">Yes, Clear All</button>
            </div>
        </div>
    `;
    document.body.appendChild(overlay);
}

function clearAllData() {
    localStorage.removeItem(Store.KEYS.INVOICES);
    localStorage.removeItem(Store.KEYS.CLIENTS);
    localStorage.removeItem(Store.KEYS.SETTINGS);
    Store.init();
    document.querySelector('.modal-overlay')?.remove();
    Utils.showToast('All data cleared!');
    App.navigate('dashboard');
}
