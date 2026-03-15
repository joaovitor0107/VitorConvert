<div class="container">
    <div class="lang-switcher">
        <button class="lang-btn" onclick="changeLanguage('pt')">PT</button>
        <button class="lang-btn" onclick="changeLanguage('en')">EN</button>
        <button class="lang-btn" onclick="changeLanguage('es')">ES</button>
    </div>

    <header>
        <div class="logo">Vitor<span>Convert</span></div>
        <p data-i18n="header-p">O jeito mais rápido de transformar seus documentos com segurança.</p>
    </header>

    <main class="card">
        <div class="mode-selector">
            <button class="btn-mode active" id="btnPdfToWord" data-i18n="mode-pdf">PDF para Word</button>
            <button class="btn-mode" id="btnImgToPdf" data-i18n="mode-img">Imagem para PDF</button>
        </div>

        <div class="drop-zone" id="dropZone">
            <h3 id="mainText" data-i18n="drop-h3">Selecione o arquivo ou arraste aqui</h3>
            <p id="subText" data-i18n="support-pdf">Arquivos suportados: .pdf</p>
        </div>

        <input type="file" id="fileInput" hidden>
        <button class="btn-main" id="convertBtn" data-i18n="btn-main">Escolher Arquivo</button>
    </main>

    <section class="monetization-box">
        <div class="ad-card">
            <h4 data-i18n="ad-h4">Publicidade</h4>
            <p><span data-i18n="ad-p">Ajude a manter o</span> VitorConvert</p>
            <div class="ad-slot" data-i18n="ad-span">Anúncio Disponível</div>
        </div>
    </section>

    <footer>
        <p>© 2026 VITORCONVERT • <span data-i18n="footer-span">PROCESSAMENTO LOCAL SEGURO</span></p>
    </footer>
</div>
