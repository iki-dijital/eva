<footer>
    <div class="container">
        <div class="col-lg-6 offset-lg-3 d-flex f-c">
            <div class="social d-flex a-c j-e f-c">
                <span class="d-block">SOSYAL MEDYADA TAKİP EDİN</span>
                <div class="d-flex">
                    <a href="" class="d-block" target="_blank">
                        <?= getSprite("facebook") ?>
                    </a>
                    <a href="" class="d-block" target="_blank">
                        <?= getSprite("instagram") ?>
                    </a>
                </div>
            </div>
            <div class="newsletter">
                <span class="d-block">Yeniliklerden haberdar olmak için e-bültene abone olunuz</span>
                <label for="email" ara-label="E-posta adresiniz" class="d-flex p-rel">
                    <input type="email" id="email" name="email" placeholder="E-posta adresiniz">
                    <button title="ABONE OL" class="d-flex a-c j-c">ABONE OL</button>
                </label>
            </div>
            <div class="links d-flex a-c j-c">
                <a href="">Bilgi Toplumu Hizmetleri</a>
                <a href="">Çerezler Politikası</a>
                <a href="">KVKK Aydınlatma Metni</a>
            </div>
            <div class="copy">
                Copyright &copy; 2023 Tüm Hakladır Saklıdır EVA UNIFORM DESIGN
            </div>
        </div>
    </div>
</footer>
<script src="<?= domain ?>assets/js/main.js?v=<?= rand() ?>"></script>
</body>

</html>