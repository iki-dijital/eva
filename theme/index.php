<?php

include "header.php";
?>
<main>
    <section class="banner">
        <div class="cm_container p-rel">
            <img src="<?= domain ?>assets/img/banner.webp" alt="Poeple with uniforms from different industries"
                class="p-abs">
            <div class="content p-rel w-100 h-100">
                <div class="container h-100 d-flex f-c">
                    <span>sizin için <br> <strong>hep aynı özenle.</strong></span>
                    <p>Her zaman en son moda trendlerini takip ediyor ve personelinizin giymekten gurur duyacağı en iyi
                        görünümlü, şık üniformalar için
                        üniforma tasarımlarımızı geliştiriyoruz.</p>
                </div>
            </div>
        </div>
    </section>
    <section class="about">
        <div class="container p-rel">
            <div class="text p-abs">hakkımızda</div>
            <div class="row">
                <div class="col-lg-6">
                    <div class="content">
                        <h2>Bizi ayrıcalıklı kılan şey, <br> tasarımlarımız.</h2>
                        <span class="d-block">EVA UNIFORM DESIGN HAKKINDA</span>
                        <p>For each project we establish relationships with partners who we know will help us create
                            added
                            value for your project. As well as bringing together the public and private sectors, we make
                            sector-overarching links to gather knowledge and to learn from each other. The way we
                            undertake
                            projects is based on permanently applying values that reinforce each other: socio-cultural
                            value, experiental value, building-technical value and economical value. This way of working
                            allows us to raise your project to a higher level.</p>
                    </div>
                </div>
                <div class="col-lg-4 offset-lg-2">
                    <img src="<?= domain ?>assets/img/mainabout-img.webp" alt="Makas ve iplik görseli" loading="lazy">
                </div>
            </div>
        </div>
    </section>
    <section class="services p-rel">
        <img src="<?= domain ?>assets/img/service-bg.webp" alt="Mezura görseli" class="p-abs w-100" loading="lazy">

        <div class="container">
            <div class="title">HİZMET ALANLARIMIZ</div>
            <div class="blaze-slider">
                <div class="blaze-container">
                    <div class="blaze-track-container">
                        <div class="blaze-track">
                            <?php for ($i = 1; $i <= 10; $i++): ?>
                                <a href="urundetay.php" title="Otel üniformaları" class="blaze-item">
                                    <img src="<?= domain ?>assets/img/service-<?= rand(1, 3) ?>.webp"
                                        alt="Üniformalı insanlar" loading="lazy">
                                    <span class="d-block">OTEL ÜNİFORMALARI</span>
                                </a>
                            <?php endfor; ?>
                        </div>
                    </div>
                    <div class="navigation d-flex a-c j-c">
                        <button class="blaze-prev d-flex a-c" aria-label="Geri">
                            <?= getSprite("arrow_right") ?>
                            <span>GERİ</span>
                        </button>
                        <button class="blaze-next d-flex a-c" aria-label="İleri">
                            <span>İLERİ</span>
                            <?= getSprite("arrow_right") ?>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <section class="how">
        <div class="container p-rel">
            <div class="text p-abs">NASIL ÇALIŞIYORUZ</div>
            <div class="row">
                <div class="col-lg-12">
                    <h2>NASIL ÇALIŞIYORUZ?</h2>
                </div>
                <div class="col-lg-12">
                    <div class="blaze-slider p-rel">
                        <div class="blaze-container">
                            <div class="blaze-track-container">
                                <div class="blaze-track">
                                    <?php for ($i = 1; $i <= 10; $i++): ?>
                                        <div class="item">
                                            <div class="row">
                                                <div class="col-lg-4">
                                                    <img src="<?= domain ?>assets/img/how-img.webp"
                                                        alt="El sıkışan insanlar" class="w-100" loading="lazy">
                                                </div>
                                                <div class="col-lg-7 offset-lg-1">
                                                    <h3>TANIŞMA <strong>GÖRÜŞMELERİ</strong></h3>
                                                    <p>İhtiyacınız olan üniforma üretimine başlamadan önce,
                                                        sizleri yakından tanıyor,isteklerinizi ve değerlerinizi
                                                        anlamaya çalışıyoruz.İşletmenizin iç ve dış dizaynını
                                                        dikkatli bir şekilde inceliyor ve edindiğimiz tüm detayları
                                                        titizlikle birleştiriyoruz.</p>
                                                </div>
                                            </div>
                                        </div>
                                    <?php endfor; ?>
                                </div>
                            </div>
                            <div class="navigation d-flex a-c j-c p-abs">
                                <button class="blaze-prev d-flex a-c" aria-label="Geri">
                                    <?= getSprite("angle_right") ?>
                                </button>
                                <button class="blaze-next d-flex a-c" aria-label="İleri">
                                    <?= getSprite("angle_right") ?>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</main>
<?php include "footer.php"; ?>