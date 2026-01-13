#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Configuration
const SOURCE_DIR = path.join(__dirname, 'source');
const TEMPLATE_FILE = path.join(__dirname, 'template.html');
const OUTPUT_FILE = path.join(__dirname, 'informe_final.html');

/**
 * Read all files from the source directory
 */
function readSourceFiles() {
    if (!fs.existsSync(SOURCE_DIR)) {
        console.error(`❌ Error: La carpeta 'source' no existe en ${SOURCE_DIR}`);
        process.exit(1);
    }

    const files = fs.readdirSync(SOURCE_DIR);
    const textFiles = [];
    const imageFiles = [];

    files.forEach(file => {
        const ext = path.extname(file).toLowerCase();
        const filePath = path.join(SOURCE_DIR, file);

        if (!fs.statSync(filePath).isFile()) return;

        if (ext === '.txt') {
            textFiles.push(filePath);
        } else if (['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext)) {
            imageFiles.push(filePath);
        }
    });

    return { textFiles, imageFiles };
}

/**
 * Read text content from files
 */
function readTextContent(textFiles) {
    if (textFiles.length === 0) {
        console.warn('⚠️  Advertencia: No se encontraron archivos .txt en la carpeta source');
        return '';
    }

    // Read the first text file (or combine all if needed)
    const content = fs.readFileSync(textFiles[0], 'utf-8');
    console.log(`✓ Contenido de texto leído: ${textFiles[0]}`);
    return content;
}

/**
 * Convert images to base64 for embedding
 */
function convertImageToBase64(imagePath) {
    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = imageBuffer.toString('base64');
    const ext = path.extname(imagePath).toLowerCase().replace('.', '');
    const mimeType = ext === 'jpg' ? 'jpeg' : ext;
    return `data:image/${mimeType};base64,${base64Image}`;
}

/**
 * Generate HTML for image gallery
 */
function generateImageGallery(imageFiles) {
    if (imageFiles.length === 0) {
        return '<p class="no-images">No se encontraron imágenes en el informe.</p>';
    }

    // Sort images alphabetically
    imageFiles.sort();

    let galleryHTML = '<div class="image-gallery">\n';

    imageFiles.forEach((imagePath, index) => {
        const base64Image = convertImageToBase64(imagePath);
        const fileName = path.basename(imagePath);

        galleryHTML += `    <div class="image-item">
        <img src="${base64Image}" alt="Imagen ${index + 1}: ${fileName}" loading="lazy">
        <p class="image-caption">Figura ${index + 1}: ${fileName}</p>
    </div>\n`;

        console.log(`✓ Imagen procesada: ${fileName}`);
    });

    galleryHTML += '</div>';
    return galleryHTML;
}

/**
 * Format text content with proper paragraphs
 */
function formatTextContent(text) {
    // Split by double line breaks to create paragraphs
    const paragraphs = text.split(/\n\s*\n/);

    let formattedHTML = '';
    paragraphs.forEach(para => {
        const trimmed = para.trim();
        if (trimmed) {
            // Check if it looks like a heading (all caps or starts with number)
            if (trimmed === trimmed.toUpperCase() && trimmed.length < 100) {
                formattedHTML += `<h3>${trimmed}</h3>\n`;
            } else if (/^\d+\./.test(trimmed)) {
                formattedHTML += `<h4>${trimmed}</h4>\n`;
            } else {
                formattedHTML += `<p>${trimmed.replace(/\n/g, '<br>')}</p>\n`;
            }
        }
    });

    return formattedHTML;
}

/**
 * Generate the final report
 */
function generateReport() {
    console.log('\n🚀 Iniciando generación de informe técnico...\n');

    // Read template
    if (!fs.existsSync(TEMPLATE_FILE)) {
        console.error(`❌ Error: No se encontró el archivo template.html en ${TEMPLATE_FILE}`);
        process.exit(1);
    }

    let template = fs.readFileSync(TEMPLATE_FILE, 'utf-8');
    console.log('✓ Template cargado');

    // Read source files
    const { textFiles, imageFiles } = readSourceFiles();
    console.log(`✓ Encontrados: ${textFiles.length} archivo(s) de texto, ${imageFiles.length} imagen(es)\n`);

    // Process content
    const textContent = readTextContent(textFiles);
    const formattedContent = formatTextContent(textContent);
    const imageGallery = generateImageGallery(imageFiles);

    // Get report title from source folder or use default
    const reportTitle = path.basename(SOURCE_DIR) === 'source'
        ? 'Informe Técnico Profesional'
        : `Informe Técnico - ${path.basename(SOURCE_DIR)}`;

    // Get current date
    const reportDate = new Date().toLocaleDateString('es-AR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    // Replace placeholders
    template = template.replace('{{REPORT_TITLE}}', reportTitle);
    template = template.replace('{{REPORT_DATE}}', reportDate);
    template = template.replace('{{REPORT_CONTENT}}', formattedContent);
    template = template.replace('{{IMAGE_GALLERY}}', imageGallery);

    // Write output file
    fs.writeFileSync(OUTPUT_FILE, template, 'utf-8');

    console.log(`\n✅ ¡Informe generado exitosamente!`);
    console.log(`📄 Archivo: ${OUTPUT_FILE}`);
    console.log(`📊 Contenido: ${textFiles.length} texto(s), ${imageFiles.length} imagen(es)`);
    console.log(`\n💡 Abre el archivo en tu navegador para visualizarlo.\n`);
}

// Run the generator
generateReport();
