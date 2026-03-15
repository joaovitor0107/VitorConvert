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
        
        // Reseta o estado do botão ao trocar de modo
        convertBtn.innerText = "Escolher Arquivo";
        fileInput.value = ""; 
    }

    // Clique na DropZone abre o seletor
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
        
        // Se não tem arquivo, abre a seleção
        if (!file) { 
            fileInput.click(); 
            return; 
        }

        convertBtn.disabled = true;
        convertBtn.innerText = "Processando...";
        document.getElementById('progressWrap').style.display = "block";

        try {
            if (currentMode === 'imgToPdf') {
                // Conversão Real de Imagem para PDF
                const arrayBuffer = await file.arrayBuffer();
                const pdfDoc = await PDFLib.PDFDocument.create();
                
                let image;
                if (file.type === 'image/png') {
                    image = await pdfDoc.embedPng(arrayBuffer);
                } else {
                    image = await pdfDoc.embedJpg(arrayBuffer);
                }

                const page = pdfDoc.addPage([image.width, image.height]);
                page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });
                
                const pdfBytes = await pdfDoc.save();
                const fileName = file.name.split('.')[0] + '.pdf';
                
                startWaitSequence(pdfBytes, fileName, 'application/pdf');

            } else {
                // PDF para Word (Simulação por enquanto)
                const fileData = new Blob(["Conteúdo extraído via VitorConvert"], {type: "application/msword"});
                const fileName = file.name.replace('.pdf', '.docx');
                
                setTimeout(() => startWaitSequence(fileData, fileName, 'application/msword'), 1500);
            }
        } catch (err) {
            console.error(err);
            alert("Erro ao processar: " + err.message);
            convertBtn.disabled = false;
            convertBtn.innerText = "Tentar Novamente";
        }
    };

    function startWaitSequence(data, name, type) {
        document.getElementById('dropZone').style.display = "none";
        document.getElementById('progressWrap').style.display = "none";
        document.getElementById('waitSection').style.display = "block";
        convertBtn.style.display = "none";

        let timeLeft = 5;
        const timerElem = document.getElementById('timer');

        const countdown = setInterval(() => {
            timeLeft--;
            timerElem.innerText = timeLeft;
            if (timeLeft <= 0) {
                clearInterval(countdown);
                download(data, name, type);
            }
        }, 1000);
    }

    function download(data
