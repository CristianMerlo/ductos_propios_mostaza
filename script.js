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
MSN;Yanina Solano;SALTA;Determinar;QZ;;;;;;;;;;;;
MUN;Yanina Solano;UNICENTER;Bimestral;CR;;;;;;;;;CANCELADO-LO REALIZA EL SHOPPING;;CANCELADO;
MCB;Yanina Solano;CASEROS;Bimestral;CR;;;;;;;;;18-sept;;LUNES 10/11;
MPF;Yanina Solano;PUERTO DE FRUTO;Bimestral;CR;;;;;;;;;8-sept;;VIERNES 07/11;
MTC;Yanina Solano;TIGRE CALLE;Bimestral;CR;;;;;;;;;CANCELADO-LO REALIZA EL SHOPPING;;LUNES 03/11;
;;;;;;;;;;;;;;;;
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
MPT;Pablo Baena;TUCUMAN 1;Trimestral;QZ;;;;;;;;;;;;
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
MMC;Pablo Baena;Posadas Calle;Determinar;QZ;;;;;;;;;;;;
MT2;JESICA ESPINOZA;FOOD TRUCK;VARIABLE;QZ;;;;;;;;;;;;`;

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
             <span class="font-bold text-slate-800 text-xs truncate" title="${item.local}">${item.local}</span>
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

// Iniciar Event Listener y Render
searchInput.addEventListener('input', (e) => render(e.target.value.toLowerCase()));
render();