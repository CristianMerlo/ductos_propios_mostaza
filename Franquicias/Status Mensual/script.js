function dashboard() {
    return {
        currentSlide: 0,
        slides: [
            { id: 0, title: 'Inicio' },
            { id: 1, title: 'Seguimiento Mensual' },
            { id: 2, title: 'Alcance del Equipo' },
            { id: 3, title: 'Resumen Ejecutivo' },
            { id: 4, title: 'Comparativa Mensual' },
            { id: 5, title: 'Análisis por Categoría' },
            { id: 6, title: 'Fallas y Locales' },
            { id: 7, title: 'Cierre' }
        ],
        indicators: [],
        indColors: ['#DA291C', '#FFC72C', '#22c55e', '#3b82f6', '#a855f7', '#f97316'],
        topFallas: [],
        topSucursales: [],
        techList: [],
        maxFallaCount: 1,
        maxSucursalCount: 1,

        async init() {
            try {
                // DASHBOARD_DATA is loaded as a script in index.html
                const data = DASHBOARD_DATA;

                this.overallMetrics = data.overallMetrics;
                this.topFallas = data.topFallas;
                this.topSucursales = data.topSucursales;
                this.indicators = data.indicators;

                // Helper for progress bars
                this.maxFallaCount = Math.max(...this.topFallas.map(f => f.count), 1);
                this.maxSucursalCount = Math.max(...this.topSucursales.map(f => f.count), 1);

                // Tech list for UI
                this.techList = data.techWorkload.datasets.map(ds => ({
                    label: ds.label,
                    color: ds.backgroundColor,
                    total: ds.data.reduce((a, b) => a + b, 0)
                })).sort((a, b) => b.total - a.total);

                this.initCharts(data);
                this.initPerformanceCharts(); // New performance charts

                // Setup Intersection Observer for slide navigation
                this.setupIntersectionObserver();
            } catch (error) {
                console.error('Error loading dashboard data:', error);
            }
        },

        initCharts(data) {
            // 1. Monthly Indicators Chart (Multi-axis Trends)
            const ctxInd = document.getElementById('chartIndicators').getContext('2d');
            const indColors = this.indColors;

            const datasets = data.indicators.map((ind, i) => ({
                label: ind.label.toUpperCase(),
                data: ind.data,
                borderColor: indColors[i % indColors.length],
                backgroundColor: 'transparent',
                borderWidth: 4,
                tension: 0.4,
                pointRadius: 5,
                pointBackgroundColor: indColors[i % indColors.length],
                yAxisID: `y${i}`, // Assign unique Y axis to each indicator
            }));

            // Build independent scales for each Y axis
            const scales = {
                x: {
                    grid: { display: false },
                    ticks: { color: '#9ca3af', font: { weight: 'bold' } }
                }
            };

            // Initialize each Y axis hidden so trends are focus
            datasets.forEach((ds, i) => {
                scales[`y${i}`] = {
                    display: false, // Hide the axes to avoid clutter
                    grid: { display: i === 0, color: 'rgba(255,255,255,0.05)' },
                    position: 'left'
                };
            });

            new Chart(ctxInd, {
                type: 'line',
                data: {
                    labels: data.months,
                    datasets: datasets
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    layout: {
                        padding: {
                            left: 220, // Increased to avoid cutting off long labels
                            right: 40
                        }
                    },
                    interaction: {
                        mode: 'index',
                        intersect: false,
                    },
                    plugins: {
                        legend: {
                            display: false, // Custom labels used instead
                        },
                        tooltip: {
                            backgroundColor: 'rgba(0,0,0,0.9)',
                            titleFont: { size: 14, weight: 'bold' },
                            bodyFont: { size: 12 },
                            padding: 12,
                            borderColor: 'rgba(255,255,255,0.1)',
                            borderWidth: 1,
                            callbacks: {
                                label: function (context) {
                                    let label = context.dataset.label || '';
                                    if (label) label += ': ';
                                    const val = context.parsed.y;
                                    label += (val % 1 === 0 ? val : val.toFixed(2));
                                    return label;
                                }
                            }
                        }
                    },
                    scales: scales
                },
                plugins: [{
                    id: 'startLabels',
                    afterDraw: (chart) => {
                        const { ctx, chartArea: { left, bottom } } = chart;
                        ctx.save();
                        ctx.font = 'bold 9px "Roboto Condensed", sans-serif';
                        ctx.textAlign = 'right';
                        ctx.textBaseline = 'middle';

                        const labelPositions = [];

                        chart.data.datasets.forEach((dataset, i) => {
                            const meta = chart.getDatasetMeta(i);
                            const firstPoint = meta.data[0];
                            if (firstPoint && firstPoint.y !== undefined) {
                                labelPositions.push({
                                    label: dataset.label,
                                    y: firstPoint.y,
                                    color: dataset.borderColor
                                });
                            }
                        });

                        // Sort by Y for collision check
                        labelPositions.sort((a, b) => a.y - b.y);

                        // Collision detection (top to bottom)
                        const minGap = 15;
                        for (let i = 1; i < labelPositions.length; i++) {
                            if (labelPositions[i].y - labelPositions[i - 1].y < minGap) {
                                labelPositions[i].y = labelPositions[i - 1].y + minGap;
                            }
                        }

                        // Boundary check (bottom to top)
                        for (let i = labelPositions.length - 1; i >= 0; i--) {
                            if (labelPositions[i].y > bottom - 5) {
                                labelPositions[i].y = bottom - 5;
                            }
                            if (i > 0 && labelPositions[i].y - labelPositions[i - 1].y < minGap) {
                                labelPositions[i - 1].y = labelPositions[i].y - minGap;
                            }
                        }

                        labelPositions.forEach(pos => {
                            ctx.fillStyle = pos.color;
                            ctx.fillText(pos.label, left - 15, pos.y);

                            ctx.beginPath();
                            ctx.arc(left - 8, pos.y, 3, 0, 2 * Math.PI);
                            ctx.fill();
                        });

                        ctx.restore();
                    }
                }]
            });
        },

        initPerformanceCharts() {
            // Check if PERFORMANCE_DATA is loaded
            if (typeof PERFORMANCE_DATA === 'undefined') {
                console.warn('PERFORMANCE_DATA not loaded');
                return;
            }

            const perfData = PERFORMANCE_DATA;

            // 1. Weekly Performance Chart (Grouped Bars)
            const ctxWeekly = document.getElementById('chartWeeklyPerformance');
            if (ctxWeekly) {
                new Chart(ctxWeekly.getContext('2d'), {
                    type: 'bar',
                    data: {
                        labels: perfData.semanas.labels,
                        datasets: [
                            {
                                label: 'Creados',
                                data: perfData.semanas.creados,
                                backgroundColor: '#DA291C',
                                borderRadius: 4
                            },
                            {
                                label: 'Solucionados',
                                data: perfData.semanas.solucionados,
                                backgroundColor: '#10B981',
                                borderRadius: 4
                            }
                        ]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                display: true,
                                position: 'top',
                                labels: { color: '#fff', font: { weight: 'bold', size: 11 } }
                            },
                            tooltip: {
                                backgroundColor: 'rgba(0,0,0,0.9)',
                                titleFont: { size: 14, weight: 'bold' },
                                bodyFont: { size: 12 },
                                padding: 12
                            }
                        },
                        scales: {
                            x: {
                                grid: { display: false },
                                ticks: { color: '#9ca3af', font: { weight: 'bold' } }
                            },
                            y: {
                                grid: { color: 'rgba(255,255,255,0.05)' },
                                ticks: { color: '#9ca3af', font: { weight: 'bold' } },
                                beginAtZero: true
                            }
                        }
                    }
                });
            }

            // 2. Monthly Comparison Chart (Grouped Bars)
            const ctxComparativa = document.getElementById('chartComparativaMensual');
            if (ctxComparativa) {
                new Chart(ctxComparativa.getContext('2d'), {
                    type: 'bar',
                    data: {
                        labels: perfData.comparativaMensual.meses,
                        datasets: [
                            {
                                label: 'Recibidos',
                                data: perfData.comparativaMensual.recibidos,
                                backgroundColor: '#DA291C',
                                borderRadius: 6
                            },
                            {
                                label: 'Resueltos',
                                data: perfData.comparativaMensual.resueltos,
                                backgroundColor: '#10B981',
                                borderRadius: 6
                            }
                        ]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                display: true,
                                position: 'top',
                                labels: { color: '#fff', font: { weight: 'bold', size: 11 } }
                            },
                            tooltip: {
                                backgroundColor: 'rgba(0,0,0,0.9)',
                                titleFont: { size: 14, weight: 'bold' },
                                bodyFont: { size: 12 },
                                padding: 12,
                                callbacks: {
                                    afterBody: function (context) {
                                        if (context.length > 0) {
                                            const index = context[0].dataIndex;
                                            const recibidos = perfData.comparativaMensual.recibidos[index];
                                            const resueltos = perfData.comparativaMensual.resueltos[index];
                                            const pendientes = recibidos - resueltos;
                                            const eficiencia = ((resueltos / recibidos) * 100).toFixed(1);
                                            return [
                                                '',
                                                `Pendientes: ${pendientes}`,
                                                `Eficiencia: ${eficiencia}%`
                                            ];
                                        }
                                    }
                                }
                            }
                        },
                        scales: {
                            x: {
                                grid: { display: false },
                                ticks: { color: '#9ca3af', font: { weight: 'bold' } }
                            },
                            y: {
                                grid: { color: 'rgba(255,255,255,0.05)' },
                                ticks: { color: '#9ca3af', font: { weight: 'bold' } },
                                beginAtZero: true
                            }
                        }
                    }
                });
            }

            // 3. Categories Donut Chart
            const ctxDonut = document.getElementById('chartCategoriesDonut');
            if (ctxDonut) {
                new Chart(ctxDonut.getContext('2d'), {
                    type: 'doughnut',
                    data: {
                        labels: perfData.categorias.map(c => c.equipo),
                        datasets: [{
                            data: perfData.categorias.map(c => c.tickets),
                            backgroundColor: perfData.categorias.map(c => c.color),
                            borderWidth: 3,
                            borderColor: '#000'
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: true,
                        plugins: {
                            legend: {
                                display: true,
                                position: 'bottom',
                                labels: { color: '#fff', font: { weight: 'bold', size: 12 }, padding: 15 }
                            },
                            tooltip: {
                                backgroundColor: 'rgba(0,0,0,0.9)',
                                bodyFont: { size: 14, weight: 'bold' },
                                padding: 12,
                                callbacks: {
                                    label: function (context) {
                                        return context.label + ': ' + context.parsed + ' tickets';
                                    }
                                }
                            }
                        }
                    }
                });
            }

            // 3. Subcategories Bar Chart
            const ctxSubcat = document.getElementById('chartSubcategoriesBars');
            if (ctxSubcat) {
                new Chart(ctxSubcat.getContext('2d'), {
                    type: 'bar',
                    data: {
                        labels: perfData.categorias.map(c => c.equipo),
                        datasets: [{
                            label: 'Tickets',
                            data: perfData.categorias.map(c => c.tickets),
                            backgroundColor: perfData.categorias.map(c => c.color),
                            borderRadius: 6
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        indexAxis: 'y',
                        plugins: {
                            legend: { display: false },
                            tooltip: {
                                backgroundColor: 'rgba(0,0,0,0.9)',
                                titleFont: { size: 14, weight: 'bold' },
                                bodyFont: { size: 12 },
                                padding: 12
                            }
                        },
                        scales: {
                            x: {
                                grid: { color: 'rgba(255,255,255,0.05)' },
                                ticks: { color: '#9ca3af', font: { weight: 'bold' } },
                                beginAtZero: true
                            },
                            y: {
                                grid: { display: false },
                                ticks: { color: '#fff', font: { weight: 'bold', size: 11 } }
                            }
                        }
                    }
                });
            }

            // 4. Fallas Chart (Horizontal Bars)
            const ctxFallas = document.getElementById('chartFallas');
            if (ctxFallas) {
                new Chart(ctxFallas.getContext('2d'), {
                    type: 'bar',
                    data: {
                        labels: perfData.fallas.map(f => f.codigo + ' - ' + f.descripcion),
                        datasets: [{
                            label: 'Ocurrencias',
                            data: perfData.fallas.map(f => f.count),
                            backgroundColor: '#DA291C',
                            borderRadius: 6
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        indexAxis: 'y',
                        plugins: {
                            legend: { display: false },
                            tooltip: {
                                backgroundColor: 'rgba(0,0,0,0.9)',
                                titleFont: { size: 12, weight: 'bold' },
                                bodyFont: { size: 11 },
                                padding: 10
                            }
                        },
                        scales: {
                            x: {
                                grid: { color: 'rgba(255,255,255,0.05)' },
                                ticks: { color: '#9ca3af', font: { weight: 'bold' } },
                                beginAtZero: true
                            },
                            y: {
                                grid: { display: false },
                                ticks: { color: '#fff', font: { weight: 'bold', size: 10 } }
                            }
                        }
                    }
                });
            }

            // 5. Top Locales Chart (Horizontal Bars)
            const ctxLocales = document.getElementById('chartTopLocales');
            if (ctxLocales) {
                new Chart(ctxLocales.getContext('2d'), {
                    type: 'bar',
                    data: {
                        labels: perfData.topLocales.map(l => l.nombre),
                        datasets: [{
                            label: 'Tickets',
                            data: perfData.topLocales.map(l => l.tickets),
                            backgroundColor: '#FFC72C',
                            borderRadius: 6
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        indexAxis: 'y',
                        plugins: {
                            legend: { display: false },
                            tooltip: {
                                backgroundColor: 'rgba(0,0,0,0.9)',
                                titleFont: { size: 14, weight: 'bold' },
                                bodyFont: { size: 12 },
                                padding: 12
                            }
                        },
                        scales: {
                            x: {
                                grid: { color: 'rgba(255,255,255,0.05)' },
                                ticks: { color: '#9ca3af', font: { weight: 'bold' } },
                                beginAtZero: true
                            },
                            y: {
                                grid: { display: false },
                                ticks: { color: '#fff', font: { weight: 'bold', size: 11 } }
                            }
                        }
                    }
                });
            }
        },

        setupIntersectionObserver() {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const id = entry.target.id;
                        this.currentSlide = parseInt(id.replace('slide-', ''));
                    }
                });
            }, { threshold: 0.5 });

            document.querySelectorAll('.slide').forEach(section => observer.observe(section));
        },

        handleScroll() {
            // Handled by observer
        }
    }
}
