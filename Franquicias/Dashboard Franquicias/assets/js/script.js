/**
 * Dashboard Franquicias - Script Orchestrator
 */

const dashboardModules = [
    {
        id: 'top-10',
        title: 'TOP 10 Locales',
        description: 'Ranking de performance y métricas destacadas.',
        icon: '🏆'
    },
    {
        id: 'franquicias',
        title: 'Locales de Franquicias',
        description: 'Gestión y seguimiento de locales externos.',
        icon: '🏪'
    },
    {
        id: 'propios',
        title: 'Locales Propios',
        description: 'Control detallado de sucursales directas.',
        icon: '🍔'
    },
    {
        id: 'semaforo',
        title: 'Semáforo',
        description: 'Estado crítico de locales (Verde/Amarillo/Rojo).',
        icon: '🚦'
    },
    {
        id: 'buscador',
        title: 'Buscador de Locales',
        description: 'Acceso rápido a datos por nombre o sigla.',
        icon: '🔍'
    }
];

document.addEventListener('DOMContentLoaded', () => {
    initDashboard();
});

/**
 * Initializes the main dashboard view
 */
function initDashboard() {
    const container = document.querySelector('.dashboard-grid');
    if (!container) return;

    container.innerHTML = dashboardModules.map(module => `
        <div class="module-card fade-in" onclick="navigateToModule('${module.id}')">
            <div class="icon-placeholder">${module.icon}</div>
            <h3>${module.title}</h3>
            <p>${module.description}</p>
        </div>
    `).join('');
}

/**
 * Handles navigation between modules
 * @param {string} moduleId 
 */
window.navigateToModule = async (moduleId) => {
    console.log(`Navigating to module: ${moduleId}`);

    const contentArea = document.getElementById('app-container');
    contentArea.classList.remove('fade-in');

    // First, try to load from embedded views (bypasses CORS)
    if (typeof embeddedViews !== 'undefined' && embeddedViews[moduleId]) {
        contentArea.innerHTML = embeddedViews[moduleId];
        console.log('Loaded module from embedded data');
    } else {
        // Fallback to fetch if not embedded
        const viewPath = `modules/${moduleId}-locales/view.html`;
        try {
            const response = await fetch(viewPath);
            if (response.ok) {
                const html = await response.text();
                contentArea.innerHTML = html;
            } else {
                throw new Error('Module view not found');
            }
        } catch (error) {
            console.warn('Loading fallback placeholder:', error);
            contentArea.innerHTML = `
                <div class="module-view fade-in">
                    <button class="btn-back" onclick="location.reload()">← Volver al Dashboard</button>
                    <div class="card">
                        <h2>Módulo: ${moduleId.toUpperCase().replace('-', ' ')}</h2>
                        <p>Cargando funcionalidades específicas para este módulo...</p>
                        <div class="placeholder-content" style="height: 300px; background: #eee; border-radius: 8px; margin-top: 2rem; display: flex; align-items: center; justify-content: center; color: #999; border: 2px dashed #ccc;">
                            Contenido en Desarrollo
                        </div>
                    </div>
                </div>
            `;
        }
    }

    // Apply common styles for back buttons and views
    applyViewStyles();

    // Initialize specific module logic
    if (moduleId === 'buscador') {
        initStoreSearch();
    }
};

/**
 * Logic for the Store Search Module
 */
async function initStoreSearch() {
    const input = document.getElementById('store-search-input');
    const grid = document.getElementById('stores-grid');
    const countText = document.getElementById('search-results-count');

    if (!input || !grid) return;

    let allStores = [];

    // Use embedded data if available, otherwise fallback to fetch
    if (typeof localesData !== 'undefined') {
        allStores = localesData;
        console.log('Loaded locales from embedded data');
    } else {
        try {
            const response = await fetch('assets/data/locales.json');
            allStores = await response.json();
        } catch (e) {
            console.error('Error loading locales data:', e);
            grid.innerHTML = '<p>Error al cargar la base de datos de locales.</p>';
            return;
        }
    }

    input.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();

        if (query.length < 2) {
            grid.innerHTML = '';
            countText.textContent = 'Ingresa al menos 2 caracteres para buscar';
            return;
        }

        const filtered = allStores.filter(store =>
            store.local.toLowerCase().includes(query) ||
            store.direccion.toLowerCase().includes(query) ||
            store.email.toLowerCase().includes(query) ||
            store.regional.toLowerCase().includes(query) ||
            store.supervisor.toLowerCase().includes(query) ||
            store.tecnico.toLowerCase().includes(query)
        );

        renderStores(filtered);
        countText.textContent = `Se encontraron ${filtered.length} locales`;
    });

    function renderStores(stores) {
        grid.innerHTML = stores.map(store => `
            <div class="store-card fade-in">
                <div class="store-name">${store.local}</div>
                
                <div class="store-info-group">
                    <div class="store-detail">
                        <span class="detail-label">Gerente Regional</span>
                        <span class="detail-value">${store.regional}</span>
                    </div>
                    <div class="store-detail">
                        <span class="detail-label">Supervisor</span>
                        <span class="detail-value">${store.supervisor}</span>
                    </div>
                    <div class="store-detail">
                        <span class="detail-label">Técnico Asignado</span>
                        <span class="detail-value">${store.tecnico}</span>
                    </div>
                </div>

                <div class="store-divider"></div>

                <div class="store-detail">
                    <span class="detail-label">Dirección</span>
                    <span class="detail-value">${store.direccion}</span>
                </div>
                <div class="store-detail">
                    <span class="detail-label">Ciudad / Provincia</span>
                    <span class="detail-value">${store.ciudad}, ${store.provincia}</span>
                </div>
                <div class="store-detail">
                    <span class="detail-label">Contacto</span>
                    <span class="detail-value">${store.email}</span>
                </div>
                <div class="badge-provincia">${store.provincia}</div>
            </div>
        `).join('');
    }
}

function applyViewStyles() {
    // Basic back button style if not in CSS
    const style = document.createElement('style');
    style.innerHTML = `
        .btn-back {
            background: none;
            border: none;
            color: var(--primary-color);
            font-weight: 700;
            cursor: pointer;
            margin-bottom: 2rem;
            font-size: 1rem;
            padding: 10px 0;
            display: flex;
            align-items: center;
            transition: var(--transition);
        }
        .btn-back:hover {
            transform: translateX(-5px);
        }
        .module-view .card {
            background: white;
            padding: 3rem;
            border-radius: var(--border-radius);
            box-shadow: var(--card-shadow);
        }
    `;
    document.head.appendChild(style);
}
