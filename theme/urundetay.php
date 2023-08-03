<?php
$call_css = "index";
$call_js = "";
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
            <h2>OTEL ÜNİFORMALARI</h2>
            <span class="desc d-block">EVA UNIFORM DESIGN ÜRÜNLERİ İNCELEYEBİLİRSİNİZ</span>
            <ul class="nav nav-tabs d-flex j-c" id="prods-tab" role="tablist">
                <?php for ($i = 1; $i <= 6; $i++): ?>
                    <li class="nav-item p-rel" role="presentation">
                        <button class="nav-link <?= $i == 1 ? 'active' : '' ?>" id="tab-<?= $i ?>" data-bs-toggle="tab"
                            data-bs-target="#content-<?= $i ?>" type="button" role="tab" aria-controls="content-<?= $i ?>"
                            aria-selected="<?= $i == 1 ? 'true' : 'false' ?>">ÖNBÜRO KIYAFETLERİ</button>
                    </li>
                <?php endfor; ?>
            </ul>
            <div class="tab-content" id="prods-content">
                <?php for ($i = 1; $i <= 6; $i++): ?>
                    <div class="tab-pane fade <?= $i == 1 ? 'show active' : '' ?>" id="content-<?= $i ?>" role="tabpanel"
                        aria-labelledby="tab-<?= $i ?>">
                        <div class="row">
                            <?php for ($j = 1; $j <= 6; $j++):
                                $x = rand(1, 3);
                                ?>
                                <div class="col-lg-4">
                                    <a href="<?= domain ?>assets/img/prod-tab-<?= $x ?>.webp" class="glightbox d-block">
                                        <img src="<?= domain ?>assets/img/prod-tab-<?= $x ?>.webp" alt="Üniformalı personeller"
                                            class="w-100 h-100">
                                    </a>
                                </div>
                            <?php endfor; ?>
                        </div>
                    </div>
                <?php endfor; ?>
            </div>
        </div>
    </section>
</main>
<?php include "footer.php"; ?>