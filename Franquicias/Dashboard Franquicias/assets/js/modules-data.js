/**
 * Standalone Data for Dashboard Franquicias
 * This file contains embedded views and data to bypass CORS issues when running locally.
 */

const embeddedViews = {
    'buscador': `
<div class="module-view fade-in">
    <button class="btn-back" onclick="window.location.reload()">← Volver al Dashboard</button>

    <div class="card search-module-card">
        <header class="module-header glass-header">
            <h2><span class="pulse-icon">🔍</span> Buscador de Locales</h2>
            <p>Acceso instantáneo a la base de datos de sucursales.</p>
        </header>

        <div class="search-hero-section">
            <div class="main-search-wrapper">
                <i class="fa-solid fa-magnifying-glass search-icon-main"></i>
                <input type="text" id="store-search-input" placeholder="Buscar local por nombre o sigla (Ej: FLORIDA, ALDREY...)" autocomplete="off">
            </div>
            <div id="search-results-count" class="results-info-premium">Comienza a escribir para buscar sucursales...</div>
        </div>

        <div id="stores-grid" class="stores-results-grid">
            <!-- Search results will appear here -->
        </div>
    </div>
</div>

<style>
    :root {
        --premium-shadow: 0 20px 50px rgba(0,0,0,0.1);
        --input-height: 80px;
    }

    .search-module-card {
        max-width: 1000px;
        margin: 0 auto;
        padding: 4rem !important;
    }

    .glass-header {
        text-align: center;
        margin-bottom: 3rem;
    }

    .pulse-icon {
        display: inline-block;
        margin-right: 10px;
    }

    .search-hero-section {
        margin-bottom: 4rem;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .main-search-wrapper {
        position: relative;
        width: 100%;
        max-width: 800px;
        transition: var(--transition);
    }

    .search-icon-main {
        position: absolute;
        left: 30px;
        top: 50%;
        transform: translateY(-50%);
        font-size: 1.8rem;
        color: var(--primary-color);
        opacity: 0.6;
        z-index: 10;
        pointer-events: none;
    }

    #store-search-input {
        width: 100%;
        height: var(--input-height);
        padding: 0 40px 0 85px;
        font-size: 1.5rem;
        font-weight: 500;
        color: var(--secondary-color);
        background: #fff;
        border: 2px solid #e0e0e0;
        border-radius: 40px;
        outline: none;
        transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
        box-shadow: 0 10px 30px rgba(0,0,0,0.03);
    }

    #store-search-input:focus {
        border-color: var(--primary-color);
        box-shadow: 0 15px 45px rgba(211, 47, 47, 0.15);
        transform: translateY(-3px);
    }

    #store-search-input::placeholder {
        color: #bbb;
        font-weight: 300;
        font-size: 1.2rem;
    }

    .results-info-premium {
        margin-top: 1.5rem;
        font-size: 1rem;
        color: var(--light-text);
        font-weight: 400;
        letter-spacing: 0.5px;
    }

    .stores-results-grid {
        margin-top: 2rem;
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
        gap: 2rem;
    }

    /* Mobile adjustments for search */
    @media (max-width: 640px) {
        .search-module-card {
            padding: 2rem 1.5rem !important;
        }
        
        #store-search-input {
            height: 65px;
            font-size: 1.1rem;
            padding-left: 65px;
        }

        .search-icon-main {
            font-size: 1.3rem;
            left: 25px;
        }
    }
</style>
`,
    'franquicias': `
<div class="module-view fade-in">
    <button class="btn-back" onclick="window.location.reload()">← Volver al Dashboard</button>

    <div class="card">
        <header class="module-header">
            <h2>🏪 Locales de Franquicias</h2>
            <p>Gestión y seguimiento de locales operados por terceros.</p>
        </header>

        <div class="placeholder-content"
            style="height: 300px; background: #fdf2f2; border-radius: 8px; margin-top: 1rem; display: flex; flex-direction: column; align-items: center; justify-content: center; color: var(--primary-color); border: 2px dashed var(--primary-color);">
            <div style="font-size: 3rem; margin-bottom: 1rem;">🏗️</div>
            <p style="font-weight: 700;">Módulo en Construcción</p>
            <p style="font-size: 0.9rem; opacity: 0.7;">Próximamente: Listado detallado y auditorías.</p>
        </div>
    </div>
</div>
`,
    'propios': `
<div class="module-view fade-in">
    <button class="btn-back" onclick="window.location.reload()">← Volver al Dashboard</button>

    <div class="card">
        <header class="module-header">
            <h2>🍔 Locales Propios</h2>
            <p>Monitoreo y administración de las sucursales directas de la marca.</p>
        </header>

        <div class="placeholder-content"
            style="height: 300px; background: #eee; border-radius: 8px; margin-top: 1rem; display: flex; flex-direction: column; align-items: center; justify-content: center; color: var(--secondary-color); border: 2px dashed var(--secondary-color);">
            <div style="font-size: 3rem; margin-bottom: 1rem;">⚙️</div>
            <p style="font-weight: 700;">Módulo en Configuración</p>
            <p style="font-size: 0.9rem; opacity: 0.7;">Próximamente: Control de stock y personal.</p>
        </div>
    </div>
</div>
`,
    'semaforo': `
<div class="module-view fade-in">
    <button class="btn-back" onclick="window.location.reload()">← Volver al Dashboard</button>

    <div class="card">
        <header class="module-header">
            <h2>🚦 Semáforo de Locales</h2>
            <p>Estado crítico de mantenimiento y alertas operativas en tiempo real.</p>
        </header>

        <div class="traffic-light-placeholder"
            style="display: flex; gap: 2rem; justify-content: center; margin: 3rem 0;">
            <div class="light-box" style="text-align: center;">
                <div
                    style="width: 60px; height: 60px; background: #4caf50; border-radius: 50%; margin: 0 auto 10px; box-shadow: 0 0 20px rgba(76, 175, 80, 0.4);">
                </div>
                <span style="font-weight: 700; color: #2e7d32;">Operativo</span>
            </div>
            <div class="light-box" style="text-align: center;">
                <div
                    style="width: 60px; height: 60px; background: #ffc107; border-radius: 50%; margin: 0 auto 10px; box-shadow: 0 0 20px rgba(255, 193, 7, 0.4);">
                </div>
                <span style="font-weight: 700; color: #ffa000;">Advertencia</span>
            </div>
            <div class="light-box" style="text-align: center;">
                <div
                    style="width: 60px; height: 60px; background: #f44336; border-radius: 50%; margin: 0 auto 10px; box-shadow: 0 0 20px rgba(244, 67, 54, 0.4);">
                </div>
                <span style="font-weight: 700; color: #c62828;">Crítico</span>
            </div>
        </div>

        <div class="placeholder-content"
            style="height: 200px; background: #fafafa; border-radius: 8px; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #999; border: 2px dashed #eee;">
            <p>Próximamente: Integración con base de datos de tickets.</p>
            <p style="font-size: 0.8rem;">Visualización por sucursal y tipo de falla.</p>
        </div>
    </div>
</div>
`,
    'top-10': `
<div class="module-view fade-in">
    <button class="btn-back" onclick="window.location.reload()">← Volver al Dashboard</button>

    <div class="card">
        <header class="module-header">
            <h2>🏆 TOP 10 Locales</h2>
            <p>Ranking de performance basado en métricas de mantenimiento y respuesta técnica.</p>
        </header>

        <div class="ranking-container">
            <table class="ranking-table">
                <thead>
                    <tr>
                        <th>Pos.</th>
                        <th>Local</th>
                        <th>Calificación</th>
                        <th>Estado</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td class="pos">1</td>
                        <td><strong>Sucursal Florida</strong></td>
                        <td>9.8</td>
                        <td><span class="badge success">Excelente</span></td>
                    </tr>
                    <tr>
                        <td class="pos">2</td>
                        <td><strong>Alto Palermo</strong></td>
                        <td>9.5</td>
                        <td><span class="badge success">Excelente</span></td>
                    </tr>
                    <tr>
                        <td class="pos">3</td>
                        <td><strong>Abasto Shopping</strong></td>
                        <td>9.2</td>
                        <td><span class="badge success">Excelente</span></td>
                    </tr>
                    <!-- More mock data -->
                    <tr>
                        <td class="pos">4</td>
                        <td><strong>Sucursal Cabildo</strong></td>
                        <td>8.9</td>
                        <td><span class="badge info">Muy Bueno</span></td>
                    </tr>
                    <tr>
                        <td class="pos">5</td>
                        <td><strong>Plaza Oeste</strong></td>
                        <td>8.7</td>
                        <td><span class="badge info">Muy Bueno</span></td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</div>
`
};

const localesData = [
    {
        "regional": "Martin Medina",
        "supervisor": "Micaela Pardo",
        "local": "VILLA DEL PARQUE",
        "email": "villadelparque@mostazaweb.com.ar",
        "direccion": "Cuenca 3035 (Est. Aprox)",
        "ciudad": "VILLA DEL PARQUE",
        "provincia": "CABA",
        "tecnico": "-"
    },
    {
        "regional": "Martin Medina",
        "supervisor": "Micaela Pardo",
        "local": "LINIERS",
        "email": "liniers@mostazaweb.com.ar",
        "direccion": "AV RIVADAVIA 11576",
        "ciudad": "LINIERS",
        "provincia": "BUENOS AIRES",
        "tecnico": "-"
    },
    {
        "regional": "Martin Medina",
        "supervisor": "Micaela Pardo",
        "local": "RAMOS",
        "email": "ramosejia@mostazaweb.com.ar",
        "direccion": "BELGRANO 86",
        "ciudad": "RAMOS MEJIA",
        "provincia": "BUENOS AIRES",
        "tecnico": "-"
    },
    {
        "regional": "Martin Medina",
        "supervisor": "Micaela Pardo",
        "local": "MERLO",
        "email": "merlo@mostazaweb.com.ar",
        "direccion": "AV LIBERTADOR 487",
        "ciudad": "MERLO",
        "provincia": "BUENOS AIRES",
        "tecnico": "-"
    },
    {
        "regional": "Martin Medina",
        "supervisor": "Micaela Pardo",
        "local": "ZARATE",
        "email": "zarate@mostazaweb.com.ar",
        "direccion": "Justa Lima de Atucha (Est. Aprox)",
        "ciudad": "ZARATE",
        "provincia": "BUENOS AIRES",
        "tecnico": "-"
    },
    {
        "regional": "Martin Medina",
        "supervisor": "Micaela Pardo",
        "local": "GUALEGUAYCHU",
        "email": "(No figura mail)",
        "direccion": "-",
        "ciudad": "-",
        "provincia": "-",
        "tecnico": "-"
    },
    {
        "regional": "Martin Medina",
        "supervisor": "Micaela Pardo",
        "local": "MERCADO PARAGUAY X 14",
        "email": "(No figura mail)",
        "direccion": "-",
        "ciudad": "-",
        "provincia": "-",
        "tecnico": "-"
    },
    {
        "regional": "Martin Medina",
        "supervisor": "Micaela Pardo",
        "local": "PORTAL TUCUMAN",
        "email": "(No figura mail)",
        "direccion": "-",
        "ciudad": "-",
        "provincia": "-",
        "tecnico": "-"
    },
    {
        "regional": "Martin Medina",
        "supervisor": "Ailen Perez",
        "local": "TUCUMAN 2",
        "email": "tucuman2@mostazaweb.com.ar",
        "direccion": "Av. Aconquija 1300",
        "ciudad": "YERBA BUENA",
        "provincia": "TUCUMAN",
        "tecnico": "-"
    },
    {
        "regional": "Martin Medina",
        "supervisor": "Ailen Perez",
        "local": "TUCUMAN 3",
        "email": "tucuman3@mostazaweb.com.ar",
        "direccion": "25 DE MAYO 392",
        "ciudad": "SAN MIGUEL DE TUCUMAN",
        "provincia": "TUCUMAN",
        "tecnico": "-"
    },
    {
        "regional": "Martin Medina",
        "supervisor": "Ailen Perez",
        "local": "TUCUMAN 4",
        "email": "tucuman4@mostazaweb.com.ar",
        "direccion": "Av Juan Domingo Peron 1900",
        "ciudad": "YERBA BUENA",
        "provincia": "TUCUMAN",
        "tecnico": "-"
    },
    {
        "regional": "Martin Medina",
        "supervisor": "Ailen Perez",
        "local": "TUCUMAN 5",
        "email": "tucuman5@mostazaweb.com.ar",
        "direccion": "Av. Mate de Luna 4107",
        "ciudad": "YERBA BUENA",
        "provincia": "TUCUMAN",
        "tecnico": "-"
    },
    {
        "regional": "Martin Medina",
        "supervisor": "Ailen Perez",
        "local": "TUCUMAN 6",
        "email": "tucuman6@mostazaweb.com.ar",
        "direccion": "SOLDATI 26",
        "ciudad": "SAN MIGUEL DE TUCUMAN",
        "provincia": "TUCUMAN",
        "tecnico": "-"
    },
    {
        "regional": "Martin Medina",
        "supervisor": "Ailen Perez",
        "local": "TUCUMAN 7",
        "email": "concepcion@mostazaweb.com.ar",
        "direccion": "San Martin 1563",
        "ciudad": "CONCEPCION",
        "provincia": "TUCUMAN",
        "tecnico": "-"
    },
    {
        "regional": "Martin Medina",
        "supervisor": "Ailen Perez",
        "local": "TUCUMAN 8",
        "email": "tucuman8@mostazaweb.com.ar",
        "direccion": "-",
        "ciudad": "-",
        "provincia": "-",
        "tecnico": "-"
    },
    {
        "regional": "Martin Medina",
        "supervisor": "Ailen Perez",
        "local": "TUCUMAN 9",
        "email": "tucuman9@mostazaweb.com.ar",
        "direccion": "-",
        "ciudad": "-",
        "provincia": "-",
        "tecnico": "-"
    },
    {
        "regional": "Martin Medina",
        "supervisor": "Fabrizio Bollero",
        "local": "PORTAL SALTA",
        "email": "portalsalta@mostazaweb.com.ar",
        "direccion": "20 de Febrero 1437",
        "ciudad": "SALTA",
        "provincia": "SALTA",
        "tecnico": "-"
    },
    {
        "regional": "Martin Medina",
        "supervisor": "Fabrizio Bollero",
        "local": "SALTA LIBERTAD",
        "email": "saltalibertad@mostazaweb.com.ar",
        "direccion": "Av Tavella s/n",
        "ciudad": "SALTA",
        "provincia": "SALTA",
        "tecnico": "-"
    },
    {
        "regional": "Martin Medina",
        "supervisor": "Fabrizio Bollero",
        "local": "SALTA PEATONAL",
        "email": "saltapeatonal@mostazaweb.com.ar",
        "direccion": "ALBERDI 242",
        "ciudad": "CAPITAL",
        "provincia": "SALTA",
        "tecnico": "-"
    },
    {
        "regional": "Martin Medina",
        "supervisor": "Fabrizio Bollero",
        "local": "SALTA AUTO",
        "email": "saltaesquinaauto@mostazaweb.com.ar",
        "direccion": "-",
        "ciudad": "-",
        "provincia": "-",
        "tecnico": "-"
    },
    {
        "regional": "Martin Medina",
        "supervisor": "Fabrizio Bollero",
        "local": "JUJUY",
        "email": "jujuy@mostazaweb.com.ar",
        "direccion": "Belgrano 563 piso 2 local 308",
        "ciudad": "San Salvador de Jujuy",
        "provincia": "Jujuy",
        "tecnico": "-"
    },
    {
        "regional": "Martin Medina",
        "supervisor": "Fabrizio Bollero",
        "local": "SALTA ORAN",
        "email": "oran@mostazaweb.com.ar",
        "direccion": "LOPEZ Y PLANES 585",
        "ciudad": "ORAN",
        "provincia": "SALTA",
        "tecnico": "-"
    },
    {
        "regional": "Martin Medina",
        "supervisor": "Fabrizio Bollero",
        "local": "SALTA NOA",
        "email": "(No figura mail)",
        "direccion": "-",
        "ciudad": "-",
        "provincia": "-",
        "tecnico": "-"
    },
    {
        "regional": "Martin Medina",
        "supervisor": "Marina Gonzalez",
        "local": "SAN JUSTO",
        "email": "sanjusto3@mostazaweb.com.ar",
        "direccion": "IGNACIO ARIETA 3156",
        "ciudad": "SAN JUSTO",
        "provincia": "BUENOS AIRES",
        "tecnico": "-"
    },
    {
        "regional": "Martin Medina",
        "supervisor": "Marina Gonzalez",
        "local": "LAFERRERE 2",
        "email": "laferrere2@mostazaweb.com.ar",
        "direccion": "Av. Luro 5917",
        "ciudad": "LAFERRERE",
        "provincia": "BUENOS AIRES",
        "tecnico": "-"
    },
    {
        "regional": "Martin Medina",
        "supervisor": "Marina Gonzalez",
        "local": "EZEIZA",
        "email": "ezeiza@mostazaweb.com.ar",
        "direccion": "Conquista del Desierto 322",
        "ciudad": "Ezeiza",
        "provincia": "BUENOS AIRES",
        "tecnico": "-"
    },
    {
        "regional": "Martin Medina",
        "supervisor": "Marina Gonzalez",
        "local": "CANNING",
        "email": "canning@mostazaweb.com.ar",
        "direccion": "interseccion ruta 58 y Ruta 16",
        "ciudad": "CANNING",
        "provincia": "BUENOS AIRES",
        "tecnico": "-"
    },
    {
        "regional": "Martin Medina",
        "supervisor": "Marina Gonzalez",
        "local": "MONTEGRANDE",
        "email": "montegrande@mostazaweb.com.ar",
        "direccion": "Leandro Alem 401",
        "ciudad": "Monte Grande",
        "provincia": "BUENOS AIRES",
        "tecnico": "-"
    },
    {
        "regional": "Martin Medina",
        "supervisor": "Marina Gonzalez",
        "local": "LA RIOJA",
        "email": "larioja@mostazaweb.com.ar",
        "direccion": "25 DE MAYO 48",
        "ciudad": "LA RIOJA",
        "provincia": "LA RIOJA",
        "tecnico": "-"
    },
    {
        "regional": "Martin Medina",
        "supervisor": "Marina Gonzalez",
        "local": "CATAMARCA",
        "email": "catamarca@mostazaweb.com.ar",
        "direccion": "Rivadavia 662",
        "ciudad": "S.F. DEL VALLE",
        "provincia": "CATAMARCA",
        "tecnico": "-"
    },
    {
        "regional": "Hernan Dalto",
        "supervisor": "Rocio Fernandez",
        "local": "LA PLATA 2",
        "email": "laplata2@mostazaweb.com.ar",
        "direccion": "calle 47 627 (e 7 y 8)",
        "ciudad": "La Plata",
        "provincia": "Buenos Aires",
        "tecnico": "-"
    },
    {
        "regional": "Hernan Dalto",
        "supervisor": "Rocio Fernandez",
        "local": "LA PLATA 3",
        "email": "laplata3@mostazaweb.com.ar",
        "direccion": "calle 8 932 (e 50 y 51)",
        "ciudad": "La Plata",
        "provincia": "Buenos Aires",
        "tecnico": "-"
    },
    {
        "regional": "Hernan Dalto",
        "supervisor": "Rocio Fernandez",
        "local": "LA PLATA 4",
        "email": "lp4@mostazaweb.com.ar",
        "direccion": "calle 12 1200 y calle 56",
        "ciudad": "La Plata",
        "provincia": "Buenos Aires",
        "tecnico": "-"
    },
    {
        "regional": "Hernan Dalto",
        "supervisor": "Rocio Fernandez",
        "local": "LA PLATA 6",
        "email": "laplata6@mostazaweb.com.ar",
        "direccion": "calle 137 1598",
        "ciudad": "La Plata",
        "provincia": "Buenos Aires",
        "tecnico": "-"
    },
    {
        "regional": "Hernan Dalto",
        "supervisor": "Rocio Fernandez",
        "local": "CITY BELL",
        "email": "citybell@mostazaweb.com.ar",
        "direccion": "av cantilo 282",
        "ciudad": "City Bell",
        "provincia": "Buenos Aires",
        "tecnico": "-"
    },
    {
        "regional": "Hernan Dalto",
        "supervisor": "Rocio Fernandez",
        "local": "MENDOZA CENTRO",
        "email": "neuquencentro@mostazaweb.com.ar",
        "direccion": "Lavalle 35 piso 5to depto 9",
        "ciudad": "Mendoza Capital",
        "provincia": "Mendoza",
        "tecnico": "-"
    },
    {
        "regional": "Hernan Dalto",
        "supervisor": "Rocio Fernandez",
        "local": "MENDOZA COLON",
        "email": "avcolon@mostazaweb.com.ar",
        "direccion": "Chile 925 piso 9 depto 6",
        "ciudad": "Mendoza Capital",
        "provincia": "Mendoza",
        "tecnico": "-"
    },
    {
        "regional": "Hernan Dalto",
        "supervisor": "Rocio Fernandez",
        "local": "SAN RAFAEL",
        "email": "sanrafael@mostazaweb.com.ar",
        "direccion": "Hipolito Yrigoyen 1530",
        "ciudad": "San rafael",
        "provincia": "Mendoza",
        "tecnico": "-"
    },
    {
        "regional": "Hernan Dalto",
        "supervisor": "Rocio Fernandez",
        "local": "S DEL ESTERO",
        "email": "portalsantiago@mostazaweb.com.ar",
        "direccion": "Av ejercito Argentino y rivadavia",
        "ciudad": "sgo del estero",
        "provincia": "sgo del estero",
        "tecnico": "-"
    },
    {
        "regional": "Hernan Dalto",
        "supervisor": "Marisa Aranda",
        "local": "LOMAS AUTO",
        "email": "lomas2@mostazaweb.com.ar",
        "direccion": "-",
        "ciudad": "-",
        "provincia": "-",
        "tecnico": "-"
    },
    {
        "regional": "Hernan Dalto",
        "supervisor": "Marisa Aranda",
        "local": "BERAZATEGUI",
        "email": "berazategui@mostazaweb.com.ar",
        "direccion": "Cerro Famatina 1938",
        "ciudad": "Florencio Varela",
        "provincia": "Buenos Aires",
        "tecnico": "-"
    },
    {
        "regional": "Hernan Dalto",
        "supervisor": "Marisa Aranda",
        "local": "ROTONDA",
        "email": "gutierrez@mostazaweb.com.ar",
        "direccion": "Calle 12 n° 672 depto 5D",
        "ciudad": "La Plata",
        "provincia": "Buenos Aires",
        "tecnico": "-"
    },
    {
        "regional": "Hernan Dalto",
        "supervisor": "Marisa Aranda",
        "local": "GONNET",
        "email": "gonnet@mostazaweb.com.ar",
        "direccion": "Calle 522 esquina 19",
        "ciudad": "La Plata",
        "provincia": "Buenos Aires",
        "tecnico": "-"
    },
    {
        "regional": "Hernan Dalto",
        "supervisor": "Marisa Aranda",
        "local": "REPUBLICA",
        "email": "republica@mostazaweb.com.ar",
        "direccion": "Calle 34 entre 12 y 13",
        "ciudad": "La Plata",
        "provincia": "Buenos Aires",
        "tecnico": "-"
    },
    {
        "regional": "Hernan Dalto",
        "supervisor": "Marisa Aranda",
        "local": "SAN JUAN",
        "email": "sanjuan@mostazaweb.com.ar",
        "direccion": "Peru 640",
        "ciudad": "San Juan Capital",
        "provincia": "San Juan",
        "tecnico": "-"
    },
    {
        "regional": "Hernan Dalto",
        "supervisor": "Marisa Aranda",
        "local": "SAN JUAN 2",
        "email": "sanjuan2@mostazaweb.com.ar",
        "direccion": "B° Sarassa torre 11 2do A",
        "ciudad": "San Juan Capital",
        "provincia": "San Juan",
        "tecnico": "-"
    },
    {
        "regional": "Hernan Dalto",
        "supervisor": "Marisa Aranda",
        "local": "RIO GALLEGOS",
        "email": "riogallegos@mostazaweb.com.ar",
        "direccion": "Alberdi 174",
        "ciudad": "Rio Gallegos",
        "provincia": "Santa Cruz",
        "tecnico": "-"
    },
    {
        "regional": "Hernan Dalto",
        "supervisor": "Rocio Correa",
        "local": "LANUS 2",
        "email": "lanus2@mostazaweb.com.ar",
        "direccion": "9 de julio 1476",
        "ciudad": "Lanus este",
        "provincia": "Buenos Aires",
        "tecnico": "-"
    },
    {
        "regional": "Hernan Dalto",
        "supervisor": "Rocio Correa",
        "local": "LOMAS",
        "email": "(No figura mail)",
        "direccion": "Fonrouge 111 piso 7 dpto 6",
        "ciudad": "Lomas de Zamora",
        "provincia": "Buenos Aires",
        "tecnico": "-"
    },
    {
        "regional": "Hernan Dalto",
        "supervisor": "Rocio Correa",
        "local": "QUILMES P.",
        "email": "quilmespeatonal@mostazaweb.com.ar",
        "direccion": "Av rivadavia 49",
        "ciudad": "Quilmes",
        "provincia": "Buenos Aires",
        "tecnico": "-"
    },
    {
        "regional": "Hernan Dalto",
        "supervisor": "Rocio Correa",
        "local": "CARRE QUILMES",
        "email": "carrefourquilmes@mostazaweb.com.ar",
        "direccion": "Av la plata 1400",
        "ciudad": "Quilmes",
        "provincia": "Buenos Aires",
        "tecnico": "-"
    },
    {
        "regional": "Hernan Dalto",
        "supervisor": "Rocio Correa",
        "local": "WILDE",
        "email": "wilde@mostazaweb.com.ar",
        "direccion": "-",
        "ciudad": "-",
        "provincia": "-",
        "tecnico": "-"
    },
    {
        "regional": "Hernan Dalto",
        "supervisor": "Rocio Correa",
        "local": "USHUAIA",
        "email": "ushuaia@mostazaweb.com.ar",
        "direccion": "shopping Paseo del FUego",
        "ciudad": "Ushuaia",
        "provincia": "Tierra del Fuego",
        "tecnico": "-"
    },
    {
        "regional": "Hernan Dalto",
        "supervisor": "Rocio Correa",
        "local": "RIO GRANDE",
        "email": "riogrande@mostazaweb.com.ar",
        "direccion": "11 de julio 795",
        "ciudad": "Río Grande",
        "provincia": "Tierra del Fuego",
        "tecnico": "-"
    },
    {
        "regional": "Hernan Dalto",
        "supervisor": "Rocio Correa",
        "local": "BARILOCHE",
        "email": "bariloche@mostazaweb.com.ar",
        "direccion": "-",
        "ciudad": "-",
        "provincia": "-",
        "tecnico": "-"
    },
    {
        "regional": "Cecilia Riccadonna",
        "supervisor": "(Directo)",
        "local": "NEUQUEN",
        "email": "neuquencentro@mostazaweb.com.ar",
        "direccion": "-",
        "ciudad": "-",
        "provincia": "-",
        "tecnico": "-"
    },
    {
        "regional": "Cecilia Riccadonna",
        "supervisor": "(Directo)",
        "local": "ALTO COMAHUE",
        "email": "altocomahue@mostazaweb.com.ar",
        "direccion": "-",
        "ciudad": "-",
        "provincia": "-",
        "tecnico": "-"
    },
    {
        "regional": "Cecilia Riccadonna",
        "supervisor": "Iris Ayala",
        "local": "CABILDO",
        "email": "cabildo@mostazaweb.com.ar",
        "direccion": "CABILDO 2150",
        "ciudad": "CABA",
        "provincia": "Buenos Aires",
        "tecnico": "-"
    },
    {
        "regional": "Cecilia Riccadonna",
        "supervisor": "Iris Ayala",
        "local": "CABILDO 2",
        "email": "cabildo2@mostazaweb.com.ar",
        "direccion": "CABILDO 2530",
        "ciudad": "CABA",
        "provincia": "Buenos Aires",
        "tecnico": "-"
    },
    {
        "regional": "Cecilia Riccadonna",
        "supervisor": "Iris Ayala",
        "local": "URQUIZA",
        "email": "urquiza@mostazaweb.com.ar",
        "direccion": "Av. Triunvirato 4714",
        "ciudad": "CABA",
        "provincia": "BuENOS AIRES",
        "tecnico": "-"
    },
    {
        "regional": "Cecilia Riccadonna",
        "supervisor": "Iris Ayala",
        "local": "AV CORDOBA",
        "email": "(Mail pendiente)",
        "direccion": "-",
        "ciudad": "-",
        "provincia": "-",
        "tecnico": "-"
    },
    {
        "regional": "Cecilia Riccadonna",
        "supervisor": "Iris Ayala",
        "local": "SAN MARTIN 2",
        "email": "smpeatonal@mostazaweb.com.ar",
        "direccion": "-",
        "ciudad": "-",
        "provincia": "-",
        "tecnico": "-"
    },
    {
        "regional": "Cecilia Riccadonna",
        "supervisor": "Iris Ayala",
        "local": "SAN MARTIN AUTO",
        "email": "sanmartinauto@mostazaweb.com.ar",
        "direccion": "RICARDO BALBIN 2276",
        "ciudad": "SAN MARTIN",
        "provincia": "Buenos Aires",
        "tecnico": "-"
    },
    {
        "regional": "Cecilia Riccadonna",
        "supervisor": "Iris Ayala",
        "local": "LA PAMPA",
        "email": "santarosa@mostazaweb.com.ar",
        "direccion": "AV SAN MARTIN 125",
        "ciudad": "SANTA ROSA",
        "provincia": "LA PAMPA",
        "tecnico": "-"
    },
    {
        "regional": "Cecilia Riccadonna",
        "supervisor": "Raúl Ayala",
        "local": "PALMAS PILAR",
        "email": "palmasdelpilar@mostazaweb.com.ar",
        "direccion": "LAS MAGNOLIAS 754",
        "ciudad": "PILAR",
        "provincia": "Buenos Aires",
        "tecnico": "-"
    },
    {
        "regional": "Cecilia Riccadonna",
        "supervisor": "Raúl Ayala",
        "local": "SAN ISIDRO",
        "email": "sanisidro@mostazaweb.com.ar",
        "direccion": "-",
        "ciudad": "-",
        "provincia": "-",
        "tecnico": "-"
    },
    {
        "regional": "Cecilia Riccadonna",
        "supervisor": "Raúl Ayala",
        "local": "SAN FERNANDO",
        "email": "sanfernando@mostazaweb.com.ar",
        "direccion": "CONSTITUCION 804",
        "ciudad": "SAN FERNANDO",
        "provincia": "Buenos Aires",
        "tecnico": "-"
    },
    {
        "regional": "Cecilia Riccadonna",
        "supervisor": "Raúl Ayala",
        "local": "FLORES",
        "email": "flores@mostazaweb.com.ar",
        "direccion": "AV RIVADAVIA 6912",
        "ciudad": "FLORES",
        "provincia": "BUENOS AIRES",
        "tecnico": "-"
    },
    {
        "regional": "Cecilia Riccadonna",
        "supervisor": "Raúl Ayala",
        "local": "PRIMERA JUNTA",
        "email": "primerajunta@mostazaweb.com.ar",
        "direccion": "AV RIVADAVIA 5576",
        "ciudad": "CABALLITO",
        "provincia": "BUENOS AIRES",
        "tecnico": "-"
    },
    {
        "regional": "Cecilia Riccadonna",
        "supervisor": "Raúl Ayala",
        "local": "BOEDO",
        "email": "boedo@mostazaweb.com.ar",
        "direccion": "Boedo 750",
        "ciudad": "CABA",
        "provincia": "BS AS",
        "tecnico": "-"
    },
    {
        "regional": "Cecilia Riccadonna",
        "supervisor": "Raúl Ayala",
        "local": "JUNIN",
        "email": "junin@mostazaweb.com.ar",
        "direccion": "-",
        "ciudad": "-",
        "provincia": "-",
        "tecnico": "-"
    },
    {
        "regional": "Cecilia Riccadonna",
        "supervisor": "Raúl Ayala",
        "local": "BOLIVAR",
        "email": "bolivar@mostazaweb.com.ar",
        "direccion": "DOMINGO FAUSTINO SARMIENTO 770",
        "ciudad": "BOLIVAR",
        "provincia": "Buenos Aires",
        "tecnico": "-"
    },
    {
        "regional": "Cecilia Riccadonna",
        "supervisor": "Mayra Illuminati",
        "local": "GALLEGOS",
        "email": "losgallegos@mostazaweb.com.ar",
        "direccion": "BELGRANO 3050",
        "ciudad": "MAR DEL PLATA",
        "provincia": "Buenos Aires",
        "tecnico": "-"
    },
    {
        "regional": "Cecilia Riccadonna",
        "supervisor": "Mayra Illuminati",
        "local": "ALDREY",
        "email": "paseoaldrey@mostazaweb.com.ar",
        "direccion": "SARMIENTO 2685",
        "ciudad": "MAR DEL PLATA",
        "provincia": "Buenos Aires",
        "tecnico": "-"
    },
    {
        "regional": "Cecilia Riccadonna",
        "supervisor": "Mayra Illuminati",
        "local": "LA PERLA",
        "email": "laperla@mostazaweb.com.ar",
        "direccion": "YPOLITO YRIGOYEN 1008",
        "ciudad": "MAR DEL PLATA",
        "provincia": "Buenos Aires",
        "tecnico": "-"
    },
    {
        "regional": "Cecilia Riccadonna",
        "supervisor": "Mayra Illuminati",
        "local": "PEATONAL",
        "email": "mardelplata4@mostazaweb.com.ar",
        "direccion": "SAN MARTIN 2501",
        "ciudad": "MAR DEL PLATA",
        "provincia": "Buenos Aires",
        "tecnico": "-"
    },
    {
        "regional": "Cecilia Riccadonna",
        "supervisor": "Mayra Illuminati",
        "local": "OLAVARRIA",
        "email": "olavarria@mostazaweb.com.ar",
        "direccion": "AV.COLON 2716",
        "ciudad": "OLAVARRIA",
        "provincia": "Buenos Aires",
        "tecnico": "-"
    },
    {
        "regional": "Cecilia Riccadonna",
        "supervisor": "Mayra Illuminati",
        "local": "TANDIL",
        "email": "tandil@mostazaweb.com.ar",
        "direccion": "PANAMA 353",
        "ciudad": "TANDIL",
        "provincia": "Buenos Aires",
        "tecnico": "-"
    },
    {
        "regional": "Cecilia Riccadonna",
        "supervisor": "Aylen Crespin",
        "local": "CONSTITUCION",
        "email": "constitucion@mostazaweb.com.ar",
        "direccion": "-",
        "ciudad": "-",
        "provincia": "-",
        "tecnico": "-"
    },
    {
        "regional": "Cecilia Riccadonna",
        "supervisor": "Aylen Crespin",
        "local": "PARQUE CHAC",
        "email": "chacabuco@mostazaweb.com.ar",
        "direccion": "AV ASAMBLEA 915",
        "ciudad": "CHACABUCO",
        "provincia": "BUENOS AIRES",
        "tecnico": "-"
    },
    {
        "regional": "Cecilia Riccadonna",
        "supervisor": "Aylen Crespin",
        "local": "SPINETTO",
        "email": "spinetto@mostazaweb.com.ar",
        "direccion": "Adolfo Alsina 2302",
        "ciudad": "CABA",
        "provincia": "Bs As",
        "tecnico": "-"
    },
    {
        "regional": "Cecilia Riccadonna",
        "supervisor": "Aylen Crespin",
        "local": "POMPEYA",
        "email": "pompeya@mostazaweb.com.ar",
        "direccion": "AV SAENZ 1043",
        "ciudad": "POMPEYA",
        "provincia": "BUENOS AIRES",
        "tecnico": "-"
    },
    {
        "regional": "Cecilia Riccadonna",
        "supervisor": "Aylen Crespin",
        "local": "ONCE",
        "email": "once@mostazaweb.com.ar",
        "direccion": "AV RIVADAVIA 2261",
        "ciudad": "ONCE",
        "provincia": "BUENOS AIRES",
        "tecnico": "-"
    },
    {
        "regional": "Cecilia Riccadonna",
        "supervisor": "Aylen Crespin",
        "local": "FORMOSA",
        "email": "formosa@mostazaweb.com.ar",
        "direccion": "-",
        "ciudad": "FORMOSA",
        "provincia": "FORMOSA",
        "tecnico": "-"
    },
    {
        "regional": "Cecilia Riccadonna",
        "supervisor": "Aylen Crespin",
        "local": "AVELLANEDA",
        "email": "avellaneda2@mostazaweb.com.ar",
        "direccion": "Av mitre 901",
        "ciudad": "Avellaneda",
        "provincia": "Buenos Aires",
        "tecnico": "-"
    },
    {
        "regional": "Melisa Castillo",
        "supervisor": "Camilo Silva",
        "local": "SAN TELMO",
        "email": "santelmo@mostazaweb.com.ar",
        "direccion": "DEFENSA 984",
        "ciudad": "SAN TELMO",
        "provincia": "BUENOS AIRES",
        "tecnico": "-"
    },
    {
        "regional": "Melisa Castillo",
        "supervisor": "Camilo Silva",
        "local": "AV DE MAYO",
        "email": "avenidademayo@mostazaweb.com.ar",
        "direccion": "avenida de mayo 1402",
        "ciudad": "CABA",
        "provincia": "BS AS",
        "tecnico": "-"
    },
    {
        "regional": "Melisa Castillo",
        "supervisor": "Camilo Silva",
        "local": "AV DE MAYO 2",
        "email": "avenidademayo2@mostazaweb.com.ar",
        "direccion": "bernardo de irigoyen 60",
        "ciudad": "CABA",
        "provincia": "BS AS",
        "tecnico": "-"
    },
    {
        "regional": "Melisa Castillo",
        "supervisor": "Camilo Silva",
        "local": "9 DE JULIO",
        "email": "9dejulio@mostazaweb.com.ar",
        "direccion": "av santa fe 1101",
        "ciudad": "CABA",
        "provincia": "BS AS",
        "tecnico": "-"
    },
    {
        "regional": "Melisa Castillo",
        "supervisor": "Camilo Silva",
        "local": "CALLAO",
        "email": "corrientes3@mostazaweb.com.ar",
        "direccion": "AV CALLAO 402",
        "ciudad": "CABA",
        "provincia": "BS AS",
        "tecnico": "-"
    },
    {
        "regional": "Melisa Castillo",
        "supervisor": "Camilo Silva",
        "local": "RAFAELA",
        "email": "rafaela@mostazaweb.com.ar",
        "direccion": "Sargento Cabral 95",
        "ciudad": "Rafaela",
        "provincia": "Santa Fe",
        "tecnico": "-"
    },
    {
        "regional": "Melisa Castillo",
        "supervisor": "Camilo Silva",
        "local": "RIBERA SANTA FE",
        "email": "santafe@mostazaweb.com.ar",
        "direccion": "shopping la ribera dique 1",
        "ciudad": "santa fe",
        "provincia": "Santa Fe",
        "tecnico": "-"
    },
    {
        "regional": "Melisa Castillo",
        "supervisor": "Camilo Silva",
        "local": "WALMART STA FE",
        "email": "wsantafe@mostazaweb.com.ar",
        "direccion": "Ruta 168 km",
        "ciudad": "santa fe",
        "provincia": "Santa Fe",
        "tecnico": "-"
    },
    {
        "regional": "Melisa Castillo",
        "supervisor": "Camilo Silva",
        "local": "SANTA FE P.",
        "email": "santafe4@mostazaweb.com.ar",
        "direccion": "San martin 2601",
        "ciudad": "santa fe",
        "provincia": "Santa Fe",
        "tecnico": "-"
    },
    {
        "regional": "Melisa Castillo",
        "supervisor": "Sabrina Orlando",
        "local": "PORTAL ROSARIO",
        "email": "portalrosario@mostazaweb.com.ar",
        "direccion": "NANSE 323",
        "ciudad": "ROSARIO",
        "provincia": "Santa Fe",
        "tecnico": "-"
    },
    {
        "regional": "Melisa Castillo",
        "supervisor": "Sabrina Orlando",
        "local": "PELLEGRINI",
        "email": "pellegrinirosario@mostazaweb.com.ar",
        "direccion": "Pellegrini 1431",
        "ciudad": "Rosario",
        "provincia": "Santa Fe",
        "tecnico": "-"
    },
    {
        "regional": "Melisa Castillo",
        "supervisor": "Sabrina Orlando",
        "local": "ROSARIO SUR",
        "email": "rosariosur@mostazaweb.com.ar",
        "direccion": "Avenida San Martin",
        "ciudad": "Rosario",
        "provincia": "Santa Fe",
        "tecnico": "-"
    },
    {
        "regional": "Melisa Castillo",
        "supervisor": "Sabrina Orlando",
        "local": "OROÑO",
        "email": "autoorono@mostazaweb.com.ar",
        "direccion": "Oroño 3120",
        "ciudad": "Rosario",
        "provincia": "Santa Fe",
        "tecnico": "-"
    },
    {
        "regional": "Melisa Castillo",
        "supervisor": "Sabrina Orlando",
        "local": "SAN NICOLAS",
        "email": "sannicolas@mostazaweb.com.ar",
        "direccion": "Mitre 449",
        "ciudad": "San Nicolás",
        "provincia": "Buenos Aires",
        "tecnico": "-"
    },
    {
        "regional": "Melisa Castillo",
        "supervisor": "Sabrina Orlando",
        "local": "PUMA",
        "email": "pumarosario@mostazaweb.com.ar",
        "direccion": "-",
        "ciudad": "-",
        "provincia": "-",
        "tecnico": "-"
    },
    {
        "regional": "Melisa Castillo",
        "supervisor": "Sabrina Orlando",
        "local": "FUNES",
        "email": "(No figura mail)",
        "direccion": "-",
        "ciudad": "-",
        "provincia": "-",
        "tecnico": "-"
    },
    {
        "regional": "Melisa Castillo",
        "supervisor": "Sabrina Orlando",
        "local": "ALTO ROSARIO",
        "email": "(No figura mail)",
        "direccion": "-",
        "ciudad": "-",
        "provincia": "-",
        "tecnico": "-"
    },
    {
        "regional": "Melisa Castillo",
        "supervisor": "Sabrina Orlando",
        "local": "CITY CENTER",
        "email": "(No figura mail)",
        "direccion": "-",
        "ciudad": "-",
        "provincia": "-",
        "tecnico": "-"
    },
    {
        "regional": "Melisa Castillo",
        "supervisor": "Ranquel Pereiro",
        "local": "GRAND BOURG",
        "email": "grandbourg@mostazaweb.com.ar",
        "direccion": "Av. Eva Duarte de Perón 1461",
        "ciudad": "Grand Bourg",
        "provincia": "Buenos Aires",
        "tecnico": "-"
    },
    {
        "regional": "Melisa Castillo",
        "supervisor": "Ranquel Pereiro",
        "local": "JOSE C PAZ",
        "email": "josecpaz@mostazaweb.com.ar",
        "direccion": "Hipólito Yrigoyen 1740",
        "ciudad": "José C Paz",
        "provincia": "Buenos Aires",
        "tecnico": "-"
    },
    {
        "regional": "Melisa Castillo",
        "supervisor": "Ranquel Pereiro",
        "local": "SAN MIGUEL 3",
        "email": "sanmiguel2@mostazaweb.com.ar",
        "direccion": "-",
        "ciudad": "-",
        "provincia": "-",
        "tecnico": "-"
    },
    {
        "regional": "Melisa Castillo",
        "supervisor": "Ranquel Pereiro",
        "local": "SAN MIGUEL A.",
        "email": "sanmiguelauto@mostazaweb.com.ar",
        "direccion": "ARTURO ILLIA 3811",
        "ciudad": "SAN MIGUEl",
        "provincia": "Buenos Aires",
        "tecnico": "-"
    },
    {
        "regional": "Melisa Castillo",
        "supervisor": "Ranquel Pereiro",
        "local": "F. ALVAREZ",
        "email": "franciscoalvarez@mostazaweb.com.ar",
        "direccion": "Gorriti 1077",
        "ciudad": "Moreno",
        "provincia": "BUENOS AIRES",
        "tecnico": "-"
    },
    {
        "regional": "Melisa Castillo",
        "supervisor": "Ranquel Pereiro",
        "local": "MORENO",
        "email": "moreno2@mostazaweb.com.ar",
        "direccion": "Bartolomé Mitre 2679",
        "ciudad": "MORENO",
        "provincia": "BUENOS AIRES",
        "tecnico": "-"
    },
    {
        "regional": "Melisa Castillo",
        "supervisor": "Ranquel Pereiro",
        "local": "LUJAN",
        "email": "lujan@mostazaweb.com.ar",
        "direccion": "AV SAN MARTIN 165",
        "ciudad": "LUJAN",
        "provincia": "Buenos Aires",
        "tecnico": "-"
    },
    {
        "regional": "Melisa Castillo",
        "supervisor": "Ranquel Pereiro",
        "local": "SAN LUIS",
        "email": "sanluis@mostazaweb.com.ar",
        "direccion": "balcarce 1485",
        "ciudad": "SAN LUIS",
        "provincia": "SAN LUIS",
        "tecnico": "-"
    },
    {
        "regional": "Melisa Castillo",
        "supervisor": "Ranquel Pereiro",
        "local": "CORRIENTES",
        "email": "corrientes1@mostazaweb.com.ar",
        "direccion": "Av. Raul Alfonsin 3525",
        "ciudad": "Corrientes",
        "provincia": "Corrientes",
        "tecnico": "-"
    },
    {
        "regional": "Melisa Castillo",
        "supervisor": "Ranquel Pereiro",
        "local": "RESISTENCIA",
        "email": "resistencia@mostazaweb.com.ar",
        "direccion": "Sta Maria de oro y Roca 99",
        "ciudad": "Resistencia",
        "provincia": "Chaco",
        "tecnico": "-"
    },
    {
        "regional": "Melisa Castillo",
        "supervisor": "Romina Bina",
        "local": "PARANA",
        "email": "entrerios@mostazaweb.com.ar",
        "direccion": "25 de mayo 70",
        "ciudad": "parana",
        "provincia": "Entre Rios",
        "tecnico": "-"
    },
    {
        "regional": "Melisa Castillo",
        "supervisor": "Laura Zapana",
        "local": "CARLOS PAZ",
        "email": "carlospaz@mostazaweb.com.ar",
        "direccion": "9 de julio 28",
        "ciudad": "Carlos Paz",
        "provincia": "Cordoba",
        "tecnico": "-"
    },
    {
        "regional": "Melisa Castillo",
        "supervisor": "Laura Zapana",
        "local": "PLAZA ESPAÑA",
        "email": "plazaespana@mostazaweb.com.ar",
        "direccion": "Av. Hipolito Yrigoyen 564",
        "ciudad": "CORDOBA",
        "provincia": "CORDOBA",
        "tecnico": "-"
    },
    {
        "regional": "Melisa Castillo",
        "supervisor": "Laura Zapana",
        "local": "RAFAEL NUÑEZ",
        "email": "(No figura mail)",
        "direccion": "-",
        "ciudad": "-",
        "provincia": "-",
        "tecnico": "-"
    }
];
