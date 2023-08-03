export function mobileMenu() {
  let showMenu = false;
  const mobileMenu = document.querySelector('.mobileMenu');
  function toggleMenu(isActive) {
    if (isActive) {
      document
        .querySelectorAll('body, .mobileMenu, .menuButton')
        .forEach((e) => {
          e.classList.add('show');
        });
    } else {
      document
        .querySelectorAll('body, .mobileMenu, .menuButton')
        .forEach((e) => {
          e.classList.remove('show');
        });
    }
  }

  document
    .querySelector('.menuButton')
    .addEventListener('click', () => {
      showMenu = !showMenu;
      toggleMenu(showMenu);
    });

  mobileMenu.innerHTML =
    document.querySelector('.header_lg nav').innerHTML;

  mobileMenu.style.paddingTop =
    document.querySelector('.header_sm').clientHeight * 1.5 + 'px';
}
