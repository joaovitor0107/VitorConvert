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
    localStorage.setItem('preferredLang', lang);
    document.getElementById('page-title').innerText = translations[lang]["page-title"];
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[lang][key]) {
            element.innerText = translations[lang][key];
        }
    });
}

window.onload = () => {
    // Inicializa idioma
    const savedLang = localStorage.getItem('preferredLang') || 'pt';
    changeLanguage(savedLang);

    let currentMode = 'pdfToWord';
    const fileInput = document.getElementById('fileInput');
    const convertBtn = document.getElementById('convertBtn');
    const dropZone = document.getElementById('dropZone');

    document.getElementById('btnPdfToWord').onclick = (e) => switchMode('pdfToWord', e.currentTarget);
    document.getElementById('btnImgToPdf').onclick = (e) => switchMode('imgToPdf', e.currentTarget);

    function switchMode(mode, btn) {
        const lang = localStorage.getItem('preferredLang') || 'pt';
        currentMode = mode;
        document.querySelectorAll('.btn-mode').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        fileInput.accept = mode === 'pdfToWord' ? '.pdf' : 'image/jpeg, image/png';
        
        // Texto dinâmico traduzido
        document.getElementById('subText').innerText = translations[lang][mode === 'pdfToWord' ? 'support-pdf' : 'support-img'];
        convertBtn.innerText = translations[lang]['btn-main'];
        document.getElementById('mainText').innerText = translations[lang]['drop-h3'];
        fileInput.value = ""; 
    }

    dropZone.onclick = () => fileInput.click();

    fileInput.onchange = function() {
        if (this.files[0]) {
            const lang = localStorage.getItem('preferredLang') || 'pt';
            document.getElementById('mainText').innerText = translations[lang]['status-ready'];
            document.getElementById('subText').innerText = this.files[0].name;
            convertBtn.innerText = translations[lang]['status-convert'];
        }
    };

    convertBtn.onclick = async () => {
        const lang = localStorage.getItem('preferredLang') || 'pt';
        if (!fileInput.files[0]) {
            fileInput.click();
            return;
        }

        convertBtn.disabled = true;
        convertBtn.innerText = translations[lang]['status-processing'];
        
        try {
            if (currentMode === 'imgToPdf') {
                const arrayBuffer = await fileInput.files[0].arrayBuffer();
                const pdfDoc = await PDFLib.PDFDocument.create();
                let image = fileInput.files[0].type === 'image/png' ? await pdfDoc.embedPng(arrayBuffer) : await pdfDoc.embedJpg(arrayBuffer);
                const page = pdfDoc.addPage([image.width, image.height]);
                page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });
                const pdfBytes = await pdfDoc.save();
                iniciarEspera(pdfBytes, fileInput.files[0].name.split('.')[0] + '.pdf', 'application/pdf');
            } else {
                const docData = new Blob(["Conteúdo via VitorConvert"], {type: "application/msword"});
                setTimeout(() => iniciarEspera(docData, fileInput.files[0].name.replace('.pdf', '.docx'), 'application/msword'), 1500);
            }
        } catch (e) {
            alert("Erro: " + e.message);
            location.reload();
        }
    };

    function iniciarEspera(data, name, type) {
        dropZone.style.display = "none";
        document.getElementById('waitSection').style.display = "block";
        convertBtn.style.display = "none";

        let tempo = 5;
        const interval = setInterval(() => {
            tempo--;
            document.getElementById('timer').innerText = tempo;
            if (tempo <= 0) {
                clearInterval(interval);
                const blob = new Blob([data], {type: type});
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = name;
                a.click();
                setTimeout(() => location.reload(), 2000);
            }
        }, 1000);
    }
};

// Tornar a função global para os botões do HTML funcionarem
window.changeLanguage = changeLanguage;
