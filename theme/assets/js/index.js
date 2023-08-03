(() => {
  // src/js/lib/common.js
  function mobileMenu() {
    let showMenu = false;
    const mobileMenu2 = document.querySelector(".mobileMenu");
    function toggleMenu(isActive) {
      if (isActive) {
        document.querySelectorAll("body, .mobileMenu, .menuButton").forEach((e) => {
          e.classList.add("show");
        });
      } else {
        document.querySelectorAll("body, .mobileMenu, .menuButton").forEach((e) => {
          e.classList.remove("show");
        });
      }
    }
    document.querySelector(".menuButton").addEventListener("click", () => {
      showMenu = !showMenu;
      toggleMenu(showMenu);
    });
    mobileMenu2.innerHTML = document.querySelector("nav.navbar").innerHTML;
    mobileMenu2.style.paddingTop = document.querySelector(".mobileHeader").clientHeight * 1.5 + "px";
  }

  // src/js/pages/index.js
  mobileMenu();
})();
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vLi4vc3JjL2pzL2xpYi9jb21tb24uanMiLCAiLi4vLi4vLi4vc3JjL2pzL3BhZ2VzL2luZGV4LmpzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJleHBvcnQgZnVuY3Rpb24gbW9iaWxlTWVudSgpIHtcclxuICBsZXQgc2hvd01lbnUgPSBmYWxzZTtcclxuICBjb25zdCBtb2JpbGVNZW51ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm1vYmlsZU1lbnUnKTtcclxuICBmdW5jdGlvbiB0b2dnbGVNZW51KGlzQWN0aXZlKSB7XHJcbiAgICBpZiAoaXNBY3RpdmUpIHtcclxuICAgICAgZG9jdW1lbnRcclxuICAgICAgICAucXVlcnlTZWxlY3RvckFsbCgnYm9keSwgLm1vYmlsZU1lbnUsIC5tZW51QnV0dG9uJylcclxuICAgICAgICAuZm9yRWFjaCgoZSkgPT4ge1xyXG4gICAgICAgICAgZS5jbGFzc0xpc3QuYWRkKCdzaG93Jyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBkb2N1bWVudFxyXG4gICAgICAgIC5xdWVyeVNlbGVjdG9yQWxsKCdib2R5LCAubW9iaWxlTWVudSwgLm1lbnVCdXR0b24nKVxyXG4gICAgICAgIC5mb3JFYWNoKChlKSA9PiB7XHJcbiAgICAgICAgICBlLmNsYXNzTGlzdC5yZW1vdmUoJ3Nob3cnKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGRvY3VtZW50XHJcbiAgICAucXVlcnlTZWxlY3RvcignLm1lbnVCdXR0b24nKVxyXG4gICAgLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xyXG4gICAgICBzaG93TWVudSA9ICFzaG93TWVudTtcclxuICAgICAgdG9nZ2xlTWVudShzaG93TWVudSk7XHJcbiAgICB9KTtcclxuXHJcbiAgbW9iaWxlTWVudS5pbm5lckhUTUwgPVxyXG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignbmF2Lm5hdmJhcicpLmlubmVySFRNTDtcclxuXHJcbiAgbW9iaWxlTWVudS5zdHlsZS5wYWRkaW5nVG9wID1cclxuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5tb2JpbGVIZWFkZXInKS5jbGllbnRIZWlnaHQgKiAxLjUgKyAncHgnO1xyXG59XHJcbiIsICJpbXBvcnQgeyBtb2JpbGVNZW51IH0gZnJvbSAnLi4vbGliL2NvbW1vbic7XHJcblxyXG5tb2JpbGVNZW51KCk7XHJcbiJdLAogICJtYXBwaW5ncyI6ICI7O0FBQU8sV0FBUyxhQUFhO0FBQzNCLFFBQUksV0FBVztBQUNmLFVBQU1BLGNBQWEsU0FBUyxjQUFjLGFBQWE7QUFDdkQsYUFBUyxXQUFXLFVBQVU7QUFDNUIsVUFBSSxVQUFVO0FBQ1osaUJBQ0csaUJBQWlCLGdDQUFnQyxFQUNqRCxRQUFRLENBQUMsTUFBTTtBQUNkLFlBQUUsVUFBVSxJQUFJLE1BQU07QUFBQSxRQUN4QixDQUFDO0FBQUEsTUFDTCxPQUFPO0FBQ0wsaUJBQ0csaUJBQWlCLGdDQUFnQyxFQUNqRCxRQUFRLENBQUMsTUFBTTtBQUNkLFlBQUUsVUFBVSxPQUFPLE1BQU07QUFBQSxRQUMzQixDQUFDO0FBQUEsTUFDTDtBQUFBLElBQ0Y7QUFFQSxhQUNHLGNBQWMsYUFBYSxFQUMzQixpQkFBaUIsU0FBUyxNQUFNO0FBQy9CLGlCQUFXLENBQUM7QUFDWixpQkFBVyxRQUFRO0FBQUEsSUFDckIsQ0FBQztBQUVILElBQUFBLFlBQVcsWUFDVCxTQUFTLGNBQWMsWUFBWSxFQUFFO0FBRXZDLElBQUFBLFlBQVcsTUFBTSxhQUNmLFNBQVMsY0FBYyxlQUFlLEVBQUUsZUFBZSxNQUFNO0FBQUEsRUFDakU7OztBQzdCQSxhQUFXOyIsCiAgIm5hbWVzIjogWyJtb2JpbGVNZW51Il0KfQo=
