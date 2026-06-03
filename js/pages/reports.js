/* ============================================
   DesignFox POS - Reports & Analytics Page
   ============================================ */

function renderReports() {
    const invoices = Store.getInvoices();
    const clients = Store.getClients();
    const settings = Store.getSettings();

    // Calculate stats
    const totalRevenue = invoices.filter(i => i.status === 'paid').reduce((s, i) => s + (parseFloat(i.total) || 0), 0);
    const pendingAmount = invoices.filter(i => i.status === 'pending' || i.status === 'overdue').reduce((s, i) => s + (parseFloat(i.total) || 0), 0);
    const paidCount = invoices.filter(i => i.status === 'paid').length;
    const pendingCount = invoices.filter(i => i.status === 'pending').length;
    const overdueCount = invoices.filter(i => i.status === 'overdue').length;
    const avgInvoice = paidCount > 0 ? totalRevenue / paidCount : 0;

    // Monthly revenue (last 6 months)
    const monthlyData = getMonthlyRevenue(invoices);
    const maxMonthly = Math.max(...monthlyData.map(m => m.revenue), 1);

    // Service breakdown
    const serviceData = getServiceBreakdown(invoices);

    // Top clients
    const topClients = getTopClients(invoices, clients);

    return `
        <div class="reports-page">
            <!-- Summary Stats -->
            <div class="stats-grid" style="margin-bottom: 24px;">
                <div class="stat-card green">
                    <div class="stat-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                    </div>
                    <div class="stat-value">${Utils.formatCurrency(totalRevenue)}</div>
                    <div class="stat-label">Total Revenue (Paid)</div>
                </div>
                <div class="stat-card yellow">
                    <div class="stat-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></svg>
                    </div>
                    <div class="stat-value">${Utils.formatCurrency(pendingAmount)}</div>
                    <div class="stat-label">Outstanding Amount</div>
                </div>
                <div class="stat-card orange">
                    <div class="stat-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
                    </div>
                    <div class="stat-value">${Utils.formatCurrency(avgInvoice)}</div>
                    <div class="stat-label">Average Invoice Value</div>
                </div>
                <div class="stat-card blue">
                    <div class="stat-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22,4 12,14.01 9,11.01"/></svg>
                    </div>
                    <div class="stat-value">${invoices.length > 0 ? Math.round((paidCount / invoices.length) * 100) : 0}%</div>
                    <div class="stat-label">Collection Rate</div>
                </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 24px;">
                <!-- Monthly Revenue Chart -->
                <div class="card">
                    <div class="card-header">
                        <h3>Monthly Revenue</h3>
                        <span style="font-size: 12px; color: var(--text-light);">Last 6 months</span>
                    </div>
                    <div class="card-body">
                        <div class="chart-bars">
                            ${monthlyData.map(m => `
                                <div class="chart-bar-group">
                                    <div class="chart-bar-value">${Utils.formatCurrency(m.revenue)}</div>
                                    <div class="chart-bar-track">
                                        <div class="chart-bar-fill" style="height: ${maxMonthly > 0 ? (m.revenue / maxMonthly) * 100 : 0}%;"></div>
                                    </div>
                                    <div class="chart-bar-label">${m.label}</div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>

                <!-- Invoice Status Breakdown -->
                <div class="card">
                    <div class="card-header">
                        <h3>Invoice Status</h3>
                    </div>
                    <div class="card-body">
                        <div class="status-breakdown">
                            <div class="status-item">
                                <div class="status-bar">
                                    <div class="status-bar-label">
                                        <span class="badge badge-paid">Paid</span>
                                        <strong>${paidCount}</strong>
                                    </div>
                                    <div class="status-bar-track">
                                        <div class="status-bar-fill" style="width: ${invoices.length > 0 ? (paidCount / invoices.length) * 100 : 0}%; background: var(--success);"></div>
                                    </div>
                                </div>
                            </div>
                            <div class="status-item">
                                <div class="status-bar">
                                    <div class="status-bar-label">
                                        <span class="badge badge-pending">Pending</span>
                                        <strong>${pendingCount}</strong>
                                    </div>
                                    <div class="status-bar-track">
                                        <div class="status-bar-fill" style="width: ${invoices.length > 0 ? (pendingCount / invoices.length) * 100 : 0}%; background: var(--warning);"></div>
                                    </div>
                                </div>
                            </div>
                            <div class="status-item">
                                <div class="status-bar">
                                    <div class="status-bar-label">
                                        <span class="badge badge-overdue">Overdue</span>
                                        <strong>${overdueCount}</strong>
                                    </div>
                                    <div class="status-bar-track">
                                        <div class="status-bar-fill" style="width: ${invoices.length > 0 ? (overdueCount / invoices.length) * 100 : 0}%; background: var(--danger);"></div>
                                    </div>
                                </div>
                            </div>
                            <div class="status-item">
                                <div class="status-bar">
                                    <div class="status-bar-label">
                                        <span class="badge badge-draft">Draft</span>
                                        <strong>${invoices.filter(i => i.status === 'draft').length}</strong>
                                    </div>
                                    <div class="status-bar-track">
                                        <div class="status-bar-fill" style="width: ${invoices.length > 0 ? (invoices.filter(i => i.status === 'draft').length / invoices.length) * 100 : 0}%; background: var(--text-light);"></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid var(--border);">
                            <div style="display: flex; justify-content: space-between; font-size: 14px;">
                                <span style="color: var(--text-secondary);">Total Invoices</span>
                                <strong>${invoices.length}</strong>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px;">
                <!-- Service Breakdown -->
                <div class="card">
                    <div class="card-header">
                        <h3>Revenue by Service</h3>
                    </div>
                    <div class="card-body" style="padding: 0;">
                        ${serviceData.length > 0 ? `
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th>Service</th>
                                        <th>Count</th>
                                        <th>Revenue</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${serviceData.slice(0, 8).map(s => `
                                        <tr>
                                            <td><strong>${s.name}</strong></td>
                                            <td>${s.count}</td>
                                            <td><strong>${Utils.formatCurrency(s.revenue)}</strong></td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        ` : `
                            <div class="empty-state" style="padding: 40px;">
                                <p>No service data yet</p>
                            </div>
                        `}
                    </div>
                </div>

                <!-- Top Clients -->
                <div class="card">
                    <div class="card-header">
                        <h3>Top Clients</h3>
                    </div>
                    <div class="card-body" style="padding: 0;">
                        ${topClients.length > 0 ? `
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th>Client</th>
                                        <th>Invoices</th>
                                        <th>Total Billed</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${topClients.slice(0, 8).map(c => `
                                        <tr>
                                            <td>
                                                <div style="display: flex; align-items: center; gap: 10px;">
                                                    <div style="width: 32px; height: 32px; border-radius: 50%; background: var(--primary-light); color: var(--primary); display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 12px;">
                                                        ${c.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <strong>${c.name}</strong>
                                                </div>
                                            </td>
                                            <td>${c.count}</td>
                                            <td><strong>${Utils.formatCurrency(c.total)}</strong></td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        ` : `
                            <div class="empty-state" style="padding: 40px;">
                                <p>No client data yet</p>
                            </div>
                        `}
                    </div>
                </div>
            </div>
        </div>
    `;
}

function getMonthlyRevenue(invoices) {
    const months = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        const label = d.toLocaleString('en-US', { month: 'short' });
        const revenue = invoices
            .filter(inv => inv.status === 'paid' && inv.date && inv.date.startsWith(monthKey))
            .reduce((sum, inv) => sum + (parseFloat(inv.total) || 0), 0);
        months.push({ label, revenue, key: monthKey });
    }
    return months;
}

function getServiceBreakdown(invoices) {
    const serviceMap = {};
    invoices.forEach(inv => {
        if (inv.items) {
            inv.items.forEach(item => {
                const name = item.service || 'Other';
                if (!serviceMap[name]) serviceMap[name] = { name, count: 0, revenue: 0 };
                serviceMap[name].count++;
                serviceMap[name].revenue += (item.quantity || 0) * (item.rate || 0);
            });
        }
    });
    return Object.values(serviceMap).sort((a, b) => b.revenue - a.revenue);
}

function getTopClients(invoices, clients) {
    const clientMap = {};
    invoices.forEach(inv => {
        const name = inv.clientName || 'Unknown';
        if (!clientMap[name]) clientMap[name] = { name, count: 0, total: 0 };
        clientMap[name].count++;
        clientMap[name].total += parseFloat(inv.total) || 0;
    });
    return Object.values(clientMap).sort((a, b) => b.total - a.total);
}
