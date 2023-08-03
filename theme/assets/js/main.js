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
    mobileMenu2.innerHTML = document.querySelector(".header_lg nav").innerHTML;
    mobileMenu2.style.paddingTop = document.querySelector(".header_sm").clientHeight * 1.5 + "px";
  }

  // node_modules/.pnpm/blaze-slider@1.9.3/node_modules/blaze-slider/dist/blaze-slider.esm.js
  function calculatePages(slider) {
    const { slidesToShow, slidesToScroll, loop } = slider.config;
    const { isStatic, totalSlides } = slider;
    const pages = [];
    const lastIndex = totalSlides - 1;
    for (let startIndex = 0; startIndex < totalSlides; startIndex += slidesToScroll) {
      const _endIndex = startIndex + slidesToShow - 1;
      const overflow = _endIndex > lastIndex;
      if (overflow) {
        if (!loop) {
          const startIndex2 = lastIndex - slidesToShow + 1;
          const lastPageIndex = pages.length - 1;
          if (pages.length === 0 || pages.length > 0 && pages[lastPageIndex][0] !== startIndex2) {
            pages.push([startIndex2, lastIndex]);
          }
          break;
        } else {
          const endIndex = _endIndex - totalSlides;
          pages.push([startIndex, endIndex]);
        }
      } else {
        pages.push([startIndex, _endIndex]);
      }
      if (isStatic) {
        break;
      }
    }
    return pages;
  }
  function calculateStates(slider) {
    const { totalSlides } = slider;
    const { loop } = slider.config;
    const pages = calculatePages(slider);
    const states = [];
    const lastPageIndex = pages.length - 1;
    for (let pageIndex = 0; pageIndex < pages.length; pageIndex++) {
      let nextPageIndex, prevPageIndex;
      if (loop) {
        nextPageIndex = pageIndex === lastPageIndex ? 0 : pageIndex + 1;
        prevPageIndex = pageIndex === 0 ? lastPageIndex : pageIndex - 1;
      } else {
        nextPageIndex = pageIndex === lastPageIndex ? lastPageIndex : pageIndex + 1;
        prevPageIndex = pageIndex === 0 ? 0 : pageIndex - 1;
      }
      const currentPageStartIndex = pages[pageIndex][0];
      const nextPageStartIndex = pages[nextPageIndex][0];
      const prevPageStartIndex = pages[prevPageIndex][0];
      let nextDiff = nextPageStartIndex - currentPageStartIndex;
      if (nextPageStartIndex < currentPageStartIndex) {
        nextDiff += totalSlides;
      }
      let prevDiff = currentPageStartIndex - prevPageStartIndex;
      if (prevPageStartIndex > currentPageStartIndex) {
        prevDiff += totalSlides;
      }
      states.push({
        page: pages[pageIndex],
        next: {
          stateIndex: nextPageIndex,
          moveSlides: nextDiff
        },
        prev: {
          stateIndex: prevPageIndex,
          moveSlides: prevDiff
        }
      });
    }
    return states;
  }
  var START = "start";
  var END = "end";
  var DEV = true;
  function fixSliderConfig(slider) {
    const { slidesToScroll, slidesToShow } = slider.config;
    const { totalSlides, config } = slider;
    if (totalSlides < slidesToShow) {
      if (DEV) {
        console.warn("slidesToShow can not be larger than number of slides. Setting slidesToShow = totalSlides instead.");
      }
      config.slidesToShow = totalSlides;
    }
    if (totalSlides <= slidesToShow) {
      return;
    }
    if (slidesToScroll > slidesToShow) {
      if (DEV) {
        console.warn("slidesToScroll can not be greater than slidesToShow. Setting slidesToScroll = slidesToShow instead");
      }
      config.slidesToScroll = slidesToShow;
    }
    if (totalSlides < slidesToScroll + slidesToShow) {
      const properSlidesToScroll = totalSlides - slidesToShow;
      if (DEV) {
        console.warn(`slidesToScroll = ${slidesToScroll} is too large for a slider with ${totalSlides} slides with slidesToShow=${slidesToShow}, setting max possible slidesToScroll = ${properSlidesToScroll} instead.`);
      }
      config.slidesToScroll = properSlidesToScroll;
    }
  }
  var Automata = class {
    constructor(totalSlides, config) {
      this.config = config;
      this.totalSlides = totalSlides;
      this.isTransitioning = false;
      constructAutomata(this, totalSlides, config);
    }
    next(pages = 1) {
      if (this.isTransitioning || this.isStatic)
        return;
      const { stateIndex } = this;
      let slidesMoved = 0;
      let newStateIndex = stateIndex;
      for (let i = 0; i < pages; i++) {
        const state = this.states[newStateIndex];
        slidesMoved += state.next.moveSlides;
        newStateIndex = state.next.stateIndex;
      }
      if (newStateIndex === stateIndex)
        return;
      this.stateIndex = newStateIndex;
      return [stateIndex, slidesMoved];
    }
    prev(pages = 1) {
      if (this.isTransitioning || this.isStatic)
        return;
      const { stateIndex } = this;
      let slidesMoved = 0;
      let newStateIndex = stateIndex;
      for (let i = 0; i < pages; i++) {
        const state = this.states[newStateIndex];
        slidesMoved += state.prev.moveSlides;
        newStateIndex = state.prev.stateIndex;
      }
      if (newStateIndex === stateIndex)
        return;
      this.stateIndex = newStateIndex;
      return [stateIndex, slidesMoved];
    }
  };
  function constructAutomata(automata, totalSlides, config) {
    automata.stateIndex = 0;
    fixSliderConfig(automata);
    automata.isStatic = totalSlides <= config.slidesToShow;
    automata.states = calculateStates(automata);
  }
  function scrollPrev(slider, slideCount) {
    const rAf = requestAnimationFrame;
    if (!slider.config.loop) {
      noLoopScroll(slider);
    } else {
      disableTransition(slider);
      slider.offset = -1 * slideCount;
      updateTransform(slider);
      wrapPrev(slider, slideCount);
      const reset = () => {
        rAf(() => {
          enableTransition(slider);
          rAf(() => {
            slider.offset = 0;
            updateTransform(slider);
            onSlideEnd(slider);
          });
        });
      };
      if (slider.isDragging) {
        if (isTouch()) {
          slider.track.addEventListener("touchend", reset, { once: true });
        } else {
          slider.track.addEventListener("pointerup", reset, { once: true });
        }
      } else {
        rAf(reset);
      }
    }
  }
  function scrollNext(slider, slideCount) {
    const rAf = requestAnimationFrame;
    if (!slider.config.loop) {
      noLoopScroll(slider);
    } else {
      slider.offset = -1 * slideCount;
      updateTransform(slider);
      setTimeout(() => {
        wrapNext(slider, slideCount);
        disableTransition(slider);
        slider.offset = 0;
        updateTransform(slider);
        rAf(() => {
          rAf(() => {
            enableTransition(slider);
            onSlideEnd(slider);
          });
        });
      }, slider.config.transitionDuration);
    }
  }
  function onSlideEnd(slider) {
    if (slider.onSlideCbs) {
      const state = slider.states[slider.stateIndex];
      const [firstSlideIndex, lastSlideIndex] = state.page;
      slider.onSlideCbs.forEach((cb) => cb(slider.stateIndex, firstSlideIndex, lastSlideIndex));
    }
  }
  function noLoopScroll(slider) {
    slider.offset = -1 * slider.states[slider.stateIndex].page[0];
    updateTransform(slider);
    onSlideEnd(slider);
  }
  function wrapPrev(slider, count) {
    const len = slider.slides.length;
    for (let i = 0; i < count; i++) {
      const slide = slider.slides[len - 1];
      slider.track.prepend(slide);
    }
  }
  function wrapNext(slider, count) {
    for (let i = 0; i < count; i++) {
      slider.track.append(slider.slides[0]);
    }
  }
  function updateTransform(slider) {
    const { track, offset, dragged } = slider;
    if (offset === 0) {
      track.style.transform = `translate3d(${dragged}px,0px,0px)`;
    } else {
      track.style.transform = `translate3d(  calc( ${dragged}px + ${offset} * (var(--slide-width) + ${slider.config.slideGap})),0px,0px)`;
    }
  }
  function enableTransition(slider) {
    slider.track.style.transitionDuration = `${slider.config.transitionDuration}ms`;
  }
  function disableTransition(slider) {
    slider.track.style.transitionDuration = `0ms`;
  }
  var slideThreshold = 10;
  var isTouch = () => "ontouchstart" in window;
  function handlePointerDown(downEvent) {
    const track = this;
    const slider = track.slider;
    if (slider.isTransitioning)
      return;
    slider.dragged = 0;
    track.isScrolled = false;
    track.startMouseClientX = "touches" in downEvent ? downEvent.touches[0].clientX : downEvent.clientX;
    if (!("touches" in downEvent)) {
      const el = downEvent.target || track;
      el.setPointerCapture(downEvent.pointerId);
    }
    disableTransition(slider);
    updateEventListener(track, "addEventListener");
  }
  function handlePointerMove(moveEvent) {
    const track = this;
    const x = "touches" in moveEvent ? moveEvent.touches[0].clientX : moveEvent.clientX;
    const dragged = track.slider.dragged = x - track.startMouseClientX;
    const draggedAbs = Math.abs(dragged);
    if (draggedAbs > 5) {
      track.slider.isDragging = true;
    }
    if (draggedAbs > 15) {
      moveEvent.preventDefault();
    }
    track.slider.dragged = dragged;
    updateTransform(track.slider);
    if (!track.isScrolled && track.slider.config.loop) {
      if (dragged > slideThreshold) {
        track.isScrolled = true;
        track.slider.prev();
      }
    }
  }
  function handlePointerUp() {
    const track = this;
    const dragged = track.slider.dragged;
    track.slider.isDragging = false;
    updateEventListener(track, "removeEventListener");
    track.slider.dragged = 0;
    updateTransform(track.slider);
    enableTransition(track.slider);
    if (!track.isScrolled) {
      if (dragged < -1 * slideThreshold) {
        track.slider.next();
      } else if (dragged > slideThreshold) {
        track.slider.prev();
      }
    }
  }
  var preventDefault = (event) => event.preventDefault();
  function dragSupport(slider) {
    const track = slider.track;
    track.slider = slider;
    const event = isTouch() ? "touchstart" : "pointerdown";
    track.addEventListener(event, handlePointerDown);
    track.addEventListener("click", (event2) => {
      if (slider.isTransitioning || slider.isDragging) {
        event2.preventDefault();
        event2.stopImmediatePropagation();
        event2.stopPropagation();
      }
    }, {
      capture: true
    });
    track.addEventListener("dragstart", preventDefault);
  }
  function updateEventListener(track, method) {
    track[method]("contextmenu", handlePointerUp);
    if (isTouch()) {
      track[method]("touchend", handlePointerUp);
      track[method]("touchmove", handlePointerMove);
    } else {
      track[method]("pointerup", handlePointerUp);
      track[method]("pointermove", handlePointerMove);
    }
  }
  function handleAutoplay(slider) {
    const config = slider.config;
    if (!config.enableAutoplay)
      return;
    const dir = config.autoplayDirection === "to left" ? "next" : "prev";
    slider.autoplayTimer = setInterval(() => {
      slider[dir]();
    }, config.autoplayInterval);
    if (config.stopAutoplayOnInteraction) {
      slider.el.addEventListener(isTouch() ? "touchstart" : "mousedown", () => {
        clearInterval(slider.autoplayTimer);
      }, { once: true });
    }
  }
  var defaultConfig = {
    // layout
    slideGap: "20px",
    slidesToScroll: 1,
    slidesToShow: 1,
    // behavior
    loop: true,
    // autoplay
    enableAutoplay: false,
    stopAutoplayOnInteraction: true,
    autoplayInterval: 3e3,
    autoplayDirection: "to left",
    // pagination
    enablePagination: true,
    // transition
    transitionDuration: 300,
    transitionTimingFunction: "ease",
    draggable: true
  };
  function createConfig(blazeConfig) {
    const config = { ...defaultConfig };
    for (const media in blazeConfig) {
      if (window.matchMedia(media).matches) {
        const mediaConfig = blazeConfig[media];
        for (const key in mediaConfig) {
          config[key] = mediaConfig[key];
        }
      }
    }
    return config;
  }
  function handleNavigation(slider) {
    const prev = slider.el.querySelector(".blaze-prev");
    const next = slider.el.querySelector(".blaze-next");
    if (prev) {
      prev.onclick = () => {
        slider.prev();
      };
    }
    if (next) {
      next.onclick = () => {
        slider.next();
      };
    }
  }
  function handlePagination(slider) {
    if (!slider.config.enablePagination || slider.isStatic)
      return;
    const paginationContainer = slider.el.querySelector(".blaze-pagination");
    if (!paginationContainer)
      return;
    slider.paginationButtons = [];
    const total = slider.states.length;
    for (let index = 0; index < total; index++) {
      const button = document.createElement("button");
      slider.paginationButtons.push(button);
      button.textContent = 1 + index + "";
      button.ariaLabel = `${index + 1} of ${total}`;
      paginationContainer.append(button);
      button.slider = slider;
      button.index = index;
      button.onclick = handlePaginationButtonClick;
    }
    slider.paginationButtons[0].classList.add("active");
  }
  function handlePaginationButtonClick() {
    const index = this.index;
    const slider = this.slider;
    const stateIndex = slider.stateIndex;
    const loop = slider.config.loop;
    const diff = Math.abs(index - stateIndex);
    const inverseDiff = slider.states.length - diff;
    const isDiffLargerThanHalf = diff > slider.states.length / 2;
    const scrollOpposite = isDiffLargerThanHalf && loop;
    if (index > stateIndex) {
      if (scrollOpposite) {
        slider.prev(inverseDiff);
      } else {
        slider.next(diff);
      }
    } else {
      if (scrollOpposite) {
        slider.next(inverseDiff);
      } else {
        slider.prev(diff);
      }
    }
  }
  function isTransitioning(slider, time = slider.config.transitionDuration) {
    slider.isTransitioning = true;
    setTimeout(() => {
      slider.isTransitioning = false;
    }, time);
  }
  var BlazeSlider = class extends Automata {
    constructor(blazeSliderEl, blazeConfig) {
      const track = blazeSliderEl.querySelector(".blaze-track");
      const slides = track.children;
      const config = blazeConfig ? createConfig(blazeConfig) : { ...defaultConfig };
      super(slides.length, config);
      this.config = config;
      this.el = blazeSliderEl;
      this.track = track;
      this.slides = slides;
      this.offset = 0;
      this.dragged = 0;
      this.isDragging = false;
      this.el.blazeSlider = this;
      this.passedConfig = blazeConfig;
      const slider = this;
      track.slider = slider;
      construct(config, slider);
      let ignoreResize = false;
      let width = 0;
      window.addEventListener("resize", () => {
        if (width === 0) {
          width = window.innerWidth;
          return;
        }
        const newWidth = window.innerWidth;
        if (width === newWidth)
          return;
        width = newWidth;
        if (!ignoreResize) {
          ignoreResize = true;
          setTimeout(() => {
            slider.refresh();
            ignoreResize = false;
          }, 200);
        }
      });
    }
    next(count) {
      if (this.isTransitioning)
        return;
      const transition = super.next(count);
      if (!transition) {
        isTransitioning(this);
        return;
      }
      const [prevStateIndex, slideCount] = transition;
      handleStateChange(this, prevStateIndex);
      isTransitioning(this);
      scrollNext(this, slideCount);
    }
    prev(count) {
      if (this.isTransitioning)
        return;
      const transition = super.prev(count);
      if (!transition) {
        isTransitioning(this);
        return;
      }
      const [prevStateIndex, slideCount] = transition;
      handleStateChange(this, prevStateIndex);
      isTransitioning(this);
      scrollPrev(this, slideCount);
    }
    stopAutoplay() {
      clearInterval(this.autoplayTimer);
    }
    destroy() {
      this.track.removeEventListener(
        isTouch() ? "touchstart" : "pointerdown",
        // @ts-expect-error
        handlePointerDown
      );
      this.stopAutoplay();
      this.paginationButtons?.forEach((button) => button.remove());
      this.el.classList.remove("static");
      this.el.classList.remove(START);
    }
    refresh() {
      const newConfig = this.passedConfig ? createConfig(this.passedConfig) : { ...defaultConfig };
      this.destroy();
      construct(newConfig, this);
    }
    /**
     * Subscribe for slide change event
     * Returns a function to unsubscribe from slide change event
     */
    onSlide(cb) {
      if (!this.onSlideCbs)
        this.onSlideCbs = /* @__PURE__ */ new Set();
      this.onSlideCbs.add(cb);
      return () => this.onSlideCbs.delete(cb);
    }
  };
  function handleStateChange(slider, prevStateIndex) {
    const classList = slider.el.classList;
    const stateIndex = slider.stateIndex;
    const buttons = slider.paginationButtons;
    if (!slider.config.loop) {
      if (stateIndex === 0) {
        classList.add(START);
      } else {
        classList.remove(START);
      }
      if (stateIndex === slider.states.length - 1) {
        classList.add(END);
      } else {
        classList.remove(END);
      }
    }
    if (buttons && slider.config.enablePagination) {
      buttons[prevStateIndex].classList.remove("active");
      buttons[stateIndex].classList.add("active");
    }
  }
  function construct(config, slider) {
    const track = slider.track;
    slider.slides = track.children;
    slider.offset = 0;
    slider.config = config;
    constructAutomata(slider, slider.totalSlides, config);
    if (!config.loop) {
      slider.el.classList.add(START);
    }
    if (config.enableAutoplay && !config.loop) {
      if (DEV) {
        console.warn("enableAutoplay:true is not consistent with loop:false, auto-fixing with enableAutoplay:false");
      }
      config.enableAutoplay = false;
    }
    track.style.transitionProperty = "transform";
    track.style.transitionTimingFunction = slider.config.transitionTimingFunction;
    track.style.transitionDuration = `${slider.config.transitionDuration}ms`;
    const { slidesToShow, slideGap } = slider.config;
    slider.el.style.setProperty("--slides-to-show", slidesToShow + "");
    slider.el.style.setProperty("--slide-gap", slideGap);
    if (!slider.isStatic) {
      if (config.draggable) {
        dragSupport(slider);
      }
    } else {
      slider.el.classList.add("static");
    }
    handlePagination(slider);
    handleAutoplay(slider);
    handleNavigation(slider);
    updateTransform(slider);
  }

  // src/js/pages/main.js
  mobileMenu();
  var servicesBlaze = document.querySelector(
    ".services .blaze-slider"
  );
  var howBlaze = document.querySelector(".how .blaze-slider");
  var blazeItems = document.querySelectorAll(".how .item");
  function showItem(getIndex) {
    blazeItems.forEach((item, index) => {
      if (index === getIndex) {
        item.classList.add("active");
      } else {
        item.classList.remove("active");
      }
    });
  }
  if (servicesBlaze !== void 0 && servicesBlaze !== null) {
    new BlazeSlider(servicesBlaze, {
      all: {
        slidesToShow: 3,
        slideGap: "30px",
        enableAutoplay: true,
        autoplayInterval: 3e3
      },
      "(max-width: 575px)": {
        slidesToShow: 1,
        slideGap: "0px"
      },
      "(max-width: 991px)": {
        slidesToShow: 2,
        slideGap: "30px"
      },
      "(max-width: 1199px)": {
        slidesToShow: 3,
        slideGap: "15px"
      }
    });
  }
  if (howBlaze !== void 0 && howBlaze !== null) {
    let howSlider = new BlazeSlider(howBlaze, {
      all: {
        slidesToShow: 1,
        slideGap: "0px",
        enableAutoplay: true,
        autoplayInterval: 3e3
      }
    });
    howSlider.onSlide((pageIndex) => {
      showItem(pageIndex);
    });
  }
})();
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vLi4vc3JjL2pzL2xpYi9jb21tb24uanMiLCAiLi4vLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL2JsYXplLXNsaWRlckAxLjkuMy9ub2RlX21vZHVsZXMvYmxhemUtc2xpZGVyL2Rpc3QvYmxhemUtc2xpZGVyLmVzbS5qcyIsICIuLi8uLi8uLi9zcmMvanMvcGFnZXMvbWFpbi5qcyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiZXhwb3J0IGZ1bmN0aW9uIG1vYmlsZU1lbnUoKSB7XHJcbiAgbGV0IHNob3dNZW51ID0gZmFsc2U7XHJcbiAgY29uc3QgbW9iaWxlTWVudSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5tb2JpbGVNZW51Jyk7XHJcbiAgZnVuY3Rpb24gdG9nZ2xlTWVudShpc0FjdGl2ZSkge1xyXG4gICAgaWYgKGlzQWN0aXZlKSB7XHJcbiAgICAgIGRvY3VtZW50XHJcbiAgICAgICAgLnF1ZXJ5U2VsZWN0b3JBbGwoJ2JvZHksIC5tb2JpbGVNZW51LCAubWVudUJ1dHRvbicpXHJcbiAgICAgICAgLmZvckVhY2goKGUpID0+IHtcclxuICAgICAgICAgIGUuY2xhc3NMaXN0LmFkZCgnc2hvdycpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgZG9jdW1lbnRcclxuICAgICAgICAucXVlcnlTZWxlY3RvckFsbCgnYm9keSwgLm1vYmlsZU1lbnUsIC5tZW51QnV0dG9uJylcclxuICAgICAgICAuZm9yRWFjaCgoZSkgPT4ge1xyXG4gICAgICAgICAgZS5jbGFzc0xpc3QucmVtb3ZlKCdzaG93Jyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBkb2N1bWVudFxyXG4gICAgLnF1ZXJ5U2VsZWN0b3IoJy5tZW51QnV0dG9uJylcclxuICAgIC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcclxuICAgICAgc2hvd01lbnUgPSAhc2hvd01lbnU7XHJcbiAgICAgIHRvZ2dsZU1lbnUoc2hvd01lbnUpO1xyXG4gICAgfSk7XHJcblxyXG4gIG1vYmlsZU1lbnUuaW5uZXJIVE1MID1cclxuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5oZWFkZXJfbGcgbmF2JykuaW5uZXJIVE1MO1xyXG5cclxuICBtb2JpbGVNZW51LnN0eWxlLnBhZGRpbmdUb3AgPVxyXG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmhlYWRlcl9zbScpLmNsaWVudEhlaWdodCAqIDEuNSArICdweCc7XHJcbn1cclxuIiwgIi8qIGJsYXplLXNsaWRlciB2MS45LjMgYnkgTWFuYW4gVGFuayAqL1xuLyoqXG4gKiBjYWxjdWxhdGUgcGFnZXMgYW5kIHJldHVyblxuICovXG5mdW5jdGlvbiBjYWxjdWxhdGVQYWdlcyhzbGlkZXIpIHtcbiAgICBjb25zdCB7IHNsaWRlc1RvU2hvdywgc2xpZGVzVG9TY3JvbGwsIGxvb3AgfSA9IHNsaWRlci5jb25maWc7XG4gICAgY29uc3QgeyBpc1N0YXRpYywgdG90YWxTbGlkZXMgfSA9IHNsaWRlcjtcbiAgICBjb25zdCBwYWdlcyA9IFtdO1xuICAgIGNvbnN0IGxhc3RJbmRleCA9IHRvdGFsU2xpZGVzIC0gMTtcbiAgICAvLyBzdGFydCB3aXRoIGluZGV4IDAsIGtlZXAgYWRkaW5nIHNsaWRlc1RvU2Nyb2xsIHRvIGdldCB0aGUgbmV3IHBhZ2VcbiAgICBmb3IgKGxldCBzdGFydEluZGV4ID0gMDsgc3RhcnRJbmRleCA8IHRvdGFsU2xpZGVzOyBzdGFydEluZGV4ICs9IHNsaWRlc1RvU2Nyb2xsKSB7XG4gICAgICAgIGNvbnN0IF9lbmRJbmRleCA9IHN0YXJ0SW5kZXggKyBzbGlkZXNUb1Nob3cgLSAxO1xuICAgICAgICBjb25zdCBvdmVyZmxvdyA9IF9lbmRJbmRleCA+IGxhc3RJbmRleDtcbiAgICAgICAgaWYgKG92ZXJmbG93KSB7XG4gICAgICAgICAgICAvLyBpZiBub3QgbG9vcGVkXG4gICAgICAgICAgICBpZiAoIWxvb3ApIHtcbiAgICAgICAgICAgICAgICAvLyBhZGp1c3QgdGhlIHN0YXJ0SW5kZXhcbiAgICAgICAgICAgICAgICBjb25zdCBzdGFydEluZGV4ID0gbGFzdEluZGV4IC0gc2xpZGVzVG9TaG93ICsgMTtcbiAgICAgICAgICAgICAgICBjb25zdCBsYXN0UGFnZUluZGV4ID0gcGFnZXMubGVuZ3RoIC0gMTtcbiAgICAgICAgICAgICAgICAvLyBjcmVhdGUgcGFnZSBvbmx5IGlmIGFkanVzdGluZyB0aGUgc3RhcnRJbmRleCBkb2VzIG5vdCBtYWtlIGl0IHRoZSBzYW1lIGFzIHByZXZpb3VzbHkgc2F2ZWQgcGFnZVxuICAgICAgICAgICAgICAgIGlmIChwYWdlcy5sZW5ndGggPT09IDAgfHxcbiAgICAgICAgICAgICAgICAgICAgKHBhZ2VzLmxlbmd0aCA+IDAgJiYgcGFnZXNbbGFzdFBhZ2VJbmRleF1bMF0gIT09IHN0YXJ0SW5kZXgpKSB7XG4gICAgICAgICAgICAgICAgICAgIHBhZ2VzLnB1c2goW3N0YXJ0SW5kZXgsIGxhc3RJbmRleF0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIGlmIGxvb3BlZFxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gYWRqdXN0IHRoZSBlbmRJbmRleFxuICAgICAgICAgICAgICAgIGNvbnN0IGVuZEluZGV4ID0gX2VuZEluZGV4IC0gdG90YWxTbGlkZXM7XG4gICAgICAgICAgICAgICAgcGFnZXMucHVzaChbc3RhcnRJbmRleCwgZW5kSW5kZXhdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHBhZ2VzLnB1c2goW3N0YXJ0SW5kZXgsIF9lbmRJbmRleF0pO1xuICAgICAgICB9XG4gICAgICAgIC8vIGlmIHN0YXRpYywgb25seSBhbGxvdyAxIGl0ZXJhdGlvblxuICAgICAgICBpZiAoaXNTdGF0aWMpIHtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBwYWdlcztcbn1cblxuLyoqXG4gKiBjYWxjdWxhdGUgYWxsIHBvc3NpYmxlIHN0YXRlcyBvZiBnaXZlbiBzbGlkZXJcbiAqL1xuZnVuY3Rpb24gY2FsY3VsYXRlU3RhdGVzKHNsaWRlcikge1xuICAgIGNvbnN0IHsgdG90YWxTbGlkZXMgfSA9IHNsaWRlcjtcbiAgICBjb25zdCB7IGxvb3AgfSA9IHNsaWRlci5jb25maWc7XG4gICAgLy8gZ2V0IGFsbCBwb3NzaWJsZSBwYWdlc1xuICAgIGNvbnN0IHBhZ2VzID0gY2FsY3VsYXRlUGFnZXMoc2xpZGVyKTtcbiAgICBjb25zdCBzdGF0ZXMgPSBbXTtcbiAgICBjb25zdCBsYXN0UGFnZUluZGV4ID0gcGFnZXMubGVuZ3RoIC0gMTtcbiAgICBmb3IgKGxldCBwYWdlSW5kZXggPSAwOyBwYWdlSW5kZXggPCBwYWdlcy5sZW5ndGg7IHBhZ2VJbmRleCsrKSB7XG4gICAgICAgIC8vIGNhbGN1bGF0ZSBwcmV2IGFuZCBuZXh0IHBhZ2UgaW5kZXggYmFzZWQgb24gY29uZmlnXG4gICAgICAgIGxldCBuZXh0UGFnZUluZGV4LCBwcmV2UGFnZUluZGV4O1xuICAgICAgICBpZiAobG9vcCkge1xuICAgICAgICAgICAgbmV4dFBhZ2VJbmRleCA9IHBhZ2VJbmRleCA9PT0gbGFzdFBhZ2VJbmRleCA/IDAgOiBwYWdlSW5kZXggKyAxO1xuICAgICAgICAgICAgcHJldlBhZ2VJbmRleCA9IHBhZ2VJbmRleCA9PT0gMCA/IGxhc3RQYWdlSW5kZXggOiBwYWdlSW5kZXggLSAxO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgbmV4dFBhZ2VJbmRleCA9XG4gICAgICAgICAgICAgICAgcGFnZUluZGV4ID09PSBsYXN0UGFnZUluZGV4ID8gbGFzdFBhZ2VJbmRleCA6IHBhZ2VJbmRleCArIDE7XG4gICAgICAgICAgICBwcmV2UGFnZUluZGV4ID0gcGFnZUluZGV4ID09PSAwID8gMCA6IHBhZ2VJbmRleCAtIDE7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgY3VycmVudFBhZ2VTdGFydEluZGV4ID0gcGFnZXNbcGFnZUluZGV4XVswXTtcbiAgICAgICAgY29uc3QgbmV4dFBhZ2VTdGFydEluZGV4ID0gcGFnZXNbbmV4dFBhZ2VJbmRleF1bMF07XG4gICAgICAgIGNvbnN0IHByZXZQYWdlU3RhcnRJbmRleCA9IHBhZ2VzW3ByZXZQYWdlSW5kZXhdWzBdO1xuICAgICAgICAvLyBjYWxjdWxhdGUgc2xpZGVzIHRoYXQgbmVlZCB0byBiZSBtb3ZlZCBmb3IgdHJhbnNpdGlvbmluZyB0byBuZXh0IGFuZCBwcmV2IHN0YXRlIGZyb20gY3VycmVudCBzdGF0ZVxuICAgICAgICBsZXQgbmV4dERpZmYgPSBuZXh0UGFnZVN0YXJ0SW5kZXggLSBjdXJyZW50UGFnZVN0YXJ0SW5kZXg7XG4gICAgICAgIGlmIChuZXh0UGFnZVN0YXJ0SW5kZXggPCBjdXJyZW50UGFnZVN0YXJ0SW5kZXgpIHtcbiAgICAgICAgICAgIG5leHREaWZmICs9IHRvdGFsU2xpZGVzO1xuICAgICAgICB9XG4gICAgICAgIGxldCBwcmV2RGlmZiA9IGN1cnJlbnRQYWdlU3RhcnRJbmRleCAtIHByZXZQYWdlU3RhcnRJbmRleDtcbiAgICAgICAgaWYgKHByZXZQYWdlU3RhcnRJbmRleCA+IGN1cnJlbnRQYWdlU3RhcnRJbmRleCkge1xuICAgICAgICAgICAgcHJldkRpZmYgKz0gdG90YWxTbGlkZXM7XG4gICAgICAgIH1cbiAgICAgICAgc3RhdGVzLnB1c2goe1xuICAgICAgICAgICAgcGFnZTogcGFnZXNbcGFnZUluZGV4XSxcbiAgICAgICAgICAgIG5leHQ6IHtcbiAgICAgICAgICAgICAgICBzdGF0ZUluZGV4OiBuZXh0UGFnZUluZGV4LFxuICAgICAgICAgICAgICAgIG1vdmVTbGlkZXM6IG5leHREaWZmLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHByZXY6IHtcbiAgICAgICAgICAgICAgICBzdGF0ZUluZGV4OiBwcmV2UGFnZUluZGV4LFxuICAgICAgICAgICAgICAgIG1vdmVTbGlkZXM6IHByZXZEaWZmLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBzdGF0ZXM7XG59XG5cbmNvbnN0IFNUQVJUID0gJ3N0YXJ0JztcbmNvbnN0IEVORCA9ICdlbmQnO1xuY29uc3QgREVWID0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJztcblxuLyoqXG4gKiBpdCBmaXhlcyBiZWxvdyBzY2VuYXJpb3Mgd2hpY2ggYXJlIHdyb25nIChhbmQgYWRkcyBhIHdhcm5pbmcgaW4gY29uc29sZSBpbiBkZXZlbG9wbWVudClcbiAqIC0gY29uZmlnLnNsaWRlc1RvU2hvdyBncmVhdGVyIHRoYW4gdG90YWxTbGlkZXNcbiAqIC0gY29uZmlnLnNsaWRlc1RvU2Nyb2xsIGdyZWF0ZXIgdGhhbiBjb25maWcuc2xpZGVzVG9TaG93IHdoaWNoIHNraXBzIHNob3dpbmcgY2VydGFpbiBzbGlkZXNcbiAqIC0gY29uZmlnLnNsaWRlc1RvU2Nyb2xsIHRvbyBoaWdoIHN1Y2ggdGhhdCBpdCBjYXVzZXMgZ2xpdGNoZXNcbiAqL1xuZnVuY3Rpb24gZml4U2xpZGVyQ29uZmlnKHNsaWRlcikge1xuICAgIGNvbnN0IHsgc2xpZGVzVG9TY3JvbGwsIHNsaWRlc1RvU2hvdyB9ID0gc2xpZGVyLmNvbmZpZztcbiAgICBjb25zdCB7IHRvdGFsU2xpZGVzLCBjb25maWcgfSA9IHNsaWRlcjtcbiAgICBpZiAodG90YWxTbGlkZXMgPCBzbGlkZXNUb1Nob3cpIHtcbiAgICAgICAgaWYgKERFVikge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKCdzbGlkZXNUb1Nob3cgY2FuIG5vdCBiZSBsYXJnZXIgdGhhbiBudW1iZXIgb2Ygc2xpZGVzLiBTZXR0aW5nIHNsaWRlc1RvU2hvdyA9IHRvdGFsU2xpZGVzIGluc3RlYWQuJyk7XG4gICAgICAgIH1cbiAgICAgICAgY29uZmlnLnNsaWRlc1RvU2hvdyA9IHRvdGFsU2xpZGVzO1xuICAgIH1cbiAgICBpZiAodG90YWxTbGlkZXMgPD0gc2xpZGVzVG9TaG93KSB7XG4gICAgICAgIC8vIHJldHVybiBiZWNhdXNlIHNsaWRlc1RvU2Nyb2xsIGRvZXMgbm90IG5lZWQgdG8gYmUgY2hlY2tlZFxuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIC8vIGRldGVjdCBzbGlkZXIgc2tpcHBpbmdcbiAgICBpZiAoc2xpZGVzVG9TY3JvbGwgPiBzbGlkZXNUb1Nob3cpIHtcbiAgICAgICAgaWYgKERFVikge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKCdzbGlkZXNUb1Njcm9sbCBjYW4gbm90IGJlIGdyZWF0ZXIgdGhhbiBzbGlkZXNUb1Nob3cuIFNldHRpbmcgc2xpZGVzVG9TY3JvbGwgPSBzbGlkZXNUb1Nob3cgaW5zdGVhZCcpO1xuICAgICAgICB9XG4gICAgICAgIGNvbmZpZy5zbGlkZXNUb1Njcm9sbCA9IHNsaWRlc1RvU2hvdztcbiAgICB9XG4gICAgLy8gZGV0ZWN0IHNsaWRlciBqdW1waW5nIGdsaXRjaFxuICAgIGlmICh0b3RhbFNsaWRlcyA8IHNsaWRlc1RvU2Nyb2xsICsgc2xpZGVzVG9TaG93KSB7XG4gICAgICAgIGNvbnN0IHByb3BlclNsaWRlc1RvU2Nyb2xsID0gdG90YWxTbGlkZXMgLSBzbGlkZXNUb1Nob3c7XG4gICAgICAgIGlmIChERVYpIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2Fybihgc2xpZGVzVG9TY3JvbGwgPSAke3NsaWRlc1RvU2Nyb2xsfSBpcyB0b28gbGFyZ2UgZm9yIGEgc2xpZGVyIHdpdGggJHt0b3RhbFNsaWRlc30gc2xpZGVzIHdpdGggc2xpZGVzVG9TaG93PSR7c2xpZGVzVG9TaG93fSwgc2V0dGluZyBtYXggcG9zc2libGUgc2xpZGVzVG9TY3JvbGwgPSAke3Byb3BlclNsaWRlc1RvU2Nyb2xsfSBpbnN0ZWFkLmApO1xuICAgICAgICB9XG4gICAgICAgIGNvbmZpZy5zbGlkZXNUb1Njcm9sbCA9IHByb3BlclNsaWRlc1RvU2Nyb2xsO1xuICAgIH1cbn1cblxuY2xhc3MgQXV0b21hdGEge1xuICAgIGNvbnN0cnVjdG9yKHRvdGFsU2xpZGVzLCBjb25maWcpIHtcbiAgICAgICAgdGhpcy5jb25maWcgPSBjb25maWc7XG4gICAgICAgIHRoaXMudG90YWxTbGlkZXMgPSB0b3RhbFNsaWRlcztcbiAgICAgICAgdGhpcy5pc1RyYW5zaXRpb25pbmcgPSBmYWxzZTtcbiAgICAgICAgY29uc3RydWN0QXV0b21hdGEodGhpcywgdG90YWxTbGlkZXMsIGNvbmZpZyk7XG4gICAgfVxuICAgIG5leHQocGFnZXMgPSAxKSB7XG4gICAgICAgIGlmICh0aGlzLmlzVHJhbnNpdGlvbmluZyB8fCB0aGlzLmlzU3RhdGljKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICBjb25zdCB7IHN0YXRlSW5kZXggfSA9IHRoaXM7XG4gICAgICAgIGxldCBzbGlkZXNNb3ZlZCA9IDA7XG4gICAgICAgIGxldCBuZXdTdGF0ZUluZGV4ID0gc3RhdGVJbmRleDtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwYWdlczsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCBzdGF0ZSA9IHRoaXMuc3RhdGVzW25ld1N0YXRlSW5kZXhdO1xuICAgICAgICAgICAgc2xpZGVzTW92ZWQgKz0gc3RhdGUubmV4dC5tb3ZlU2xpZGVzO1xuICAgICAgICAgICAgbmV3U3RhdGVJbmRleCA9IHN0YXRlLm5leHQuc3RhdGVJbmRleDtcbiAgICAgICAgfVxuICAgICAgICBpZiAobmV3U3RhdGVJbmRleCA9PT0gc3RhdGVJbmRleClcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgdGhpcy5zdGF0ZUluZGV4ID0gbmV3U3RhdGVJbmRleDtcbiAgICAgICAgcmV0dXJuIFtzdGF0ZUluZGV4LCBzbGlkZXNNb3ZlZF07XG4gICAgfVxuICAgIHByZXYocGFnZXMgPSAxKSB7XG4gICAgICAgIGlmICh0aGlzLmlzVHJhbnNpdGlvbmluZyB8fCB0aGlzLmlzU3RhdGljKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICBjb25zdCB7IHN0YXRlSW5kZXggfSA9IHRoaXM7XG4gICAgICAgIGxldCBzbGlkZXNNb3ZlZCA9IDA7XG4gICAgICAgIGxldCBuZXdTdGF0ZUluZGV4ID0gc3RhdGVJbmRleDtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwYWdlczsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCBzdGF0ZSA9IHRoaXMuc3RhdGVzW25ld1N0YXRlSW5kZXhdO1xuICAgICAgICAgICAgc2xpZGVzTW92ZWQgKz0gc3RhdGUucHJldi5tb3ZlU2xpZGVzO1xuICAgICAgICAgICAgbmV3U3RhdGVJbmRleCA9IHN0YXRlLnByZXYuc3RhdGVJbmRleDtcbiAgICAgICAgfVxuICAgICAgICBpZiAobmV3U3RhdGVJbmRleCA9PT0gc3RhdGVJbmRleClcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgdGhpcy5zdGF0ZUluZGV4ID0gbmV3U3RhdGVJbmRleDtcbiAgICAgICAgcmV0dXJuIFtzdGF0ZUluZGV4LCBzbGlkZXNNb3ZlZF07XG4gICAgfVxufVxuLy8gdGhpcyB3aWxsIGJlIGNhbGxlZCB3aGVuIHNsaWRlciBpcyByZWZyZXNoZWRcbmZ1bmN0aW9uIGNvbnN0cnVjdEF1dG9tYXRhKGF1dG9tYXRhLCB0b3RhbFNsaWRlcywgY29uZmlnKSB7XG4gICAgYXV0b21hdGEuc3RhdGVJbmRleCA9IDA7XG4gICAgZml4U2xpZGVyQ29uZmlnKGF1dG9tYXRhKTtcbiAgICBhdXRvbWF0YS5pc1N0YXRpYyA9IHRvdGFsU2xpZGVzIDw9IGNvbmZpZy5zbGlkZXNUb1Nob3c7XG4gICAgYXV0b21hdGEuc3RhdGVzID0gY2FsY3VsYXRlU3RhdGVzKGF1dG9tYXRhKTtcbn1cblxuZnVuY3Rpb24gc2Nyb2xsUHJldihzbGlkZXIsIHNsaWRlQ291bnQpIHtcbiAgICBjb25zdCByQWYgPSByZXF1ZXN0QW5pbWF0aW9uRnJhbWU7XG4gICAgaWYgKCFzbGlkZXIuY29uZmlnLmxvb3ApIHtcbiAgICAgICAgbm9Mb29wU2Nyb2xsKHNsaWRlcik7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICAvLyBzaGlmdCBlbGVtZW50cyBhbmQgYXBwbHkgbmVnYXRpdmUgdHJhbnNmb3JtIHRvIG1ha2UgaXQgbG9vayBsaWtlIG5vdGhpbmcgY2hhbmdlZFxuICAgICAgICAvLyBkaXNhYmxlIHRyYW5zaXRpb25cbiAgICAgICAgZGlzYWJsZVRyYW5zaXRpb24oc2xpZGVyKTtcbiAgICAgICAgLy8gYXBwbHkgbmVnYXRpdmUgdHJhbnNmb3JtXG4gICAgICAgIHNsaWRlci5vZmZzZXQgPSAtMSAqIHNsaWRlQ291bnQ7XG4gICAgICAgIHVwZGF0ZVRyYW5zZm9ybShzbGlkZXIpO1xuICAgICAgICAvLyBhbmQgbW92ZSB0aGUgZWxlbWVudHNcbiAgICAgICAgd3JhcFByZXYoc2xpZGVyLCBzbGlkZUNvdW50KTtcbiAgICAgICAgY29uc3QgcmVzZXQgPSAoKSA9PiB7XG4gICAgICAgICAgICByQWYoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGVuYWJsZVRyYW5zaXRpb24oc2xpZGVyKTtcbiAgICAgICAgICAgICAgICByQWYoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBzbGlkZXIub2Zmc2V0ID0gMDtcbiAgICAgICAgICAgICAgICAgICAgdXBkYXRlVHJhbnNmb3JtKHNsaWRlcik7XG4gICAgICAgICAgICAgICAgICAgIG9uU2xpZGVFbmQoc2xpZGVyKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgICAgICAvLyBpZiB0aGUgc2Nyb2xsIHdhcyBkb25lIGFzIHBhcnQgb2YgZHJhZ2dpbmdcbiAgICAgICAgLy8gcmVzZXQgc2hvdWxkIGJlIGRvbmUgYWZ0ZXIgdGhlIGRyYWdnaW5nIGlzIGNvbXBsZXRlZFxuICAgICAgICBpZiAoc2xpZGVyLmlzRHJhZ2dpbmcpIHtcbiAgICAgICAgICAgIGlmIChpc1RvdWNoKCkpIHtcbiAgICAgICAgICAgICAgICBzbGlkZXIudHJhY2suYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hlbmQnLCByZXNldCwgeyBvbmNlOiB0cnVlIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgc2xpZGVyLnRyYWNrLmFkZEV2ZW50TGlzdGVuZXIoJ3BvaW50ZXJ1cCcsIHJlc2V0LCB7IG9uY2U6IHRydWUgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByQWYocmVzZXQpO1xuICAgICAgICB9XG4gICAgfVxufVxuLy8gPC0tLSBtb3ZlIHNsaWRlciB0byBsZWZ0IGZvciBzaG93aW5nIGNvbnRlbnQgb24gcmlnaHRcbmZ1bmN0aW9uIHNjcm9sbE5leHQoc2xpZGVyLCBzbGlkZUNvdW50KSB7XG4gICAgY29uc3QgckFmID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lO1xuICAgIGlmICghc2xpZGVyLmNvbmZpZy5sb29wKSB7XG4gICAgICAgIG5vTG9vcFNjcm9sbChzbGlkZXIpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgLy8gYXBwbHkgb2Zmc2V0IGFuZCBsZXQgdGhlIHNsaWRlciBzY3JvbGwgZnJvbSAgPC0gKHJpZ2h0IHRvIGxlZnQpXG4gICAgICAgIHNsaWRlci5vZmZzZXQgPSAtMSAqIHNsaWRlQ291bnQ7XG4gICAgICAgIHVwZGF0ZVRyYW5zZm9ybShzbGlkZXIpO1xuICAgICAgICAvLyBvbmNlIHRoZSB0cmFuc2l0aW9uIGlzIGRvbmVcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAvLyByZW1vdmUgdGhlIGVsZW1lbnRzIGZyb20gc3RhcnQgdGhhdCBhcmUgbm8gbG9uZ2VyIHZpc2libGUgYW5kIHB1dCB0aGVtIGF0IHRoZSBlbmRcbiAgICAgICAgICAgIHdyYXBOZXh0KHNsaWRlciwgc2xpZGVDb3VudCk7XG4gICAgICAgICAgICBkaXNhYmxlVHJhbnNpdGlvbihzbGlkZXIpO1xuICAgICAgICAgICAgLy8gYXBwbHkgdHJhbnNmb3JtIHdoZXJlIHRoZSBzbGlkZXIgc2hvdWxkIGdvXG4gICAgICAgICAgICBzbGlkZXIub2Zmc2V0ID0gMDtcbiAgICAgICAgICAgIHVwZGF0ZVRyYW5zZm9ybShzbGlkZXIpO1xuICAgICAgICAgICAgckFmKCgpID0+IHtcbiAgICAgICAgICAgICAgICByQWYoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBlbmFibGVUcmFuc2l0aW9uKHNsaWRlcik7XG4gICAgICAgICAgICAgICAgICAgIG9uU2xpZGVFbmQoc2xpZGVyKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LCBzbGlkZXIuY29uZmlnLnRyYW5zaXRpb25EdXJhdGlvbik7XG4gICAgfVxufVxuZnVuY3Rpb24gb25TbGlkZUVuZChzbGlkZXIpIHtcbiAgICBpZiAoc2xpZGVyLm9uU2xpZGVDYnMpIHtcbiAgICAgICAgY29uc3Qgc3RhdGUgPSBzbGlkZXIuc3RhdGVzW3NsaWRlci5zdGF0ZUluZGV4XTtcbiAgICAgICAgY29uc3QgW2ZpcnN0U2xpZGVJbmRleCwgbGFzdFNsaWRlSW5kZXhdID0gc3RhdGUucGFnZTtcbiAgICAgICAgc2xpZGVyLm9uU2xpZGVDYnMuZm9yRWFjaCgoY2IpID0+IGNiKHNsaWRlci5zdGF0ZUluZGV4LCBmaXJzdFNsaWRlSW5kZXgsIGxhc3RTbGlkZUluZGV4KSk7XG4gICAgfVxufVxuXG4vLyB3aGVuIGxvb3AgaXMgZGlzYWJsZWQsIHdlIG11c3QgdXBkYXRlIHRoZSBvZmZzZXRcbmZ1bmN0aW9uIG5vTG9vcFNjcm9sbChzbGlkZXIpIHtcbiAgICBzbGlkZXIub2Zmc2V0ID0gLTEgKiBzbGlkZXIuc3RhdGVzW3NsaWRlci5zdGF0ZUluZGV4XS5wYWdlWzBdO1xuICAgIHVwZGF0ZVRyYW5zZm9ybShzbGlkZXIpO1xuICAgIG9uU2xpZGVFbmQoc2xpZGVyKTtcbn1cbmZ1bmN0aW9uIHdyYXBQcmV2KHNsaWRlciwgY291bnQpIHtcbiAgICBjb25zdCBsZW4gPSBzbGlkZXIuc2xpZGVzLmxlbmd0aDtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNvdW50OyBpKyspIHtcbiAgICAgICAgLy8gcGljayB0aGUgbGFzdCBhbmQgbW92ZSB0byBmaXJzdFxuICAgICAgICBjb25zdCBzbGlkZSA9IHNsaWRlci5zbGlkZXNbbGVuIC0gMV07XG4gICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgc2xpZGVyLnRyYWNrLnByZXBlbmQoc2xpZGUpO1xuICAgIH1cbn1cbmZ1bmN0aW9uIHdyYXBOZXh0KHNsaWRlciwgY291bnQpIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNvdW50OyBpKyspIHtcbiAgICAgICAgc2xpZGVyLnRyYWNrLmFwcGVuZChzbGlkZXIuc2xpZGVzWzBdKTtcbiAgICB9XG59XG5mdW5jdGlvbiB1cGRhdGVUcmFuc2Zvcm0oc2xpZGVyKSB7XG4gICAgY29uc3QgeyB0cmFjaywgb2Zmc2V0LCBkcmFnZ2VkIH0gPSBzbGlkZXI7XG4gICAgaWYgKG9mZnNldCA9PT0gMCkge1xuICAgICAgICB0cmFjay5zdHlsZS50cmFuc2Zvcm0gPSBgdHJhbnNsYXRlM2QoJHtkcmFnZ2VkfXB4LDBweCwwcHgpYDtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHRyYWNrLnN0eWxlLnRyYW5zZm9ybSA9IGB0cmFuc2xhdGUzZCggIGNhbGMoICR7ZHJhZ2dlZH1weCArICR7b2Zmc2V0fSAqICh2YXIoLS1zbGlkZS13aWR0aCkgKyAke3NsaWRlci5jb25maWcuc2xpZGVHYXB9KSksMHB4LDBweClgO1xuICAgIH1cbn1cbmZ1bmN0aW9uIGVuYWJsZVRyYW5zaXRpb24oc2xpZGVyKSB7XG4gICAgc2xpZGVyLnRyYWNrLnN0eWxlLnRyYW5zaXRpb25EdXJhdGlvbiA9IGAke3NsaWRlci5jb25maWcudHJhbnNpdGlvbkR1cmF0aW9ufW1zYDtcbn1cbmZ1bmN0aW9uIGRpc2FibGVUcmFuc2l0aW9uKHNsaWRlcikge1xuICAgIHNsaWRlci50cmFjay5zdHlsZS50cmFuc2l0aW9uRHVyYXRpb24gPSBgMG1zYDtcbn1cblxuY29uc3Qgc2xpZGVUaHJlc2hvbGQgPSAxMDtcbmNvbnN0IGlzVG91Y2ggPSAoKSA9PiAnb250b3VjaHN0YXJ0JyBpbiB3aW5kb3c7XG5mdW5jdGlvbiBoYW5kbGVQb2ludGVyRG93bihkb3duRXZlbnQpIHtcbiAgICBjb25zdCB0cmFjayA9IHRoaXM7XG4gICAgY29uc3Qgc2xpZGVyID0gdHJhY2suc2xpZGVyO1xuICAgIGlmIChzbGlkZXIuaXNUcmFuc2l0aW9uaW5nKVxuICAgICAgICByZXR1cm47XG4gICAgc2xpZGVyLmRyYWdnZWQgPSAwO1xuICAgIHRyYWNrLmlzU2Nyb2xsZWQgPSBmYWxzZTtcbiAgICB0cmFjay5zdGFydE1vdXNlQ2xpZW50WCA9XG4gICAgICAgICd0b3VjaGVzJyBpbiBkb3duRXZlbnQgPyBkb3duRXZlbnQudG91Y2hlc1swXS5jbGllbnRYIDogZG93bkV2ZW50LmNsaWVudFg7XG4gICAgaWYgKCEoJ3RvdWNoZXMnIGluIGRvd25FdmVudCkpIHtcbiAgICAgICAgLy8gZG8gbm90IGRpcmVjdGx5IHNldFBvaW50ZXJDYXB0dXJlIG9uIHRyYWNrIC0gaXQgYmxvY2tzIHRoZSBjbGljayBldmVudHNcbiAgICAgICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL0dvb2dsZUNocm9tZUxhYnMvcG9pbnRlci10cmFja2VyL2lzc3Vlcy80XG4gICAgICAgIGNvbnN0IGVsID0gKGRvd25FdmVudC50YXJnZXQgfHwgdHJhY2spO1xuICAgICAgICBlbC5zZXRQb2ludGVyQ2FwdHVyZShkb3duRXZlbnQucG9pbnRlcklkKTtcbiAgICB9XG4gICAgZGlzYWJsZVRyYW5zaXRpb24oc2xpZGVyKTtcbiAgICB1cGRhdGVFdmVudExpc3RlbmVyKHRyYWNrLCAnYWRkRXZlbnRMaXN0ZW5lcicpO1xufVxuZnVuY3Rpb24gaGFuZGxlUG9pbnRlck1vdmUobW92ZUV2ZW50KSB7XG4gICAgY29uc3QgdHJhY2sgPSB0aGlzO1xuICAgIGNvbnN0IHggPSAndG91Y2hlcycgaW4gbW92ZUV2ZW50ID8gbW92ZUV2ZW50LnRvdWNoZXNbMF0uY2xpZW50WCA6IG1vdmVFdmVudC5jbGllbnRYO1xuICAgIGNvbnN0IGRyYWdnZWQgPSAodHJhY2suc2xpZGVyLmRyYWdnZWQgPSB4IC0gdHJhY2suc3RhcnRNb3VzZUNsaWVudFgpO1xuICAgIGNvbnN0IGRyYWdnZWRBYnMgPSBNYXRoLmFicyhkcmFnZ2VkKTtcbiAgICAvLyBjb25zaWRlciBkcmFnZ2luZyBvbmx5IGlmIHRoZSB1c2VyIGhhcyBkcmFnZ2VkIG1vcmUgdGhhbiA1cHhcbiAgICBpZiAoZHJhZ2dlZEFicyA+IDUpIHtcbiAgICAgICAgLy8gdHJhY2suc2V0QXR0cmlidXRlKCdkYXRhLWRyYWdnaW5nJywgJ3RydWUnKVxuICAgICAgICB0cmFjay5zbGlkZXIuaXNEcmFnZ2luZyA9IHRydWU7XG4gICAgfVxuICAgIC8vIHByZXZlbnQgdmVydGljYWwgc2Nyb2xsaW5nIGlmIGhvcml6b250YWwgc2Nyb2xsaW5nIGlzIGhhcHBlbmluZ1xuICAgIGlmIChkcmFnZ2VkQWJzID4gMTUpIHtcbiAgICAgICAgbW92ZUV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgfVxuICAgIHRyYWNrLnNsaWRlci5kcmFnZ2VkID0gZHJhZ2dlZDtcbiAgICB1cGRhdGVUcmFuc2Zvcm0odHJhY2suc2xpZGVyKTtcbiAgICBpZiAoIXRyYWNrLmlzU2Nyb2xsZWQgJiYgdHJhY2suc2xpZGVyLmNvbmZpZy5sb29wKSB7XG4gICAgICAgIGlmIChkcmFnZ2VkID4gc2xpZGVUaHJlc2hvbGQpIHtcbiAgICAgICAgICAgIHRyYWNrLmlzU2Nyb2xsZWQgPSB0cnVlO1xuICAgICAgICAgICAgdHJhY2suc2xpZGVyLnByZXYoKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbmZ1bmN0aW9uIGhhbmRsZVBvaW50ZXJVcCgpIHtcbiAgICBjb25zdCB0cmFjayA9IHRoaXM7XG4gICAgY29uc3QgZHJhZ2dlZCA9IHRyYWNrLnNsaWRlci5kcmFnZ2VkO1xuICAgIHRyYWNrLnNsaWRlci5pc0RyYWdnaW5nID0gZmFsc2U7XG4gICAgdXBkYXRlRXZlbnRMaXN0ZW5lcih0cmFjaywgJ3JlbW92ZUV2ZW50TGlzdGVuZXInKTtcbiAgICAvLyByZXNldCBkcmFnXG4gICAgdHJhY2suc2xpZGVyLmRyYWdnZWQgPSAwO1xuICAgIHVwZGF0ZVRyYW5zZm9ybSh0cmFjay5zbGlkZXIpO1xuICAgIGVuYWJsZVRyYW5zaXRpb24odHJhY2suc2xpZGVyKTtcbiAgICBpZiAoIXRyYWNrLmlzU2Nyb2xsZWQpIHtcbiAgICAgICAgaWYgKGRyYWdnZWQgPCAtMSAqIHNsaWRlVGhyZXNob2xkKSB7XG4gICAgICAgICAgICB0cmFjay5zbGlkZXIubmV4dCgpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGRyYWdnZWQgPiBzbGlkZVRocmVzaG9sZCkge1xuICAgICAgICAgICAgdHJhY2suc2xpZGVyLnByZXYoKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbmNvbnN0IHByZXZlbnREZWZhdWx0ID0gKGV2ZW50KSA9PiBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuLyoqXG4gKiBkcmFnIGJhc2VkIG5hdmlnYXRpb24gZm9yIHNsaWRlclxuICovXG5mdW5jdGlvbiBkcmFnU3VwcG9ydChzbGlkZXIpIHtcbiAgICAvLyBAdHMtZXhwZWN0LWVycm9yXG4gICAgY29uc3QgdHJhY2sgPSBzbGlkZXIudHJhY2s7XG4gICAgdHJhY2suc2xpZGVyID0gc2xpZGVyO1xuICAgIGNvbnN0IGV2ZW50ID0gaXNUb3VjaCgpID8gJ3RvdWNoc3RhcnQnIDogJ3BvaW50ZXJkb3duJztcbiAgICAvLyBAdHMtZXhwZWN0LWVycm9yXG4gICAgdHJhY2suYWRkRXZlbnRMaXN0ZW5lcihldmVudCwgaGFuZGxlUG9pbnRlckRvd24pO1xuICAgIC8vIHByZXZlbnQgY2xpY2sgZGVmYXVsdCB3aGVuIHNsaWRlciBpcyBiZWluZyBkcmFnZ2VkIG9yIHRyYW5zaXRpb25pbmdcbiAgICB0cmFjay5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldmVudCkgPT4ge1xuICAgICAgICBpZiAoc2xpZGVyLmlzVHJhbnNpdGlvbmluZyB8fCBzbGlkZXIuaXNEcmFnZ2luZykge1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIGV2ZW50LnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgIH1cbiAgICB9LCB7XG4gICAgICAgIGNhcHR1cmU6IHRydWUsXG4gICAgfSk7XG4gICAgLy8gcHJldmVudCBkcmFnZ2luZyBvZiBlbGVtZW50cyBpbnNpZGUgdGhlIHNsaWRlclxuICAgIHRyYWNrLmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWdzdGFydCcsIHByZXZlbnREZWZhdWx0KTtcbn1cbmZ1bmN0aW9uIHVwZGF0ZUV2ZW50TGlzdGVuZXIodHJhY2ssIG1ldGhvZCkge1xuICAgIHRyYWNrW21ldGhvZF0oJ2NvbnRleHRtZW51JywgaGFuZGxlUG9pbnRlclVwKTtcbiAgICBpZiAoaXNUb3VjaCgpKSB7XG4gICAgICAgIHRyYWNrW21ldGhvZF0oJ3RvdWNoZW5kJywgaGFuZGxlUG9pbnRlclVwKTtcbiAgICAgICAgLy8gQHRzLWV4cGVjdC1lcnJvclxuICAgICAgICB0cmFja1ttZXRob2RdKCd0b3VjaG1vdmUnLCBoYW5kbGVQb2ludGVyTW92ZSk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICB0cmFja1ttZXRob2RdKCdwb2ludGVydXAnLCBoYW5kbGVQb2ludGVyVXApO1xuICAgICAgICAvLyBAdHMtZXhwZWN0LWVycm9yXG4gICAgICAgIHRyYWNrW21ldGhvZF0oJ3BvaW50ZXJtb3ZlJywgaGFuZGxlUG9pbnRlck1vdmUpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gaGFuZGxlQXV0b3BsYXkoc2xpZGVyKSB7XG4gICAgY29uc3QgY29uZmlnID0gc2xpZGVyLmNvbmZpZztcbiAgICBpZiAoIWNvbmZpZy5lbmFibGVBdXRvcGxheSlcbiAgICAgICAgcmV0dXJuO1xuICAgIGNvbnN0IGRpciA9IGNvbmZpZy5hdXRvcGxheURpcmVjdGlvbiA9PT0gJ3RvIGxlZnQnID8gJ25leHQnIDogJ3ByZXYnO1xuICAgIHNsaWRlci5hdXRvcGxheVRpbWVyID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgICAgICBzbGlkZXJbZGlyXSgpO1xuICAgIH0sIGNvbmZpZy5hdXRvcGxheUludGVydmFsKTtcbiAgICBpZiAoY29uZmlnLnN0b3BBdXRvcGxheU9uSW50ZXJhY3Rpb24pIHtcbiAgICAgICAgc2xpZGVyLmVsLmFkZEV2ZW50TGlzdGVuZXIoaXNUb3VjaCgpID8gJ3RvdWNoc3RhcnQnIDogJ21vdXNlZG93bicsICgpID0+IHtcbiAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwoc2xpZGVyLmF1dG9wbGF5VGltZXIpO1xuICAgICAgICB9LCB7IG9uY2U6IHRydWUgfSk7XG4gICAgfVxufVxuXG5jb25zdCBkZWZhdWx0Q29uZmlnID0ge1xuICAgIC8vIGxheW91dFxuICAgIHNsaWRlR2FwOiAnMjBweCcsXG4gICAgc2xpZGVzVG9TY3JvbGw6IDEsXG4gICAgc2xpZGVzVG9TaG93OiAxLFxuICAgIC8vIGJlaGF2aW9yXG4gICAgbG9vcDogdHJ1ZSxcbiAgICAvLyBhdXRvcGxheVxuICAgIGVuYWJsZUF1dG9wbGF5OiBmYWxzZSxcbiAgICBzdG9wQXV0b3BsYXlPbkludGVyYWN0aW9uOiB0cnVlLFxuICAgIGF1dG9wbGF5SW50ZXJ2YWw6IDMwMDAsXG4gICAgYXV0b3BsYXlEaXJlY3Rpb246ICd0byBsZWZ0JyxcbiAgICAvLyBwYWdpbmF0aW9uXG4gICAgZW5hYmxlUGFnaW5hdGlvbjogdHJ1ZSxcbiAgICAvLyB0cmFuc2l0aW9uXG4gICAgdHJhbnNpdGlvbkR1cmF0aW9uOiAzMDAsXG4gICAgdHJhbnNpdGlvblRpbWluZ0Z1bmN0aW9uOiAnZWFzZScsXG4gICAgZHJhZ2dhYmxlOiB0cnVlLFxufTtcbmZ1bmN0aW9uIGNyZWF0ZUNvbmZpZyhibGF6ZUNvbmZpZykge1xuICAgIC8vIHN0YXJ0IHdpdGggZGVmYXVsdCBjb25maWcgY2xvbmVcbiAgICBjb25zdCBjb25maWcgPSB7IC4uLmRlZmF1bHRDb25maWcgfTtcbiAgICBmb3IgKGNvbnN0IG1lZGlhIGluIGJsYXplQ29uZmlnKSB7XG4gICAgICAgIC8vIGlmIHRoZSBtZWRpYSBtYXRjaGVzLCBvdmVycmlkZSB0aGUgY29uZmlnIHdpdGggbWVkaWEgY29uZmlnXG4gICAgICAgIGlmICh3aW5kb3cubWF0Y2hNZWRpYShtZWRpYSkubWF0Y2hlcykge1xuICAgICAgICAgICAgY29uc3QgbWVkaWFDb25maWcgPSBibGF6ZUNvbmZpZ1ttZWRpYV07XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGtleSBpbiBtZWRpYUNvbmZpZykge1xuICAgICAgICAgICAgICAgIC8vIEB0cy1leHBlY3QtZXJyb3JcbiAgICAgICAgICAgICAgICBjb25maWdba2V5XSA9IG1lZGlhQ29uZmlnW2tleV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGNvbmZpZztcbn1cblxuZnVuY3Rpb24gaGFuZGxlTmF2aWdhdGlvbihzbGlkZXIpIHtcbiAgICBjb25zdCBwcmV2ID0gc2xpZGVyLmVsLnF1ZXJ5U2VsZWN0b3IoJy5ibGF6ZS1wcmV2Jyk7XG4gICAgY29uc3QgbmV4dCA9IHNsaWRlci5lbC5xdWVyeVNlbGVjdG9yKCcuYmxhemUtbmV4dCcpO1xuICAgIGlmIChwcmV2KSB7XG4gICAgICAgIHByZXYub25jbGljayA9ICgpID0+IHtcbiAgICAgICAgICAgIHNsaWRlci5wcmV2KCk7XG4gICAgICAgIH07XG4gICAgfVxuICAgIGlmIChuZXh0KSB7XG4gICAgICAgIG5leHQub25jbGljayA9ICgpID0+IHtcbiAgICAgICAgICAgIHNsaWRlci5uZXh0KCk7XG4gICAgICAgIH07XG4gICAgfVxufVxuXG5mdW5jdGlvbiBoYW5kbGVQYWdpbmF0aW9uKHNsaWRlcikge1xuICAgIGlmICghc2xpZGVyLmNvbmZpZy5lbmFibGVQYWdpbmF0aW9uIHx8IHNsaWRlci5pc1N0YXRpYylcbiAgICAgICAgcmV0dXJuO1xuICAgIGNvbnN0IHBhZ2luYXRpb25Db250YWluZXIgPSBzbGlkZXIuZWwucXVlcnlTZWxlY3RvcignLmJsYXplLXBhZ2luYXRpb24nKTtcbiAgICBpZiAoIXBhZ2luYXRpb25Db250YWluZXIpXG4gICAgICAgIHJldHVybjtcbiAgICBzbGlkZXIucGFnaW5hdGlvbkJ1dHRvbnMgPSBbXTtcbiAgICBjb25zdCB0b3RhbCA9IHNsaWRlci5zdGF0ZXMubGVuZ3RoO1xuICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCB0b3RhbDsgaW5kZXgrKykge1xuICAgICAgICBjb25zdCBidXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICAgICAgc2xpZGVyLnBhZ2luYXRpb25CdXR0b25zLnB1c2goYnV0dG9uKTtcbiAgICAgICAgYnV0dG9uLnRleHRDb250ZW50ID0gMSArIGluZGV4ICsgJyc7XG4gICAgICAgIGJ1dHRvbi5hcmlhTGFiZWwgPSBgJHtpbmRleCArIDF9IG9mICR7dG90YWx9YDtcbiAgICAgICAgcGFnaW5hdGlvbkNvbnRhaW5lci5hcHBlbmQoYnV0dG9uKTtcbiAgICAgICAgLy8gQHRzLWV4cGVjdC1lcnJvclxuICAgICAgICBidXR0b24uc2xpZGVyID0gc2xpZGVyO1xuICAgICAgICAvLyBAdHMtZXhwZWN0LWVycm9yXG4gICAgICAgIGJ1dHRvbi5pbmRleCA9IGluZGV4O1xuICAgICAgICAvLyBAdHMtZXhwZWN0LWVycm9yXG4gICAgICAgIGJ1dHRvbi5vbmNsaWNrID0gaGFuZGxlUGFnaW5hdGlvbkJ1dHRvbkNsaWNrO1xuICAgIH1cbiAgICAvLyBpbml0aWFsbHkgdGhlIGZpcnN0IGJ1dHRvbiBpcyBhY3RpdmVcbiAgICBzbGlkZXIucGFnaW5hdGlvbkJ1dHRvbnNbMF0uY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG59XG5mdW5jdGlvbiBoYW5kbGVQYWdpbmF0aW9uQnV0dG9uQ2xpY2soKSB7XG4gICAgY29uc3QgaW5kZXggPSB0aGlzLmluZGV4O1xuICAgIGNvbnN0IHNsaWRlciA9IHRoaXMuc2xpZGVyO1xuICAgIGNvbnN0IHN0YXRlSW5kZXggPSBzbGlkZXIuc3RhdGVJbmRleDtcbiAgICBjb25zdCBsb29wID0gc2xpZGVyLmNvbmZpZy5sb29wO1xuICAgIGNvbnN0IGRpZmYgPSBNYXRoLmFicyhpbmRleCAtIHN0YXRlSW5kZXgpO1xuICAgIGNvbnN0IGludmVyc2VEaWZmID0gc2xpZGVyLnN0YXRlcy5sZW5ndGggLSBkaWZmO1xuICAgIGNvbnN0IGlzRGlmZkxhcmdlclRoYW5IYWxmID0gZGlmZiA+IHNsaWRlci5zdGF0ZXMubGVuZ3RoIC8gMjtcbiAgICBjb25zdCBzY3JvbGxPcHBvc2l0ZSA9IGlzRGlmZkxhcmdlclRoYW5IYWxmICYmIGxvb3A7XG4gICAgLy8gaWYgdGFyZ2V0IHN0YXRlIGlzIGFoZWFkIG9mIGN1cnJlbnQgc3RhdGVcbiAgICBpZiAoaW5kZXggPiBzdGF0ZUluZGV4KSB7XG4gICAgICAgIC8vIGJ1dCB0aGUgZGlmZiBpcyB0b28gbGFyZ2VcbiAgICAgICAgaWYgKHNjcm9sbE9wcG9zaXRlKSB7XG4gICAgICAgICAgICAvLyBzY3JvbGwgaW4gb3Bwb3NpdGUgZGlyZWN0aW9uIHRvIHJlZHVjZSBzY3JvbGxpbmdcbiAgICAgICAgICAgIHNsaWRlci5wcmV2KGludmVyc2VEaWZmKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIC8vIHNjcm9sbCBub3JtYWxseVxuICAgICAgICAgICAgc2xpZGVyLm5leHQoZGlmZik7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLy8gaWYgdGFyZ2V0IHN0YXRlIGlzIGJlZm9yZSBjdXJyZW50IHN0YXRlXG4gICAgZWxzZSB7XG4gICAgICAgIC8vIGJ1dCB0aGUgZGlmZiBpcyB0b28gbGFyZ2VcbiAgICAgICAgaWYgKHNjcm9sbE9wcG9zaXRlKSB7XG4gICAgICAgICAgICAvLyBzY3JvbGwgaW4gb3Bwb3NpdGUgZGlyZWN0aW9uXG4gICAgICAgICAgICBzbGlkZXIubmV4dChpbnZlcnNlRGlmZik7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAvLyBzY3JvbGwgbm9ybWFsbHlcbiAgICAgICAgICAgIHNsaWRlci5wcmV2KGRpZmYpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5mdW5jdGlvbiBpc1RyYW5zaXRpb25pbmcoc2xpZGVyLCB0aW1lID0gc2xpZGVyLmNvbmZpZy50cmFuc2l0aW9uRHVyYXRpb24pIHtcbiAgICBzbGlkZXIuaXNUcmFuc2l0aW9uaW5nID0gdHJ1ZTtcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgc2xpZGVyLmlzVHJhbnNpdGlvbmluZyA9IGZhbHNlO1xuICAgIH0sIHRpbWUpO1xufVxuY2xhc3MgQmxhemVTbGlkZXIgZXh0ZW5kcyBBdXRvbWF0YSB7XG4gICAgY29uc3RydWN0b3IoYmxhemVTbGlkZXJFbCwgYmxhemVDb25maWcpIHtcbiAgICAgICAgY29uc3QgdHJhY2sgPSBibGF6ZVNsaWRlckVsLnF1ZXJ5U2VsZWN0b3IoJy5ibGF6ZS10cmFjaycpO1xuICAgICAgICBjb25zdCBzbGlkZXMgPSB0cmFjay5jaGlsZHJlbjtcbiAgICAgICAgY29uc3QgY29uZmlnID0gYmxhemVDb25maWdcbiAgICAgICAgICAgID8gY3JlYXRlQ29uZmlnKGJsYXplQ29uZmlnKVxuICAgICAgICAgICAgOiB7IC4uLmRlZmF1bHRDb25maWcgfTtcbiAgICAgICAgc3VwZXIoc2xpZGVzLmxlbmd0aCwgY29uZmlnKTtcbiAgICAgICAgdGhpcy5jb25maWcgPSBjb25maWc7XG4gICAgICAgIHRoaXMuZWwgPSBibGF6ZVNsaWRlckVsO1xuICAgICAgICB0aGlzLnRyYWNrID0gdHJhY2s7XG4gICAgICAgIHRoaXMuc2xpZGVzID0gc2xpZGVzO1xuICAgICAgICB0aGlzLm9mZnNldCA9IDA7XG4gICAgICAgIHRoaXMuZHJhZ2dlZCA9IDA7XG4gICAgICAgIHRoaXMuaXNEcmFnZ2luZyA9IGZhbHNlO1xuICAgICAgICAvLyBAdHMtaWdub3JlIC0gZm9yIGRlYnVnZ2luZ1xuICAgICAgICB0aGlzLmVsLmJsYXplU2xpZGVyID0gdGhpcztcbiAgICAgICAgdGhpcy5wYXNzZWRDb25maWcgPSBibGF6ZUNvbmZpZztcbiAgICAgICAgY29uc3Qgc2xpZGVyID0gdGhpcztcbiAgICAgICAgdHJhY2suc2xpZGVyID0gc2xpZGVyO1xuICAgICAgICBjb25zdHJ1Y3QoY29uZmlnLCBzbGlkZXIpO1xuICAgICAgICAvLyB0aHJvdHRsZWQgdG8gcmVmcmVzaCBldmVyeSAyMDBtcyB3aGVuIHJlc2l6aW5nXG4gICAgICAgIGxldCBpZ25vcmVSZXNpemUgPSBmYWxzZTtcbiAgICAgICAgbGV0IHdpZHRoID0gMDtcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsICgpID0+IHtcbiAgICAgICAgICAgIGlmICh3aWR0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgIHdpZHRoID0gd2luZG93LmlubmVyV2lkdGg7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgbmV3V2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcbiAgICAgICAgICAgIC8vIGlnbm9yZSBoZWlnaHQgY2hhbmdlIC0gb25seSByZWZyZXNoIGlmIHRoZSB3aWR0aCBpcyBjaGFuZ2VkXG4gICAgICAgICAgICBpZiAod2lkdGggPT09IG5ld1dpZHRoKVxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIHdpZHRoID0gbmV3V2lkdGg7XG4gICAgICAgICAgICBpZiAoIWlnbm9yZVJlc2l6ZSkge1xuICAgICAgICAgICAgICAgIGlnbm9yZVJlc2l6ZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHNsaWRlci5yZWZyZXNoKCk7XG4gICAgICAgICAgICAgICAgICAgIGlnbm9yZVJlc2l6ZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH0sIDIwMCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBuZXh0KGNvdW50KSB7XG4gICAgICAgIGlmICh0aGlzLmlzVHJhbnNpdGlvbmluZylcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgY29uc3QgdHJhbnNpdGlvbiA9IHN1cGVyLm5leHQoY291bnQpO1xuICAgICAgICBpZiAoIXRyYW5zaXRpb24pIHtcbiAgICAgICAgICAgIGlzVHJhbnNpdGlvbmluZyh0aGlzKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBbcHJldlN0YXRlSW5kZXgsIHNsaWRlQ291bnRdID0gdHJhbnNpdGlvbjtcbiAgICAgICAgaGFuZGxlU3RhdGVDaGFuZ2UodGhpcywgcHJldlN0YXRlSW5kZXgpO1xuICAgICAgICBpc1RyYW5zaXRpb25pbmcodGhpcyk7XG4gICAgICAgIHNjcm9sbE5leHQodGhpcywgc2xpZGVDb3VudCk7XG4gICAgfVxuICAgIHByZXYoY291bnQpIHtcbiAgICAgICAgaWYgKHRoaXMuaXNUcmFuc2l0aW9uaW5nKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICBjb25zdCB0cmFuc2l0aW9uID0gc3VwZXIucHJldihjb3VudCk7XG4gICAgICAgIGlmICghdHJhbnNpdGlvbikge1xuICAgICAgICAgICAgaXNUcmFuc2l0aW9uaW5nKHRoaXMpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IFtwcmV2U3RhdGVJbmRleCwgc2xpZGVDb3VudF0gPSB0cmFuc2l0aW9uO1xuICAgICAgICBoYW5kbGVTdGF0ZUNoYW5nZSh0aGlzLCBwcmV2U3RhdGVJbmRleCk7XG4gICAgICAgIGlzVHJhbnNpdGlvbmluZyh0aGlzKTtcbiAgICAgICAgc2Nyb2xsUHJldih0aGlzLCBzbGlkZUNvdW50KTtcbiAgICB9XG4gICAgc3RvcEF1dG9wbGF5KCkge1xuICAgICAgICBjbGVhckludGVydmFsKHRoaXMuYXV0b3BsYXlUaW1lcik7XG4gICAgfVxuICAgIGRlc3Ryb3koKSB7XG4gICAgICAgIC8vIHJlbW92ZSBzaWRlIGVmZmVjdHMgdGhhdCB3b24ndCBiZSBvdmVycmlkZGVuIGJ5IGNvbnN0cnVjdCgpXG4gICAgICAgIC8vIHJlbW92ZSBvbGQgZHJhZyBldmVudCBoYW5kbGVyXG4gICAgICAgIHRoaXMudHJhY2sucmVtb3ZlRXZlbnRMaXN0ZW5lcihpc1RvdWNoKCkgPyAndG91Y2hzdGFydCcgOiAncG9pbnRlcmRvd24nLCBcbiAgICAgICAgLy8gQHRzLWV4cGVjdC1lcnJvclxuICAgICAgICBoYW5kbGVQb2ludGVyRG93bik7XG4gICAgICAgIC8vIHN0b3AgYXV0b3BsYXlcbiAgICAgICAgdGhpcy5zdG9wQXV0b3BsYXkoKTtcbiAgICAgICAgLy8gcmVtb3ZlIHBhZ2luYXRpb24gYnV0dG9uc1xuICAgICAgICB0aGlzLnBhZ2luYXRpb25CdXR0b25zPy5mb3JFYWNoKChidXR0b24pID0+IGJ1dHRvbi5yZW1vdmUoKSk7XG4gICAgICAgIC8vIHJlbW92ZSBjbGFzc2VzXG4gICAgICAgIHRoaXMuZWwuY2xhc3NMaXN0LnJlbW92ZSgnc3RhdGljJyk7XG4gICAgICAgIHRoaXMuZWwuY2xhc3NMaXN0LnJlbW92ZShTVEFSVCk7XG4gICAgfVxuICAgIHJlZnJlc2goKSB7XG4gICAgICAgIGNvbnN0IG5ld0NvbmZpZyA9IHRoaXMucGFzc2VkQ29uZmlnXG4gICAgICAgICAgICA/IGNyZWF0ZUNvbmZpZyh0aGlzLnBhc3NlZENvbmZpZylcbiAgICAgICAgICAgIDogeyAuLi5kZWZhdWx0Q29uZmlnIH07XG4gICAgICAgIHRoaXMuZGVzdHJveSgpO1xuICAgICAgICBjb25zdHJ1Y3QobmV3Q29uZmlnLCB0aGlzKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogU3Vic2NyaWJlIGZvciBzbGlkZSBjaGFuZ2UgZXZlbnRcbiAgICAgKiBSZXR1cm5zIGEgZnVuY3Rpb24gdG8gdW5zdWJzY3JpYmUgZnJvbSBzbGlkZSBjaGFuZ2UgZXZlbnRcbiAgICAgKi9cbiAgICBvblNsaWRlKGNiKSB7XG4gICAgICAgIGlmICghdGhpcy5vblNsaWRlQ2JzKVxuICAgICAgICAgICAgdGhpcy5vblNsaWRlQ2JzID0gbmV3IFNldCgpO1xuICAgICAgICB0aGlzLm9uU2xpZGVDYnMuYWRkKGNiKTtcbiAgICAgICAgcmV0dXJuICgpID0+IHRoaXMub25TbGlkZUNicy5kZWxldGUoY2IpO1xuICAgIH1cbn1cbmZ1bmN0aW9uIGhhbmRsZVN0YXRlQ2hhbmdlKHNsaWRlciwgcHJldlN0YXRlSW5kZXgpIHtcbiAgICBjb25zdCBjbGFzc0xpc3QgPSBzbGlkZXIuZWwuY2xhc3NMaXN0O1xuICAgIGNvbnN0IHN0YXRlSW5kZXggPSBzbGlkZXIuc3RhdGVJbmRleDtcbiAgICBjb25zdCBidXR0b25zID0gc2xpZGVyLnBhZ2luYXRpb25CdXR0b25zO1xuICAgIGlmICghc2xpZGVyLmNvbmZpZy5sb29wKSB7XG4gICAgICAgIGlmIChzdGF0ZUluZGV4ID09PSAwKSB7XG4gICAgICAgICAgICBjbGFzc0xpc3QuYWRkKFNUQVJUKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGNsYXNzTGlzdC5yZW1vdmUoU1RBUlQpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChzdGF0ZUluZGV4ID09PSBzbGlkZXIuc3RhdGVzLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgICAgIGNsYXNzTGlzdC5hZGQoRU5EKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGNsYXNzTGlzdC5yZW1vdmUoRU5EKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBpZiAoYnV0dG9ucyAmJiBzbGlkZXIuY29uZmlnLmVuYWJsZVBhZ2luYXRpb24pIHtcbiAgICAgICAgYnV0dG9uc1twcmV2U3RhdGVJbmRleF0uY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG4gICAgICAgIGJ1dHRvbnNbc3RhdGVJbmRleF0uY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG4gICAgfVxufVxuZnVuY3Rpb24gY29uc3RydWN0KGNvbmZpZywgc2xpZGVyKSB7XG4gICAgY29uc3QgdHJhY2sgPSBzbGlkZXIudHJhY2s7XG4gICAgc2xpZGVyLnNsaWRlcyA9IHRyYWNrLmNoaWxkcmVuO1xuICAgIHNsaWRlci5vZmZzZXQgPSAwO1xuICAgIHNsaWRlci5jb25maWcgPSBjb25maWc7XG4gICAgY29uc3RydWN0QXV0b21hdGEoc2xpZGVyLCBzbGlkZXIudG90YWxTbGlkZXMsIGNvbmZpZyk7XG4gICAgLy8gaWYgYSBzaWRlIGVmZmVjdCBpcyBpbiBjb25kaXRpb24gLSBtYWtlIHN1cmUgdG8gYWRkIGl0IGZvciBib3RoIGNvbmRpdGlvbnMgLSBzbyBpdCBnZXRzIGNsZWFuZWQgdXBcbiAgICAvLyB3aGVuIHJlZnJlc2ggaXMgY2FsbGVkXG4gICAgaWYgKCFjb25maWcubG9vcCkge1xuICAgICAgICBzbGlkZXIuZWwuY2xhc3NMaXN0LmFkZChTVEFSVCk7XG4gICAgfVxuICAgIGlmIChjb25maWcuZW5hYmxlQXV0b3BsYXkgJiYgIWNvbmZpZy5sb29wKSB7XG4gICAgICAgIGlmIChERVYpIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybignZW5hYmxlQXV0b3BsYXk6dHJ1ZSBpcyBub3QgY29uc2lzdGVudCB3aXRoIGxvb3A6ZmFsc2UsIGF1dG8tZml4aW5nIHdpdGggZW5hYmxlQXV0b3BsYXk6ZmFsc2UnKTtcbiAgICAgICAgfVxuICAgICAgICBjb25maWcuZW5hYmxlQXV0b3BsYXkgPSBmYWxzZTtcbiAgICB9XG4gICAgdHJhY2suc3R5bGUudHJhbnNpdGlvblByb3BlcnR5ID0gJ3RyYW5zZm9ybSc7XG4gICAgdHJhY2suc3R5bGUudHJhbnNpdGlvblRpbWluZ0Z1bmN0aW9uID0gc2xpZGVyLmNvbmZpZy50cmFuc2l0aW9uVGltaW5nRnVuY3Rpb247XG4gICAgdHJhY2suc3R5bGUudHJhbnNpdGlvbkR1cmF0aW9uID0gYCR7c2xpZGVyLmNvbmZpZy50cmFuc2l0aW9uRHVyYXRpb259bXNgO1xuICAgIGNvbnN0IHsgc2xpZGVzVG9TaG93LCBzbGlkZUdhcCB9ID0gc2xpZGVyLmNvbmZpZztcbiAgICBzbGlkZXIuZWwuc3R5bGUuc2V0UHJvcGVydHkoJy0tc2xpZGVzLXRvLXNob3cnLCBzbGlkZXNUb1Nob3cgKyAnJyk7XG4gICAgc2xpZGVyLmVsLnN0eWxlLnNldFByb3BlcnR5KCctLXNsaWRlLWdhcCcsIHNsaWRlR2FwKTtcbiAgICBpZiAoIXNsaWRlci5pc1N0YXRpYykge1xuICAgICAgICBpZiAoY29uZmlnLmRyYWdnYWJsZSkge1xuICAgICAgICAgICAgZHJhZ1N1cHBvcnQoc2xpZGVyKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgc2xpZGVyLmVsLmNsYXNzTGlzdC5hZGQoJ3N0YXRpYycpO1xuICAgIH1cbiAgICBoYW5kbGVQYWdpbmF0aW9uKHNsaWRlcik7XG4gICAgaGFuZGxlQXV0b3BsYXkoc2xpZGVyKTtcbiAgICBoYW5kbGVOYXZpZ2F0aW9uKHNsaWRlcik7XG4gICAgdXBkYXRlVHJhbnNmb3JtKHNsaWRlcik7XG59XG5cbmV4cG9ydCB7IEJsYXplU2xpZGVyIGFzIGRlZmF1bHQgfTtcbiIsICJpbXBvcnQgeyBtb2JpbGVNZW51IH0gZnJvbSAnLi4vbGliL2NvbW1vbic7XHJcbmltcG9ydCBCbGF6ZVNsaWRlciBmcm9tICdibGF6ZS1zbGlkZXInO1xyXG5cclxubW9iaWxlTWVudSgpO1xyXG5cclxuY29uc3Qgc2VydmljZXNCbGF6ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXHJcbiAgJy5zZXJ2aWNlcyAuYmxhemUtc2xpZGVyJ1xyXG4pO1xyXG5jb25zdCBob3dCbGF6ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5ob3cgLmJsYXplLXNsaWRlcicpO1xyXG5jb25zdCBibGF6ZUl0ZW1zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmhvdyAuaXRlbScpO1xyXG5cclxuZnVuY3Rpb24gc2hvd0l0ZW0oZ2V0SW5kZXgpIHtcclxuICBibGF6ZUl0ZW1zLmZvckVhY2goKGl0ZW0sIGluZGV4KSA9PiB7XHJcbiAgICBpZiAoaW5kZXggPT09IGdldEluZGV4KSB7XHJcbiAgICAgIGl0ZW0uY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBpdGVtLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xyXG4gICAgfVxyXG4gIH0pO1xyXG59XHJcblxyXG5pZiAoc2VydmljZXNCbGF6ZSAhPT0gdW5kZWZpbmVkICYmIHNlcnZpY2VzQmxhemUgIT09IG51bGwpIHtcclxuICBuZXcgQmxhemVTbGlkZXIoc2VydmljZXNCbGF6ZSwge1xyXG4gICAgYWxsOiB7XHJcbiAgICAgIHNsaWRlc1RvU2hvdzogMyxcclxuICAgICAgc2xpZGVHYXA6ICczMHB4JyxcclxuICAgICAgZW5hYmxlQXV0b3BsYXk6IHRydWUsXHJcbiAgICAgIGF1dG9wbGF5SW50ZXJ2YWw6IDMwMDAsXHJcbiAgICB9LFxyXG4gICAgJyhtYXgtd2lkdGg6IDU3NXB4KSc6IHtcclxuICAgICAgc2xpZGVzVG9TaG93OiAxLFxyXG4gICAgICBzbGlkZUdhcDogJzBweCcsXHJcbiAgICB9LFxyXG4gICAgJyhtYXgtd2lkdGg6IDk5MXB4KSc6IHtcclxuICAgICAgc2xpZGVzVG9TaG93OiAyLFxyXG4gICAgICBzbGlkZUdhcDogJzMwcHgnLFxyXG4gICAgfSxcclxuICAgICcobWF4LXdpZHRoOiAxMTk5cHgpJzoge1xyXG4gICAgICBzbGlkZXNUb1Nob3c6IDMsXHJcbiAgICAgIHNsaWRlR2FwOiAnMTVweCcsXHJcbiAgICB9LFxyXG4gIH0pO1xyXG59XHJcblxyXG5pZiAoaG93QmxhemUgIT09IHVuZGVmaW5lZCAmJiBob3dCbGF6ZSAhPT0gbnVsbCkge1xyXG4gIGxldCBob3dTbGlkZXIgPSBuZXcgQmxhemVTbGlkZXIoaG93QmxhemUsIHtcclxuICAgIGFsbDoge1xyXG4gICAgICBzbGlkZXNUb1Nob3c6IDEsXHJcbiAgICAgIHNsaWRlR2FwOiAnMHB4JyxcclxuICAgICAgZW5hYmxlQXV0b3BsYXk6IHRydWUsXHJcbiAgICAgIGF1dG9wbGF5SW50ZXJ2YWw6IDMwMDAsXHJcbiAgICB9LFxyXG4gIH0pO1xyXG5cclxuICBob3dTbGlkZXIub25TbGlkZSgocGFnZUluZGV4KSA9PiB7XHJcbiAgICBzaG93SXRlbShwYWdlSW5kZXgpO1xyXG4gIH0pO1xyXG59XHJcbiJdLAogICJtYXBwaW5ncyI6ICI7O0FBQU8sV0FBUyxhQUFhO0FBQzNCLFFBQUksV0FBVztBQUNmLFVBQU1BLGNBQWEsU0FBUyxjQUFjLGFBQWE7QUFDdkQsYUFBUyxXQUFXLFVBQVU7QUFDNUIsVUFBSSxVQUFVO0FBQ1osaUJBQ0csaUJBQWlCLGdDQUFnQyxFQUNqRCxRQUFRLENBQUMsTUFBTTtBQUNkLFlBQUUsVUFBVSxJQUFJLE1BQU07QUFBQSxRQUN4QixDQUFDO0FBQUEsTUFDTCxPQUFPO0FBQ0wsaUJBQ0csaUJBQWlCLGdDQUFnQyxFQUNqRCxRQUFRLENBQUMsTUFBTTtBQUNkLFlBQUUsVUFBVSxPQUFPLE1BQU07QUFBQSxRQUMzQixDQUFDO0FBQUEsTUFDTDtBQUFBLElBQ0Y7QUFFQSxhQUNHLGNBQWMsYUFBYSxFQUMzQixpQkFBaUIsU0FBUyxNQUFNO0FBQy9CLGlCQUFXLENBQUM7QUFDWixpQkFBVyxRQUFRO0FBQUEsSUFDckIsQ0FBQztBQUVILElBQUFBLFlBQVcsWUFDVCxTQUFTLGNBQWMsZ0JBQWdCLEVBQUU7QUFFM0MsSUFBQUEsWUFBVyxNQUFNLGFBQ2YsU0FBUyxjQUFjLFlBQVksRUFBRSxlQUFlLE1BQU07QUFBQSxFQUM5RDs7O0FDM0JBLFdBQVMsZUFBZSxRQUFRO0FBQzVCLFVBQU0sRUFBRSxjQUFjLGdCQUFnQixLQUFLLElB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
