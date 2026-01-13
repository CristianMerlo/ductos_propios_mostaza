// Datos de Desempeño - Diciembre 2024
const PERFORMANCE_DATA = {
    // KPIs Principales
    kpis: {
        totalTickets: 364,
        localesAtendidos: 51,
        avgDiasSolucion: 4.15,
        cumplimiento: 98.4
    },

    // Volumen Semanal (Semanas 49-53)
    semanas: {
        labels: ['S49', 'S50', 'S51', 'S52', 'S53'],
        creados: [92, 92, 92, 64, 24],
        solucionados: [92, 92, 90, 64, 20]
    },

    // Categorías de Equipos
    categorias: [
        { equipo: 'Cafeteras Cimbali', tickets: 353, color: '#DA291C' },
        { equipo: 'Cafeteras Melita', tickets: 9, color: '#FFC72C' },
        { equipo: 'Máquina de Hielo', tickets: 2, color: '#155E75' }
    ],

    // Top 15 Locales
    topLocales: [
        { nombre: 'Quilmes Peatonal', tickets: 26 },
        { nombre: 'Berazategui', tickets: 20 },
        { nombre: 'Boedo', tickets: 18 },
        { nombre: 'Primera Junta', tickets: 16 },
        { nombre: 'Palmas del Pilar', tickets: 15 },
        { nombre: 'San Justo', tickets: 12 },
        { nombre: 'Morón', tickets: 11 },
        { nombre: 'Lomas de Zamora', tickets: 10 },
        { nombre: 'Caballito', tickets: 9 },
        { nombre: 'Flores', tickets: 8 },
        { nombre: 'Avellaneda', tickets: 8 },
        { nombre: 'Lanús', tickets: 7 },
        { nombre: 'Banfield', tickets: 7 },
        { nombre: 'Quilmes Centro', tickets: 6 },
        { nombre: 'San Martín', tickets: 6 }
    ],

    // Fallas Principales
    fallas: [
        { codigo: 'ER 021/022', descripcion: 'Anomalía en movimiento de las muelas', count: 113 },
        { codigo: 'ER 033/034', descripcion: 'Válvula de agua', count: 47 },
        { codigo: 'OTRAS', descripcion: 'Otras fallas', count: 47 },
        { codigo: 'ER 062/065', descripcion: 'Filtros / Sensor de agua', count: 34 },
        { codigo: 'ER 003', descripcion: 'Cámara fuera de posición', count: 28 }
    ]
};
