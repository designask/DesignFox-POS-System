/* ============================================
   DesignFox POS - Clients Page
   ============================================ */

function renderClients() {
    const clients = Store.getClients();
    const invoices = Store.getInvoices();

    return `
        <div class="clients-page">
            <div class="filter-bar">
                <div class="search-box">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="11" cy="11" r="8"/>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                    </svg>
                    <input type="text" placeholder="Search clients..." id="clientSearch" oninput="filterClients()">
                </div>
                <button class="btn btn-primary" onclick="showAddClientModal()">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                        <circle cx="8.5" cy="7" r="4"/>
                        <line x1="20" y1="8" x2="20" y2="14"/>
                        <line x1="23" y1="11" x2="17" y2="11"/>
                    </svg>
                    Add Client
                </button>
            </div>

            <div class="card">
                <div class="card-body" style="padding: 0;">
                    ${clients.length > 0 ? `
                        <div class="table-container" style="border: none;">
                            <table class="table" id="clientsTable">
                                <thead>
                                    <tr>
                                        <th>Client</th>
                                        <th>Email</th>
                                        <th>Phone</th>
                                        <th>Invoices</th>
                                        <th>Total Billed</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${clients.map(client => {
                                        const clientInvoices = invoices.filter(inv => inv.clientId === client.id);
                                        const totalBilled = clientInvoices.reduce((sum, inv) => sum + (parseFloat(inv.total) || 0), 0);
                                        return `
                                            <tr data-search="${(client.name + ' ' + (client.email || '')).toLowerCase()}">
                                                <td>
                                                    <div style="display: flex; align-items: center; gap: 12px;">
                                                        <div style="width: 36px; height: 36px; border-radius: 50%; background: var(--primary-light); color: var(--primary); display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 14px;">
                                                            ${client.name.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <div style="font-weight: 600;">${client.name}</div>
                                                            <div style="font-size: 12px; color: var(--text-light);">${client.address || ''}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>${client.email || '-'}</td>
                                                <td>${client.phone || '-'}</td>
                                                <td><span class="badge badge-paid">${clientInvoices.length}</span></td>
                                                <td><strong>${Utils.formatCurrency(totalBilled)}</strong></td>
                                                <td>
                                                    <div style="display: flex; gap: 6px;">
                                                        <button class="btn btn-sm btn-outline" onclick="showEditClientModal('${client.id}')" title="Edit">
                                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
                                                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                                                            </svg>
                                                        </button>
                                                        <button class="btn btn-sm btn-outline" onclick="confirmDeleteClient('${client.id}')" title="Delete" style="color: var(--danger); border-color: #fecaca;">
                                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
                                                                <polyline points="3,6 5,6 21,6"/>
                                                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        `;
                                    }).join('')}
                                </tbody>
                            </table>
                        </div>
                    ` : `
                        <div class="empty-state">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                                <circle cx="9" cy="7" r="4"/>
                                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                            </svg>
                            <h3>No Clients Yet</h3>
                            <p>Add your first client or create an invoice to automatically add clients</p>
                            <button class="btn btn-primary" onclick="showAddClientModal()">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                                    <circle cx="8.5" cy="7" r="4"/>
                                    <line x1="20" y1="8" x2="20" y2="14"/>
                                    <line x1="23" y1="11" x2="17" y2="11"/>
                                </svg>
                                Add First Client
                            </button>
                        </div>
                    `}
                </div>
            </div>
        </div>
    `;
}

function filterClients() {
    const search = document.getElementById('clientSearch').value.toLowerCase();
    const rows = document.querySelectorAll('#clientsTable tbody tr');
    rows.forEach(row => {
        row.style.display = !search || row.dataset.search.includes(search) ? '' : 'none';
    });
}

function showAddClientModal(client = null) {
    const isEdit = !!client;
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `
        <div class="modal">
            <div class="modal-header">
                <h3>${isEdit ? 'Edit Client' : 'Add New Client'}</h3>
                <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20">
                        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                </button>
            </div>
            <div class="modal-body">
                <form id="clientForm" onsubmit="handleSaveClient(event, '${isEdit ? client.id : ''}')">
                    <div class="form-group">
                        <label class="form-label">Client Name *</label>
                        <input type="text" class="form-input" id="modalClientName" required value="${isEdit ? client.name : ''}" placeholder="Enter client name">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Email</label>
                        <input type="email" class="form-input" id="modalClientEmail" value="${isEdit ? client.email || '' : ''}" placeholder="client@email.com">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Phone</label>
                        <input type="text" class="form-input" id="modalClientPhone" value="${isEdit ? client.phone || '' : ''}" placeholder="+94 XX XXX XXXX">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Address</label>
                        <textarea class="form-textarea" id="modalClientAddress" placeholder="Client address" style="min-height: 70px;">${isEdit ? client.address || '' : ''}</textarea>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button class="btn btn-outline" onclick="this.closest('.modal-overlay').remove()">Cancel</button>
                <button class="btn btn-primary" onclick="document.getElementById('clientForm').requestSubmit()">
                    ${isEdit ? 'Update Client' : 'Add Client'}
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(overlay);
}

function showEditClientModal(clientId) {
    const client = Store.getClient(clientId);
    if (client) showAddClientModal(client);
}

function handleSaveClient(event, editId) {
    event.preventDefault();
    
    const client = {
        id: editId || Utils.generateId(),
        name: document.getElementById('modalClientName').value,
        email: document.getElementById('modalClientEmail').value,
        phone: document.getElementById('modalClientPhone').value,
        address: document.getElementById('modalClientAddress').value,
        createdAt: editId ? Store.getClient(editId)?.createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    Store.saveClient(client);
    document.querySelector('.modal-overlay')?.remove();
    Utils.showToast(editId ? 'Client updated successfully!' : 'Client added successfully!');
    App.navigate('clients');
}

function confirmDeleteClient(id) {
    const client = Store.getClient(id);
    if (!client) return;

    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `
        <div class="modal">
            <div class="modal-header">
                <h3>Delete Client</h3>
                <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20">
                        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                </button>
            </div>
            <div class="modal-body">
                <p>Are you sure you want to delete <strong>${client.name}</strong>?</p>
                <p style="color: var(--text-secondary); margin-top: 8px; font-size: 13px;">This won't delete their invoices.</p>
            </div>
            <div class="modal-footer">
                <button class="btn btn-outline" onclick="this.closest('.modal-overlay').remove()">Cancel</button>
                <button class="btn btn-danger" onclick="deleteClient('${id}')">Delete</button>
            </div>
        </div>
    `;
    document.body.appendChild(overlay);
}

function deleteClient(id) {
    Store.deleteClient(id);
    document.querySelector('.modal-overlay')?.remove();
    Utils.showToast('Client deleted successfully');
    App.navigate('clients');
}
