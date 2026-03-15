let currentMode = 'pdf';
let selectedFile = null;
let isWaiting = false;

// Abre o seletor de arquivos
function triggerAction() {
    if (isWaiting) return;
    if (!selectedFile) {
        document.getElementById('fileInput').click();
    } else {
        startCounter();
    }
}

// Gerencia o arquivo selecionado
function handleFile(file) {
    if (!file) return;
    selectedFile = file;
    document.getElementById('mainText').innerText = "Arquivo: " + file.name;
    document.getElementById('mainText').style.color = "#00d2ff";
    document.getElementById('actionBtn').innerText = "Converter Agora";
}

// Contador de 5 segundos antes da conversão
function startCounter() {
    isWaiting = true;
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
            
            if (currentMode === 'img') {
                processImg();
            } else {
                alert("O motor de PDF para Word está em manutenção. Use Imagem para PDF.");
                resetBtn();
            }
        }
    }, 1000);
}

// Reseta o botão para o estado original
function resetBtn() {
    isWaiting = false;
    document.getElementById('actionBtn').innerText = "Converter Agora";
}

// Conversão Real: Imagem -> PDF
async function processImg() {
    try {
        const { PDFDocument } = PDFLib;
        const pdfDoc = await PDFDocument.create();
        const imageBytes = await selectedFile.arrayBuffer();
        
        let image;
        if (selectedFile.type === "image/png") {
            image = await pdfDoc.embedPng(imageBytes);
        } else {
            image = await pdfDoc.embedJpg(imageBytes);
        }
        
        const page = pdfDoc.addPage([image.width, image.height]);
        page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });
        
        const pdfBytes = await pdfDoc.save();
        const link = document.createElement('a');
        link.href = URL.createObjectURL(new Blob([pdfBytes], { type: "application/pdf" }));
        link.download = selectedFile.name.split('.')[0] + ".pdf";
        link.click();
    } catch (e) {
        alert("Erro ao converter arquivo. Tente JPG ou PNG.");
    }
    resetBtn();
}

// Alterna entre os modos de conversão
function switchMode(mode) {
    if (isWaiting) return;
    currentMode = mode;
    selectedFile = null;
    
    // UI Updates
    document.querySelectorAll('.btn-mode').forEach(b => b.classList.remove('active'));
    document.getElementById('mode-' + mode).classList.add('active');
    
    document.getElementById('fileInput').accept = mode === 'pdf' ? ".pdf" : "image/*";
    document.getElementById('subText').innerText = mode === 'pdf' ? "Arquivos suportados: .pdf" : "Arquivos suportados: .jpg, .png";
    document.getElementById('mainText').innerText = "Selecione o arquivo ou arraste aqui";
    document.getElementById('mainText').style.color = "#fff";
    document.getElementById('actionBtn').innerText = "Escolher Arquivo";
}

// Previne comportamento padrão do navegador ao arrastar arquivos
window.addEventListener("dragover", e => e.preventDefault());
window.addEventListener("drop", e => e.preventDefault());
