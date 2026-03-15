let currentMode = 'pdf';
let selectedFile = null;
let isWaiting = false;

function triggerInput() {
    if (isWaiting) return;
    if (!selectedFile) {
        document.getElementById('fileInput').click();
    } else {
        startCounter();
    }
}

function handleFile(file) {
    if (!file) return;
    selectedFile = file;
    document.getElementById('mainText').innerText = "Arquivo: " + file.name;
    document.getElementById('mainText').style.color = "#00d2ff";
    document.getElementById('actionBtn').innerText = "Converter Agora";
}

function startCounter() {
    isWaiting = true;
    let count = 5;
    const btn = document.getElementById('actionBtn');
    
    const timer = setInterval(() => {
        btn.innerText = `Aguarde ${count}s...`;
        btn.style.background = "#222";
        btn.style.color = "#fff";
        count--;
        if (count < 0) {
            clearInterval(timer);
            btn.innerText = "Convertendo...";
            btn.style.background = "#00d2ff";
            btn.style.color = "#061424";
            if (currentMode === 'img') processImg();
            else { alert("PDF para Word indisponível no momento."); resetBtn(); }
        }
    }, 1000);
}

function resetBtn() {
    isWaiting = false;
    document.getElementById('actionBtn').innerText = "Converter Agora";
}

async function processImg() {
    try {
        const { PDFDocument } = PDFLib;
        const pdfDoc = await PDFDocument.create();
        const imgBytes = await selectedFile.arrayBuffer();
        const image = selectedFile.type.includes("png") ? await pdfDoc.embedPng(imgBytes) : await pdfDoc.embedJpg(imgBytes);
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

function switchMode(mode) {
    if (isWaiting) return;
    currentMode = mode;
    selectedFile = null;
    document.querySelectorAll('.btn-mode').forEach(b => b.classList.remove('active'));
    document.getElementById('mode-' + mode).classList.add('active');
    document.getElementById('subText').innerText = mode === 'pdf' ? "Arquivos suportados: .pdf" : "Arquivos suportados: .jpg, .png";
    document.getElementById('mainText').innerText = "Selecione o arquivo ou arraste aqui";
    document.getElementById('mainText').style.color = "#fff";
    document.getElementById('actionBtn').innerText = "Escolher Arquivo";
}
