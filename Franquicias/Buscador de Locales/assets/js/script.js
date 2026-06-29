/**
 * Buscador de Locales Standalone
 * Script principal
 */

document.addEventListener('DOMContentLoaded', () => {
    initStoreSearch();
});

function initStoreSearch() {
    const input = document.getElementById('store-search-input');
    const grid = document.getElementById('stores-grid');
    const countText = document.getElementById('search-results-count');

    if (!input || !grid) return;

    // localesData is loaded globally from data.js
    if (typeof localesData === 'undefined') {
        grid.innerHTML = '<p style="color:red; text-align:center;">Error: Base de datos no encontrada.</p>';
        return;
    }

    input.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();

        if (query.length < 2) {
            grid.innerHTML = '';
            countText.textContent = 'Ingresa al menos 2 caracteres para buscar';
            return;
        }

        const filtered = localesData.filter(store =>
            (store.local && store.local.toLowerCase().includes(query)) ||
            (store.direccion && store.direccion.toLowerCase().includes(query)) ||
            (store.email && store.email.toLowerCase().includes(query)) ||
            (store.regional && store.regional.toLowerCase().includes(query)) ||
            (store.supervisor && store.supervisor.toLowerCase().includes(query)) ||
            (store.tecnico && store.tecnico.toLowerCase().includes(query)) ||
            (store.sigla_sistema && store.sigla_sistema.toLowerCase().includes(query)) ||
            (store.sigla_tickets && store.sigla_tickets.toLowerCase().includes(query)) ||
            (store.provincia && store.provincia.toLowerCase().includes(query))
        );

        renderStores(filtered);
        
        if (filtered.length === 1) {
            countText.textContent = `Se encontró 1 local`;
        } else {
            countText.textContent = `Se encontraron ${filtered.length} locales`;
        }
    });

    function renderStores(stores) {
        grid.innerHTML = stores.map(store => `
            <div class="store-card fade-in">
                <div class="store-name">
                    ${store.local || '-'}
                    <span class="siglas-badge" title="Sigla Sistema: ${store.sigla_sistema} | Sigla Tickets: ${store.sigla_tickets}">
                        ${store.sigla_sistema !== '-' ? store.sigla_sistema : store.sigla_tickets}
                    </span>
                </div>
                
                <div class="store-info-group">
                    <div class="store-detail">
                        <span class="detail-label">Gerente Regional</span>
                        <span class="detail-value">${store.regional || '-'}</span>
                    </div>
                    <div class="store-detail">
                        <span class="detail-label">Supervisor</span>
                        <span class="detail-value">${store.supervisor || '-'}</span>
                    </div>
                    <div class="store-detail">
                        <span class="detail-label">Técnico Asignado</span>
                        <span class="detail-value">${store.tecnico || '-'}</span>
                    </div>
                </div>

                <div class="store-detail">
                    <span class="detail-label">Razón Social</span>
                    <span class="detail-value" style="font-size: 0.85rem; color: var(--light-text);">${store.razon_social || '-'}</span>
                </div>

                <div class="store-divider"></div>

                <div class="store-detail">
                    <span class="detail-label">Dirección</span>
                    <span class="detail-value">${store.direccion || '-'}</span>
                </div>
                <div class="store-detail">
                    <span class="detail-label">Localidad / Provincia</span>
                    <span class="detail-value">${store.ciudad || '-'}, ${store.provincia || '-'}</span>
                </div>
                <div class="store-detail">
                    <span class="detail-label">Contacto</span>
                    <span class="detail-value">${store.email || '-'}</span>
                </div>
                
                <div class="store-footer">
                    <div class="badge-provincia">${store.provincia || '-'}</div>
                    <div class="badge-tipo">${store.tipo_local || '-'}</div>
                </div>
            </div>
        `).join('');
    }
}
