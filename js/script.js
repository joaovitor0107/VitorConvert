let currentMode = 'pdf';
let selectedFile = null;
let waiting = false;

function triggerInput() {
    if (waiting) return;
    if (!selectedFile) {
        document.getElementById('fileInput').click();
    } else {
        startCounter();
    }
}

function handleFile(file) {
    if (!file) return;
    selectedFile = file;
    const main = document.getElementById('mainText');
    main.innerText = "Arquivo: " + file.name;
    main.style.color = "#00d2ff";
    document.getElementById('actionBtn').innerText = "Converter Agora";
}

function startCounter() {
    waiting = true;
    let count = 5;
    const btn = document.getElementById('actionBtn');
    
    const timer = setInterval(() => {
        btn.innerText = `Aguarde ${count}s...`;
        btn.style.background = "#444";
        count--;
        if (count < 0) {
            clearInterval(timer);
            btn.innerText = "Convertendo...";
            btn.style.background = "#00d2ff";
            if (currentMode === 'img') processarImg();
            else { alert("PDF para Word em breve."); resetBtn(); }
        }
    }, 1000);
}

function resetBtn() {
    waiting = false;
    document.getElementById('actionBtn').innerText = "Converter Agora";
}

async function processarImg() {
    try {
        const { PDFDocument } = PDFLib;
        const pdfDoc = await PDFDocument.create();
        const arrayBuffer = await selectedFile.arrayBuffer();
        let image = selectedFile.type === "image/png" ? await pdfDoc.embedPng(arrayBuffer) : await pdfDoc.embedJpg(arrayBuffer);
        const page = pdfDoc.addPage([image.width, image.height]);
        page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });
        const pdfBytes = await pdfDoc.save();
        const link = document.createElement('a');
        link.href = URL.createObjectURL(new Blob([pdfBytes], { type: "application/pdf" }));
        link.download = "convertido.pdf";
        link.click();
    } catch (e) { alert("Erro ao converter."); }
    resetBtn();
}

function switchMode(mode) {
    if (waiting) return;
    currentMode = mode;
    selectedFile = null;
    document.querySelectorAll('.btn-mode').forEach(b => b.classList.remove('active'));
    document.getElementById('mode-' + mode).classList.add('active');
    document.getElementById('subText').innerText = mode === 'pdf' ? "Arquivos suportados: .pdf" : "Arquivos suportados: .jpg, .png";
    document.getElementById('mainText').innerText = "Selecione o arquivo ou arraste aqui";
    document.getElementById('mainText').style.color = "#fff";
    document.getElementById('actionBtn').innerText = "Escolher Arquivo";
}

window.addEventListener("dragover", e => e.preventDefault());
window.addEventListener("drop", e => e.preventDefault());
