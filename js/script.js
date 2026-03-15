let selectedFile = null;
let isWaiting = false;

function triggerInput() {
    if (isWaiting) return;
    if (!selectedFile) {
        document.getElementById('fileInput').click();
    } else {
        startAdCounter();
    }
}

function handleFile(file) {
    if (!file) return;
    selectedFile = file;
    document.getElementById('mainText').innerText = "Arquivo: " + file.name;
    document.getElementById('actionBtn').innerText = "Converter Agora";
}

function startAdCounter() {
    isWaiting = true;
    let seconds = 5;
    const btn = document.getElementById('actionBtn');
    
    // Bloqueia o botão durante a "propaganda"
    btn.disabled = true;

    const timer = setInterval(() => {
        btn.innerText = `Processando em ${seconds}s...`;
        seconds--;

        if (seconds < 0) {
            clearInterval(timer);
            btn.innerText = "Baixando...";
            btn.disabled = false;
            processAndDownload();
        }
    }, 1000);
}

async function processAndDownload() {
    try {
        const { PDFDocument } = PDFLib;
        const pdfDoc = await PDFDocument.create();
        const bytes = await selectedFile.arrayBuffer();
        
        let image;
        if (selectedFile.type.includes("png")) {
            image = await pdfDoc.embedPng(bytes);
        } else {
            image = await pdfDoc.embedJpg(bytes);
        }

        const page = pdfDoc.addPage([image.width, image.height]);
        page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });

        const pdfBytes = await pdfDoc.save();
        const link = document.createElement('a');
        link.href = URL.createObjectURL(new Blob([pdfBytes], { type: "application/pdf" }));
        link.download = "vitorconvert.pdf";
        link.click();
    } catch (e) {
        alert("Erro na conversão.");
    }
    resetState();
}

function resetState() {
    isWaiting = false;
    document.getElementById('actionBtn').innerText = "Converter Agora";
}
