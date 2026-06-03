/* ============================================
   DesignFox POS - Invoices List Page
   ============================================ */

function renderInvoices() {
    const invoices = Store.getInvoices();
    const sortedInvoices = [...invoices].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return `
        <div class="invoices-page">
            <!-- Filter Bar -->
            <div class="filter-bar">
                <div class="search-box">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="11" cy="11" r="8"/>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                    </svg>
                    <input type="text" placeholder="Search invoices..." id="invoiceSearch" oninput="filterInvoices()">
                </div>
                <select class="form-select" id="statusFilter" onchange="filterInvoices()" style="width: auto; min-width: 150px;">
                    <option value="">All Status</option>
                    <option value="paid">Paid</option>
                    <option value="pending">Pending</option>
                    <option value="overdue">Overdue</option>
                    <option value="draft">Draft</option>
                </select>
                <button class="btn btn-primary" onclick="App.navigate('create-invoice')">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M12 5v14M5 12h14"/>
                    </svg>
                    New Invoice
                </button>
            </div>

            <!-- Invoices Table -->
            <div class="card">
                <div class="card-body" style="padding: 0;">
                    ${sortedInvoices.length > 0 ? `
                        <div class="table-container" style="border: none;">
                            <table class="table" id="invoicesTable">
                                <thead>
                                    <tr>
                                        <th>Invoice #</th>
                                        <th>Client</th>
                                        <th>Date</th>
                                        <th>Due Date</th>
                                        <th>Amount</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${sortedInvoices.map(inv => `
                                        <tr data-invoice="${inv.id}" data-status="${inv.status}" data-search="${(inv.invoiceNumber + ' ' + inv.clientName).toLowerCase()}">
                                            <td><strong style="color: var(--primary);">${inv.invoiceNumber}</strong></td>
                                            <td>
                                                <div>
                                                    <div style="font-weight: 500;">${inv.clientName || '-'}</div>
                                                    <div style="font-size: 12px; color: var(--text-light);">${inv.clientEmail || ''}</div>
                                                </div>
                                            </td>
                                            <td>${Utils.formatDate(inv.date)}</td>
                                            <td>${Utils.formatDate(inv.dueDate)}</td>
                                            <td><strong>${Utils.formatCurrency(inv.total)}</strong></td>
                                            <td><span class="badge ${Utils.getStatusBadge(inv.status)}">${inv.status.charAt(0).toUpperCase() + inv.status.slice(1)}</span></td>
                                            <td>
                                                <div style="display: flex; gap: 6px;">
                                                    <button class="btn btn-sm btn-outline" onclick="App.navigate('view-invoice', '${inv.id}')" title="View">
                                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
                                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                                            <circle cx="12" cy="12" r="3"/>
                                                        </svg>
                                                    </button>
                                                    <button class="btn btn-sm btn-outline" onclick="App.navigate('create-invoice', '${inv.id}')" title="Edit">
                                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
                                                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                                                        </svg>
                                                    </button>
                                                    <button class="btn btn-sm btn-outline" onclick="confirmDeleteInvoice('${inv.id}')" title="Delete" style="color: var(--danger); border-color: #fecaca;">
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
                            <h3>No Invoices Yet</h3>
                            <p>Create your first invoice to get started with billing</p>
                            <button class="btn btn-primary" onclick="App.navigate('create-invoice')">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M12 5v14M5 12h14"/>
                                </svg>
                                Create First Invoice
                            </button>
                        </div>
                    `}
                </div>
            </div>
        </div>
    `;
}

function filterInvoices() {
    const search = document.getElementById('invoiceSearch').value.toLowerCase();
    const status = document.getElementById('statusFilter').value;
    const rows = document.querySelectorAll('#invoicesTable tbody tr');

    rows.forEach(row => {
        const matchesSearch = !search || row.dataset.search.includes(search);
        const matchesStatus = !status || row.dataset.status === status;
        row.style.display = matchesSearch && matchesStatus ? '' : 'none';
    });
}

function confirmDeleteInvoice(id) {
    const invoice = Store.getInvoice(id);
    if (!invoice) return;

    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `
        <div class="modal">
            <div class="modal-header">
                <h3>Delete Invoice</h3>
                <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20">
                        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                </button>
            </div>
            <div class="modal-body">
                <p>Are you sure you want to delete invoice <strong>${invoice.invoiceNumber}</strong>?</p>
                <p style="color: var(--text-secondary); margin-top: 8px; font-size: 13px;">This action cannot be undone.</p>
            </div>
            <div class="modal-footer">
                <button class="btn btn-outline" onclick="this.closest('.modal-overlay').remove()">Cancel</button>
                <button class="btn btn-danger" onclick="deleteInvoice('${id}')">Delete</button>
            </div>
        </div>
    `;
    document.body.appendChild(overlay);
}

function deleteInvoice(id) {
    Store.deleteInvoice(id);
    document.querySelector('.modal-overlay')?.remove();
    Utils.showToast('Invoice deleted successfully');
    App.navigate('invoices');
}
