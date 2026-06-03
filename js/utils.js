/* ============================================
   DesignFox POS - Utility Functions
   ============================================ */

const Utils = {
    // Generate unique ID
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },

    // Format currency
    formatCurrency(amount, currency = 'LKR') {
        const num = parseFloat(amount) || 0;
        return `${currency} ${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    },

    // Format date
    formatDate(dateStr) {
        if (!dateStr) return '-';
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    },

    // Get today's date in YYYY-MM-DD format
    getToday() {
        return new Date().toISOString().split('T')[0];
    },

    // Get date X days from now
    getFutureDate(days) {
        const date = new Date();
        date.setDate(date.getDate() + days);
        return date.toISOString().split('T')[0];
    },

    // Show toast notification
    showToast(message, type = 'success') {
        const existing = document.querySelector('.toast');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
                ${type === 'success' ? '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>' : 
                  type === 'error' ? '<circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>' :
                  '<circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>'}
            </svg>
            ${message}
        `;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    },

    // Services list for DesignFox
    getServices() {
        return [
            { id: 'graphic-design', name: 'Graphic Design', category: 'Design' },
            { id: 'logo-design', name: 'Logo Design', category: 'Design' },
            { id: 'brand-identity', name: 'Brand Identity Package', category: 'Design' },
            { id: 'social-media-design', name: 'Social Media Design', category: 'Design' },
            { id: 'print-design', name: 'Print Design (Flyers/Brochures)', category: 'Design' },
            { id: 'packaging-design', name: 'Packaging Design', category: 'Design' },
            { id: 'web-design', name: 'Web Design', category: 'Web' },
            { id: 'web-development', name: 'Web Development', category: 'Web' },
            { id: 'ecommerce', name: 'E-Commerce Website', category: 'Web' },
            { id: 'landing-page', name: 'Landing Page Design', category: 'Web' },
            { id: 'web-maintenance', name: 'Website Maintenance', category: 'Web' },
            { id: 'ui-ux-design', name: 'UI/UX Design', category: 'Web' },
            { id: 'seo', name: 'SEO Optimization', category: 'Digital Marketing' },
            { id: 'social-media-marketing', name: 'Social Media Marketing', category: 'Digital Marketing' },
            { id: 'google-ads', name: 'Google Ads Management', category: 'Digital Marketing' },
            { id: 'facebook-ads', name: 'Facebook/Meta Ads', category: 'Digital Marketing' },
            { id: 'content-marketing', name: 'Content Marketing', category: 'Digital Marketing' },
            { id: 'email-marketing', name: 'Email Marketing', category: 'Digital Marketing' },
            { id: 'video-production', name: 'Video Production', category: 'Digital Marketing' },
            { id: 'consultation', name: 'Consultation', category: 'Other' },
            { id: 'custom', name: 'Custom Service', category: 'Other' }
        ];
    },

    // Get status color class
    getStatusBadge(status) {
        const classes = {
            'paid': 'badge-paid',
            'pending': 'badge-pending',
            'overdue': 'badge-overdue',
            'draft': 'badge-draft'
        };
        return classes[status] || 'badge-draft';
    }
};
