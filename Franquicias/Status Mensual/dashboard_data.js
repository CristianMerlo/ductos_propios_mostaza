const DASHBOARD_DATA = {
  "monthlyEvolution": [
    {
      "month": "JAN",
      "total": 1,
      "solved": 0,
      "pending": 1,
      "sla": 0
    },
    {
      "month": "DEC",
      "total": 165,
      "solved": 165,
      "pending": 0,
      "sla": 1.82
    }
  ],
  "topFallas": [
    {
      "incidencia": "ER 021  y 022 - Anomalía en movimiento de las muelas",
      "count": 48
    },
    {
      "incidencia": "ER 033 y 034 - Falla de válvula, revisar según error",
      "count": 21
    },
    {
      "incidencia": "Otras fallas, indicar número de falla",
      "count": 21
    },
    {
      "incidencia": "ER 062 a 065 - Calibrar equipo, filtros obstruidos o falla sensor, según error",
      "count": 17
    },
    {
      "incidencia": "ER 003 - Cámara fuera de posición, maquina bloqueada",
      "count": 13
    }
  ],
  "topSucursales": [
    {
      "sucursal": "Quilmes Peatonal",
      "count": 11
    },
    {
      "sucursal": "Berazategui",
      "count": 9
    },
    {
      "sucursal": "Primera Junta",
      "count": 8
    },
    {
      "sucursal": "Boedo",
      "count": 8
    },
    {
      "sucursal": "Cabildo",
      "count": 7
    }
  ],
  "techWorkload": {
    "labels": [
      "JAN",
      "DEC"
    ],
    "datasets": [
      {
        "label": "Lucas Ale",
        "data": [
          0,
          32
        ],
        "backgroundColor": "#DA291C"
      },
      {
        "label": "Bruno Leyes",
        "data": [
          0,
          22
        ],
        "backgroundColor": "#FFC72C"
      },
      {
        "label": "Mauro Husak",
        "data": [
          0,
          29
        ],
        "backgroundColor": "#22c55e"
      },
      {
        "label": "Pablo Aviles",
        "data": [
          0,
          33
        ],
        "backgroundColor": "#3b82f6"
      },
      {
        "label": "Cristian Merlo",
        "data": [
          0,
          13
        ],
        "backgroundColor": "#a855f7"
      },
      {
        "label": "Nicolas Franco",
        "data": [
          0,
          24
        ],
        "backgroundColor": "#f97316"
      },
      {
        "label": "Nahuel Loubiere",
        "data": [
          0,
          7
        ],
        "backgroundColor": "#06b6d4"
      }
    ]
  },
  "indicators": [
    {
      "label": "Horas Tecnico MO realizadas",
      "data": [
        84.0,
        83.0,
        92.0,
        78.0,
        123.0,
        91.0,
        100.0,
        209.0,
        452.0
      ]
    },
    {
      "label": "Tecnicos disponibles en campo",
      "data": [
        3.0,
        3.0,
        3.0,
        3.0,
        3.0,
        2.0,
        2.0,
        4.0,
        5.0
      ]
    },
    {
      "label": "tecnico en taller exclusivo cafeteras",
      "data": [
        1.0,
        1.0,
        1.0,
        1.0,
        0.0,
        1.0,
        1.0,
        0.0,
        1.0
      ]
    },
    {
      "label": "Tickets a cargo de proveedor (Flexsol)",
      "data": [
        0.0,
        0.0,
        0.0,
        0.0,
        7.0,
        35.0,
        18.0,
        9.0,
        3.0
      ]
    },
    {
      "label": "Tickets de otros equipos o tareas",
      "data": [
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        5.0,
        10.0
      ]
    },
    {
      "label": "Facturacion MO (USD)",
      "data": [
        1825.0,
        1725.0,
        1925.0,
        1876.0,
        3075.0,
        2275.0,
        2500.0,
        5225.0,
        11100.0
      ]
    }
  ],
  "regularTasks": [
    "Reparacion de cafeteras Cimbali",
    "Reparacion de cafeteras Melitta",
    "Atencion de freezers",
    "Atencion de hornos",
    "Atencion de Cattabriga - Taylor",
    "Reparacion de Planchas",
    "Instalacion de carteles",
    "adecuaciones en broilers",
    "pendientes edilicios especificos",
    "gestion de servicios de proveedores especificos y servicios",
    "Instalaciones pre y post apertura",
    "Cobertura de garantias",
    "Relevamiento de equipamientos y estado por local",
    "Soporte remoto para provincias",
    "Apoyo a Propios en pendientes y emergencias"
  ],
  "months": [
    "ABRIL",
    "MAYO",
    "JUNIO",
    "JULIO",
    "AGOSTO",
    "SEPTIEMBRE",
    "OCTUBRE",
    "NOVIEMBRE",
    "DICIEMBRE"
  ],
  "overallMetrics": {
    "totalTickets": 364,
    "totalHours": 452,
    "avgSLA": 4.15
  }
};