<?php

include "header.php";
?>
<main>
    <section class="page_banner p-rel">
        <img src="<?= domain ?>assets/img/page_banner.webp" alt="Kumaş kesen makas" class="w-100">
        <div class="container h-100 d-flex a-c">
            <div class="page_banner_title p-rel j-c a-c">
                HİZMET ALANLARI
            </div>
        </div>
    </section>
    <section class="prods">
        <div class="container">
            <h2>HİZMET ALANLARIMIZ</h2>
            <span class="desc d-block">EVA UNIFORM DESIGN ÜRÜNLERİ İNCELEYEBİLİRSİNİZ</span>
            <div class="prods_wrapper d-flex j-b">
                <?php for ($i = 1; $i <= 5; $i++): ?>
                    <a href="urundetay.php" class="prod p-rel d-block" title="Otel üniformaları incele">
                        <img src="<?=domain?>assets/img/prod-<?= $i ?>.webp" alt="Otel üniformaları" class="w-100 h-100">
                        <div class="overlay p-abs">
                            <span class="d-block w-100">OTEL ÜNİFORMALARI</span>
                            <button title="Ürünleri incele" type="button">ÜRÜNLERİ İNCELE</button>
                        </div>
                    </a>
                <?php endfor; ?>
            </div>
        </div>
    </section>
</main>
<?php include "footer.php"; ?>