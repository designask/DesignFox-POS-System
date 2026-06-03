/* ============================================
   DesignFox POS - View Invoice Page
   ============================================ */

function renderViewInvoice(invoiceId) {
    const invoice = Store.getInvoice(invoiceId);
    if (!invoice) {
        return `
            <div class="empty-state">
                <h3>Invoice Not Found</h3>
                <p>The invoice you're looking for doesn't exist.</p>
                <button class="btn btn-primary" onclick="App.navigate('invoices')">Back to Invoices</button>
            </div>
        `;
    }

    const settings = Store.getSettings();

    return `
        <div class="invoice-view-container">
            <!-- Actions -->
            <div class="invoice-actions">
                <button class="btn btn-outline" onclick="App.navigate('invoices')">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                        <line x1="19" y1="12" x2="5" y2="12"/>
                        <polyline points="12,19 5,12 12,5"/>
                    </svg>
                    Back
                </button>
                <button class="btn btn-outline" onclick="App.navigate('create-invoice', '${invoice.id}')">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                    Edit
                </button>
                <button class="btn btn-primary" onclick="printInvoice('${invoice.id}')">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                        <polyline points="6,9 6,2 18,2 18,9"/>
                        <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
                        <rect x="6" y="14" width="12" height="8"/>
                    </svg>
                    Print / Download
                </button>
                ${invoice.status !== 'paid' ? `
                    <button class="btn btn-success" onclick="markAsPaid('${invoice.id}')">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                            <polyline points="22,4 12,14.01 9,11.01"/>
                        </svg>
                        Mark as Paid
                    </button>
                ` : ''}
            </div>

            <!-- Invoice Document -->
            <div class="invoice-document">
                <!-- Header -->
                <div class="invoice-doc-header">
                    <div class="company-details">
                        <h2>${settings.company.name}</h2>
                        <p>${settings.company.address}</p>
                        <p>${settings.company.phone}</p>
                        <p>${settings.company.email}</p>
                    </div>
                    <div class="invoice-meta">
                        <h3>INVOICE</h3>
                        <p><strong>${invoice.invoiceNumber}</strong></p>
                        <p>Date: ${Utils.formatDate(invoice.date)}</p>
                        <p>Due: ${Utils.formatDate(invoice.dueDate)}</p>
                        <p style="margin-top: 8px;">
                            <span class="badge ${Utils.getStatusBadge(invoice.status)}">${invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}</span>
                        </p>
                    </div>
                </div>

                <!-- Bill To -->
                <div class="invoice-parties">
                    <div>
                        <h4>Bill To</h4>
                        <p><strong>${invoice.clientName}</strong></p>
                        ${invoice.clientAddress ? `<p>${invoice.clientAddress}</p>` : ''}
                        ${invoice.clientEmail ? `<p>${invoice.clientEmail}</p>` : ''}
                        ${invoice.clientPhone ? `<p>${invoice.clientPhone}</p>` : ''}
                    </div>
                    <div>
                        <h4>From</h4>
                        <p><strong>${settings.company.name}</strong></p>
                        <p>${settings.company.address}</p>
                        <p>${settings.company.email}</p>
                    </div>
                </div>

                <!-- Items Table -->
                <table class="invoice-items-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Service / Description</th>
                            <th class="text-right">Qty</th>
                            <th class="text-right">Rate</th>
                            <th class="text-right">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${invoice.items.map((item, i) => `
                            <tr>
                                <td>${i + 1}</td>
                                <td>
                                    <strong>${item.service || 'Service'}</strong>
                                    ${item.description ? `<br><span style="font-size: 12px; color: var(--text-secondary);">${item.description}</span>` : ''}
                                </td>
                                <td class="text-right">${item.quantity}</td>
                                <td class="text-right">${Utils.formatCurrency(item.rate)}</td>
                                <td class="text-right"><strong>${Utils.formatCurrency(item.quantity * item.rate)}</strong></td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>

                <!-- Summary -->
                <div class="invoice-summary">
                    <div class="invoice-summary-box">
                        <div class="invoice-summary-row">
                            <span>Subtotal</span>
                            <span>${Utils.formatCurrency(invoice.subtotal)}</span>
                        </div>
                        ${invoice.tax > 0 ? `
                            <div class="invoice-summary-row">
                                <span>Tax</span>
                                <span>${Utils.formatCurrency(invoice.tax)}</span>
                            </div>
                        ` : ''}
                        ${invoice.discount > 0 ? `
                            <div class="invoice-summary-row">
                                <span>Discount</span>
                                <span>-${Utils.formatCurrency(invoice.discount)}</span>
                            </div>
                        ` : ''}
                        <div class="invoice-summary-row total">
                            <span>Total</span>
                            <span>${Utils.formatCurrency(invoice.total)}</span>
                        </div>
                    </div>
                </div>

                <!-- Notes -->
                ${invoice.notes ? `
                    <div class="invoice-notes">
                        <h4>Notes & Terms</h4>
                        <p>${invoice.notes.replace(/\n/g, '<br>')}</p>
                    </div>
                ` : ''}
            </div>
        </div>
    `;
}

function markAsPaid(invoiceId) {
    const invoice = Store.getInvoice(invoiceId);
    if (invoice) {
        invoice.status = 'paid';
        invoice.updatedAt = new Date().toISOString();
        Store.saveInvoice(invoice);
        Utils.showToast('Invoice marked as paid!');
        App.navigate('view-invoice', invoiceId);
    }
}

function printInvoice(invoiceId) {
    const invoice = Store.getInvoice(invoiceId);
    if (!invoice) return;

    const settings = Store.getSettings();
    
    const printContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Invoice ${invoice.invoiceNumber}</title>
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body { font-family: 'Inter', -apple-system, sans-serif; padding: 40px; color: #1e293b; font-size: 14px; }
                .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; padding-bottom: 20px; border-bottom: 3px solid #f97316; }
                .company h2 { font-size: 22px; color: #f97316; margin-bottom: 4px; }
                .company p { color: #64748b; font-size: 12px; line-height: 1.6; }
                .invoice-title { text-align: right; }
                .invoice-title h3 { font-size: 28px; color: #1e293b; margin-bottom: 8px; }
                .invoice-title p { color: #64748b; font-size: 12px; }
                .parties { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; margin-bottom: 32px; }
                .parties h4 { font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #94a3b8; margin-bottom: 6px; }
                .parties p { font-size: 13px; line-height: 1.6; }
                table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
                th { background: #f8fafc; padding: 10px 14px; text-align: left; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b; border-bottom: 2px solid #e2e8f0; }
                td { padding: 12px 14px; border-bottom: 1px solid #f1f5f9; font-size: 13px; }
                .text-right { text-align: right; }
                .summary { display: flex; justify-content: flex-end; }
                .summary-box { width: 250px; }
                .summary-row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 13px; color: #64748b; }
                .summary-row.total { border-top: 2px solid #1e293b; margin-top: 8px; padding-top: 10px; font-size: 18px; font-weight: 800; color: #1e293b; }
                .notes { margin-top: 32px; padding-top: 20px; border-top: 1px solid #e2e8f0; }
                .notes h4 { font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #94a3b8; margin-bottom: 6px; }
                .notes p { font-size: 12px; color: #64748b; line-height: 1.6; }
                .footer { margin-top: 48px; text-align: center; font-size: 11px; color: #94a3b8; }
                @media print { body { padding: 20px; } }
            </style>
        </head>
        <body>
            <div class="header">
                <div class="company">
                    <h2>${settings.company.name}</h2>
                    <p>${settings.company.address}<br>${settings.company.phone}<br>${settings.company.email}</p>
                </div>
                <div class="invoice-title">
                    <h3>INVOICE</h3>
                    <p><strong>${invoice.invoiceNumber}</strong><br>Date: ${Utils.formatDate(invoice.date)}<br>Due: ${Utils.formatDate(invoice.dueDate)}</p>
                </div>
            </div>
            <div class="parties">
                <div>
                    <h4>Bill To</h4>
                    <p><strong>${invoice.clientName}</strong>${invoice.clientAddress ? '<br>' + invoice.clientAddress : ''}${invoice.clientEmail ? '<br>' + invoice.clientEmail : ''}${invoice.clientPhone ? '<br>' + invoice.clientPhone : ''}</p>
                </div>
                <div>
                    <h4>From</h4>
                    <p><strong>${settings.company.name}</strong><br>${settings.company.address}<br>${settings.company.email}</p>
                </div>
            </div>
            <table>
                <thead>
                    <tr><th>#</th><th>Service / Description</th><th class="text-right">Qty</th><th class="text-right">Rate</th><th class="text-right">Amount</th></tr>
                </thead>
                <tbody>
                    ${invoice.items.map((item, i) => `
                        <tr>
                            <td>${i + 1}</td>
                            <td><strong>${item.service || 'Service'}</strong>${item.description ? '<br><span style="color:#64748b;font-size:11px;">' + item.description + '</span>' : ''}</td>
                            <td class="text-right">${item.quantity}</td>
                            <td class="text-right">LKR ${parseFloat(item.rate).toLocaleString('en-US', {minimumFractionDigits: 2})}</td>
                            <td class="text-right"><strong>LKR ${(item.quantity * item.rate).toLocaleString('en-US', {minimumFractionDigits: 2})}</strong></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            <div class="summary">
                <div class="summary-box">
                    <div class="summary-row"><span>Subtotal</span><span>LKR ${parseFloat(invoice.subtotal).toLocaleString('en-US', {minimumFractionDigits: 2})}</span></div>
                    ${invoice.tax > 0 ? `<div class="summary-row"><span>Tax</span><span>LKR ${parseFloat(invoice.tax).toLocaleString('en-US', {minimumFractionDigits: 2})}</span></div>` : ''}
                    ${invoice.discount > 0 ? `<div class="summary-row"><span>Discount</span><span>-LKR ${parseFloat(invoice.discount).toLocaleString('en-US', {minimumFractionDigits: 2})}</span></div>` : ''}
                    <div class="summary-row total"><span>Total</span><span>LKR ${parseFloat(invoice.total).toLocaleString('en-US', {minimumFractionDigits: 2})}</span></div>
                </div>
            </div>
            ${invoice.notes ? `<div class="notes"><h4>Notes & Terms</h4><p>${invoice.notes.replace(/\n/g, '<br>')}</p></div>` : ''}
            <div class="footer">
                <p>Thank you for choosing ${settings.company.name} | ${settings.company.website || ''}</p>
            </div>
        </body>
        </html>
    `;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.onload = function() {
        printWindow.print();
    };
}
