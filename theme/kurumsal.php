<?php

include "header.php";
?>
<main>
    <section class="page_banner p-rel">
        <img src="<?= domain ?>assets/img/page_banner.webp" alt="Kumaş kesen makas">
        <div class="container h-100 d-flex a-c">
            <div class="page_banner_title p-rel j-c a-c">
                KURUMSAL
            </div>
        </div>
    </section>
    <section class="page_content">
        <div class="container">
            <h2>The standard Lorem Ipsum passage, used since the 1500s</h2>
            <p>"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
                ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
                fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia
                deserunt mollit anim id est laborum."</p>
            <h2>Section 1.10.32 of "de Finibus Bonorum et Malorum", written by Cicero in 45 BC</h2>
            <p>"Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam
                rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt
                explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia
                consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui
                dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora
                incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum
                exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem
                vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum
                qui dolorem eum fugiat quo voluptas nulla pariatur?"</p>
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