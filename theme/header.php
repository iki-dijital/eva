<?php

include "components/define-domain.php";
include "components/svg-sprite.php";

?>
<!doctype html>
<html lang="tr" dir="ltr">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <meta name="author" content="İki Dijital, info@ikidijital.com">
    <meta name="description" content="Eva Uniform Design">
    <title>Eva Uniform Design</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800&display=swap"
        rel="stylesheet">
    <link rel="stylesheet" href="<?= domain ?>assets/css/main.css?v=<?= rand() ?>">
</head>

<body>

    <header class="header_lg p-rel">
        <div class="container">
            <div class="row">
                <div class="col-lg-3">
                    <a href="" title="Ana sayfaya git" class="logo d-block">
                        <img src="<?= domain ?>assets/img/logo.webp" fetchpriority="high" alt="Eva uniform design logo">
                    </a>
                </div>
                <div class="col-lg-5 offset-lg-1">
                    <nav aria-label="Main menu" class="d-flex a-e h-100">
                        <a href="index.php" title="Ana sayfa" class="p-rel d-block">Ana Sayfa</a>
                        <a href="kurumsal.php" title="Kurumsal" class="p-rel d-block">Kurumsal</a>
                        <a href="" title="Hizmet alanları" class="p-rel d-block">Hizmet Alanları</a>
                        <a href="" title="İletişim" class="p-rel d-block">İletişim</a>
                    </nav>
                </div>
                <div class="col-lg-3 p-rel" id="blue_ribbon">
                    <div class="lang d-flex j-e">
                        <a href="" title="Türkçe" class="p-rel d-block">TR</a>
                        <a href="" title="İngilizce" class="p-rel d-block">EN</a>
                    </div>
                    <div class="social d-flex a-c j-e">
                        <span class="d-block">TAKİP EDİN: </span>
                        <div class="d-flex">
                            <a href="" class="d-block" target="_blank">
                                <?= getSprite("facebook") ?>
                            </a>
                            <a href="" class="d-block" target="_blank">
                                <?= getSprite("twitter") ?>
                            </a>
                            <a href="" class="d-block" target="_blank">
                                <?= getSprite("instagram") ?>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </header>
    <header class="header_sm">
        <div class="container">
            <div class="row">
                <div class="col-6">
                    <a href="" class="logo" title="Ana sayfaya git">
                        <img src="<?= domain ?>assets/img/logo.webp" alt="Eva uniform logo">
                    </a>
                </div>
                <div class="col-6">
                    <div class="menuButton d-flex a-c">
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
            </div>
        </div>
    </header>

    <div class="mobileMenu"></div>