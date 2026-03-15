et currentMode = 'pdf';
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
        count--;
        if (count < 0) {
            clearInterval(timer);
            btn.innerText = "Convertendo...";
            if (currentMode === 'img') processImg();
            else { alert("PDF para Word indisponível"); resetBtn(); }
        }
    }, 1000);
}

function resetBtn() {
    waiting = false;
    document.getElementById('actionBtn').innerText = "Converter Agora";
}

async function processImg() {
    try {
        const { PDFDocument } = PDFLib;
        const pdfDoc = await PDFDocument.create();
        const image = await (selectedFile.type.includes("png") ? pdfDoc.embedPng(await selectedFile.arrayBuffer()) : pdfDoc.embedJpg(await selectedFile.arrayBuffer()));
        const page = pdfDoc.addPage([image.width, image.height]);
        page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });
        const pdfBytes = await pdfDoc.save();
        const link = document.createElement('a');
        link.href = URL.createObjectURL(new Blob([pdfBytes], { type: "application/pdf" }));
        link.download = "convertido.pdf";
        link.click();
    } catch (e) { alert("Erro no arquivo."); }
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

function changeLanguage(lang) {
    document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('btn-' + lang).classList.add('active');
}
