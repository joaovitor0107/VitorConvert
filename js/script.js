window.onload = () => {
    let currentMode = 'pdfToWord';
    const fileInput = document.getElementById('fileInput');
    const convertBtn = document.getElementById('convertBtn');
    const dropZone = document.getElementById('dropZone');

    // Troca de Modo
    document.getElementById('btnPdfToWord').onclick = (e) => switchMode('pdfToWord', e.currentTarget);
    document.getElementById('btnImgToPdf').onclick = (e) => switchMode('imgToPdf', e.currentTarget);

    function switchMode(mode, btn) {
        currentMode = mode;
        document.querySelectorAll('.btn-mode').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        fileInput.accept = mode === 'pdfToWord' ? '.pdf' : 'image/jpeg, image/png';
        document.getElementById('subText').innerText = "Arquivos suportados: " + (mode === 'pdfToWord' ? ".pdf" : ".jpg, .png");
        convertBtn.innerText = "Escolher Arquivo";
    }

    // Clique abre seletor
    dropZone.onclick = () => fileInput.click();
    convertBtn.onclick = () => {
        if (!fileInput.files[0]) {
            fileInput.click();
        } else {
            iniciarProcessamento();
        }
    };

    fileInput.onchange = function() {
        if (this.files[0]) {
            document.getElementById('mainText').innerText = "Arquivo Pronto!";
            document.getElementById('subText').innerText = this.files[0].name;
            convertBtn.innerText = "Converter Agora";
        }
    };

    async function iniciarProcessamento() {
        const file = fileInput.files[0];
        convertBtn.disabled = true;
        convertBtn.innerText = "Processando...";
        document.getElementById('progressWrap').style.display = "block";

        try {
            if (currentMode === 'imgToPdf') {
                const arrayBuffer = await file.arrayBuffer();
                const pdfDoc = await PDFLib.PDFDocument.create();
                let image = file.type === 'image/png' ? await pdfDoc.embedPng(arrayBuffer) : await pdfDoc.embedJpg(arrayBuffer);
                const page = pdfDoc.addPage([image.width, image.height]);
                page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });
                const pdfBytes = await pdfDoc.save();
                startWaitSequence(pdfBytes, file.name.split('.')[0] + '.pdf', 'application/pdf');
            } else {
                // Simulação PDF para Word
                const dummyData = new Blob(["Conteúdo extraído via VitorConvert"], {type: "application/msword"});
                setTimeout(() => startWaitSequence(dummyData, file.name.replace('.pdf', '.docx'), 'application/msword'), 1500);
            }
        } catch (err) {
            alert("Erro: " + err.message);
            location.reload();
        }
    }

    function startWaitSequence(data, name, type) {
        document.getElementById('dropZone').style.display = "none";
        document.getElementById('progressWrap').style.display = "none";
        document.getElementById('waitSection').style.display = "block";
        convertBtn.style.display = "none";

        let timeLeft = 5;
        const countdown = setInterval(() => {
            timeLeft--;
            document.getElementById('timer').innerText = timeLeft;
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
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => location.reload(), 1500);
    }
};
