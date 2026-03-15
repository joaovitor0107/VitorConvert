const translations = {
    pt: {
        "header-p": "O jeito mais rápido de transformar seus documentos com segurança.",
        "mode-pdf": "PDF para Word", "mode-img": "Imagem para PDF",
        "drop-h3": "Selecione o arquivo ou arraste aqui", "drop-p": "Arquivos suportados: .pdf",
        "btn-main": "Escolher Arquivo", "footer-span": "PROCESSAMENTO LOCAL SEGURO",
        "support-pdf": "Arquivos suportados: .pdf", "support-img": "Arquivos suportados: .jpg, .png",
        "btn-convert": "Converter Agora"
    },
    en: {
        "header-p": "The fastest way to safely transform your documents.",
        "mode-pdf": "PDF to Word", "mode-img": "Image to PDF",
        "drop-h3": "Select file or drag here", "drop-p": "Supported files: .pdf",
        "btn-main": "Choose File", "footer-span": "SECURE LOCAL PROCESSING",
        "support-pdf": "Supported files: .pdf", "support-img": "Supported files: .jpg, .png",
        "btn-convert": "Convert Now"
    },
    es: {
        "header-p": "La forma más rápida de transformar sus documentos de forma segura.",
        "mode-pdf": "PDF a Word", "mode-img": "Imagen a PDF",
        "drop-h3": "Seleccione el archivo o arrastre aquí", "drop-p": "Archivos soportados: .pdf",
        "btn-main": "Elegir Archivo", "footer-span": "PROCESAMIENTO LOCAL SEGURO",
        "support-pdf": "Archivos soportados: .pdf", "support-img": "Archivos soportados: .jpg, .png",
        "btn-convert": "Convertir Ahora"
    }
};

let currentMode = 'pdf';

function changeLanguage(lang) {
    localStorage.setItem('prefLang', lang);
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang][key]) el.innerText = translations[lang][key];
    });
    
    // Atualiza textos de suporte
    const supportKey = currentMode === 'pdf' ? 'support-pdf' : 'support-img';
    document.getElementById('subText').innerText = translations[lang][supportKey];
    
    document.querySelectorAll('.lang-btn').forEach(btn => btn.classList.remove('active'));
    const activeBtn = document.getElementById('btn-' + lang);
    if(activeBtn) activeBtn.classList.add('active');
}

function switchMode(mode) {
    currentMode = mode;
    const lang = localStorage.getItem('prefLang') || 'pt';
    const fileInput = document.getElementById('fileInput');
    
    document.querySelectorAll('.btn-mode').forEach(btn => btn.classList.remove('active'));
    
    if(mode === 'pdf') {
        document.getElementById('mode-pdf').classList.add('active');
        fileInput.accept = ".pdf";
    } else {
        document.getElementById('mode-img').classList.add('active');
        fileInput.accept = "image/*";
    }
    
    document.getElementById('subText').innerText = translations[lang][mode === 'pdf' ? 'support-pdf' : 'support-img'];
    document.getElementById('mainText').innerText = translations[lang]['drop-h3'];
    document.querySelector('.btn-main').innerText = translations[lang]['btn-main'];
}

window.onload = () => {
    const saved = localStorage.getItem('prefLang') || 'pt';
    changeLanguage(saved);

    const fileInput = document.getElementById('fileInput');
    const dropZone = document.querySelector('.drop-zone');
    const btnMain = document.querySelector('.btn-main');
    const mainText = document.getElementById('mainText');

    // Forçar abertura do seletor
    [dropZone, btnMain].forEach(el => {
        el.onclick = (e) => {
            e.preventDefault();
            fileInput.click();
        };
    });

    // Detectar quando o arquivo entra no site
    fileInput.addEventListener('change', function() {
        if (this.files && this.files[0]) {
            const fileName = this.files[0].name;
            const lang = localStorage.getItem('prefLang') || 'pt';
            
            // FEEDBACK VISUAL: Mostra o nome do arquivo no card
            mainText.innerText = "Arquivo: " + fileName;
            mainText.style.color = "#00d2ff"; // Fica azul neon
            
            // Muda o texto do botão para indicar que está pronto
            btnMain.innerText = translations[lang]['btn-convert'];
            
            console.log("Arquivo carregado com sucesso:", fileName);
        }
    });
};
