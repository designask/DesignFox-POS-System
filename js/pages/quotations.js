/* ============================================
   DesignFox POS - Quotations/Estimates Page
   ============================================ */

function renderQuotations() {
    const quotations = Store.getQuotations();
    const sorted = [...quotations].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return `
        <div class="quotations-page">
            <div class="filter-bar">
                <div class="search-box">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="11" cy="11" r="8"/>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                    </svg>
                    <input type="text" placeholder="Search quotations..." id="quotationSearch" oninput="filterQuotations()">
                </div>
                <select class="form-select" id="quotationStatusFilter" onchange="filterQuotations()" style="width: auto; min-width: 150px;">
                    <option value="">All Status</option>
                    <option value="draft">Draft</option>
                    <option value="sent">Sent</option>
                    <option value="accepted">Accepted</option>
                    <option value="rejected">Rejected</option>
                </select>
                <button class="btn btn-primary" onclick="App.navigate('create-quotation')">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M12 5v14M5 12h14"/>
                    </svg>
                    New Quotation
                </button>
            </div>

            <div class="card">
                <div class="card-body" style="padding: 0;">
                    ${sorted.length > 0 ? `
                        <div class="table-container" style="border: none;">
                            <table class="table" id="quotationsTable">
                                <thead>
                                    <tr>
                                        <th>Quote #</th>
                                        <th>Client</th>
                                        <th>Date</th>
                                        <th>Valid Until</th>
                                        <th>Amount</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${sorted.map(q => `
                                        <tr data-status="${q.status}" data-search="${(q.quotationNumber + ' ' + q.clientName).toLowerCase()}">
                                            <td><strong style="color: var(--accent);">${q.quotationNumber}</strong></td>
                                            <td>${q.clientName || '-'}</td>
                                            <td>${Utils.formatDate(q.date)}</td>
                                            <td>${Utils.formatDate(q.validUntil)}</td>
                                            <td><strong>${Utils.formatCurrency(q.total)}</strong></td>
                                            <td><span class="badge badge-${q.status === 'accepted' ? 'paid' : q.status === 'sent' ? 'pending' : q.status === 'rejected' ? 'overdue' : 'draft'}">${q.status.charAt(0).toUpperCase() + q.status.slice(1)}</span></td>
                                            <td>
                                                <div style="display: flex; gap: 6px;">
                                                    <button class="btn btn-sm btn-outline" onclick="convertToInvoice('${q.id}')" title="Convert to Invoice" style="color: var(--success); border-color: #bbf7d0;">
                                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
                                                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                                                            <polyline points="14,2 14,8 20,8"/>
                                                            <polyline points="9,15 12,18 15,15"/>
                                                            <line x1="12" y1="12" x2="12" y2="18"/>
                                                        </svg>
                                                    </button>
                                                    <button class="btn btn-sm btn-outline" onclick="App.navigate('create-quotation', '${q.id}')" title="Edit">
                                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
                                                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                                                        </svg>
                                                    </button>
                                                    <button class="btn btn-sm btn-outline" onclick="confirmDeleteQuotation('${q.id}')" title="Delete" style="color: var(--danger); border-color: #fecaca;">
                                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
                                                            <polyline points="3,6 5,6 21,6"/>
                                                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                                                        </svg>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    ` : `
                        <div class="empty-state">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                                <polyline points="14,2 14,8 20,8"/>
                            </svg>
                            <h3>No Quotations Yet</h3>
                            <p>Create a quotation and convert it to an invoice when accepted</p>
                            <button class="btn btn-primary" onclick="App.navigate('create-quotation')">Create First Quotation</button>
                        </div>
                    `}
                </div>
            </div>
        </div>
    `;
}

function filterQuotations() {
    const search = document.getElementById('quotationSearch').value.toLowerCase();
    const status = document.getElementById('quotationStatusFilter').value;
    const rows = document.querySelectorAll('#quotationsTable tbody tr');
    rows.forEach(row => {
        const matchSearch = !search || row.dataset.search.includes(search);
        const matchStatus = !status || row.dataset.status === status;
        row.style.display = matchSearch && matchStatus ? '' : 'none';
    });
}

function convertToInvoice(quotationId) {
    const q = Store.getQuotation(quotationId);
    if (!q) return;

    const settings = Store.getSettings();
    const invoice = {
        id: Utils.generateId(),
        invoiceNumber: Store.getNextInvoiceNumber(),
        clientName: q.clientName,
        clientEmail: q.clientEmail,
        clientPhone: q.clientPhone,
        clientAddress: q.clientAddress,
        clientId: q.clientId,
        date: Utils.getToday(),
        dueDate: Utils.getFutureDate(settings.paymentTerms || 14),
        status: 'pending',
        items: q.items,
        subtotal: q.subtotal,
        tax: q.tax,
        discount: q.discount,
        total: q.total,
        notes: q.notes || settings.defaultNotes || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    // Update quotation status
    q.status = 'accepted';
    q.updatedAt = new Date().toISOString();
    Store.saveQuotation(q);

    Store.saveInvoice(invoice);
    Utils.showToast('Quotation converted to invoice!');
    App.navigate('view-invoice', invoice.id);
}

function confirmDeleteQuotation(id) {
    const q = Store.getQuotation(id);
    if (!q) return;
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `
        <div class="modal">
            <div class="modal-header">
                <h3>Delete Quotation</h3>
                <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20">
                        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                </button>
            </div>
            <div class="modal-body">
                <p>Delete quotation <strong>${q.quotationNumber}</strong>?</p>
            </div>
            <div class="modal-footer">
                <button class="btn btn-outline" onclick="this.closest('.modal-overlay').remove()">Cancel</button>
                <button class="btn btn-danger" onclick="deleteQuotation('${id}')">Delete</button>
            </div>
        </div>
    `;
    document.body.appendChild(overlay);
}

function deleteQuotation(id) {
    Store.deleteQuotation(id);
    document.querySelector('.modal-overlay')?.remove();
    Utils.showToast('Quotation deleted');
    App.navigate('quotations');
}

/* ============================================
   Create Quotation Page
   ============================================ */

let quotationItems = [];
let editingQuotationId = null;

function renderCreateQuotation(editId) {
    editingQuotationId = editId || null;
    let quotation = null;

    if (editingQuotationId) {
        quotation = Store.getQuotation(editingQuotationId);
        if (quotation) quotationItems = [...quotation.items];
    } else {
        quotationItems = [{ id: Utils.generateId(), service: '', description: '', quantity: 1, rate: 0 }];
    }

    const clients = Store.getClients();
    const services = Utils.getServices();
    const settings = Store.getSettings();
    const quoteNumber = quotation ? quotation.quotationNumber : Store.getNextQuotationNumber();

    return `
        <div class="create-invoice-page">
            <div class="card">
                <div class="card-header">
                    <h3>${editingQuotationId ? 'Edit Quotation' : 'Create Quotation'}</h3>
                    <span style="color: var(--text-secondary); font-size: 14px;">${quoteNumber}</span>
                </div>
                <div class="card-body">
                    <form id="quotationForm" onsubmit="handleSaveQuotation(event)">
                        <input type="hidden" id="quotationId" value="${quotation ? quotation.id : Utils.generateId()}">
                        <input type="hidden" id="quotationNumber" value="${quoteNumber}">

                        <div style="margin-bottom: 32px;">
                            <h4 style="font-size: 14px; font-weight: 600; color: var(--text-primary); margin-bottom: 16px; padding-bottom: 8px; border-bottom: 1px solid var(--border);">Client Information</h4>
                            <div class="form-row">
                                <div class="form-group">
                                    <label class="form-label">Select Client</label>
                                    <select class="form-select" id="qClientSelect" onchange="handleQClientSelect()">
                                        <option value="">-- Select client --</option>
                                        ${clients.map(c => `<option value="${c.id}" ${quotation && quotation.clientId === c.id ? 'selected' : ''}>${c.name}</option>`).join('')}
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Client Name *</label>
                                    <input type="text" class="form-input" id="qClientName" required value="${quotation ? quotation.clientName : ''}">
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label class="form-label">Email</label>
                                    <input type="email" class="form-input" id="qClientEmail" value="${quotation ? quotation.clientEmail : ''}">
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Phone</label>
                                    <input type="text" class="form-input" id="qClientPhone" value="${quotation ? quotation.clientPhone : ''}">
                                </div>
                            </div>
                        </div>

                        <div style="margin-bottom: 32px;">
                            <h4 style="font-size: 14px; font-weight: 600; color: var(--text-primary); margin-bottom: 16px; padding-bottom: 8px; border-bottom: 1px solid var(--border);">Quotation Details</h4>
                            <div class="form-row">
                                <div class="form-group">
                                    <label class="form-label">Date</label>
                                    <input type="date" class="form-input" id="qDate" value="${quotation ? quotation.date : Utils.getToday()}">
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Valid Until</label>
                                    <input type="date" class="form-input" id="qValidUntil" value="${quotation ? quotation.validUntil : Utils.getFutureDate(30)}">
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Status</label>
                                    <select class="form-select" id="qStatus">
                                        <option value="draft" ${quotation && quotation.status === 'draft' ? 'selected' : ''}>Draft</option>
                                        <option value="sent" ${quotation && quotation.status === 'sent' ? 'selected' : ''}>Sent</option>
                                        <option value="accepted" ${quotation && quotation.status === 'accepted' ? 'selected' : ''}>Accepted</option>
                                        <option value="rejected" ${quotation && quotation.status === 'rejected' ? 'selected' : ''}>Rejected</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div style="margin-bottom: 32px;">
                            <h4 style="font-size: 14px; font-weight: 600; color: var(--text-primary); margin-bottom: 16px; padding-bottom: 8px; border-bottom: 1px solid var(--border);">Services & Items</h4>
                            <div class="table-container">
                                <table class="items-table">
                                    <thead>
                                        <tr>
                                            <th style="width: 25%;">Service</th>
                                            <th style="width: 30%;">Description</th>
                                            <th style="width: 12%;">Qty</th>
                                            <th style="width: 18%;">Rate (${settings.currency})</th>
                                            <th style="width: 12%;">Amount</th>
                                            <th style="width: 3%;"></th>
                                        </tr>
                                    </thead>
                                    <tbody id="qItemsBody">
                                        ${renderQuotationItems(services)}
                                    </tbody>
                                </table>
                            </div>
                            <button type="button" class="btn btn-outline btn-sm" onclick="addQuotationItem()" style="margin-top: 12px;">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M12 5v14M5 12h14"/></svg>
                                Add Item
                            </button>
                        </div>

                        <div class="invoice-totals">
                            <div class="totals-box">
                                <div class="total-row">
                                    <span>Subtotal</span>
                                    <span id="qSubtotal">${Utils.formatCurrency(0)}</span>
                                </div>
                                <div class="total-row">
                                    <span>Tax (${settings.taxRate || 0}%)</span>
                                    <span id="qTax">${Utils.formatCurrency(0)}</span>
                                </div>
                                <div class="total-row">
                                    <span>Discount</span>
                                    <span><input type="number" class="form-input" id="qDiscount" value="${quotation ? quotation.discount || 0 : 0}" min="0" step="0.01" style="width: 100px; padding: 6px 10px; text-align: right;" oninput="calculateQTotals()"></span>
                                </div>
                                <div class="total-row grand-total">
                                    <span>Total</span>
                                    <span id="qTotal">${Utils.formatCurrency(0)}</span>
                                </div>
                            </div>
                        </div>

                        <div class="form-group" style="margin-top: 24px;">
                            <label class="form-label">Notes</label>
                            <textarea class="form-textarea" id="qNotes">${quotation ? quotation.notes || '' : 'This quotation is valid for 30 days from the date of issue.'}</textarea>
                        </div>

                        <div style="display: flex; gap: 12px; margin-top: 24px; justify-content: flex-end;">
                            <button type="button" class="btn btn-outline" onclick="App.navigate('quotations')">Cancel</button>
                            <button type="submit" class="btn btn-primary btn-lg">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17,21 17,13 7,13 7,21"/><polyline points="7,3 7,8 15,8"/></svg>
                                ${editingQuotationId ? 'Update Quotation' : 'Save Quotation'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;
}

function renderQuotationItems(services) {
    if (!services) services = Utils.getServices();
    return quotationItems.map((item, index) => `
        <tr>
            <td>
                <select class="form-select" onchange="quotationItems[${index}].service = this.value">
                    <option value="">Select service...</option>
                    ${services.map(s => `<option value="${s.name}" ${item.service === s.name ? 'selected' : ''}>${s.name}</option>`).join('')}
                </select>
            </td>
            <td><input type="text" class="form-input" value="${item.description || ''}" oninput="quotationItems[${index}].description = this.value"></td>
            <td><input type="number" class="form-input" value="${item.quantity}" min="1" oninput="quotationItems[${index}].quantity = parseFloat(this.value)||0; calculateQTotals()"></td>
            <td><input type="number" class="form-input" value="${item.rate}" min="0" step="0.01" oninput="quotationItems[${index}].rate = parseFloat(this.value)||0; calculateQTotals()"></td>
            <td style="font-weight: 600;" id="qItemAmt_${index}">${Utils.formatCurrency(item.quantity * item.rate)}</td>
            <td>${quotationItems.length > 1 ? `<button type="button" class="remove-item" onclick="quotationItems.splice(${index},1); refreshQItems()"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>` : ''}</td>
        </tr>
    `).join('');
}

function addQuotationItem() {
    quotationItems.push({ id: Utils.generateId(), service: '', description: '', quantity: 1, rate: 0 });
    refreshQItems();
}

function refreshQItems() {
    const tbody = document.getElementById('qItemsBody');
    if (tbody) { tbody.innerHTML = renderQuotationItems(); calculateQTotals(); }
}

function calculateQTotals() {
    const subtotal = quotationItems.reduce((s, i) => s + (i.quantity * i.rate), 0);
    const settings = Store.getSettings();
    const tax = subtotal * ((settings.taxRate || 0) / 100);
    const discount = parseFloat(document.getElementById('qDiscount')?.value) || 0;
    const total = subtotal + tax - discount;

    quotationItems.forEach((item, index) => {
        const el = document.getElementById(`qItemAmt_${index}`);
        if (el) el.textContent = Utils.formatCurrency(item.quantity * item.rate);
    });

    const s = document.getElementById('qSubtotal');
    const t = document.getElementById('qTax');
    const tot = document.getElementById('qTotal');
    if (s) s.textContent = Utils.formatCurrency(subtotal);
    if (t) t.textContent = Utils.formatCurrency(tax);
    if (tot) tot.textContent = Utils.formatCurrency(total);
}

function handleQClientSelect() {
    const id = document.getElementById('qClientSelect').value;
    if (id) {
        const c = Store.getClient(id);
        if (c) {
            document.getElementById('qClientName').value = c.name;
            document.getElementById('qClientEmail').value = c.email || '';
            document.getElementById('qClientPhone').value = c.phone || '';
        }
    }
}

function handleSaveQuotation(event) {
    event.preventDefault();
    const settings = Store.getSettings();
    const subtotal = quotationItems.reduce((s, i) => s + (i.quantity * i.rate), 0);
    const tax = subtotal * ((settings.taxRate || 0) / 100);
    const discount = parseFloat(document.getElementById('qDiscount').value) || 0;
    const total = subtotal + tax - discount;

    const quotation = {
        id: document.getElementById('quotationId').value,
        quotationNumber: document.getElementById('quotationNumber').value,
        clientName: document.getElementById('qClientName').value,
        clientEmail: document.getElementById('qClientEmail').value,
        clientPhone: document.getElementById('qClientPhone').value,
        clientId: document.getElementById('qClientSelect').value || null,
        date: document.getElementById('qDate').value,
        validUntil: document.getElementById('qValidUntil').value,
        status: document.getElementById('qStatus').value,
        items: quotationItems,
        subtotal, tax, discount, total,
        notes: document.getElementById('qNotes').value,
        createdAt: editingQuotationId ? Store.getQuotation(editingQuotationId).createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    Store.saveQuotation(quotation);
    Utils.showToast(editingQuotationId ? 'Quotation updated!' : 'Quotation created!');
    setTimeout(() => App.navigate('quotations'), 500);
}

setTimeout(calculateQTotals, 100);
