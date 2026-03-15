window.onload = () => {
    let currentMode = 'pdfToWord';
    const fileInput = document.getElementById('fileInput');
    const convertBtn = document.getElementById('convertBtn');
    const dropZone = document.getElementById('dropZone');

    // Funções de Troca de Modo
    document.getElementById('btnPdfToWord').onclick = (e) => switchMode('pdfToWord', e.currentTarget);
    document.getElementById('btnImgToPdf').onclick = (e) => switchMode('imgToPdf', e.currentTarget);

    function switchMode(mode, btn) {
        currentMode = mode;
        document.querySelectorAll('.btn-mode').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        fileInput.accept = mode === 'pdfToWord' ? '.pdf' : 'image/jpeg, image/png';
        document.getElementById('subText').innerText = "Arquivos suportados: " + (mode === 'pdfToWord' ? ".pdf" : ".jpg, .png");
        
        // Reseta interface
        convertBtn.innerText = "Escolher Arquivo";
        document.getElementById('mainText').innerText = "Selecione o arquivo ou arraste aqui";
        fileInput.value = ""; 
    }

    // Clique na área abre o seletor
    dropZone.onclick = () => fileInput.click();

    fileInput.onchange = function() {
        if (this.files[0]) {
            document.getElementById('mainText').innerText = "Arquivo Pronto!";
            document.getElementById('subText').innerText = this.files[0].name;
            convertBtn.innerText = "Converter Agora";
        }
    };

    convertBtn.onclick = async () => {
        if (!fileInput.files[0]) {
            fileInput.click();
            return;
        }

        convertBtn.disabled = true;
        convertBtn.innerText = "Processando...";
        
        try {
            if (currentMode === 'imgToPdf') {
                const arrayBuffer = await fileInput.files[0].arrayBuffer();
                const pdfDoc = await PDFLib.PDFDocument.create();
                let image = fileInput.files[0].type === 'image/png' ? await pdfDoc.embedPng(arrayBuffer) : await pdfDoc.embedJpg(arrayBuffer);
                const page = pdfDoc.addPage([image.width, image.height]);
                page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });
                const pdfBytes = await pdfDoc.save();
                iniciarEspera(pdfBytes, fileInput.files[0].name.split('.')[0] + '.pdf', 'application/pdf');
            } else {
                // Simulação de PDF para Word
                const docData = new Blob(["Conteúdo via VitorConvert"], {type: "application/msword"});
                setTimeout(() => iniciarEspera(docData, fileInput.files[0].name.replace('.pdf', '.docx'), 'application/msword'), 1500);
            }
        } catch (e) {
            alert("Erro: " + e.message);
            location.reload();
        }
    };

    function iniciarEspera(data, name, type) {
        dropZone.style.display = "none";
        document.getElementById('waitSection').style.display = "block";
        convertBtn.style.display = "none";

        let tempo = 5;
        const interval = setInterval(() => {
            tempo--;
            document.getElementById('timer').innerText = tempo;
            if (tempo <= 0) {
                clearInterval(interval);
                const blob = new Blob([data], {type: type});
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = name;
                a.click();
                setTimeout(() => location.reload(), 2000);
            }
        }, 1000);
    }
};
