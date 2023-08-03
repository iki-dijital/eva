<?php
$call_css = "index";
$call_js = "";
include "header.php";
?>
<main>
    <section class="page_banner p-rel">
        <img src="<?= domain ?>assets/img/page_banner.webp" alt="Kumaş kesen makas">
        <div class="container h-100 d-flex a-c">
            <div class="page_banner_title p-rel j-c a-c">
                İLETİŞİM
            </div>
        </div>
    </section>
    <section class='page_content contact_area'>
        <div class='container'>
            <div class='row'>
                <div class='col-lg-12'>
                    <h2>EVA UNIFORM DESIGN</h2>
                    <ul class='contact-info d-flex a-c'>
                        <li class='d-flex a-c w-100'>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 428.64 612">
                                <path
                                    d="M365.89 62.78C325.41 22.3 271.59 0 214.34 0S103.27 22.3 62.78 62.78c-74.91 74.91-84.22 215.84-20.16 301.23L214.34 612 385.8 364.36c64.32-85.74 55.01-226.67-19.91-301.58ZM216.31 290.59c-43.13 0-78.24-35.11-78.24-78.24s35.11-78.24 78.24-78.24 78.24 35.11 78.24 78.24-35.11 78.24-78.24 78.24Z" />
                            </svg>
                            <p>442. Sk. No:28 <strong>Konak / İZMİR</strong></p>
                        </li>
                        <li class='d-flex a-c'>
                            <svg viewBox="0 0 348.08 347.29">
                                <path
                                    d="m340.27 274.69-53.75-53.76c-10.71-10.66-28.44-10.34-39.52.74l-27.08 27.08c-1.71-.94-3.48-1.93-5.34-2.97-17.1-9.48-40.51-22.46-65.14-47.11-24.7-24.7-37.7-48.14-47.21-65.26-1-1.81-1.96-3.56-2.91-5.22l18.18-18.15 8.94-8.95c11.1-11.1 11.4-28.83.72-39.52L73.39 7.8C62.71-2.88 44.97-2.56 33.87 8.54L18.72 23.78l.41.41C14.05 30.67 9.8 38.15 6.65 46.21c-2.91 7.67-4.72 15-5.55 22.33-7.1 58.84 19.79 112.62 92.77 185.6 100.87 100.87 182.17 93.25 185.67 92.88 7.64-.91 14.96-2.74 22.4-5.63 7.99-3.12 15.46-7.36 21.94-12.43l.33.29 15.35-15.03c11.07-11.1 11.39-28.83.72-39.54Z" />
                            </svg>

                            <p>+90 553 <strong>873 33 29</strong></p>
                        </li>
                        <li class='d-flex a-c'>
                            <svg viewBox="0 0 612 464.83">
                                <path
                                    d="M539.36 0H72.64C32.59 0 0 31.29 0 69.76v325.31c0 38.46 32.59 69.76 72.64 69.76h466.72c40.05 0 72.64-31.29 72.64-69.76V69.76C612 31.3 579.42 0 539.36 0Zm0 403.24H72.64c-5.89 0-11.05-3.82-11.05-8.17V112.78l211.09 178.21c4.33 3.65 9.83 5.67 15.5 5.67h35.65c5.66 0 11.17-2.01 15.5-5.67l211.1-178.22v282.31c0 4.35-5.17 8.17-11.05 8.17ZM306 235.5 100.69 61.58h410.62L306 235.5Z" />
                            </svg>
                            <p><strong>edakaratas</strong>@evauniform.com</p>
                        </li>
                    </ul>
                    <button title='Yol Tarifi Al' data-coordinates='38.416556543194716, 27.133025326999462'
                        class='directions button-primary'>YOL TARİFİ AL</button>
                </div>
                <div class='col-lg-10'>
                    <div class='map-wrapper'>
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d225.73271882883137!2d27.13281767551024!3d38.416545696284494!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14bbd8e6b03b8b5b%3A0x3b54ccbebdbf1802!2zVcSfdXIsIDQ0Mi4gU2suIE5vOjI4LCAzNTI2MCBLb25hay_EsHptaXI!5e0!3m2!1sen!2str!4v1691064989050!5m2!1sen!2str"
                            style="border:0;" allowfullscreen="" loading="lazy"
                            referrerpolicy="no-referrer-when-downgrade"></iframe>
                    </div>
                </div>
                <div class='col-lg-8'>
                    <form action='' class='d-flex f-c'>
                        <span>İletişim Formu</span>
                        <label for='isim'>
                            <input type='text' name='isim' placeholder='Adınız Soyadınız' title='Adınız Soyadınız'>
                        </label>
                        <label for='gsm'>
                            <input type='tel' name='gsm' placeholder='GSM Numaranız' title='GSM Numaranız'>
                        </label>
                        <label for='mesaj'>
                            <textarea name='mesaj' id='mesaj' placeholder='Mesajınız' title='Mesajınız'></textarea>
                        </label>
                        <button type='submit' class='button-primary' title='Gönder'>GÖNDER</button>
                    </form>
                </div>
            </div>
        </div>
    </section>
</main>
<?php include "footer.php"; ?>