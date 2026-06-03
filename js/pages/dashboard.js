/* ============================================
   DesignFox POS - Dashboard Page
   ============================================ */

function renderDashboard() {
    const invoices = Store.getInvoices();
    const clients = Store.getClients();
    const quotations = Store.getQuotations();
    
    const totalRevenue = invoices
        .filter(inv => inv.status === 'paid')
        .reduce((sum, inv) => sum + (parseFloat(inv.total) || 0), 0);
    
    const pendingAmount = invoices
        .filter(inv => inv.status === 'pending' || inv.status === 'overdue')
        .reduce((sum, inv) => sum + (parseFloat(inv.total) || 0), 0);
    
    const totalInvoices = invoices.length;
    const totalClients = clients.length;

    // This month stats
    const now = new Date();
    const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const thisMonthInvoices = invoices.filter(inv => inv.date && inv.date.startsWith(thisMonth));
    const thisMonthRevenue = thisMonthInvoices
        .filter(inv => inv.status === 'paid')
        .reduce((sum, inv) => sum + (parseFloat(inv.total) || 0), 0);

    // Recent invoices
    const recentInvoices = [...invoices]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);

    // Overdue invoices
    const overdueInvoices = invoices.filter(inv => {
        if (inv.status === 'paid' || inv.status === 'draft') return false;
        return new Date(inv.dueDate) < now;
    });

    return `
        <div class="dashboard-page">
            <!-- Stats Grid -->
            <div class="stats-grid">
                <div class="stat-card orange">
                    <div class="stat-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="12" y1="1" x2="12" y2="23"/>
                            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                        </svg>
                    </div>
                    <div class="stat-value">${Utils.formatCurrency(totalRevenue)}</div>
                    <div class="stat-label">Total Revenue</div>
                </div>
                <div class="stat-card yellow">
                    <div class="stat-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="10"/>
                            <polyline points="12,6 12,12 16,14"/>
                        </svg>
                    </div>
                    <div class="stat-value">${Utils.formatCurrency(pendingAmount)}</div>
                    <div class="stat-label">Pending Amount</div>
                </div>
                <div class="stat-card blue">
                    <div class="stat-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                            <polyline points="14,2 14,8 20,8"/>
                        </svg>
                    </div>
                    <div class="stat-value">${totalInvoices}</div>
                    <div class="stat-label">Total Invoices</div>
                </div>
                <div class="stat-card green">
                    <div class="stat-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                            <circle cx="9" cy="7" r="4"/>
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                        </svg>
                    </div>
                    <div class="stat-value">${totalClients}</div>
                    <div class="stat-label">Total Clients</div>
                </div>
            </div>

            <!-- Quick Actions & This Month -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 24px;">
                <div class="card">
                    <div class="card-header">
                        <h3>Quick Actions</h3>
                    </div>
                    <div class="card-body" style="display: flex; gap: 10px; flex-wrap: wrap;">
                        <button class="btn btn-primary" onclick="App.navigate('create-invoice')">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M12 5v14M5 12h14"/></svg>
                            New Invoice
                        </button>
                        <button class="btn btn-outline" onclick="App.navigate('create-quotation')">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/></svg>
                            New Quotation
                        </button>
                        <button class="btn btn-outline" onclick="App.navigate('clients')">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>
                            Add Client
                        </button>
                        <button class="btn btn-outline" onclick="App.navigate('reports')">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
                            View Reports
                        </button>
                    </div>
                </div>
                <div class="card">
                    <div class="card-header">
                        <h3>This Month</h3>
                        <span style="font-size: 12px; color: var(--text-light);">${now.toLocaleString('en-US', { month: 'long', year: 'numeric' })}</span>
                    </div>
                    <div class="card-body">
                        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; text-align: center;">
                            <div>
                                <div style="font-size: 22px; font-weight: 800; color: var(--success);">${Utils.formatCurrency(thisMonthRevenue)}</div>
                                <div style="font-size: 11px; color: var(--text-secondary); margin-top: 4px;">Revenue</div>
                            </div>
                            <div>
                                <div style="font-size: 22px; font-weight: 800; color: var(--accent);">${thisMonthInvoices.length}</div>
                                <div style="font-size: 11px; color: var(--text-secondary); margin-top: 4px;">Invoices</div>
                            </div>
                            <div>
                                <div style="font-size: 22px; font-weight: 800; color: var(--danger);">${overdueInvoices.length}</div>
                                <div style="font-size: 11px; color: var(--text-secondary); margin-top: 4px;">Overdue</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Recent Invoices -->
            <div class="card">
                <div class="card-header">
                    <h3>Recent Invoices</h3>
                    <button class="btn btn-sm btn-outline" onclick="App.navigate('invoices')">View All</button>
                </div>
                <div class="card-body" style="padding: 0;">
                    ${recentInvoices.length > 0 ? `
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>Invoice #</th>
                                    <th>Client</th>
                                    <th>Date</th>
                                    <th>Amount</th>
                                    <th>Status</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                ${recentInvoices.map(inv => `
                                    <tr>
                                        <td><strong>${inv.invoiceNumber}</strong></td>
                                        <td>${inv.clientName || '-'}</td>
                                        <td>${Utils.formatDate(inv.date)}</td>
                                        <td><strong>${Utils.formatCurrency(inv.total)}</strong></td>
                                        <td><span class="badge ${Utils.getStatusBadge(inv.status)}">${inv.status.charAt(0).toUpperCase() + inv.status.slice(1)}</span></td>
                                        <td>
                                            <button class="btn btn-sm btn-outline" onclick="App.navigate('view-invoice', '${inv.id}')">View</button>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    ` : `
                        <div class="empty-state">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                                <polyline points="14,2 14,8 20,8"/>
                            </svg>
                            <h3>No Invoices Yet</h3>
                            <p>Create your first invoice to get started</p>
                            <button class="btn btn-primary" onclick="App.navigate('create-invoice')">Create Invoice</button>
                        </div>
                    `}
                </div>
            </div>
        </div>
    `;
}
