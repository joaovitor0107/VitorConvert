let currentMode = 'pdfToWord';
const fileInput = document.getElementById('fileInput');
const convertBtn = document.getElementById('convertBtn');
const dropZone = document.getElementById('dropZone');

document.getElementById('btnPdfToWord').onclick = (e) => switchMode('pdfToWord', e.currentTarget);
document.getElementById('btnImgToPdf').onclick = (e) => switchMode('imgToPdf', e.currentTarget);

function switchMode(mode, btn) {
    currentMode = mode;
    document.querySelectorAll('.btn-mode').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    fileInput.accept = mode === 'pdfToWord' ? '.pdf' : 'image/jpeg, image/png';
    document.getElementById('subText').innerText = "Arquivos suportados: " + (mode === 'pdfToWord' ? ".pdf" : ".jpg, .png");
}

dropZone.onclick = () => fileInput.click();

fileInput.onchange = function() {
    if (this.files[0]) {
        document.getElementById('mainText').innerText = "Arquivo Pronto!";
        document.getElementById('subText').innerText = this.files[0].name;
        convertBtn.innerText = "Converter Agora";
    }
};

convertBtn.onclick = async () => {
    const file = fileInput.files[0];
    if (!file) { fileInput.click(); return; }

    convertBtn.disabled = true;
    convertBtn.innerText = "Processando...";
    document.getElementById('progressWrap').style.display = "block";

    try {
        let fileData, fileName, fileType;

        if (currentMode === 'imgToPdf') {
            const reader = new FileReader();
            reader.onload = async (e) => {
                const imgData = e.target.result;
                const pdfDoc = await PDFLib.PDFDocument.create();
                const image = file.type === 'image/png' ? await pdfDoc.embedPng(imgData) : await pdfDoc.embedJpg(imgData);
                const page = pdfDoc.addPage([image.width, image.height]);
                page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });
                fileData = await pdfDoc.save();
                fileName = file.name.split('.')[0] + '.pdf';
                fileType = 'application/pdf';
                startWaitSequence(fileData, fileName, fileType);
            };
            reader.readAsArrayBuffer(file);
        } else {
            // PDF para Word (Simulado)
            fileData = new Blob(["Conteúdo extraído via VitorConvert"], {type: "application/msword"});
            fileName = file.name.replace('.pdf', '.docx');
            fileType = 'application/msword';
            setTimeout(() => startWaitSequence(fileData, fileName, fileType), 1000);
        }
    } catch (err) {
        alert("Erro: " + err.message);
        location.reload();
    }
};

function startWaitSequence(data, name, type) {
    document.getElementById('dropZone').style.display = "none";
    document.getElementById('progressWrap').style.display = "none";
    document.getElementById('waitSection').style.display = "block";
    convertBtn.style.display = "none";

    let timeLeft = 5;
    const timerElem = document.getElementById('timer');
    
    // Opcional: Abre uma aba de anúncio no início da espera
    // window.open('https://seu-link-de-anuncio.com', '_blank');

    const countdown = setInterval(() => {
        timeLeft--;
        timerElem.innerText = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(countdown);
            download(data, name, type);
        }
    }, 1000);
}

function download(data, name, type) {
    const blob = data instanceof Blob ? data : new Blob([data], {type: type});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    a.click();
    
    setTimeout(() => {
        alert("Download Concluído!");
        location.reload();
    }, 1000);
}
