// script.js

// --- 1. DATOS (Base de Datos simulada desde CSV) ---
const csvRaw = `LOCAL;REGION;LOCAL;Frecuencia;Proveedor;Enero;Febrero;Marzo;Abril;Mayo;Junio;Julio;Agosto;Septiembre;Octubre;Noviembre;Diciembre
MWG;Yanina Solano;WALMART GUAYMALLEN;Trimestral;QZ;;;;;;;;;;;;
MBM;Yanina Solano;BARRACAS MALL;Mensual;QZ;;;;;;;;;;;;
MML;Yanina Solano;LUJAN DE CUYO;Trimestral;QZ;;;;;;;;;;;;
MMZ;Yanina Solano;MENDOZA ;Mensual;QZ;;;;;;;;;;;;
MAM ;Yanina Solano;ARENA MAIPU;Trimestral;QZ;;;;;;;;;;;;
MAE;Yanina Solano;AEROPARQUE  ;Mensual;QZ;;;;;;;;;;;;
MDO;Yanina Solano;DOT;Trimestral;QZ;;;;;;;;;20-sept;;;
MVZ;Yanina Solano;CARREFOUR VELEZ;Bimestral;CR;;;;;;;;;;9-oct;MARTES 11/11;
MCW;Yanina Solano;WARNES;Bimestral;CR;;;;;;;;;22-sept;;;
MST;Yanina Solano;SAN MARTIN;Bimestral;CR;;;;;;;;;LOCAL CERRADO POR FALTA DE GAS;;;
MNC;Yanina Solano;NORCENTER ;Bimestral;CR;;;;;;;;;CANCELADO porque es ducto nuevo;;;
MOT;Yanina Solano;TORTUGUITA;Bimestral;CR;;;;;;;;;HABIA  OTRO PROVEEDOR EN EL LOCAL;;;
MSF;Yanina Solano;SOLEIL;Bimestral;CR;;;;;;;;;CANCELADO-LO REALIZA EL SHOPPING;;;
MPP;Yanina Solano;PASEO PILAR;Bimestral;CR;;;;;;;;;7-sept;;MARTES 04/11;
MBP;Yanina Solano;PACHECO;Bimestral;CR;;;;;;;;;24-sept;;JUEVES 06/11;
MCT;Yanina Solano;CONSTITUYENTES;Bimestral;CR;;;;;;;;;25-sept;;;
MDV;Yanina Solano;DEVOTO;Bimestral;CR;;;;;;;;;26-sept;;;
MPA;Yanina Solano;PANAMERICANA;Bimestral;CR;;;;;;;;;CANCELADO POR SOFIA;;;
MSN;Yanina Solano;SALTA;Trimestral;Asignar Proveedor;;;;;;;;;;;;
MUN;Yanina Solano;UNICENTER;Bimestral;CR;;;;;;;;;CANCELADO-LO REALIZA EL SHOPPING;;CANCELADO;
MCB;Yanina Solano;CASEROS;Bimestral;CR;;;;;;;;;18-sept;;LUNES 10/11;
MPF;Yanina Solano;PUERTO DE FRUTO;Bimestral;CR;;;;;;;;;8-sept;;VIERNES 07/11;
MTC;Yanina Solano;TIGRE CALLE;Bimestral;CR;;;;;;;;;CANCELADO-LO REALIZA EL SHOPPING;;LUNES 03/11;
MPAT;Yanina Solano;197;Bimestral;CR;;;;;;;;;9-sept;;MIERCOLES 05/11;
MLA;GIMENA CONTE;NEUQUEN  3 ( LA ANONIMA );Mensual;Qz;;;;;;;;;;;;
MNA;GIMENA CONTE;NEUQUEN 2  ALTO COMAHUE ;Mensual;Qz;;;;;;;;;;;;
MNQ;GIMENA CONTE;NEUQUEN  1;Mensual;Qz;;;;;;;;;;;;
MWN;GIMENA CONTE;NEUQUEN  4  ( WALMART );Mensual;Qz;;;;;;;;;;;;
MAN;GIMENA CONTE;NEUQUEN AUTO;Mensual;Qz;;;;;;;;;;;;
MMH;GIMENA CONTE;HAEDO AUTO;Bimestral;JTC;;;;;;;;;19-sept;;;
MAR;GIMENA CONTE;ALTO ROSARIO ;Mensual;Qz;;;;;;;;;;;;
MCR;GIMENA CONTE;CITY ROSARIO   ;Trimestral;Qz;;;;;;;;;;;;
MNI;Gimena Conte;NINE;Bimestral;JTC;;;;;;;;;10-sept;;;
MMVP;Gimena Conte;MORON;Bimestral;JTC;;;;;;;;;30-sept;;;
MPO;GIMENA CONTE;PLAZA OESTE;Bimestral;JTC;;;;;;;;;10-sept;;;
MSM;Gimena Conte;SAN MIGUEL 1;Bimestral;CR;;;;;;;;;6-sept;;;
MLU;GIMENA CONTE;LUJAN 2;Bimestral;JTC;;;;;;;;;15-sept;;;
MCS;Gimena Conte;SAN JUSTO 4;Bimestral;JTC;;;;;;;;;19-sept;;;
MGC;Gimena Conte;CATAN;Bimestral;JTC;;;;;;;;;5-sept;;;
MSJ;Gimena Conte;SAN JUSTO 1 ;Mensual;JTC;;;;;;;;;12-sept;;;
MTA;Gimena Conte;TABLADA;Bimestral;JTC;;;;;;;;;30-sept;;;
MWS;Gimena Conte;SAN JUSTO 2;Bimestral;JTC;;;;;;;;;15-sept;;;
MEP;Gimena Conte;PARANÁ;Trimestral;Qz;;;;;;;;;3-sept;;;
MLE;GIMENA CONTE;PARQUE LELOIR;Mensual;JTC;;;;;;;;;12-sept;;;
MCM;Gimena Conte;MORENO 1;Bimestral;JTC;;;;;;;;;30-sept;;;
MIVP;GIMENA CONTE;ITUZAINGO;Bimestral;JTC;;;;;;;;;16-sept;;;
MCC;Jesica Espinoza;COMODORO CENTRO;Mensual;Servicios Integrales;;;;;;;;;;;;
MWC;Jesica Espinoza;COMODORO RIVADAVIA  ;Mensual;Servicios Integrales;;;;;;;;;;;;
MCH;Jesica Espinoza;Comodoro Auto;Mensual;Servicios Integrales;;;;;;;;;;;;
MCA;Jesica Espinoza;CARREFOUR AVELLANEDA ;Bimestral;JTC;;;;;;;;;18-sept;LUNES 20/10;;
AFA;Jesica Espinoza;AMERICAN FAVS;Mensual;Qz;;;;;;;;;;;;
MAA;Jesica Espinoza;ALTO AVELLANEDA ;Mensual;Qz;;;;;;;;;;;;
MOC;Jesica Espinoza;MADERO 2;Mensual;JTC;;;;;;;;;;LUNES 10/11;;
MPD;Jesica Espinoza;MADERO 3;Bimestral;JTC;;;;;;;;;17-sept;MIERCOLES 15/10;;
MMA;Jesica Espinoza;MADRYN;Trimestral;Qz;;;;;;;;;Cotizando;;;
MTR;Jesica Espinoza;TRELEW;Bimestral;JTC;;;;;;;;;Cotizando;;;
MLT;Jesica Espinoza;LAS TOSCAS ;Mensual;JTC;;;;;;;;;16-sept;MARTES 28/10;;
MBO;Jesica Espinoza;BOULEVARD;Bimestral;JTC;;;;;;;;;19-sept;NO SE REALIZO-PROBLEMAS CON LA ADMINISTRACCION DEL SHOPPING-VISITA FALLIDA;;
MLO;Jesica Espinoza;LOMITAS ;Bimestral;JTC;;;;;;;;;8-sept;LUNES 13/10;;
MPL;Jesica Espinoza;PORTAL LOMAS ;Mensual;JTC;;;;;;;;;13-sept;MIERCOLES 08/10;;
MBB;Jesica Espinoza;Bahia Blanca;Bimestral;JTC;;;;;;;;;Cotizando;;;
MQM;Jesica Espinoza;QUILMES  JUMBO ;Mensual;JTC;;;;;;;;;17-sept;JUEVES 09/10;;
MAU;Jesica Espinoza;SARANDI;Bimestral;JTC;;;;;;;;;10-sept;LUNES 06/10;;
MVA;Jesica Espinoza;VARELA ;Bimestral;JTC;;;;;;;;;16-sept;MIERCOLES 29/10;;
MLP;Jesica Espinoza;LA PLATA ;Bimestral;JTC;;;;;;;;;11-sept;MARTES 21/10;;
MDB;Jesica Espinoza;DOLORES;Bimestral;JTC;;;;;;;;;Cotizando;MIERCOLES 29/10;;
MSB;Jesica Espinoza;BAHIA SHOPPING;Bimestral;JTC;;;;;;;;;Cotizando;;;
MLZ;Jesica Espinoza;LOMAS CENTRO;Bimestral;JTC;;;;;;;;;26-sept;JUEVES 16/10;;
MPIL;Jesica Espinoza;LA PLATA 5;Bimestral;JTC;;;;;;;;;17-sept;MARTES 21/10;;
MLC;Pablo Baena;AV LA PLATA CALLE;Bimestral;JTC;;;;;;;;;21-oct;MIERCOLES 15/10;;
MLAA;Jesica Espinoza;LANUS AUTO;Bimestral;JTC;;;;;;;;;4-sept;JUEVES 16/10;;
MAC;Pablo Baena;ACOYTE;Mensual;JTC;;;;;;;;;18-sept;LUNES 20/10;;
MVC;Pablo Baena;CABALLITO ;Bimestral;CR;;;;;;;;;CANCELADO-LO REALIZA EL SHOPPING;;;
MDI;Pablo Baena;DIAGONAL ;Bimestral;JTC;;;;;;;;;23-sept;MIERCOLES 22/10;;
MC9;Pablo Baena;PELLEGRINI BS AS ;Bimestral;JTC;;;;;;;;;18-sept;JUEVES 30/10;;
MCO;Pablo Baena;CORRIENTES Y 9 DE JULIO ;Bimestral;JTC;;;;;;;;;25-sept;JUEVES 23/10;;
MF2;Pablo Baena;FLORIDA 2;Bimestral;JTC;;;;;;;;;23-sept;JUEVES 23/10;;
MGP;Pablo Baena;GALERIAS PACIFICO   ;Bimestral;CR;;;;;;;;;12-sept;;;
MPT;Pablo Baena;TUCUMAN 1;Trimestral;Asignar Proveedor;;;;;;;;;;;;
MRM;Pablo Baena;RECOLETA ;Bimestral;CR;;;;;;;;;17-sept;;;
MCG;Pablo Baena;CORDOBA GENERAL PAZ  ;Mensual;CMC;;;;;;;;;;;7-nov;
MCL;Pablo Baena;PASEO LIBERTAD;Mensual;CMC;;;;;;;;;;;28-nov;
MRC;Pablo Baena;RIO CUARTO;Mensual;CMC;;;;;;;;;;;21-nov;
MCP;Pablo Baena;PATIO OLMOS ;Mensual;CMC;;;;;;;;;;;13-nov;
MCV;Pablo Baena;VILLA CABRERA ;Mensual;CMC;;;;;;;;;;;18-nov;
MSC;Pablo Baena;NUEVO CENTRO;Mensual;CMC;;;;;;;;;;;5-nov;
MJC;Pablo Baena;SHOPPING JOCKEY CLUB;Mensual;CMC;;;;;;;;;;;10-nov;
MMP;Pablo Baena;MOSTAZA POSADAS;Trimestral;QZ;;;;;;;;;;;;
MAT;Pablo Baena;MATADERO;Bimestral;JTC;;;;;;;;;LO REALIZO CR;MARTES 28/10;;
MAB;Pablo Baena;ABASTO;Bimestral;CR;;;;;;;;;CANCELADO-LO REALIZA EL SHOPPING;;CANCELADO;
MAP;Pablo Baena;ALTO PALERMO;Bimestral;CR;;;;;;;;;CANCELADO;;VIERNES 14/11;
MCJ;Pablo Baena;JUAN B JUSTO   ;Bimestral;JTC;;;;;;;;;29-sept;LUNES 27/10;;
MJS;Pablo Baena;TRENES;Mensual;JTC;;;;;;;;;26-sept;Se esta esperando el ok de la administraccion;;
MPB;Pablo Baena;PARQUE BROWN;Bimestral;CR;;;;;;;;;CANCELADO;;CANCELADO;
MPC;Pablo Baena;CENTENARIO;Bimestral;JTC;;;;;;;;;25-sept;JUEVES 30/10;;
MT1;Pablo Baena;FOOD TRUCK;VARIABLE;JTC;;;;;;;;;;;;
MMC;Pablo Baena;Posadas Calle;Trimestral;QZ;;;;;;;;;;;;
MT2;JESICA ESPINOZA;FOOD TRUCK;VARIABLE;QZ;;;;;;;;;;;;`;

// --- DATOS DETALLADOS (desde Excel) ---
const detailedData = {
  "AFA": {
    local: "AMERICAN FAVS",
    frecuencia: "Mensual",
    proveedor: "Qz",
    complejo: "SHOPPING ALTO AVELLANEDA",
    direccion: "Guemes 897 (Local 206) Avellaneda CP 1870",
    zona: "SUR",
    localidad: "AVELLANEDA",
    provincia: "BUENOS AIRES",
    cp: "",
    razon_social: "MOSTAZA Y PAN S.A.",
    mail: "am.favs@outlook.com",
    gerente: "Soraya Morales",
    tel_gerente: "1122517663",
    supervisor_interno: "Damian Riquelme",
    region: "Jesica Espinoza",
  },
  "MAA": {
    local: "ALTO AVELLANEDA",
    frecuencia: "Mensual",
    proveedor: "Qz",
    complejo: "SHOPPING ALTO AVELLANEDA",
    direccion: "Gral. Güemes 897",
    zona: "SUR",
    localidad: "AVELLANEDA",
    provincia: "BUENOS AIRES",
    cp: "B1873BOC",
    razon_social: "MOSTAZA Y PAN S.A.",
    mail: "altoavellaneda@mostazaweb.com.ar",
    gerente: "EZEQUIEL SANCHEZ",
    tel_gerente: "1158249033",
    supervisor_interno: "Damian Riquelme",
    region: "Jesica Espinoza",
  },
  "MAB": {
    local: "ABASTO",
    frecuencia: "Bimestral",
    proveedor: "CR",
    complejo: "SHOPPING ABASTO",
    direccion: "Av. Corrientes 3247",
    zona: "CABA",
    localidad: "CABA",
    provincia: "BUENOS AIRES",
    cp: "C1193AAE",
    razon_social: "MOSTAZA Y PAN S.A.",
    mail: "abasto@mostazaweb.com.ar",
    gerente: "Cecilia Soto",
    tel_gerente: "1134253161",
    supervisor_interno: "Pablo Cozzo",
    region: "Pablo Baena",
  },
  "MAC": {
    local: "ACOYTE",
    frecuencia: "Mensual",
    proveedor: "JTC",
    complejo: "VIA PUBLICA",
    direccion: "Av. Rivadavia 4994",
    zona: "CABA",
    localidad: "CABA",
    provincia: "BUENOS AIRES",
    cp: "1406",
    razon_social: "MOSTAZA Y PAN S.A.",
    mail: "acoyte@mostazaweb.com.ar",
    gerente: "MICAELA GUTIERREZ",
    tel_gerente: "1156620817",
    supervisor_interno: "Pablo Cozzo",
    region: "Pablo Baena",
  },
  "MAE": {
    local: "AEROPARQUE",
    frecuencia: "Mensual",
    proveedor: "QZ",
    complejo: "AEROPARQUE",
    direccion: "AV.COSTANERA RAFAEL OBLIGADO S/N",
    zona: "CABA",
    localidad: "CABA",
    provincia: "BUENOS AIRES",
    cp: "1425",
    razon_social: "MOSTAZA Y PAN S.A.",
    mail: "aeroparque@mostazaweb.com.ar",
    gerente: "FLORENCIA OTRERAS",
    tel_gerente: "1170328988",
    supervisor_interno: "Sofia Sas",
    region: "Yanina Solano",
  },
  "MAM": {
    local: "ARENA MAIPU",
    frecuencia: "Trimestral",
    proveedor: "QZ",
    complejo: "SHOPPING ARENA MAIPU",
    direccion: "EMILIO CIVIT 791 , MAIPU , MENDOZA",
    zona: "INTERIOR",
    localidad: "",
    provincia: "",
    cp: "",
    razon_social: "",
    mail: "arenamaipu@mostazaweb.com.ar",
    gerente: "Leandro Micelli",
    tel_gerente: "2615578910",
    supervisor_interno: "GUILLERMINA GARIS",
    region: "Yanina Solano",
  },
  "MAN": {
    local: "NEUQUEN AUTO",
    frecuencia: "Mensual",
    proveedor: "Qz",
    complejo: "VIA PUBLICA",
    direccion: "Perticonne 215",
    zona: "INTERIOR",
    localidad: "",
    provincia: "",
    cp: "",
    razon_social: "",
    mail: "perticone@mostazaweb.com.ar",
    gerente: "GISELLA RAMIREZ",
    tel_gerente: "1169055713",
    supervisor_interno: "JOHANA GONZALEZ",
    region: "GIMENA CONTE",
  },
  "MAP": {
    local: "ALTO PALERMO",
    frecuencia: "Bimestral",
    proveedor: "CR",
    complejo: "SHOPPING ALTO PALERMO",
    direccion: "Av. Santa Fé 3253",
    zona: "CABA",
    localidad: "CABA",
    provincia: "BUENOS AIRES",
    cp: "C1425",
    razon_social: "MOSTAZA Y PAN S.A.",
    mail: "altopalermo@mostazaweb.com.ar",
    gerente: "Lucia Padia",
    tel_gerente: "2944700183",
    supervisor_interno: "Erica Luna",
    region: "Pablo Baena",
  },
  "MAR": {
    local: "ALTO ROSARIO",
    frecuencia: "Mensual",
    proveedor: "Qz",
    complejo: "SHOPPING ALTO ROSARIO",
    direccion: "JUNIN 501",
    zona: "INTERIOR",
    localidad: "ROSARIO",
    provincia: "SANTA FE",
    cp: "S2000DJK",
    razon_social: "MOSTAZA Y PAN S.A.",
    mail: "altorosario@mostazaweb.com.ar",
    gerente: "CINTHIA SOSA",
    tel_gerente: "3413662666",
    supervisor_interno: "MILAGROS SANCHEZ",
    region: "GIMENA CONTE",
  },
  "MAT": {
    local: "ALBERDI",
    frecuencia: "Bimestral",
    proveedor: "JTC",
    complejo: "VIA PUBLICA - AUTO",
    direccion: "Av. Juan Bautista Alberdi 7401",
    zona: "OESTE",
    localidad: "MATADEROS",
    provincia: "BUENOS AIRES",
    cp: "1440",
    razon_social: "MOSTAZA Y PAN S.A.",
    mail: "alberdi@mostazaweb.com.ar",
    gerente: "Claudia Ramirez",
    tel_gerente: "11 23778688",
    supervisor_interno: "Pablo Cozzo",
    region: "Pablo Baena",
  },
  "MAU": {
    local: "SARANDI",
    frecuencia: "Bimestral",
    proveedor: "JTC",
    complejo: "WALMART SARANDI",
    direccion: "Au. Bs. As- La Plata km 9",
    zona: "SUR",
    localidad: "SARANDI",
    provincia: "BUENOS AIRES",
    cp: "B1870",
    razon_social: "MOSTAZA Y PAN S.A.",
    mail: "walmartsarandi@mostazaweb.com.ar",
    gerente: "Sofia Decker",
    tel_gerente: "1169075371",
    supervisor_interno: "Yesica Zarate",
    region: "Jesica Espinoza",
  },
  "MBB": {
    local: "Bahia Blanca",
    frecuencia: "Bimestral",
    proveedor: "JTC",
    complejo: "VIA PUBLICA",
    direccion: "O Higgins 40",
    zona: "INTERIOR",
    localidad: "BAHIA BLANCA",
    provincia: "BUENOS AIRES",
    cp: "8000",
    razon_social: "MOSTAZA Y PAN S.A.",
    mail: "bblanca@mostazaweb.com.ar",
    gerente: "FLORENCIA TOBARES",
    tel_gerente: "2915275298",
    supervisor_interno: "Romina De Luca",
    region: "Jesica Espinoza",
  },
  "MBM": {
    local: "BARRACAS MALL",
    frecuencia: "Mensual",
    proveedor: "QZ",
    complejo: "SHOPPING BARRACAS MALL",
    direccion: "LAS CAÑAS 1833",
    zona: "INTERIOR",
    localidad: "DORREGO",
    provincia: "MENDOZA",
    cp: "5519",
    razon_social: "MOSTAZA Y PAN S.A.",
    mail: "barracamall@mostazaweb.com.ar",
    gerente: "DIEGO GOMEZ",
    tel_gerente: "1176351568",
    supervisor_interno: "GUILLERMINA GARIS",
    region: "Yanina Solano",
  },
  "MBO": {
    local: "BOULEVARD",
    frecuencia: "Bimestral",
    proveedor: "JTC",
    complejo: "SHOPPING BOULEVARD",
    direccion: "H. Yrigoyen 13298",
    zona: "SUR",
    localidad: "ADROGUE",
    provincia: "BUENOS AIRES",
    cp: "B1846",
    razon_social: "MOSTAZA Y PAN S.A.",
    mail: "boulevard@mostazaweb.com.ar",
    gerente: "TATIANA SZUKAILO",
    tel_gerente: "1135705560",
    supervisor_interno: "Romina De Luca",
    region: "Jesica Espinoza",
  },
  "MBP": {
    local: "PACHECO",
    frecuencia: "Bimestral",
    proveedor: "CR",
    complejo: "VIA PUBLICA",
    direccion: "Av. Hipólito Yrigoyen 816, Gral. Pacheco, Provincia de Buenos Aires",
    zona: "NORTE",
    localidad: "",
    provincia: "",
    cp: "",
    razon_social: "",
    mail: "pacheco@mostazaweb.com.ar",
    gerente: "BARBARA PORTILLO",
    tel_gerente: "1165947260",
    supervisor_interno: "Yamila Varano",
    region: "Yanina Solano",
  },
  "MC9": {
    local: "PELLEGRINI BS AS",
    frecuencia: "Bimestral",
    proveedor: "JTC",
    complejo: "VIA PUBLICA",
    direccion: "Córdoba 998",
    zona: "CABA",
    localidad: "CABA",
    provincia: "BUENOS AIRES",
    cp: "1107",
    razon_social: "MOSTAZA Y PAN S.A.",
    mail: "pellegrini@mostazaweb.com.ar",
    gerente: "JHONATHAN RODRIGUEZ",
    tel_gerente: "1127675645",
    supervisor_interno: "Joaquin Aquino",
    region: "Pablo Baena",
  },
  "MCA": {
    local: "CARREFOUR AVELLANEDA",
    frecuencia: "Bimestral",
    proveedor: "JTC",
    complejo: "CARREFOUR AVELLANEDA",
    direccion: "Av Pres Hipolito de Irigoyen 299",
    zona: "SUR",
    localidad: "AVELLANEDA",
    provincia: "BUENOS AIRES",
    cp: "B1870BLC",
    razon_social: "MOSTAZA Y PAN S.A.",
    mail: "carrefouravellaneda@mostazaweb.com.ar",
    gerente: "Brisa Zamorano",
    tel_gerente: "1123195688",
    supervisor_interno: "Yesica Zarate",
    region: "Jesica Espinoza",
  },
  "MCB": {
    local: "CASEROS",
    frecuencia: "Bimestral",
    proveedor: "CR",
    complejo: "VIA PUBLICA",
    direccion: "Justo José de Urquiza 4751",
    zona: "NORTE",
    localidad: "CASEROS",
    provincia: "BUENOS AIRES",
    cp: "",
    razon_social: "MOSTAZA Y PAN S.A.",
    mail: "caseros@mostazaweb.com.ar",
    gerente: "REBECCA PRADO",
    tel_gerente: "1139527448",
    supervisor_interno: "Micaela Moreno",
    region: "Yanina Solano",
  },
  "MCC": {
    local: "COMODORO CENTRO",
    frecuencia: "Mensual",
    proveedor: "Servicios Integrales",
    complejo: "VIA PUBLICA",
    direccion: "SAN MARTIN 401",
    zona: "INTERIOR",
    localidad: "COMODORO RIVADAVIA",
    provincia: "CHUBUT",
    cp: "U9000",
    razon_social: "GASTRO MANANGEMENT GROUP S.A.",
    mail: "comodorocentro@mostazaweb.com.ar",
    gerente: "Rocio Arzaroli",
    tel_gerente: "1134515690",
    supervisor_interno: "Bruno Ureta",
    region: "Jesica Espinoza",
  },
  "MCG": {
    local: "CORDOBA GENERAL PAZ",
    frecuencia: "Mensual",
    proveedor: "CMC",
    complejo: "via publica",
    direccion: "AV.GENERAL PAZ 123",
    zona: "INTERIOR",
    localidad: "CAPITAL",
    provincia: "CORDOBA",
    cp: "X5022",
    razon_social: "MOSTAZA Y PAN S.A.",
    mail: "generalpaz@mostazaweb.com.ar",
    gerente: "Maira Romero",
    tel_gerente: "3512515141",
    supervisor_interno: "Laura Zapana",
    region: "Pablo Baena",
  },
  "MCH": {
    local: "Comodoro Auto",
    frecuencia: "Mensual",
    proveedor: "Servicios Integrales",
    complejo: "VIA PUBLICA",
    direccion: "Av Hipolito Yrigoyen",
    zona: "INTERIOR",
    localidad: "BAHIA BLANCA",
    provincia: "BUENOS AIRES",
    cp: "",
    razon_social: "MOSTAZA Y PAN S.A.",
    mail: "",
    gerente: "DAMIAN SOTO",
    tel_gerente: "1164455980",
    supervisor_interno: "Bruno Ureta",
    region: "Jesica Espinoza",
  },
  "MCJ": {
    local: "JUAN B JUSTO",
    frecuencia: "Bimestral",
    proveedor: "JTC",
    complejo: "VIA PUBLICA",
    direccion: "AV CORRIENTES 5790",
    zona: "CABA",
    localidad: "CABA",
    provincia: "BUENOS AIRES",
    cp: "1069",
    razon_social: "MOSTAZA Y PAN S.A.",
    mail: "juanbjusto@mostazaweb.com.ar",
    gerente: "Lucio Zanneti",
    tel_gerente: "1133718755",
    supervisor_interno: "Erica Luna",
    region: "Pablo Baena",
  },
  "MCL": {
    local: "PASEO LIBERTAD",
    frecuencia: "Mensual",
    proveedor: "CMC",
    complejo: "PASEO LIBERTAD GENERAL PAZA",
    direccion: "LIBERTAD  1100",
    zona: "INTERIOR",
    localidad: "GENERAL PAZ",
    provincia: "CORDOBA",
    cp: "X5004AKR",
    razon_social: "MOSTAZA Y PAN S.A.",
    mail: "cordobalibertad@mostazaweb.com.ar",
    gerente: "MAILEN PERALTA",
    tel_gerente: "3513587818",
    supervisor_interno: "Laura Zapana",
    region: "Pablo Baena",
  },
  "MCM": {
    local: "MORENO 1",
    frecuencia: "Bimestral",
    proveedor: "JTC",
    complejo: "CARREFOUR MORENO",
    direccion: "Acceso Oeste y Graham Bell",
    zona: "OESTE",
    localidad: "MORENO",
    provincia: "BUENOS AIRES",
    cp: "1744",
    razon_social: "MOSTAZA Y PAN S.A.",
    mail: "carrefourmoreno@mostazaweb.com.ar",
    gerente: "CANDELA PAZ",
    tel_gerente: "1161171822",
    supervisor_interno: "ROMINA BINA",
    region: "Gimena Conte",
  },
  "MCO": {
    local: "CORRIENTES Y 9 DE JULIO",
    frecuencia: "Bimestral",
    proveedor: "JTC",
    complejo: "PEATONAL",
    direccion: "Av. Corrientes 970",
    zona: "CABA",
    localidad: "CABA",
    provincia: "BUENOS AIRES",
    cp: "C1043",
    razon_social: "MOSTAZA Y PAN S.A.",
    mail: "corrientes@mostazaweb.com.ar",
    gerente: "Moira Hoyos",
    tel_gerente: "1124542555",
    supervisor_interno: "Joaquin Aquino",
    region: "Pablo Baena",
  },
  "MCP": {
    local: "PATIO OLMOS",
    frecuencia: "Mensual",
    proveedor: "CMC",
    complejo: "SHOPPING PATIO OLMOS",
    direccion: "VELEZ SARSFIELD 361",
    zona: "INTERIOR",
    localidad: "PATIO OLMOS",
    provincia: "CORDOBA",
    cp: "X5000JJD",
    razon_social: "MOSTAZA Y PAN S.A.",
    mail: "patioolmos@mostazaweb.com.ar",
    gerente: "Yamila Naghi",
    tel_gerente: "3516143809",
    supervisor_interno: "Laura Zapana",
    region: "Pablo Baena",
  },
  "MCR": {
    local: "CITY ROSARIO",
    frecuencia: "Trimestral",
    proveedor: "Qz",
    complejo: "ROSARIO CENTER CITY",
    direccion: "BV OROÑO Y AV. CIRCUNVALACION",
    zona: "INTERIOR",
    localidad: "ROSARIO",
    provincia: "SANTA FE",
    cp: "200",
    razon_social: "MOSTAZA Y PAN S.A.",
    mail: "citycenter@mostazaweb.com.ar",
    gerente: "NICOLE COFFARO",
    tel_gerente: "3412150740",
    supervisor_interno: "MILAGROS SANCHEZ",
    region: "GIMENA CONTE",
  },
  "MCS": {
    local: "SAN JUSTO 4",
    frecuencia: "Bimestral",
    proveedor: "JTC",
    complejo: "CARREFOUR SAN JUSTO",
    direccion: "Av Don Bosco 2680",
    zona: "OESTE",
    localidad: "SAN JUSTO",
    provincia: "BUENOS AIRES",
    cp: "B1754",
    razon_social: "MOSTAZA Y PAN S.A.",
    mail: "carrefoursanjusto@mostazaweb.com.ar",
    gerente: "Griselda Ortega",
    tel_gerente: "1144221162",
    supervisor_interno: "ANTONELLA HORNA",
    region: "Gimena Conte",
  },
  "MCT": {
    local: "CONSTITUYENTES",
    frecuencia: "Bimestral",
    proveedor: "CR",
    complejo: "WALMART",
    direccion: "Av. de los Constituyentes 6020,",
    zona: "CABA",
    localidad: "CABA",
    provincia: "BUENOS AIRES",
    cp: "1431",
    razon_social: "MOSTAZA Y PAN S.A.",
    mail: "constituyentes@mostazaweb.com.ar",
    gerente: "CRISTIAN MONTENEGRO",
    tel_gerente: "1171172645",
    supervisor_interno: "Micaela Moreno",
    region: "Yanina Solano",
  },
  "MCV": {
    local: "VILLA CABRERA",
    frecuencia: "Mensual",
    proveedor: "CMC",
    complejo: "SHOPPING CORDOBA",
    direccion: "JOSE DE GOYCOHEA2851",
    zona: "INTERIOR",
    localidad: "VILLA CABRERA",
    provincia: "CORDOBA",
    cp: "X5000",
    razon_social: "MOSTAZA Y PAN S.A.",
    mail: "vcabrera@mostazaweb.com.ar",
    gerente: "Dafne Jofre",
    tel_gerente: "3512240291",
    supervisor_interno: "Laura Zapana",
    region: "Pablo Baena",
  },
  "MCW": {
    local: "WARNES",
    frecuencia: "Bimestral",
    proveedor: "CR",
    complejo: "CARREFOUR WARNES",
    direccion: "Av. Warnes nº 2707",
    zona: "CABA",
    localidad: "CABA",
    provincia: "BUENOS AIRES",
    cp: "1427",
    razon_social: "MOSTAZA Y PAN S.A.",
    mail: "warnes@mostazaweb.com.ar",
    gerente: "TOMAS CRIADO",
    tel_gerente: "1141681360",
    supervisor_interno: "Micaela Moreno",
    region: "Yanina Solano",
  },
  "MDB": {
    local: "DOLORES",
    frecuencia: "Bimestral",
    proveedor: "JTC",
    complejo: "VIA PUBLICA",
    direccion: "Ruta 2 KM 202",
    zona: "NORTE",
    localidad: "DOLORES",
    provincia: "BUENOS AIRES",
    cp: "7100",
    razon_social: "MOSTAZA Y PAN S.A.",
    mail: "dolores@mostazaweb.com.ar",
    gerente: "LUANA LUNA",
    tel_gerente: "1165192452",
    supervisor_interno: "Yesica Zarate",
    region: "Jesica Espinoza",
  },
  "MDI": {
    local: "DIAGONAL",
    frecuencia: "Bimestral",
    proveedor: "JTC",
    complejo: "PEATONAL",
    direccion: "Av. Presidente Roque Saenz Peña 572",
    zona: "CABA",
    localidad: "CABA",
    provincia: "BUENOS AIRES",
    cp: "C1016AAN",
    razon_social: "MOSTAZA Y PAN S.A.",
    mail: "diagonal@mostazaweb.com.ar",
    gerente: "LOURDES STEPANIUK",
    tel_gerente: "1168739267",
    supervisor_interno: "Joaquin Aquino",
    region: "Pablo Baena",
  },
  "MDO": {
    local: "DOT",
    frecuencia: "Trimestral",
    proveedor: "QZ",
    complejo: "SHOPPING DOT BAIRES",
    direccion: "Vedía 3626",
    zona: "CABA",
    localidad: "CABA",
    provincia: "BUENOS AIRES",
    cp: "C1430",
    razon_social: "MOSTAZA Y PAN S.A.",
    mail: "dot@mostazaweb.com.ar",
    gerente: "SELENE GARCIA",
    tel_gerente: "1133694141",
    supervisor_interno: "Sofia Sas",
    region: "Yanina Solano",
  },
  "MDV": {
    local: "DEVOTO",
    frecuencia: "Bimestral",
    proveedor: "CR",
    complejo: "SHOPPING DEVOTO",
    direccion: "José Pedro Varela 4862",
    zona: "CABA",
    localidad: "VILLA DEVOTO",
    provincia: "BUENOS AIRES",
    cp: "C1417",
    razon_social: "MOSTAZA Y PAN S.A.",
    mail: "devoto@mostazaweb.com.ar",
    gerente: "CAMILA ROMERO",
    tel_gerente: "1126359833",
    supervisor_interno: "Micaela Moreno",
    region: "Yanina Solano",
  },
  "MEP": {
    local: "PARANÁ",
    frecuencia: "Trimestral",
    proveedor: "Qz",
    complejo: "PASEO PARANÁ",
    direccion: "Corrientes 687",
    zona: "INTERIOR",
    localidad: "PARANÁ",
    provincia: "ENTRE RIOS",
    cp: "",
    razon_social: "GASTRO MANANGEMENT GROUP S.A.",
    mail: "paseoparana@mostazaweb.com.ar",
    gerente: "JOAQUIN CERSOFIOS",
    tel_gerente: "3434658449",
    supervisor_interno: "ROMINA BINA",
    region: "Gimena Conte",
  },
  "MF2": {
    local: "FLORIDA 2",
    frecuencia: "Bimestral",
    proveedor: "JTC",
    complejo: "PEATONAL",
    direccion: "mlt",
    zona: "CABA",
    localidad: "CABA",
    provincia: "BUENOS AIRES",
    cp: "C1005AAJ",
    razon_social: "MOSTAZA Y PAN S.A.",
    mail: "florida2@mostazaweb.com.ar",
    gerente: "Mara Meza",
    tel_gerente: "1160534529",
    supervisor_interno: "Joaquin Aquino",
    region: "Pablo Baena",
  },
  "MFL": {
    local: "FLORIDA",
    frecuencia: "",
    proveedor: "",
    complejo: "PEATONAL",
    direccion: "Florida 267",
    zona: "CABA",
    localidad: "CABA",
    provincia: "BUENOS AIRES",
    cp: "C1005AAE",
    razon_social: "MOSTAZA Y PAN S.A.",
    mail: "florida@mostazaweb.com.ar",
    gerente: "Bianca Albarracin",
    tel_gerente: "1131146710",
    supervisor_interno: "Joaquin Aquino",
    region: "Pablo Baena",
  },
  "MGC": {
    local: "CATAN",
    frecuencia: "Bimestral",
    proveedor: "JTC",
    complejo: "SHOPPING CATAN",
    direccion: "Av Brigadier Gral. Juan Manuel de Rosas 14457. Ruta 3 km 29",
    zona: "OESTE",
    localidad: "GONZALES CATAN",
    provincia: "BUENOS AIRES",
    cp: "B1759GZK",
    razon_social: "MOSTAZA Y PAN S.A.",
    mail: "catan@mostazaweb.com.ar",
    gerente: "BELEN VILCA",
    tel_gerente: "1161724709",
    supervisor_interno: "ANTONELLA HORNA",
    region: "Gimena Conte",
  },
  "MGP": {
    local: "GALERIAS PACIFICO",
    frecuencia: "Bimestral",
    proveedor: "CR",
    complejo: "SHOPPING GALERIAS PACIFICO",
    direccion: "San Martin 678.",
    zona: "CABA",
    localidad: "CABA",
    provincia: "BUENOS AIRES",
    cp: "C1005AAO",
    razon_social: "MOSTAZA Y PAN S.A.",
    mail: "galerias@mostazaweb.com.ar",
    gerente: "Patricia Ferreyra",
    tel_gerente: "1132675841",
    supervisor_interno: "Joaquin Aquino",
    region: "Pablo Baena",
  },
  "MIVP": {
    local: "ITUZAINGO",
    frecuencia: "Bimestral",
    proveedor: "JTC",
    complejo: "VIA PUBLICA",
    direccion: "CORONEL PABLO ZUFRIATEGUI 965",
    zona: "OESTE",
    localidad: "ITUZAINGO",
    provincia: "BUENOS AIRES",
    cp: "1714",
    razon_social: "MOSTAZA Y PAN S.A.",
    mail: "ITUZAINGO@MOSTAZAWEB.COM.AR",
    gerente: "Bianca Montenegro",
    tel_gerente: "1158032098",
    supervisor_interno: "MILAGROS SANCHEZ",
    region: "GIMENA CONTE",
  },
  "MJC": {
    local: "SHOPPING JOCKEY CLUB",
    frecuencia: "Mensual",
    proveedor: "CMC",
    complejo: "Elias Jofre 1050",
    direccion: "ELIAS YOFRE 1050",
    zona: "CORBOBA",
    localidad: "CAPITAL",
    provincia: "CORDOBA",
    cp: "",
    razon_social: "MOSTAZA Y PAN S.A.",
    mail: "jockeyclub@mostazaweb.com.ar",
    gerente: "Agustina Carrizo",
    tel_gerente: "3517500903",
    supervisor_interno: "Laura Zapana",
    region: "Pablo Baena",
  },
  "MJS": {
    local: "TRENES",
    frecuencia: "Mensual",
    proveedor: "JTC",
    complejo: "VIA PUBLICA",
    direccion: "Juan b Justo 606",
    zona: "CABA",
    localidad: "CAPITAL",
    provincia: "BUENOS AIRES",
    cp: "",
    razon_social: "MOSTAZA Y PAN S.A.",
    mail: "trenes@mostazaweb.com.ar",
    gerente: "NAYLA TERAN",
    tel_gerente: "1133354077",
    supervisor_interno: "Erica Luna",
    region: "Pablo Baena",
  },
  "MLA": {
    local: "NEUQUEN  3 ( LA ANONIMA )",
    frecuencia: "Mensual",
    proveedor: "Qz",
    complejo: "LA ANONIMA",
    direccion: "ANTARTIDA ARGENTINA 1111",
    zona: "INTERIOR",
    localidad: "NEUQUEN",
    provincia: "NEUQUEN",
    cp: "Q8300",
    razon_social: "GASTRO MANANGEMENT GROUP S.A.",
    mail: "laanonimaneuquen@mostazaweb.com.ar",
    gerente: "MARTINA BUSTOS",
    tel_gerente: "3541543040",
    supervisor_interno: "JOHANA GONZALEZ",
    region: "GIMENA CONTE",
  },
  "MLAA": {
    local: "LANUS AUTO",
    frecuencia: "",
    proveedor: "",
    complejo: "",
    direccion: "",
    zona: "",
    localidad: "",
    provincia: "",
    cp: "",
    razon_social: "",
    mail: "",
    gerente: "GIULIANA ACEBAL",
    tel_gerente: "1131485246",
    supervisor_interno: "Romina De Luca",
    region: "Jesica Espinoza",
  },
  "MLC": {
    local: "AV LA PLATA CALLE",
    frecuencia: "Bimestral",
    proveedor: "JTC",
    complejo: "VIA PUBLICA - AUTO",
    direccion: "Av la Plata 1150",
    zona: "NORTE",
    localidad: "BOEDO",
    provincia: "BUENOS AIRES",
    cp: "B1706",
    razon_social: "MOSTAZA Y PAN S.A.",
    mail: "avlaplata@mostazaweb.com.ar",
    gerente: "Mailen Suarez",
    tel_gerente: "1153297742",
    supervisor_interno: "Pablo Cozzo",
    region: "Pablo Baena",
  },
  "MLE": {
    local: "PARQUE LELOIR",
    frecuencia: "Mensual",
    proveedor: "JTC",
    complejo: "VIA PUBLICA",
    direccion: "AV PRESIDENTE PERON 8545 , ITUZAINGO",
    zona: "OESTE",
    localidad: "",
    provincia: "BUENOS AIRES",
    cp: "",
    razon_social: "MOSTAZA Y PAN S.A.",
    mail: "leloir@mostazaweb.com.ar",
    gerente: "XIMENA CABEZAS",
    tel_gerente: "1132393095",
    supervisor_interno: "MILAGROS SANCHEZ",
    region: "GIMENA CONTE",
  },
  "MLO": {
    local: "LOMITAS",
    frecuencia: "Bimestral",
    proveedor: "JTC",
    complejo: "VIA PUBLICA",
    direccion: "COLOMBRES 306",
    zona: "SUR",
    localidad: "LOMAS DE ZAMORA",
    provincia: "BUENOS AIRES",
    cp: "1832",
    razon_social: "MOSTAZA Y PAN S.A.",
    mail: "lomitas@mostazaweb.com.ar",
    gerente: "AYELEN CLAVERO",
    tel_gerente: "1167589911",
    supervisor_interno: "Romina De Luca",
    region: "Jesica Espinoza",
  },
  "MLP": {
    local: "LA PLATA",
    frecuencia: "Bimestral",
    proveedor: "JTC",
    complejo: "WALMART LA PLATA",
    direccion: "Camino Parque Centenario 1876",
    zona: "SUR",
    localidad: "La Plata",
    provincia: "BUENOS AIRES",
    cp: "B1897EXL",
    razon_social: "MOSTAZA Y PAN S.A.",
    mail: "walmartlp@mostazaweb.com.ar",
    gerente: "CONSTANZA LANATA",
    tel_gerente: "1136760278",
    supervisor_interno: "Yesica Zarate",
    region: "Jesica Espinoza",
  },
  "MLT": {
    local: "LAS TOSCAS",
    frecuencia: "Mensual",
    proveedor: "JTC",
    complejo: "LAS TOSCAS CANNING SHOPPING",
    direccion: "FORMOSA 653",
    zona: "SUR",
    localidad: "EZEIZA",
    provincia: "BUENOS AIRES",
    cp: "1804",
    razon_social: "MOSTAZA Y PAN S.A.",
    mail: "lastoscas@mostazaweb.com.ar",
    gerente: "Daniel Flores",
    tel_gerente: "1164813886",
    supervisor_interno: "Leandro Peralta",
    region: "Jesica Espinoza",
  },
  "MLU": {
    local: "LUJAN 2",
    frecuencia: "Bimestral",
    proveedor: "JTC",
    complejo: "SHOPPING",
    direccion: "Roberto Payro 198",
    zona: "OESTE",
    localidad: "LUJAN",
    provincia: "BUENOS AIRES",
    cp: "6700",
    razon_social: "MSOTAZA Y PAN S.A.",
    mail: "lujan2@mostazaweb.com.ar",
    gerente: "MILAGROS MORUZZI",
    tel_gerente: "2323672948",
    supervisor_interno: "ROMINA BINA",
    region: "GIMENA CONTE",
  },
  "MLZ": {
    local: "LOMAS",
    frecuencia: "Bimestral",
    proveedor: "JTC",
    complejo: "",
    direccion: "",
    zona: "",
    localidad: "",
    provincia: "",
    cp: "",
    razon_social: "",
    mail: "",
    gerente: "Micaela Cabrera",
    tel_gerente: "1137868532",
    supervisor_interno: "Romina De Luca",
    region: "Jesica Espinoza",
  },
  "MMA": {
    local: "MADRYN",
    frecuencia: "Trimestral",
    proveedor: "Qz",
    complejo: "VIA PUBLICA",
    direccion: "28 de Julio 188",
    zona: "INTERIOR",
    localidad: "PUERTO MADRYN",
    provincia: "CHUBUT",
    cp: "9120",
    razon_social: "MOSTAZA Y PAN S.A.",
    mail: "puertomadryn@mostazaweb.com.ar",
    gerente: "CAMILA GIMENEZ",
    tel_gerente: "2805051143",
    supervisor_interno: "Damian Riquelme",
    region: "Jesica Espinoza",
  },
  "MMC": {
    local: "Posadas Calle",
    frecuencia: "Trimestral",
    proveedor: "QZ",
    complejo: "VIA PUBLICA",
    direccion: "San Lorenzo 1176",
    zona: "INTERIOR",
    localidad: "MISIONES",
    provincia: "MISIONES",
    cp: "",
    razon_social: "MOSTAZA Y PAN S.A",
    mail: "POSADASCALLE@MOSTAZAWEB.COM.AR",
    gerente: "YENIFER MARTINS",
    tel_gerente: "3764800137",
    supervisor_interno: "Pablo Cozzo",
    region: "Pablo Baena",
  },
  "MMH": {
    local: "HAEDO AUTO",
    frecuencia: "Bimestral",
    proveedor: "JTC",
    complejo: "VIA PUBLICA - AUTO",
    direccion: "Av. Luis P. Güemes 452 Haedo",
    zona: "OESTE",
    localidad: "HAEDO",
    provincia: "BUENOS AIRES",
    cp: "1706",
    razon_social: "MOSTAZA Y PAN S.A.",
    mail: "Haedo2@mostazaweb.com.ar",
    gerente: "NATALIA DIMARCO",
    tel_gerente: "1157634485",
    supervisor_interno: "MILAGROS SANCHEZ",
    region: "GIMENA CONTE",
  },
  "MML": {
    local: "LUJAN DE CUYO",
    frecuencia: "Trimestral",
    proveedor: "QZ",
    complejo: "TERRAMALVA CENTRO COMERCIAL",
    direccion: "Av. Roque Saenz Peña 1110 esquina Corvalan",
    zona: "INTERIOR",
    localidad: "MENDOZA",
    provincia: "MENDOZA",
    cp: "5507",
    razon_social: "MOSTAZA Y PAN S.A.",
    mail: "lujandecuyo@mostazaweb.com.ar",
    gerente: "DANISA MANZANELLI",
    tel_gerente: "2616025089",
    supervisor_interno: "GUILLERMINA GARIS",
    region: "Yanina Solano",
  },
  "MMP": {
    local: "MOSTAZA POSADAS",
    frecuencia: "Trimestral",
    proveedor: "QZ",
    complejo: "Hipermercado Libertad",
    direccion: "Av. Quaranta 3598",
    zona: "INTERIOR",
    localidad: "MISIONES",
    provincia: "MISIONES",
    cp: "",
    razon_social: "MOSTAZA Y PAN S.A.",
    mail: "posadas@mostazaweb.com.ar",
    gerente: "ALDANA RUIZ",
    tel_gerente: "1127317705",
    supervisor_interno: "Pablo Cozzo",
    region: "Pablo Baena",
  },
  "MMVP": {
    local: "MORON",
    frecuencia: "Bimestral",
    proveedor: "JTC",
    complejo: "VIA PUBLICA",
    direccion: "BELGRANO 274",
    zona: "OESTE",
    localidad: "MORON",
    provincia: "BUENOS AIRES",
    cp: "1708",
    razon_social: "MOSTAZA Y PAN S.A.",
    mail: "moron@mostazaweb.com.ar",
    gerente: "MELANIE FODERA",
    tel_gerente: "1127677643",
    supervisor_interno: "ROMINA BINA",
    region: "Gimena Conte",
  },
  "MMZ": {
    local: "MENDOZA PLAZA",
    frecuencia: "Mensual",
    proveedor: "QZ",
    complejo: "SHOPPING MENDOZA PLAZA",
    direccion: "AV.ACCESO ESTE 3280",
    zona: "INTERIOR",
    localidad: "GUAYMALLEN",
    provincia: "MENDOZA",
    cp: "M5500",
    razon_social: "MOSTAZA Y PAN S.A.",
    mail: "mendoza@mostazaweb.com.ar",
    gerente: "AGOSTINA GRIGAS",
    tel_gerente: "2613679231",
    supervisor_interno: "AGOSTINA GRIGAS",
    region: "Yanina Solano",
  },
  "MNA": {
    local: "NEUQUEN 2  ALTO COMAHUE",
    frecuencia: "Mensual",
    proveedor: "Qz",
    complejo: "SHOPPING ALTO COMAHUE",
    direccion: "DR RAMON 355",
    zona: "INTERIOR",
    localidad: "NEUQUEN",
    provincia: "NEUQUEN",
    cp: "8300",
    razon_social: "GASTRO MANANGEMENT GROUP S.A.",
    mail: "altocomahue@mostazaweb.com.ar",
    gerente: "MAILEN CASTILLO",
    tel_gerente: "2994667570",
    supervisor_interno: "JOHANA GONZALEZ",
    region: "GIMENA CONTE",
  },
  "MNC": {
    local: "NORCENTER",
    frecuencia: "Bimestral",
    proveedor: "CR",
    complejo: "NORCENTER",
    direccion: "Esteban Echeverría 3750",
    zona: "NORTE",
    localidad: "MUNRO",
    provincia: "BUENOS AIRES",
    cp: "1625",
    razon_social: "MOSTAZA Y PAN S.A.",
    mail: "norcenter@mostazaweb.com.ar",
    gerente: "SOL GARCIA",
    tel_gerente: "1164140804",
    supervisor_interno: "Micaela Moreno",
    region: "Yanina Solano",
  },
  "MNI": {
    local: "NINE",
    frecuencia: "Bimestral",
    proveedor: "JTC",
    complejo: "SHOPPING NINE",
    direccion: "Victorica 1128",
    zona: "OESTE",
    localidad: "MORENO",
    provincia: "BUENOS AIRES",
    cp: "B1744",
    razon_social: "MOSTAZA Y PAN S.A.",
    mail: "nine@mostazaweb.com.ar",
    gerente: "SOFIA AVALOS",
    tel_gerente: "1134968804",
    supervisor_interno: "ROMINA BINA",
    region: "Gimena Conte",
  },
  "MNQ": {
    local: "NEUQUEN  1",
    frecuencia: "Mensual",
    proveedor: "Qz",
    complejo: "SHOPPING PORTAL PATAGONICA",
    direccion: "JULIAN LASTRA",
    zona: "INTERIOR",
    localidad: "NEUQUEN",
    provincia: "NEUQUEN",
    cp: "Q8300",
    razon_social: "GASTRO MANANGEMENT GROUP S.A.",
    mail: "neuquen@motazaweb.com.ar",
    gerente: "YOSELIN PUENTES",
    tel_gerente: "2995896654",
    supervisor_interno: "JOHANA GONZALEZ",
    region: "GIMENA CONTE",
  },
  "MOC": {
    local: "MADERO 2",
    frecuencia: "Mensual",
    proveedor: "JTC",
    complejo: "PEATONAL",
    direccion: "Olga Cossettini 803",
    zona: "CABA",
    localidad: "CABA",
    provincia: "BUENOS AIRES",
    cp: "C1107",
    razon_social: "MOSTAZA Y PAN S.A.",
    mail: "madero2@mostazaweb.com.ar",
    gerente: "MATIAS BRIZUELA",
    tel_gerente: "1128483379",
    supervisor_interno: "Damian Riquelme",
    region: "Jesica Espinoza",
  },
  "MOT": {
    local: "TORTUGUITAS",
    frecuencia: "Bimestral",
    proveedor: "CR",
    complejo: "SHOOPPING OPEN MALL",
    direccion: "Panamericana km36,5  Ramal oeste",
    zona: "NORTE",
    localidad: "MALVINAS ARGENTINA",
    provincia: "BUENOS AIRES",
    cp: "1667",
    razon_social: "MOSTAZA Y PAN S.A.",
    mail: "tortugas@mostazaweb.com.ar",
    gerente: "AYELEN QUINTEROS",
    tel_gerente: "1136357252",
    supervisor_interno: "Yamila Varano",
    region: "Yanina Solano",
  },
  "MPA": {
    local: "PANAMERICANA",
    frecuencia: "Bimestral",
    proveedor: "CR",
    complejo: "VIA PUBLICA - AUTO",
    direccion: "Parana 3999",
    zona: "NORTE",
    localidad: "MARTINEZ",
    provincia: "BUENOS AIRES",
    cp: "1640",
    razon_social: "MOSTAZA Y PAN S.A.",
    mail: "panamericana@mostazaweb.com.ar",
    gerente: "LUCIANA FREDE",
    tel_gerente: "1122531166",
    supervisor_interno: "Sofia Sas",
    region: "Yanina Solano",
  },
  "MPAT": {
    local: "PANAMERICANA AUTO",
    frecuencia: "Bimestral",
    proveedor: "CR",
    complejo: "VIA PUBLICA",
    direccion: "",
    zona: "NORTE",
    localidad: "PACHECO",
    provincia: "BUENOS AIRES",
    cp: "",
    razon_social: "MOSTAZA Y PAN S.A.",
    mail: "pacheco1@mostazaweb.com.ar",
    gerente: "BRENDA ALBORNOZ",
    tel_gerente: "1123034204",
    supervisor_interno: "Yamila Varano",
    region: "Yanina Solano",
  },
  "MPB": {
    local: "PARQUE BROWN",
    frecuencia: "Bimestral",
    proveedor: "CR",
    complejo: "FACTORY PARQUE BROWN",
    direccion: "Av.Fernandez de la cruz 4602",
    zona: "NORTE",
    localidad: "VILLA LUGANIO",
    provincia: "BUENOS AIRES",
    cp: "1439",
    razon_social: "MOSTAZA Y PAN S.A.",
    mail: "parquebrown@mostazaweb.com.ar",
    gerente: "Yanina Ramirez",
    tel_gerente: "1155643918",
    supervisor_interno: "Pablo Cozzo",
    region: "Pablo Baena",
  },
  "MPC": {
    local: "CENTENARIO",
    frecuencia: "Bimestral",
    proveedor: "JTC",
    complejo: "VIA PUBLICA",
    direccion: "AV . DIAZ VELEZ 5009",
    zona: "CABA",
    localidad: "CABA",
    provincia: "BUENOS AIRES",
    cp: "",
    razon_social: "MOSTAZA Y PAN S.A.",
    mail: "centenario@mostazaweb.com.am",
    gerente: "Nahiara Vargas",
    tel_gerente: "1161364156",
    supervisor_interno: "Erica Luna",
    region: "Pablo Baena",
  },
  "MPD": {
    local: "MADERO 3",
    frecuencia: "Bimestral",
    proveedor: "JTC",
    complejo: "PEATONAL",
    direccion: "Pierina Dealessi  1502",
    zona: "CABA",
    localidad: "CABA",
    provincia: "BUENOS AIRES",
    cp: "C1107",
    razon_social: "MOSTAZA Y PAN S.A.",
    mail: "madero3@mostazaweb.com.ar",
    gerente: "Mario Peralta",
    tel_gerente: "1162246665",
    supervisor_interno: "Damian Riquelme",
    region: "Jesica Espinoza",
  },
  "MPF": {
    local: "PUERTO DE FRUTO",
    frecuencia: "Bimestral",
    proveedor: "CR",
    complejo: "VIA PUBLICA",
    direccion: "SARMIENTO 157",
    zona: "NORTE",
    localidad: "",
    provincia: "BUENOS AIRES",
    cp: "",
    razon_social: "MOSTAZA Y PAN S.A.",
    mail: "puertodefrutos@mostazaweb.com.ar",
    gerente: "ROMINA SALAZAR",
    tel_gerente: "1168001663",
    supervisor_interno: "Sofia Sas",
    region: "Yanina Solano",
  },
  "MPIL": {
    local: "PLAZA ITALIA - LA PLATA 5",
    frecuencia: "Bimestral",
    proveedor: "JTC",
    complejo: "",
    direccion: "",
    zona: "",
    localidad: "",
    provincia: "",
    cp: "",
    razon_social: "",
    mail: "",
    gerente: "Lucila Antunez",
    tel_gerente: "11 30052960",
    supervisor_interno: "YESICA ZARATE",
    region: "Jesica Espinoza",
  },
  "MPL": {
    local: "PORTAL LOMAS",
    frecuencia: "Mensual",
    proveedor: "JTC",
    complejo: "PORTAL LOMAS SHOPPING",
    direccion: "Av Antartida Argentina  801  y Frias",
    zona: "SUR",
    localidad: "LAVALLOL",
    provincia: "BUENOS AIRES",
    cp: "B1836AN",
    razon_social: "MOSTAZA Y PAN S.A.",
    mail: "portallomas@mostazaweb.com.ar",
    gerente: "Cecilia Colasanti",
    tel_gerente: "1165801244",
    supervisor_interno: "Romina De Luca",
    region: "Jesica Espinoza",
  },
  "MPO": {
    local: "PLAZA OESTE",
    frecuencia: "Bimestral",
    proveedor: "JTC",
    complejo: "SHOPPING PLAZA OESTE",
    direccion: "Av Brig Gral Juan M. de Rosas 658",
    zona: "OESTE",
    localidad: "MORON",
    provincia: "BUENOS AIRES",
    cp: "B1712",
    razon_social: "MOSTAZA Y PAN S.A.",
    mail: "MORON2@MOSTAZAWEB.COM.AR",
    gerente: "FLORENCIA VAZQUEZ",
    tel_gerente: "1136006626",
    supervisor_interno: "MILAGROS SANCHEZ",
    region: "GIMENA CONTE",
  },
  "MPP": {
    local: "PASEO PILAR",
    frecuencia: "Bimestral",
    proveedor: "CR",
    complejo: "SHOPPING PASEO PILAR",
    direccion: "panamericana, Ramal Pilar km 44, B1669 Del Viso",
    zona: "NORTE",
    localidad: "",
    provincia: "",
    cp: "",
    razon_social: "",
    mail: "paseopilar@mostazaweb.com.ar",
    gerente: "MARCOS POLZONI",
    tel_gerente: "1151334510",
    supervisor_interno: "Yamila Varano",
    region: "Yanina Solano",
  },
  "MPT": {
    local: "TUCUMAN 1",
    frecuencia: "Trimestral",
    proveedor: "Asignar Proveedor",
    complejo: "SHOPPING PORTAL TUCUMAN",
    direccion: "AV.FERMIN CARIOLA   42",
    zona: "INTERIOR",
    localidad: "YERBA BUENA",
    provincia: "TUCUMAN",
    cp: "T4107",
    razon_social: "MOSTAZA Y PAN S.A.",
    mail: "tucuman@mostazaweb.com.ar",
    gerente: "TOMAS CASALE",
    tel_gerente: "3813472026",
    supervisor_interno: "Joaquin Aquino",
    region: "Pablo Baena",
  },
  "MQM": {
    local: "QUILMES  JUMBO",
    frecuencia: "Mensual",
    proveedor: "JTC",
    complejo: "FACTORY QUILMES",
    direccion: "Calchaquí 3950",
    zona: "SUR",
    localidad: "Quilmes Oeste",
    provincia: "BUENOS AIRES",
    cp: "1879",
    razon_social: "MOSTAZA Y PAN S.A.",
    mail: "jumboquilmes@mostazaweb.com.ar",
    gerente: "Lorena Avila",
    tel_gerente: "1133196577",
    supervisor_interno: "Yesica Zarate",
    region: "Jesica Espinoza",
  },
  "MRC": {
    local: "RIO CUARTO",
    frecuencia: "Mensual",
    proveedor: "CMC",
    complejo: "PASEO RIO CUARTO",
    direccion: "Sagranderos 200",
    zona: "INTERIOR",
    localidad: "CORDOBA",
    provincia: "CORDOBA",
    cp: "",
    razon_social: "MOSTAZA Y PAN S.A.",
    mail: "riocuarto@mostazaweb.com.ar",
    gerente: "Ariel Moreno",
    tel_gerente: "3584 90-0166",
    supervisor_interno: "Laura Zapana",
    region: "Pablo Baena",
  },
  "MRM": {
    local: "RECOLETA",
    frecuencia: "Bimestral",
    proveedor: "CR",
    complejo: "RECOLETA URBAN MALL",
    direccion: "Junin 1648",
    zona: "CABA",
    localidad: "RECOLETA",
    provincia: "BUENOS AIRES",
    cp: "C1113",
    razon_social: "MOSTAZA Y PAN S.A.",
    mail: "recoleta@mostazaweb.com.ar",
    gerente: "MARIA RODRIGUEZ",
    tel_gerente: "1158858412",
    supervisor_interno: "Erica Luna",
    region: "Pablo Baena",
  },
  "MSB": {
    local: "BAHIA SHOPPING",
    frecuencia: "Bimestral",
    proveedor: "JTC",
    complejo: "",
    direccion: "",
    zona: "",
    localidad: "",
    provincia: "",
    cp: "",
    razon_social: "",
    mail: "",
    gerente: "Luciana Calfapietra",
    tel_gerente: "1135905790",
    supervisor_interno: "Romina De Luca",
    region: "Jesica Espinoza",
  },
  "MSC": {
    local: "NUEVO CENTRO",
    frecuencia: "Mensual",
    proveedor: "CMC",
    complejo: "SHOPPING NUEVO CENTRO",
    direccion: "Av. Duarte Quirós 1400, X5000 Córdoba",
    zona: "INTERIOR",
    localidad: "",
    provincia: "CORDOBA",
    cp: "",
    razon_social: "MOSTAZA Y PAN S.A.",
    mail: "nuevocentro@mostazaweb.com.ar",
    gerente: "Lucia Heredia",
    tel_gerente: "3512100912",
    supervisor_interno: "Laura Zapana",
    region: "Pablo Baena",
  },
  "MSF": {
    local: "SOLEIL",
    frecuencia: "Bimestral",
    proveedor: "CR",
    complejo: "SOLEIL PREMIUN OUTLET",
    direccion: "Bernardo de Irigoyen 2647",
    zona: "NORTE",
    localidad: "BOULOGNNE",
    provincia: "BUENOS AIRES",
    cp: "B1609",
    razon_social: "MOSTAZA Y PAN S.A.",
    mail: "soleil@mostazaweb.com.ar",
    gerente: "AGUSTINA RUIZ",
    tel_gerente: "1131224750",
    supervisor_interno: "Yamila Varano",
    region: "Yanina Solano",
  },
  "MSJ": {
    local: "SAN JUSTO 1",
    frecuencia: "Mensual",
    proveedor: "JTC",
    complejo: "SHOPPING SAN JUSTO",
    direccion: "Gral. Juan Manuel de Rosas 3910",
    zona: "OESTE",
    localidad: "SAN JUSTO",
    provincia: "BUENOS AIRES",
    cp: "B1754",
    razon_social: "MOSTAZA Y PAN S.A.",
    mail: "sanjusto@mostazaweb.com.ar",
    gerente: "CINTHIA BUSTAMANTE",
    tel_gerente: "1163788507",
    supervisor_interno: "ANTONELLA HORNA",
    region: "Gimena Conte",
  },
  "MSM": {
    local: "SAN MIGUEL 1",
    frecuencia: "Bimestral",
    proveedor: "CR",
    complejo: "SHOPPING TERRAZA DE MAYO",
    direccion: "Ruta 8 Y 202 Av Arturo Illia3770",
    zona: "NORTE",
    localidad: "MALVINAS ARGENTINA",
    provincia: "BUENOS AIRES",
    cp: "B1663",
    razon_social: "MOSTAZA Y PAN S.A.",
    mail: "sanmiguel@mostazaweb.com.ar",
    gerente: "ROCIO LOPEZ",
    tel_gerente: "1131267957",
    supervisor_interno: "ROMINA BINA",
    region: "Gimena Conte",
  },
  "MSN": {
    local: "SALTA",
    frecuencia: "Trimestral",
    proveedor: "Asignar Proveedor",
    complejo: "SHOPPING ALTO NOA",
    direccion: "VIRREY TOLEDO 702",
    zona: "INTERIOR",
    localidad: "SALTA",
    provincia: "SALTA",
    cp: "A4400ARD",
    razon_social: "GASTRO MANANGEMENT GROUP S.A.",
    mail: "salta@mostazaweb.com.ar",
    gerente: "AYELEN GARCIA",
    tel_gerente: "3875216236",
    supervisor_interno: "AILEN PEREZ",
    region: "Yanina Solano",
  },
  "MST": {
    local: "SAN MARTIN",
    frecuencia: "Bimestral",
    proveedor: "CR",
    complejo: "CARREFOUR SAN MARTIN",
    direccion: "Av. Gral. Jose  San Martín 420",
    zona: "NORTE",
    localidad: "SAN MARTIN",
    provincia: "BUENOS AIRES",
    cp: "B1672AAB",
    razon_social: "MOSTAZA Y PAN S.A.",
    mail: "sanmartin@mostazaweb.com.ar",
    gerente: "RODRIGO DINAMARCA",
    tel_gerente: "1122970902",
    supervisor_interno: "Sofia Sas",
    region: "Yanina Solano",
  },
  "MT1": {
    local: "FOOD TRUCK",
    frecuencia: "VARIABLE",
    proveedor: "JTC",
    complejo: "VIA PUBLICA",
    direccion: "",
    zona: "PARTIDO DE LA COSTA",
    localidad: "COSTA ATLANTICA",
    provincia: "BUENOS AIRES",
    cp: "",
    razon_social: "MSOTAZA Y PAN S.A.",
    mail: "FOODTRUCK@MOSTAZAWEB.COM.AR",
    gerente: "",
    tel_gerente: "",
    supervisor_interno: "Joaquin Aquino",
    region: "Pablo Baena",
  },
  "MTA": {
    local: "TABLADA",
    frecuencia: "Bimestral",
    proveedor: "JTC",
    complejo: "WALMART TABLADA",
    direccion: "Av.Monseñor Bufano  6050",
    zona: "OESTE",
    localidad: "TABLADA",
    provincia: "BUENOS AIRES",
    cp: "B1766",
    razon_social: "MOSTAZA Y PAN S.A.",
    mail: "walmarttablada@mostazaweb.com.ar",
    gerente: "Sofia Suarez",
    tel_gerente: "1136639130",
    supervisor_interno: "ANTONELLA HORNA",
    region: "Gimena Conte",
  },
  "MTC": {
    local: "TIGRE CALLE",
    frecuencia: "Bimestral",
    proveedor: "CR",
    complejo: "VIA PUBLICA",
    direccion: "BARTOLOME MITRE 460 , TIGRE",
    zona: "NORTE",
    localidad: "",
    provincia: "BUENOS AIRES",
    cp: "",
    razon_social: "MOSTAZA Y PAN S.A.",
    mail: "tigre@mostazaweb.com.ar",
    gerente: "MICAELA QUIJANO",
    tel_gerente: "1164319440",
    supervisor_interno: "Sofia Sas",
    region: "Yanina Solano",
  },
  "MTR": {
    local: "TRELEW",
    frecuencia: "Bimestral",
    proveedor: "JTC",
    complejo: "SHOPPING PORTAL TRELEW",
    direccion: "JOSIAH WILLIAMS  209",
    zona: "INTERIOR",
    localidad: "TRELEW",
    provincia: "CHUBUT",
    cp: "9100",
    razon_social: "MOSTAZA Y PAN S.A.",
    mail: "trelew@mostazaweb.com.ar",
    gerente: "Julieta Lopez",
    tel_gerente: "1125407340",
    supervisor_interno: "Damian Riquelme",
    region: "Jesica Espinoza",
  },
  "MUN": {
    local: "UNICENTER",
    frecuencia: "Bimestral",
    proveedor: "CR",
    complejo: "SHOPPING UNICENTER",
    direccion: "Paraná 3745",
    zona: "NORTE",
    localidad: "MARTINEZ",
    provincia: "BUENOS AIRES",
    cp: "B1640FRC",
    razon_social: "MOSTAZA Y PAN S.A.",
    mail: "unicenter@mostazaweb.com.ar",
    gerente: "EZEQUIEL GONZALEZ",
    tel_gerente: "1144466370",
    supervisor_interno: "SOFIA SAS",
    region: "Yanina Solano",
  },
  "MVA": {
    local: "VARELA",
    frecuencia: "Bimestral",
    proveedor: "JTC",
    complejo: "CARREFOUR VARELA",
    direccion: "Av. San Martín 554",
    zona: "SUR",
    localidad: "VARELA",
    provincia: "BUENOS AIRES",
    cp: "1888",
    razon_social: "MOSTAZA Y PAN S.A.",
    mail: "varela@mostazaweb.com.ar",
    gerente: "Nicole Morales",
    tel_gerente: "1167855334",
    supervisor_interno: "Yesica Zarate",
    region: "Jesica Espinoza",
  },
  "MVC": {
    local: "CABALLITO",
    frecuencia: "Bimestral",
    proveedor: "CR",
    complejo: "VILLAGE CABALLITO",
    direccion: "Av Rivadavia 5071",
    zona: "CABA",
    localidad: "CABA",
    provincia: "BUENOS AIRES",
    cp: "C1424CEF",
    razon_social: "MOSTAZA Y PAN S.A.",
    mail: "villagecaballito@mostazaweb.com.ar",
    gerente: "SANTIAGO FLEITAS",
    tel_gerente: "1157041047",
    supervisor_interno: "Pablo Cozzo",
    region: "Pablo Baena",
  },
  "MVZ": {
    local: "CARREFOUR VELEZ",
    frecuencia: "Bimestral",
    proveedor: "CR",
    complejo: "",
    direccion: "Av. Alvarez Jonte 6383, CP 1408, CABA",
    zona: "",
    localidad: "CABA",
    provincia: "BUENOS AIRES",
    cp: "",
    razon_social: "",
    mail: "velez@mostazaweb.com.ar",
    gerente: "MELINA MARTINEZ",
    tel_gerente: "1159963638",
    supervisor_interno: "Micaela Moreno",
    region: "Yanina Solano",
  },
  "MWC": {
    local: "COMODORO RIVADAVIA",
    frecuencia: "Mensual",
    proveedor: "Servicios Integrales",
    complejo: "WALMART",
    direccion: "ENRIQUE GIROLANO 3100",
    zona: "INTERIOR",
    localidad: "COMODORO RIVADAVIA",
    provincia: "CHUBUT",
    cp: "U9003EVH",
    razon_social: "GASTRO MANANGEMENT GROUP S.A.",
    mail: "comodoro@mostazaweb.com.ar",
    gerente: "MAITE SEGURA",
    tel_gerente: "2974253530",
    supervisor_interno: "Bruno Ureta",
    region: "Jesica Espinoza",
  },
  "MWG": {
    local: "WALMART GUAYMALLEN",
    frecuencia: "Trimestral",
    proveedor: "QZ",
    complejo: "WALMART",
    direccion: "MOLDES 1221",
    zona: "INTERIOR",
    localidad: "GUAYMALLEN",
    provincia: "MENDOZA",
    cp: "5519",
    razon_social: "MOSTAZA Y PAN S.A.",
    mail: "walmartmendoza@mostazaweb.com.ar",
    gerente: "JavierManuccia",
    tel_gerente: "2614191790",
    supervisor_interno: "AGOSTINA GRIGAS",
    region: "Yanina Solano",
  },
  "MWN": {
    local: "NEUQUEN  4  ( WALMART )",
    frecuencia: "Mensual",
    proveedor: "Qz",
    complejo: "WALMART",
    direccion: "RN 22 Y A. PERTICONE 1255",
    zona: "INTERIOR",
    localidad: "NEUQUEN",
    provincia: "NEUQUEN",
    cp: "8300",
    razon_social: "GASTRO MANANGEMENT GROUP S.A.",
    mail: "Walmartneuquen@mostazaweb.com.ar",
    gerente: "LAUTARO INDORATO",
    tel_gerente: "2994099984",
    supervisor_interno: "JOHANA GONZALEZ",
    region: "GIMENA CONTE",
  },
  "MWS": {
    local: "SAN JUSTO 2",
    frecuencia: "Bimestral",
    proveedor: "JTC",
    complejo: "WALMART SAN JUSTO",
    direccion: "Gral. Juan Manuel de Rosas 3990",
    zona: "OESTE",
    localidad: "SAN JUSTO",
    provincia: "BUENOS AIRES",
    cp: "B1754FUX",
    razon_social: "MOSTAZA Y PAN S.A.",
    mail: "sanjusto2@mostazaweb.com.ar",
    gerente: "CANDELA GARCIA",
    tel_gerente: "1133845426",
    supervisor_interno: "ANTONELLA HORNA",
    region: "Gimena Conte",
  },
};


// --- 2. FUNCIONES DE PROCESAMIENTO ---

function parseCSV(csv) {
  const lines = csv.split('\n');
  const data = [];

  for (let i = 1; i < lines.length; i++) {
    const row = lines[i].split(';');
    if (row.length < 5) continue;

    const item = {
      id: row[0] || "S/D",
      region: row[1] || "",
      local: row[2] || "Sin Nombre",
      frecuencia: row[3] || "Determinar",
      proveedor: row[4] || "",
      meses: [] // Array de 12 posiciones
    };

    // Extraemos todos los meses (Indices 5 al 16)
    for (let m = 5; m <= 16; m++) {
      item.meses.push(row[m]);
    }
    data.push(item);
  }
  return data;
}

const db = parseCSV(csvRaw);
const tableBody = document.getElementById('tableBody');
const searchInput = document.getElementById('searchInput');

// --- 2.1 CARGA DE LINKS (links.csv) ---
let linksMap = {};

async function loadLinks() {
  try {
    const response = await fetch('links.csv');
    if (!response.ok) throw new Error("No se pudo cargar links.csv");
    const text = await response.text();
    const lines = text.split('\n');

    lines.forEach(line => {
      const parts = line.split(';');
      if (parts.length >= 2) {
        const id = parts[0].trim();
        const link = parts[1].trim();
        if (id && link) {
          linksMap[id] = link;
        }
      }
    });
    console.log("Links cargados:", Object.keys(linksMap).length);
    render(); // Re-renderizar cuando carguen los links
  } catch (e) {
    console.warn("No se pudo cargar links.csv, usando búsqueda por defecto.", e);
  }
}

loadLinks();

// Determina el color del cuadro basado en el texto del CSV
function getCellStyle(text) {
  if (!text) return "bg-white";
  const t = text.toLowerCase();

  if (t.includes("cancelado") || t.includes("cerrado") || t.includes("fallida"))
    return "bg-red-50 text-red-600 border border-red-100 font-bold";

  if (t.includes("cotizando") || t.includes("esperando"))
    return "bg-amber-50 text-amber-600 border border-amber-100";

  // Regla para fechas o confirmaciones
  if (t.includes("sept") || t.includes("oct") || t.includes("nov") || t.includes("dic") || t.includes("/") || t.match(/\d/))
    return "bg-emerald-50 text-emerald-600 border border-emerald-100 font-medium";

  return "bg-slate-50 text-slate-400";
}

// --- 3. RENDERIZADO DE LA TABLA ---
function render(filter = "") {
  tableBody.innerHTML = "";

  db.forEach(item => {
    // Filtro de búsqueda
    const str = `${item.local} ${item.region} ${item.id} ${item.frecuencia}`.toLowerCase();
    if (!str.includes(filter)) return;

    const tr = document.createElement('tr');
    tr.className = "hover:bg-slate-50 border-b border-slate-100 transition-colors group h-12";

    const searchLink = `https://drive.google.com/drive/search?q=${encodeURIComponent(item.id + " " + item.local)}`;
    const driveLink = linksMap[item.id] || searchLink;

    let html = `
      <!-- 1. Columna Salud -->
      <td class="p-2 sticky left-0 bg-white group-hover:bg-slate-50 border-r border-slate-200 z-20 text-center">
         <div class="w-3 h-3 mx-auto rounded-full bg-slate-300 border border-slate-400 opacity-50"></div>
      </td>

      <!-- 2. Columna ID + Nombre -->
      <td class="p-2 sticky left-12 bg-white group-hover:bg-slate-50 border-r border-slate-200 z-20 shadow-[2px_0_5px_rgba(0,0,0,0.02)]">
        <div class="flex items-center gap-2">
          <span class="font-mono text-xs font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100 min-w-[35px] text-center">
            ${item.id}
          </span>
          <div class="flex flex-col truncate w-48">
             <span class="font-bold text-slate-800 text-xs truncate cursor-pointer hover:text-indigo-600 transition-colors" title="${item.local}" onclick="openModal('${item.id}')">${item.local}</span>
             <span class="text-[9px] text-slate-400 truncate">${item.region}</span>
          </div>
        </div>
      </td>

      <!-- 3. Frecuencia -->
      <td class="p-2 text-center border-r border-slate-100">
        <span class="text-[9px] font-semibold text-slate-500 uppercase">
          ${item.frecuencia.substring(0, 3)}
        </span>
      </td>
    `;

    // 4. Meses
    item.meses.forEach(mesContent => {
      const style = getCellStyle(mesContent);
      let icon = "";
      // Iconos para simplificar visualmente
      if (style.includes("red")) icon = '<i class="fa-solid fa-xmark"></i>';
      else if (style.includes("emerald")) icon = '<i class="fa-solid fa-check"></i>';
      else if (style.includes("amber")) icon = '<i class="fa-solid fa-hourglass"></i>';
      else if (mesContent) icon = '•';

      html += `
        <td class="p-1 text-center border-r border-slate-50">
          <div class="w-full h-8 flex items-center justify-center text-[10px] rounded ${style}" title="${mesContent || ''}">
            ${icon}
          </div>
        </td>
      `;
    });

    // 5. Comentarios y Docs
    html += `
      <td class="p-2 bg-slate-50 border-r border-slate-200">
        <input type="text" class="input-invisible text-xs text-slate-600 placeholder-slate-300">
      </td>

      <td class="p-2 text-center">
        <a href="${driveLink}" target="_blank" 
           class="inline-block text-indigo-500 hover:text-indigo-700 hover:bg-indigo-50 px-2 py-1 rounded transition-colors">
           <i class="fa-brands fa-google-drive text-lg"></i>
        </a>
      </td>
    `;

    tr.innerHTML = html;
    tableBody.appendChild(tr);
  });
}

// --- 4. FUNCIONES DEL MODAL ---
function openModal(id) {
  const data = detailedData[id];
  const modal = document.getElementById('modal');

  if (!data) {
    console.warn(`No detailed data found for ID: ${id}`);
    return;
  }

  // Populate modal fields
  document.getElementById('modal-id').textContent = id;
  document.getElementById('modal-title').textContent = data.local || 'Sin nombre';
  document.getElementById('modal-direccion').textContent = data.direccion || '-';
  document.getElementById('modal-complejo').textContent = data.complejo || '-';
  document.getElementById('modal-gerente').textContent = data.gerente || '-';
  document.getElementById('modal-telefono').textContent = data.tel_gerente || '-';
  document.getElementById('modal-email').textContent = data.mail || '-';
  document.getElementById('modal-supervisor').textContent = data.region || '-';
  document.getElementById('modal-frecuencia').textContent = data.frecuencia || '-';
  document.getElementById('modal-proveedor').textContent = data.proveedor || '-';

  // Show modal
  modal.classList.remove('hidden');
}

function closeModal() {
  const modal = document.getElementById('modal');
  modal.classList.add('hidden');
}

// Close modal when pressing ESC key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeModal();
  }
});

// --- 5. INICIAR EVENT LISTENER Y RENDER ---
searchInput.addEventListener('input', (e) => render(e.target.value.toLowerCase()));
render();