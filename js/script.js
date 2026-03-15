let currentMode = 'img';
let selectedFile = null;
let isWaiting = false;

function triggerInput() {
    if (isWaiting) return;
    if (!selectedFile) {
        document.getElementById('fileInput').click();
    } else {
        startTimer();
    }
}

function handleFile(file) {
    if (!file) return;
    selectedFile = file;
    document.getElementById('mainText').innerText = "Arquivo: " + file.name;
    document.getElementById('actionBtn').innerText = "Converter Agora";
}

function startTimer() {
    isWaiting = true;
    let time = 5;
    const btn = document.getElementById('actionBtn');
    
    const interval = setInterval(() => {
        btn.innerText = `Aguarde ${time}s...`;
        btn.style.opacity = "0.7";
        time--;
        
        if (time < 0) {
            clearInterval(interval);
            btn.innerText = "Baixando...";
            btn.style.opacity = "1";
            if (currentMode === 'img') processImage();
            else { alert("Modo PDF indisponível."); resetBtn(); }
        }
    }, 1000);
}

async function processImage() {
    try {
        const { PDFDocument } = PDFLib;
        const pdfDoc = await PDFDocument.create();
        const bytes = await selectedFile.arrayBuffer();
        const image = selectedFile.type.includes("png") ? await pdfDoc.embedPng(bytes) : await pdfDoc.embedJpg(bytes);
        const page = pdfDoc.addPage([image.width, image.height]);
        page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });
        const pdfBytes = await pdfDoc.save();
        const link = document.createElement('a');
        link.href = URL.createObjectURL(new Blob([pdfBytes], { type: "application/pdf" }));
        link.download = "vitorconvert.pdf";
        link.click();
    } catch (e) { alert("Erro ao converter."); }
    resetBtn();
}

function resetBtn() {
    isWaiting = false;
    document.getElementById('actionBtn').innerText = "Escolher Arquivo";
}

function switchMode(mode) {
    if (isWaiting) return;
    currentMode = mode;
    document.querySelectorAll('.btn-mode').forEach(b => b.classList.remove('active'));
    document.getElementById('mode-' + mode).classList.add('active');
    document.getElementById('subText').innerText = mode === 'img' ? "Arquivos suportados: .jpg, .png" : "Arquivos suportados: .pdf";
}
