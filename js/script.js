let currentMode = 'pdf';
let selectedFile = null;
let waiting = false;

function triggerInput() {
    if (waiting) return;
    if (!selectedFile) {
        document.getElementById('fileInput').click();
    } else {
        startCountdown();
    }
}

function handleFile(file) {
    if (!file) return;
    selectedFile = file;
    document.getElementById('mainText').innerText = "Arquivo: " + file.name;
    document.getElementById('mainText').style.color = "#00d2ff";
    document.getElementById('actionBtn').innerText = "Converter Agora";
}

function startCountdown() {
    waiting = true;
    let count = 5;
    const btn = document.getElementById('actionBtn');
    
    const timer = setInterval(() => {
        btn.innerText = Aguarde ${count}s...;
        btn.style.opacity = "0.7";
        count--;
        
        if (count < 0) {
            clearInterval(timer);
            btn.innerText = "Convertendo...";
            btn.style.opacity = "1";
            if (currentMode === 'img') {
                processarImagem();
            } else {
                alert("Função PDF para Word requer processamento via servidor.");
                resetBtn();
            }
        }
    }, 1000);
}

function resetBtn() {
    waiting = false;
    document.getElementById('actionBtn').innerText = "Converter Agora";
}

async function processarImagem() {
    try {
        const { PDFDocument } = PDFLib;
        const pdfDoc = await PDFDocument.create();
        const arrayBuffer = await selectedFile.arrayBuffer();
        let image;

        if (selectedFile.type.includes("png")) {
            image = await pdfDoc.embedPng(arrayBuffer);
        } else {
            image = await pdfDoc.embedJpg(arrayBuffer);
        }

        const page = pdfDoc.addPage([image.width, image.height]);
        page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });

        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([pdfBytes], { type: "application/pdf" });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = selectedFile.name.split('.')[0] + ".pdf";
        link.click();
    } catch (e) {
        alert("Erro na conversão. Use JPG ou PNG.");
    }
    resetBtn();
}

function switchMode(mode) {
    if (waiting) return;
    currentMode = mode;
    selectedFile = null;
    document.querySelectorAll('.btn-mode').forEach(b => b.classList.remove('active'));
    document.getElementById('mode-' + mode).classList.add('active');
    document.getElementById('fileInput').accept = mode === 'pdf' ? ".pdf" : "image/*";
    document.getElementById('subText').innerText = mode === 'pdf' ? "Arquivos suportados: .pdf" : "Arquivos suportados: .jpg, .png";
    document.getElementById('mainText').innerText = "Selecione o arquivo ou arraste aqui";
    document.getElementById('mainText').style.color = "#fff";
    document.getElementById('actionBtn').innerText = "Escolher Arquivo";
}

function changeLanguage(lang) {
    document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('btn-' + lang).classList.add('active');
}

// Prevenir abertura acidental de arquivos no navegador
window.addEventListener("dragover", e => e.preventDefault());
window.addEventListener("drop", e => e.preventDefault());
