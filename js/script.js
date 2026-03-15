let currentMode = 'pdfToWord';
const fileInput = document.getElementById('fileInput');
const convertBtn = document.getElementById('convertBtn');
const dropZone = document.getElementById('dropZone');

// Inicializa os anúncios do Google Adsense que estão no carregamento inicial
window.onload = () => {
    try {
        (adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
        console.log("Aguardando aprovação do Adsense");
    }
};

// Lógica de clique na zona de seleção
dropZone.onclick = () => fileInput.click();

fileInput.onchange = function() {
    if (this.files[0]) {
        // Atualiza os textos conforme a imagem
        document.getElementById('mainText').innerText = "Arquivo Selecionado!";
        document.getElementById('subText').innerText = this.files[0].name;
        convertBtn.innerText = "Converter Agora";
        convertBtn.style.background = "#00a8ff"; // Garante o azul vibrante
    }
};

convertBtn.onclick = async () => {
    const file = fileInput.files[0];
    if (!file) {
        fileInput.click();
        return;
    }

    // Visual de processamento
    convertBtn.disabled = true;
    convertBtn.innerText = "Processando...";
    document.getElementById('progressWrap').style.display = "block";
    
    // Simulação de progresso da barra
    let prog = 0;
    const interval = setInterval(() => {
        prog += 10;
        document.getElementById('progressBar').style.width = prog + "%";
        if(prog >= 100) clearInterval(interval);
    }, 100);

    try {
        // Lógica de conversão (Exemplo PDF para Word simulado)
        // Aqui você pode integrar a biblioteca pdf-lib ou sua API de conversão
        setTimeout(() => {
            const fileData = new Blob(["VitorConvert: Processamento Seguro"], {type: "application/msword"});
            const fileName = file.name.replace(/\.[^/.]+$/, "") + ".docx";
            startWaitSequence(fileData, fileName, "application/msword");
        }, 1500);

    } catch (err) {
        alert("Erro ao processar: " + err.message);
        location.reload();
    }
};

function startWaitSequence(data, name, type) {
    // Esconde a interface de seleção e mostra a de espera/anúncio
    document.getElementById('dropZone').style.display = "none";
    document.getElementById('progressWrap').style.display = "none";
    document.getElementById('waitSection').style.display = "block";
    convertBtn.style.display = "none";

    // Chama o segundo anúncio (o que fica na tela de espera)
    try {
        (adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {}

    let timeLeft = 5;
    const timerElem = document.getElementById('timer');
    
    const countdown = setInterval(() => {
        timeLeft--;
