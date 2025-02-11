// --- GENERAL
gsap.defaults({
  ease: "circ.out",
  duration: 0.8,
});

let easeIn = "circ.in";
let easeInOut = "circ.inOut";

let durationS = 0.4;
let durationL = 1.2;
let durationXL = 1.6;

const breakpoints = {
  mobile: 479,
  mobileLandscape: 767,
  tablet: 991,
}; 

let mm = gsap.matchMedia();
// Au début de ton fichier JS
if (navigator.userAgent.includes('Telegram')) {
  document.querySelector('.swiper.is--home-milestones').style.contain = 'size layout paint';
}

gsap.set('[data-visibility]', {visibility: "visible"});

function relaodBreakpoints() {
  function getCurrentBreakpoint() {
    const width = window.innerWidth;
    if (width <= breakpoints.mobile) return "mobile";
    if (width <= breakpoints.mobileLandscape) return "mobileLandscape";
    if (width <= breakpoints.tablet) return "tablet";
    return "desktop";
  }

  let currentBreakpoint = getCurrentBreakpoint();

  function checkAndReload() {
    const newBreakpoint = getCurrentBreakpoint();
    if (newBreakpoint !== currentBreakpoint) {
      currentBreakpoint = newBreakpoint;
      location.reload();
    }
  }

  window.addEventListener("resize", checkAndReload);

  window.addEventListener("load", checkAndReload);
}

function initScroller() {
  let scrollW = document.querySelector('[page-scroll="wrapper"]')
  if(scrollW === null) {return}
  let scroller = document.querySelector('[page-scroll="indicator"]')

  let tl = gsap.timeline({
    scrollTrigger: {
      trigger: "body", // On utilise le body comme trigger
      start: "top top",
      end: () => `+=${document.documentElement.scrollHeight - window.innerHeight}`,
      scrub: 1.2,
      markers: false // Pour débugger
    }
  });

  tl.to(scroller, {
    y: "95vh",
    ease: "none"
  });
}

function splitLines(text) {
  let splitType = new SplitType(text, {
    types: "lines",
    tagName: "span",
  });
  splitType.lines.forEach(line => {
    line.style.display = 'inline-block';
  });

  // Wrap each line in a div with overflow hidden
  let textLines = text.querySelectorAll(".line");
  return textLines;
}

function splitChars(word) {
  let splitType = new SplitType(word, {
    types: "chars",
    tagName: "span",
  });

  let wordChars = word.querySelectorAll(".char");

  return wordChars;
}

function initPopup() {
  let btns = document.querySelectorAll('[data-btn = "launch"]')
  let wrapper = document.querySelector('[data-pop-up="wrap"]')

  if(wrapper === null) {return}

  let popup1 = wrapper.querySelector('[data-pop-up="1"]')
  let popup2 = wrapper.querySelector('[data-pop-up="2"]')
  
  let continueBtnW = popup1.querySelector('.launch-popup__btn')
  let continueBtn = popup1.querySelector('[data-pop-up="btn-continue"]')

  let closeBtns = wrapper.querySelectorAll('[data-pop-up="close"]')

  let checkboxs = popup1.querySelectorAll('.launch-popup__card-checkbox')

  let copyBtn = popup2.querySelector('[data-pop-up="copy-btn"]')

  function resetPopupState() {
    checkboxs.forEach(checkbox => {
      let input = checkbox.querySelector('.launch-popup__checkbox-input');
      let checkmark = checkbox.querySelector('.launch-popup__checkbox-visual');
      let parentCard = input.parentElement.parentElement.parentElement;
      
      input.checked = false;
      gsap.set(checkmark, { opacity: 0 });
      parentCard.classList.remove('is--active');
    });
    
    continueBtnW.classList.remove('is--active');
  }

  checkboxs.forEach(checkbox => {
    let input = checkbox.querySelector('.launch-popup__checkbox-input');
    let checkmark = checkbox.querySelector('.launch-popup__checkbox-visual');
    let parentCard = input.parentElement.parentElement.parentElement;
    
    // Ajout du clic sur la carte
    parentCard.addEventListener('click', () => {
        input.checked = !input.checked; // Inverse l'état de la checkbox
        
        // Déclenche manuellement l'événement change
        const event = new Event('change');
        input.dispatchEvent(event);
    });

    input.addEventListener('change', () => {
        if (input.checked) {
            gsap.to(checkmark, {
                opacity: 1,
            });
            parentCard.classList.add('is--active');
            
        } else {
            gsap.to(checkmark, {
              opacity: 0,
            });
            parentCard.classList.remove('is--active');
        }

        let allChecked = Array.from(checkboxs).every(checkbox => 
          checkbox.querySelector('.launch-popup__checkbox-input').checked
        );

        if (allChecked) {
          continueBtnW.classList.add('is--active');
        } else {
          continueBtnW.classList.remove('is--active');
        }
    });
});

  btns.forEach((btn) => {
    btn.addEventListener('click', () => {
      lenis.stop();
      gsap.set([popup1, popup2], {opacity: 0, yPercent: 10, display: "none"})

      let tl = gsap.timeline()

      tl.set(wrapper, {visibility: "visible", display: "flex", opacity: 0})
      tl.set(popup1, {display: "block"})
      tl.to(wrapper, {opacity: 1, ease: "none", duration: durationS})
      tl.to(popup1, {opacity: 1, yPercent: 0})
    })
  })

  continueBtn.addEventListener('click', () => {
    let continueTl = gsap.timeline()
    continueTl.to(popup1, {opacity: 0, yPercent: 10})
    continueTl.set(popup1, {display: "none"})
    continueTl.set(popup2, {display: "block"})
    continueTl.to(popup2, {opacity: 1, yPercent: 0})
  })

  function copyToClipboard() {
    // Copier le texte
    navigator.clipboard.writeText("bitcoinbitcoin")
      .then(() => {
        // Feedback visuel avec GSAP
        gsap.to('.launch-popup__feedback', {
          opacity: 1,
          y: -20,
          duration: 0.3,
          onComplete: () => {
            gsap.to('.launch-popup__feedback', {
              opacity: 0,
              y: 0,
              delay: 1
            });
          }
        });
      });
  }
  
  copyBtn.addEventListener('click', () => {
    copyToClipboard();
  })

  closeBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      let closeTl = gsap.timeline()
      closeTl.to(wrapper, {opacity: 0, ease: "none", duration: durationS})
      closeTl.set(popup2, {display: "none"}) // Cache popup2
      closeTl.set(popup1, {display: "none"}) // Cache popup1
      closeTl.set(wrapper, {visibility: "hidden"}) // Cache le wrapper en dernier
      closeTl.add(resetPopupState)
      lenis.start();
    })
  })
}

function initTitles() {
  let paragraphs = document.querySelectorAll('[data-title]')
  if(paragraphs.length === 0) {return;}

  paragraphs.forEach((paragraph) => {
    // Sauvegarder le style original
    const originalStyle = window.getComputedStyle(paragraph);
    const background = originalStyle.background;
    const backgroundClip = originalStyle.backgroundClip;
    const webkitBackgroundClip = originalStyle.webkitBackgroundClip;
    const webkitTextFillColor = originalStyle.webkitTextFillColor;
    
    let splitedParagraph = new SplitType(paragraph, {
      types: "lines",
      tagName: "span",
    });

    // Appliquer le style de gradient à chaque ligne
    splitedParagraph.lines.forEach(line => {
      line.style.background = background;
      line.style.backgroundClip = backgroundClip;
      line.style.webkitBackgroundClip = webkitBackgroundClip;
      line.style.webkitTextFillColor = webkitTextFillColor;
    });

    let tl = gsap.timeline({
      scrollTrigger: {
        trigger: paragraph,
        start: "top 85%",
        markers: false
      }
    });

    tl.from(splitedParagraph.lines, {
      opacity: 0.01,
      /*yPercent: 130,
      rotateX: "120deg",
      transformOrigin: "50% 0%",
      perspective: 250,
      scale: 0.8,*/
      stagger: 0.2,
      ease: "none",
      duration: durationL
    });
  });
}

function initParagraphs() {
  let paragraphs = document.querySelectorAll('[data-paragraph]')
  if(paragraphs.length === 0) {return;}

  paragraphs.forEach((paragraph) => {
    let splitedParagraph = splitLines(paragraph)

    // S'assurer que le split est fait
    //splitedParagraph.split();

    let spanLines = splitedParagraph
    let tl = gsap.timeline({
      scrollTrigger: {
        trigger: paragraph,
        start: "top 80%",
        // Enlever scrub pour une animation plus fluide
        markers: false
      }
    });

    tl.from(spanLines, {
      opacity: 0.01, 
      //yPercent: 80, // Optionnel : ajouter un petit mouvement
      ease: "none",
      stagger: 0.2
    });
  });
}

function initWords() {
  let words = document.querySelectorAll('[data-split-word]')
  if(words.length === 0) {return;}

  words.forEach((word) => {
    let splitedWord = splitChars(word)

    let tl = gsap.timeline({
      scrollTrigger: {
        trigger: word,
        start: "top 80%",
        scrub: false,
        markers: false
      }
    })

    tl.from(splitedWord, {yPercent: 120, duration: durationS, stagger: 0.1})
  })
}

function initFadeList() {
  let lists = document.querySelectorAll('[data-fade-item-wrap]');

  if(lists.lenght === 0) {return;}
  
  lists.forEach((list) =>{
    let items = list.querySelectorAll('[data-fade-item]');
    let tl = gsap.timeline({scrollTrigger: {trigger: list, start: 'top 80%'}});
    tl.from(items, {opacity: 0.01, stagger: 0.1, ease: "none", duration: durationL});
  })
}

function initFadeUp() {
  let items = document.querySelectorAll('[data-fade-up]');
  if(items.length === 0) {return;}
  items.forEach((item) => {
    let tl = gsap.timeline({scrollTrigger: {trigger: item, start: 'top 80%'}});
    tl.from(item, {opacity: 0.01, yPercent: 10, duration: durationL});
  })
}

function initHomeHero() {
  let title = document.querySelector('[data-home-hero="title"]')
  if(title === null) {return}

  //let eyebrow = document.querySelector('[data-home-hero="eyebrow"]')
  let subtitle = document.querySelector('[data-home-hero="subtitle"]')
  let btn = document.querySelector('[data-home-hero="btn"]')
  let imgs = document.querySelectorAll('[data-home-hero="img"]')

  const originalStyle = window.getComputedStyle(title);
  const background = originalStyle.background;
  const backgroundClip = originalStyle.backgroundClip;
  const webkitBackgroundClip = originalStyle.webkitBackgroundClip;
  const webkitTextFillColor = originalStyle.webkitTextFillColor;
  
  let splitedTitle = new SplitType(title, {
    types: "lines",
    tagName: "span",
  });

  let splitedSubtitle = new SplitType(subtitle, {
    types: "lines",
    tagName: "span",
  });

  // Appliquer le style de gradient à chaque ligne
  splitedTitle.lines.forEach(line => {
    line.style.background = background;
    line.style.backgroundClip = backgroundClip;
    line.style.webkitBackgroundClip = webkitBackgroundClip;
    line.style.webkitTextFillColor = webkitTextFillColor;
  });

  let tl = gsap.timeline()

  //tl.from(eyebrow, {opacity: 0.01, duration: durationL}, "0.3")

  tl.from(splitedTitle.lines, {
    opacity: 0.01,
    stagger: 0.2,
    ease: "none",
    duration: durationL
  }, 0.3);

  tl.from(splitedSubtitle.lines, {
    opacity: 0.01, 
    ease: "none",
    duration: durationL,
    stagger: 0.2
  }, ">-0.5");

  tl.from(btn, {opacity: 0.01, yPercent: 100}, "< 0.3")
  tl.from(imgs, {opacity: 0.01, ease: "none", duration: durationL}, "< 0.2")
}

function initHomeHeroSequence() {
  let wrap = document.querySelector('[data-home-hero="img"]')
  if(wrap === null) {return}

  let titleLeft = document.querySelector('[data-home-sequence="left-title"]')
  let titleRight = document.querySelector('[data-home-sequence="right-title"]')

  let lineLeft = document.querySelector('[data-home-sequence="left-line"]')
  let lineRight = document.querySelector('[data-home-sequence="right-line"]')

  let captionLeft = document.querySelector('[data-home-sequence="left-caption"]')
  let captionLeft2 = document.querySelector('[data-home-sequence="left-caption-2"]')
  let captionRight = document.querySelector('[data-home-sequence="right-caption"]')
  let captionRight2 = document.querySelector('[data-home-sequence="right-caption-2"]')
  let captionRight3 = document.querySelector('[data-home-sequence="right-caption-3"]')
  let captionRightGraph = document.querySelector('[data-home-sequence="right-graph"]')
  let captionRightGraph2 = document.querySelector('[data-home-sequence="right-graph-2"]')

  let titleLeftM = document.querySelector('[data-home-m-sequence="left-title"]')
  let titleRightM = document.querySelector('[data-home-m-sequence="right-title"]')

  let lineLeftM = document.querySelector('[data-home-m-sequence="left-line"]')
  let lineRightM = document.querySelector('[data-home-m-sequence="right-line"]')

  let captionLeftM = document.querySelector('[data-home-m-sequence="left-caption"]')
  let captionLeft2M = document.querySelector('[data-home-m-sequence="left-caption-2"]')
  let captionRightM = document.querySelector('[data-home-m-sequence="right-caption"]')
  let captionRight2M = document.querySelector('[data-home-m-sequence="right-caption-2"]')
  let captionRight3M = document.querySelector('[data-home-m-sequence="right-caption-3"]')
  let captionRightGraphM = document.querySelector('[data-home-m-sequence="right-graph"]')
  let captionRightGraph2M = document.querySelector('[data-home-m-sequence="right-graph-2"]')

  //gsap.set([titleLeft, titleRight, lineLeft, lineRight, captionLeft, captionRight, captionRightGraph], {opacity: 0})

  let tl = gsap.timeline({repeat: -1})
  let tlM = gsap.timeline({repeat: -1})

  tl.from([titleLeft, captionLeft], {yPercent: 20, opacity: 0, stagger: 0.4}, 3)
  tl.from(lineLeft, {opacity: 0, ease: "none", duration: durationL}, "<0.2")
  tl.to([lineLeft, titleLeft, captionLeft], {opacity: 0, ease: "none", duration: durationS}, ">0.5")
  tl.from([titleRight, captionRight], {yPercent: 20, opacity: 0, stagger: 0.4}, ">0.5")
  tl.from(lineRight, {opacity: 0, ease: "none", duration: durationL}, "<0.2")
  tl.to(captionRight, {opacity: 0, ease: "none", duration: durationS}, ">0.5")
  tl.from(captionRightGraph, {yPercent: 20, opacity: 0, stagger: 0.4}, "> 0.2")
  tl.to([lineRight, titleRight, captionRightGraph], {opacity: 0, ease: "none"}, ">1.5")

  tl.to(titleLeft, { opacity: 1}, ">1")
  tl.from(captionLeft2, {yPercent: 20, opacity: 0}, "<0.4")
  tl.to(lineLeft, {opacity: 1, ease: "none", duration: durationL}, "<0.2")
  tl.to([lineLeft, titleLeft, captionLeft2], {opacity: 0, ease: "none", duration: durationS}, ">0.5")
  tl.to(titleRight, {opacity: 0}, ">0.5")
  tl.from([captionRight2, captionRight3], {yPercent: 20, opacity: 0, stagger: 0.4}, "<0.4")
  tl.to(lineRight, {opacity: 1, ease: "none", duration: durationL}, "<0.2")
  tl.to([titleRight, captionRight2, captionRight3], {opacity: 0, ease: "none"}, ">0.5")
  tl.from(captionRightGraph2, {yPercent: 20, opacity: 0, stagger: 0.4}, "<0.4")
  tl.to([lineRight, titleRight, captionRightGraph2], {opacity: 0, ease: "none"}, ">2")

  mm.add("(max-width: 479px)", () => {
    tlM.from([titleLeftM, captionLeftM], {yPercent: 20, opacity: 0, stagger: 0.4}, 3)
    tlM.from(lineLeftM, {opacity: 0, ease: "none", duration: durationL}, "<0.2")
    tlM.to([lineLeftM, titleLeftM, captionLeftM], {opacity: 0, ease: "none", duration: durationS}, ">0.5")
    tlM.from([titleRightM, captionRightM], {yPercent: 20, opacity: 0, stagger: 0.4}, ">0.5")
    tlM.from(lineRightM, {opacity: 0, ease: "none", duration: durationL}, "<0.2")
    tlM.to(captionRightM, {opacity: 0, ease: "none", duration: durationS}, ">0.5")
    tlM.from(captionRightGraphM, {yPercent: 20, opacity: 0, stagger: 0.4}, "> 0.2")
    tlM.to([lineRightM, titleRightM, captionRightGraphM], {opacity: 0, ease: "none"}, ">1.5")

    tlM.to(titleLeftM, { opacity: 1}, ">1")
    tlM.from(captionLeft2M, {yPercent: 20, opacity: 0}, "<0.4")
    tlM.to(lineLeftM, {opacity: 1, ease: "none", duration: durationL}, "<0.2")
    tlM.to([lineLeftM, titleLeftM, captionLeft2M], {opacity: 0, ease: "none", duration: durationS}, ">0.5")
    tlM.to(titleRightM, {opacity: 0}, ">0.5")
    tlM.from([captionRight2M, captionRight3M], {yPercent: 20, opacity: 0, stagger: 0.4}, "<0.4")
    tlM.to(lineRightM, {opacity: 1, ease: "none", duration: durationL}, "<0.2")
    tlM.to([titleRightM, captionRight2M, captionRight3M], {opacity: 0, ease: "none"}, ">0.5")
    tlM.from(captionRightGraph2M, {yPercent: 20, opacity: 0, stagger: 0.4}, "<0.4")
    tlM.to([lineRightM, titleRightM, captionRightGraph2M], {opacity: 0, ease: "none"}, ">2")
  })

}

function initFeaturesVisuals() {
  let visuals = document.querySelectorAll('.home-features__item-bg-img.is--visual');
  if(visuals.length === 0) {return}

  visuals.forEach((visual) => {
    let tl = gsap.timeline({
      scrollTrigger: {
        trigger: visual,
        start: 'top 70%',
        end: 'bottom bottom',
        scrub: 1.5
      }
    })

    tl.from(visual, {opacity: 0.05, ease: "none", duration: durationXL})
  })
}

function initHomeFeatures() {
  let wrapper = document.querySelector('[data-home-features="wrapper"]')
  if(wrapper === null) {return}

  let items = wrapper.querySelectorAll('.home-features__item')
  let headings = wrapper.querySelectorAll('h2')
  let eyebrows = wrapper.querySelectorAll('.h-eyebrow')
  let paragraphs = wrapper.querySelectorAll('.text-large')
  let imgs = wrapper.querySelectorAll('.home-features__item-bg-img.is--visual')

  // Premier item visible au départ, les autres cachés
  gsap.set(items, {autoAlpha: 0})
  gsap.set(items[0], {autoAlpha: 1})

  // Split des textes
  headings.forEach((heading) => {
    const originalStyle = window.getComputedStyle(heading)
    const background = originalStyle.background
    const backgroundClip = originalStyle.backgroundClip
    const webkitBackgroundClip = originalStyle.webkitBackgroundClip
    const webkitTextFillColor = originalStyle.webkitTextFillColor
    
    let splitedHeading = new SplitType(heading, {
      types: "lines",
      tagName: "span"
    })

    splitedHeading.lines.forEach(line => {
      line.style.background = background
      line.style.backgroundClip = backgroundClip
      line.style.webkitBackgroundClip = webkitBackgroundClip
      line.style.webkitTextFillColor = webkitTextFillColor
    })
  })

  paragraphs.forEach((paragraph) => {
    splitLines(paragraph)
  })

  eyebrows.forEach((word) => {
    splitChars(word)
  })

  // Animation du premier contenu au chargement
  let firstContentTl = gsap.timeline({
    scrollTrigger: {
      trigger: wrapper,
      start: "top 70%",
      markers: false
    }
  })
  
  firstContentTl
    .from(eyebrows[0].querySelectorAll('.char'), {
      opacity: 0,
      duration: durationS,
      stagger: 0.2
    })
    .from(imgs[0], {
      opacity: 0.05,
      ease: "none",
      duration: durationXL
    }, "<")
    .from(headings[0].querySelectorAll('.line'), {
      opacity: 0,
      /*yPercent: 130,
      rotateX: "120deg",
      transformOrigin: "50% 0%",
      perspective: 250,
      scale: 0.8,*/
      stagger: 0.1,
      ease: "none",
      duration: durationL
    }, "<0.2")
    .from(paragraphs[0].querySelectorAll('.line'), {
      opacity: 0.01,
      //yPercent: 80,
      ease: "none",
      stagger: 0.1
    }, "<0.6")

  // Timeline pour les transitions entre sections
  items.forEach((item, i) => {
    if(i === 0) return; // On skip le premier item car déjà géré

    gsap.timeline({
      scrollTrigger: {
        trigger: wrapper,
        start: `${i * 25}% top`,
        end: `${(i + 1) * 25}% top`,
        scrub: 1.2,
        markers: false,
        onEnter: () => {
          // Timeline pour les animations de contenu
          let contentTl = gsap.timeline()
          
          contentTl.from(eyebrows[i].querySelectorAll('.char'), {
            opacity: 0.2,
            duration: durationS,
            stagger: 0.1
          }, 0.4)
          .from(imgs[i], {
            opacity: 0.05,
            ease: "none",
            duration: durationXL
          }, "<")
          .from(headings[i].querySelectorAll('.line'), {
            opacity: 0,
            /*yPercent: 130,
            rotateX: "120deg",
            transformOrigin: "50% 0%",
            perspective: 250,
            scale: 0.8,*/
            stagger: 0.1,
            ease: "none",
            duration: durationL
          }, "<0.2")
          .from(paragraphs[i].querySelectorAll('.line'), {
            opacity: 0.01,
            //yPercent: 80,
            ease: "none",
            stagger: 0.1
          }, "<0.6")

          gsap.to(items[i], {autoAlpha: 1})
          gsap.to(items[i-1], {autoAlpha: 0})
        },
        onLeave: () => {
          if(i < items.length - 1) {
            gsap.to(items[i], {autoAlpha: 0})
            gsap.to(items[i+1], {autoAlpha: 1})
          }
        },
        onEnterBack: () => {
          gsap.to(items[i], {autoAlpha: 1})
          if(i < items.length - 1) {
            gsap.to(items[i+1], {autoAlpha: 0})
          }
        },
        onLeaveBack: () => {
          gsap.to(items[i], {autoAlpha: 0})
          gsap.to(items[i-1], {autoAlpha: 1})
        }
      }
    })
  })
}

function initHomeFaq() {
    let faqItems = document.querySelectorAll('.home-faq__item')

  if(faqItems.length === 0) {return;} 
 
  faqItems.forEach((item) => {
    let btn = item.querySelector('.btn-w')
    let iconLine = item.querySelector('[data-home-faq="btn-line"]')
    
    // Configuration initiale
    gsap.set(item, {height: btn.offsetHeight})
    gsap.set(iconLine, {opacity: 1}) 
    
    btn.addEventListener('click', () => {
      let isOpen = item.classList.contains('active')
      
      // Fermer les autres items
      faqItems.forEach(i => {
        if (i !== item) {
          let otherBtn = i.querySelector('.btn-w')
          let otherIcon = i.querySelector('[data-home-faq="btn-line"]')
          
          gsap.to(i, {
            height: otherBtn.offsetHeight,
          })
          gsap.to(otherIcon, {
            opacity: 1,
          })
          i.classList.remove('active')
        }
      })
      
      // Animer l'item actif
      gsap.to(item, {
        height: isOpen ? btn.offsetHeight : "auto",
      })
      
      // Animer l'icône
      gsap.to(iconLine, {
        opacity: isOpen ? 1 : 0,
      })
      
      item.classList.toggle('active')
    })
  })
}

function initMilestonesSlider() {

  let sliderWrapper = document.querySelector('.swiper.is--home-milestones')
  if(sliderWrapper === null) {return;}

  const milestonesSlider = new Swiper('.swiper.is--home-milestones', {
    autoHeight: true,
    direction: 'horizontal',
    loop: false,
    allowTouchMove: true,
    speed: 600,
    slideToClickedSlide: false,
    
    // Navigation arrows
    navigation: {
      nextEl: '.home-milestones__slider-btn-right',
      prevEl: '.home-milestones__slider-btn-left',
    },
    enabled: true,
    slidesPerView: "auto",
    spaceBetween: 0,
    
    // Ajouter ces options
    observer: true, // Pour forcer la mise à jour lors des changements DOM
    observeParents: true,
    resizeObserver: true,
    
    on: {
      beforeInit: function() {
        // Fixer la hauteur avant l'initialisation
        const swiperEl = document.querySelector('.swiper.is--home-milestones');
        const slides = swiperEl.querySelectorAll('.swiper-slide');
        let maxHeight = 0;
        
        slides.forEach(slide => {
          slide.style.height = 'auto'; // Reset la hauteur
          maxHeight = Math.max(maxHeight, slide.offsetHeight);
        });
        
        // Appliquer la hauteur max à tous les slides
        slides.forEach(slide => {
          slide.style.height = `${maxHeight}px`;
        });
        
        // Forcer la hauteur du container
        swiperEl.querySelector('.swiper-wrapper').style.height = `${maxHeight}px`;
      },
      
      init: function() {
        // Forcer un update après l'initialisation
        this.update();
      }
    },

    breakpoints: {
      480: {
        allowTouchMove: false,
      }
    }
});
}

function initGlobal() {
  relaodBreakpoints();
  initScroller();
  document.fonts.ready.then(() => {
    initPopup();
    initTitles();
    initParagraphs();
    initWords();
    initFadeUp();
    initFadeList();
    initHomeHero();
    initHomeHeroSequence();
    //initFeaturesVisuals();
    initHomeFeatures();
    initHomeFaq();
    initMilestonesSlider();
  })
}

initGlobal();