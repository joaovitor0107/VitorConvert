const translations = {
    pt: {
        "page-title": "VitorConvert | Converter PDF para Word e Imagem para PDF Grátis",
        "header-p": "O jeito mais rápido de transformar seus documentos com segurança.",
        "mode-pdf": "PDF para Word",
        "mode-img": "Imagem para PDF",
        "drop-h3": "Selecione o arquivo ou arraste aqui",
        "drop-p": "Arquivos suportados: .pdf",
        "wait-h4": "Seu arquivo está sendo processado!",
        "wait-p1": "O download iniciará em",
        "wait-p2": "segundos...",
        "btn-main": "Escolher Arquivo",
        "ad-h4": "Publicidade",
        "ad-p": "Ajude a manter o",
        "ad-span": "Anúncio Disponível",
        "footer-span": "PROCESSAMENTO LOCAL SEGURO",
        "status-ready": "Arquivo Pronto!",
        "status-processing": "Processando...",
        "status-convert": "Converter Agora",
        "support-img": "Arquivos suportados: .jpg, .png",
        "support-pdf": "Arquivos suportados: .pdf"
    },
    en: {
        "page-title": "VitorConvert | Convert PDF to Word and Image to PDF Free",
        "header-p": "The fastest way to transform your documents securely.",
        "mode-pdf": "PDF to Word",
        "mode-img": "Image to PDF",
        "drop-h3": "Select file or drag here",
        "drop-p": "Supported files: .pdf",
        "wait-h4": "Your file is being processed!",
        "wait-p1": "Download will start in",
        "wait-p2": "seconds...",
        "btn-main": "Choose File",
        "ad-h4": "Advertisement",
        "ad-p": "Help maintain",
        "ad-span": "Ad Available",
        "footer-span": "SECURE LOCAL PROCESSING",
        "status-ready": "File Ready!",
        "status-processing": "Processing...",
        "status-convert": "Convert Now",
        "support-img": "Supported files: .jpg, .png",
        "support-pdf": "Supported files: .pdf"
    },
    es: {
        "page-title": "VitorConvert | Convertir PDF a Word e Imagen a PDF Gratis",
        "header-p": "La forma más rápida de transformar sus documentos de forma segura.",
        "mode-pdf": "PDF a Word",
        "mode-img": "Imagen a PDF",
        "drop-h3": "Seleccione el archivo o arrastre aquí",
        "drop-p": "Archivos soportados: .pdf",
        "wait-h4": "¡Su archivo está siendo procesado!",
        "wait-p1": "La descarga comenzará en",
        "wait-p2": "segundos...",
        "btn-main": "Elegir Archivo",
        "ad-h4": "Publicidad",
        "ad-p": "Ayude a mantener",
        "ad-span": "Anuncio Disponible",
        "footer-span": "PROCESAMIENTO LOCAL SEGURO",
        "status-ready": "¡Archivo Listo!",
        "status-processing": "Procesando...",
        "status-convert": "Convertir Ahora",
        "support-img": "Archivos soportados: .jpg, .png",
        "support-pdf": "Archivos soportados: .pdf"
    }
};

function changeLanguage(lang) {
    try {
        localStorage.setItem('preferredLang', lang);
        
        // Título da página
        const titleTag = document.getElementById('page-title');
        if(titleTag) titleTag.innerText = translations[lang]["page-title"];

        // Elementos com data-i18n
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (translations[lang] && translations[lang][key]) {
                element.innerText = translations[lang][key];
            }
        });

        // Atualizar botões de idioma (visual)
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.remove('active');
            if(btn.innerText.toLowerCase() === lang) btn.classList.add('active');
        });
    } catch (e) {
        console.error("Erro ao trocar idioma:", e);
    }
}

window.addEventListener('load', () => {
    const savedLang = localStorage.getItem('preferredLang') || 'pt';
    changeLanguage(savedLang);
});
