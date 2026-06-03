/* ============================================
   DesignFox POS - Create Invoice Page
   ============================================ */

let invoiceItems = [];
let editingInvoiceId = null;

function renderCreateInvoice(editId) {
    editingInvoiceId = editId || null;
    let invoice = null;
    
    if (editingInvoiceId) {
        invoice = Store.getInvoice(editingInvoiceId);
        if (invoice) {
            invoiceItems = [...invoice.items];
        }
    } else {
        invoiceItems = [{ id: Utils.generateId(), service: '', description: '', quantity: 1, rate: 0 }];
    }

    const clients = Store.getClients();
    const services = Utils.getServices();
    const settings = Store.getSettings();
    const invoiceNumber = invoice ? invoice.invoiceNumber : Store.getNextInvoiceNumber();

    return `
        <div class="create-invoice-page">
            <div class="card">
                <div class="card-header">
                    <h3>${editingInvoiceId ? 'Edit Invoice' : 'Create New Invoice'}</h3>
                    <span style="color: var(--text-secondary); font-size: 14px;">${invoiceNumber}</span>
                </div>
                <div class="card-body">
                    <form id="invoiceForm" onsubmit="handleSaveInvoice(event)">
                        <input type="hidden" id="invoiceId" value="${invoice ? invoice.id : Utils.generateId()}">
                        <input type="hidden" id="invoiceNumber" value="${invoiceNumber}">

                        <!-- Client Details -->
                        <div style="margin-bottom: 32px;">
                            <h4 style="font-size: 14px; font-weight: 600; color: var(--text-primary); margin-bottom: 16px; padding-bottom: 8px; border-bottom: 1px solid var(--border);">Client Information</h4>
                            <div class="form-row">
                                <div class="form-group">
                                    <label class="form-label">Select Client</label>
                                    <select class="form-select" id="clientSelect" onchange="handleClientSelect()">
                                        <option value="">-- Select existing client or enter new --</option>
                                        ${clients.map(c => `<option value="${c.id}" ${invoice && invoice.clientId === c.id ? 'selected' : ''}>${c.name}</option>`).join('')}
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Client Name *</label>
                                    <input type="text" class="form-input" id="clientName" required value="${invoice ? invoice.clientName : ''}" placeholder="Enter client name">
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label class="form-label">Email</label>
                                    <input type="email" class="form-input" id="clientEmail" value="${invoice ? invoice.clientEmail : ''}" placeholder="client@email.com">
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Phone</label>
                                    <input type="text" class="form-input" id="clientPhone" value="${invoice ? invoice.clientPhone : ''}" placeholder="+94 XX XXX XXXX">
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Address</label>
                                <input type="text" class="form-input" id="clientAddress" value="${invoice ? invoice.clientAddress : ''}" placeholder="Client address">
                            </div>
                        </div>

                        <!-- Invoice Details -->
                        <div style="margin-bottom: 32px;">
                            <h4 style="font-size: 14px; font-weight: 600; color: var(--text-primary); margin-bottom: 16px; padding-bottom: 8px; border-bottom: 1px solid var(--border);">Invoice Details</h4>
                            <div class="form-row">
                                <div class="form-group">
                                    <label class="form-label">Invoice Date *</label>
                                    <input type="date" class="form-input" id="invoiceDate" required value="${invoice ? invoice.date : Utils.getToday()}">
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Due Date *</label>
                                    <input type="date" class="form-input" id="dueDate" required value="${invoice ? invoice.dueDate : Utils.getFutureDate(14)}">
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Status</label>
                                    <select class="form-select" id="invoiceStatus">
                                        <option value="pending" ${invoice && invoice.status === 'pending' ? 'selected' : ''}>Pending</option>
                                        <option value="paid" ${invoice && invoice.status === 'paid' ? 'selected' : ''}>Paid</option>
                                        <option value="overdue" ${invoice && invoice.status === 'overdue' ? 'selected' : ''}>Overdue</option>
                                        <option value="draft" ${invoice && invoice.status === 'draft' ? 'selected' : ''}>Draft</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <!-- Services/Items -->
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
                                    <tbody id="itemsBody">
                                        ${renderInvoiceItems(services)}
                                    </tbody>
                                </table>
                            </div>
                            <button type="button" class="btn btn-outline btn-sm mt-3" onclick="addInvoiceItem()" style="margin-top: 12px;">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                                    <path d="M12 5v14M5 12h14"/>
                                </svg>
                                Add Item
                            </button>
                        </div>

                        <!-- Totals -->
                        <div class="invoice-totals">
                            <div class="totals-box">
                                <div class="total-row">
                                    <span>Subtotal</span>
                                    <span id="subtotalDisplay">${Utils.formatCurrency(0)}</span>
                                </div>
                                <div class="total-row">
                                    <span>Tax (${settings.taxRate || 0}%)</span>
                                    <span id="taxDisplay">${Utils.formatCurrency(0)}</span>
                                </div>
                                <div class="total-row">
                                    <span>Discount</span>
                                    <span>
                                        <input type="number" class="form-input" id="discountInput" value="${invoice ? invoice.discount || 0 : 0}" min="0" step="0.01" style="width: 100px; padding: 6px 10px; text-align: right;" oninput="calculateTotals()">
                                    </span>
                                </div>
                                <div class="total-row grand-total">
                                    <span>Total</span>
                                    <span id="totalDisplay">${Utils.formatCurrency(0)}</span>
                                </div>
                            </div>
                        </div>

                        <!-- Notes -->
                        <div style="margin-top: 32px;">
                            <div class="form-group">
                                <label class="form-label">Notes / Terms</label>
                                <textarea class="form-textarea" id="invoiceNotes" placeholder="Payment terms, thank you note, or any additional information...">${invoice ? invoice.notes || '' : 'Thank you for your business!\nPayment is due within 14 days of invoice date.'}</textarea>
                            </div>
                        </div>

                        <!-- Actions -->
                        <div style="display: flex; gap: 12px; margin-top: 24px; justify-content: flex-end;">
                            <button type="button" class="btn btn-outline" onclick="App.navigate('invoices')">Cancel</button>
                            <button type="submit" class="btn btn-primary btn-lg">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
                                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                                    <polyline points="17,21 17,13 7,13 7,21"/>
                                    <polyline points="7,3 7,8 15,8"/>
                                </svg>
                                ${editingInvoiceId ? 'Update Invoice' : 'Save Invoice'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;
}

function renderInvoiceItems(services) {
    if (!services) services = Utils.getServices();
    return invoiceItems.map((item, index) => `
        <tr data-item-id="${item.id}">
            <td>
                <select class="form-select" onchange="updateItemService(${index}, this.value)">
                    <option value="">Select service...</option>
                    ${services.map(s => `<option value="${s.name}" ${item.service === s.name ? 'selected' : ''}>${s.name}</option>`).join('')}
                </select>
            </td>
            <td>
                <input type="text" class="form-input" value="${item.description || ''}" placeholder="Description" oninput="updateItemField(${index}, 'description', this.value)">
            </td>
            <td>
                <input type="number" class="form-input" value="${item.quantity}" min="1" step="1" oninput="updateItemField(${index}, 'quantity', this.value); calculateTotals()">
            </td>
            <td>
                <input type="number" class="form-input" value="${item.rate}" min="0" step="0.01" oninput="updateItemField(${index}, 'rate', this.value); calculateTotals()">
            </td>
            <td style="font-weight: 600; font-size: 14px;" id="itemAmount_${index}">
                ${Utils.formatCurrency(item.quantity * item.rate)}
            </td>
            <td>
                ${invoiceItems.length > 1 ? `
                    <button type="button" class="remove-item" onclick="removeInvoiceItem(${index})">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                            <line x1="18" y1="6" x2="6" y2="18"/>
                            <line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                    </button>
                ` : ''}
            </td>
        </tr>
    `).join('');
}

function addInvoiceItem() {
    invoiceItems.push({ id: Utils.generateId(), service: '', description: '', quantity: 1, rate: 0 });
    refreshItems();
}

function removeInvoiceItem(index) {
    invoiceItems.splice(index, 1);
    refreshItems();
}

function updateItemService(index, value) {
    invoiceItems[index].service = value;
}

function updateItemField(index, field, value) {
    if (field === 'quantity' || field === 'rate') {
        invoiceItems[index][field] = parseFloat(value) || 0;
    } else {
        invoiceItems[index][field] = value;
    }
}

function refreshItems() {
    const tbody = document.getElementById('itemsBody');
    if (tbody) {
        tbody.innerHTML = renderInvoiceItems();
        calculateTotals();
    }
}

function calculateTotals() {
    const subtotal = invoiceItems.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
    const settings = Store.getSettings();
    const taxRate = settings.taxRate || 0;
    const tax = subtotal * (taxRate / 100);
    const discount = parseFloat(document.getElementById('discountInput')?.value) || 0;
    const total = subtotal + tax - discount;

    // Update each item's amount display live
    invoiceItems.forEach((item, index) => {
        const amountEl = document.getElementById(`itemAmount_${index}`);
        if (amountEl) {
            amountEl.textContent = Utils.formatCurrency(item.quantity * item.rate);
        }
    });

    const subtotalEl = document.getElementById('subtotalDisplay');
    const taxEl = document.getElementById('taxDisplay');
    const totalEl = document.getElementById('totalDisplay');

    if (subtotalEl) subtotalEl.textContent = Utils.formatCurrency(subtotal);
    if (taxEl) taxEl.textContent = Utils.formatCurrency(tax);
    if (totalEl) totalEl.textContent = Utils.formatCurrency(total);
}

function handleClientSelect() {
    const select = document.getElementById('clientSelect');
    const clientId = select.value;
    if (clientId) {
        const client = Store.getClient(clientId);
        if (client) {
            document.getElementById('clientName').value = client.name;
            document.getElementById('clientEmail').value = client.email || '';
            document.getElementById('clientPhone').value = client.phone || '';
            document.getElementById('clientAddress').value = client.address || '';
        }
    }
}

function handleSaveInvoice(event) {
    event.preventDefault();

    const settings = Store.getSettings();
    const subtotal = invoiceItems.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
    const taxRate = settings.taxRate || 0;
    const tax = subtotal * (taxRate / 100);
    const discount = parseFloat(document.getElementById('discountInput').value) || 0;
    const total = subtotal + tax - discount;

    const invoice = {
        id: document.getElementById('invoiceId').value,
        invoiceNumber: document.getElementById('invoiceNumber').value,
        clientName: document.getElementById('clientName').value,
        clientEmail: document.getElementById('clientEmail').value,
        clientPhone: document.getElementById('clientPhone').value,
        clientAddress: document.getElementById('clientAddress').value,
        clientId: document.getElementById('clientSelect').value || null,
        date: document.getElementById('invoiceDate').value,
        dueDate: document.getElementById('dueDate').value,
        status: document.getElementById('invoiceStatus').value,
        items: invoiceItems,
        subtotal: subtotal,
        tax: tax,
        discount: discount,
        total: total,
        notes: document.getElementById('invoiceNotes').value,
        createdAt: editingInvoiceId ? Store.getInvoice(editingInvoiceId).createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    // Also save client if new
    if (!invoice.clientId && invoice.clientName) {
        const newClient = {
            id: Utils.generateId(),
            name: invoice.clientName,
            email: invoice.clientEmail,
            phone: invoice.clientPhone,
            address: invoice.clientAddress,
            createdAt: new Date().toISOString()
        };
        Store.saveClient(newClient);
        invoice.clientId = newClient.id;
    }

    Store.saveInvoice(invoice);
    Utils.showToast(editingInvoiceId ? 'Invoice updated successfully!' : 'Invoice created successfully!');
    
    setTimeout(() => {
        App.navigate('view-invoice', invoice.id);
    }, 500);
}

// Calculate totals on page load
setTimeout(calculateTotals, 100);
