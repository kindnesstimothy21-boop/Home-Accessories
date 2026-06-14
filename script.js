/* ============================================================
   HOME ACCESSORIES — MAIN SCRIPT
   ------------------------------------------------------------
   Every interactive feature on the site lives here, grouped
   into small functions. Each function only runs if it finds
   the matching element on the page, so this ONE file can be
   safely linked on every page (home, about, products, etc.)
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- PAGE LOADER ----------
     Shows a black screen with "Home Accessories" while the
     page sets itself up, then fades away smoothly. */
  const loader = document.querySelector('.loader');
  if (loader){
    window.addEventListener('load', () => {
      setTimeout(() => loader.classList.add('hide'), 350);
    });
    // Fallback in case 'load' already fired
    setTimeout(() => loader.classList.add('hide'), 1200);
  }

  /* ---------- HERO CAROUSEL ----------
     Cross-fades through the hero background images automatically,
     and lets visitors jump to a slide using the small dash-dots. */
  const heroSlides = document.querySelectorAll('.hero-slide');
  const heroDots = document.querySelectorAll('.hero-dots button');
  if (heroSlides.length){
    let heroCurrent = 0;
    let heroInterval;

    const showHeroSlide = (index) => {
      heroSlides.forEach((s, i) => s.classList.toggle('active', i === index));
      heroDots.forEach((d, i) => d.classList.toggle('active', i === index));
      heroCurrent = index;
    };

    const nextHeroSlide = () => showHeroSlide((heroCurrent + 1) % heroSlides.length);

    const startHeroAuto = () => { heroInterval = setInterval(nextHeroSlide, 5000); };

    heroDots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        clearInterval(heroInterval);
        showHeroSlide(i);
        startHeroAuto();
      });
    });

    showHeroSlide(0);
    startHeroAuto();
  }

  /* ---------- IMAGE LOAD HANDLING ----------
     Every <img> starts with a soft "shimmer" placeholder (set in CSS).
     Once an image finishes loading we add the "loaded" class to turn
     the shimmer off. If an image fails to load (broken link, slow
     network, etc.), we swap in a safe fallback photo so the layout
     never shows an empty/broken box. */
  const FALLBACK_IMG = 'https://images.unsplash.com/photo-1556911220-bff31c812dba?q=80&w=800&auto=format&fit=crop';

  document.querySelectorAll('img').forEach(img => {
    const markLoaded = () => img.classList.add('loaded');

    if (img.complete && img.naturalWidth > 0){
      markLoaded();
    } else {
      img.addEventListener('load', markLoaded);
      img.addEventListener('error', () => {
        if (img.src !== FALLBACK_IMG){
          img.src = FALLBACK_IMG;
        }
        markLoaded();
      });
    }
  });


    //  Toggles the hamburger icon and slides the menu open/closed. */
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (navToggle && navLinks){
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('open');
      navLinks.classList.toggle('open');
    });
    // Close menu when a link is tapped (mobile UX)
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('open');
        navLinks.classList.remove('open');
      });
    });
  }

  /* ---------- BACK TO TOP BUTTON ----------
     Appears after scrolling down 400px, scrolls smoothly to top. */
  const backToTop = document.querySelector('.back-to-top');
  if (backToTop){
    window.addEventListener('scroll', () => {
      backToTop.classList.toggle('show', window.scrollY > 400);
    });
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- SCROLL REVEAL ANIMATIONS ----------
     Any element with class "reveal" fades + slides up into view
     the first time it enters the screen. */
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length){
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting){
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(el => observer.observe(el));
  }

  /* ---------- TESTIMONIAL SLIDER ----------
     Cycles through customer review slides automatically and
     via clickable dots. */
  const slides = document.querySelectorAll('.testimonial-slide');
  const dots = document.querySelectorAll('.testimonial-dots button');
  if (slides.length){
    let current = 0;
    let interval;

    const showSlide = (index) => {
      slides.forEach((s, i) => s.classList.toggle('active', i === index));
      dots.forEach((d, i) => d.classList.toggle('active', i === index));
      current = index;
    };

    const nextSlide = () => showSlide((current + 1) % slides.length);

    const startAuto = () => {
      interval = setInterval(nextSlide, 5500);
    };

    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        clearInterval(interval);
        showSlide(i);
        startAuto();
      });
    });

    showSlide(0);
    startAuto();
  }

  /* ---------- FAQ ACCORDION ----------
     Clicking a question opens/closes its answer. Only one
     answer is shown at a time for a tidy look. */
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-q');
    const answer = item.querySelector('.faq-a');
    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      faqItems.forEach(other => {
        other.classList.remove('open');
        other.querySelector('.faq-a').style.maxHeight = null;
      });
      if (!isOpen){
        item.classList.add('open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  /* ---------- PRODUCT FILTERING ----------
     On the Products page, clicking a category button shows
     only matching product cards (or all, for "All"). */
  const filterButtons = document.querySelectorAll('.filter-btn');
  const productCards = document.querySelectorAll('.product-card');
  if (filterButtons.length && productCards.length){
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const category = btn.dataset.filter;

        productCards.forEach(card => {
          const match = category === 'all' || card.dataset.category === category;
          card.style.display = match ? 'flex' : 'none';
        });
      });
    });
  }

  /* ---------- QUICK VIEW MODAL ----------
     Clicking "Quick View" on a product card opens a simple
     pop-up with a bigger image, name, price and a WhatsApp
     order button pre-filled with that product's name. */
  const modal = document.getElementById('quick-view-modal');
  if (modal){
    const modalImg = modal.querySelector('.qv-img img');
    const modalTitle = modal.querySelector('.qv-title');
    const modalPrice = modal.querySelector('.qv-price');
    const modalDesc = modal.querySelector('.qv-desc');
    const modalWhatsapp = modal.querySelector('.qv-whatsapp');
    const closeBtn = modal.querySelector('.qv-close');

    document.querySelectorAll('.quick-view button').forEach(btn => {
      btn.addEventListener('click', () => {
        const card = btn.closest('.product-card');
        const name = card.dataset.name;
        const price = card.dataset.price;
        const img = card.querySelector('.product-media img').src;
        const desc = card.dataset.desc || '';

        modalImg.src = img;
        modalImg.alt = name;
        modalTitle.textContent = name;
        modalPrice.textContent = price;
        modalDesc.textContent = desc;
        modalWhatsapp.href =
          `https://wa.me/2348167741107?text=${encodeURIComponent('Hello Home Accessories, I am interested in the ' + name + ' (' + price + '). Is it available?')}`;

        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
      });
    });

    const closeModal = () => {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    };
    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeModal();
    });
  }

  /* ---------- NEWSLETTER FORM ----------
     Prevents the page from reloading, shows a friendly
     "thank you" message instead. (No real email is sent —
     connect this to an email service later if needed.) */
  const newsletterForm = document.querySelector('.newsletter-form');
  if (newsletterForm){
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const msg = newsletterForm.nextElementSibling;
      newsletterForm.reset();
      if (msg && msg.classList.contains('form-success')){
        msg.classList.add('show');
        setTimeout(() => msg.classList.remove('show'), 4000);
      }
    });
  }

  /* ---------- CONTACT FORM ----------
     Prevents reload and shows a success message. To actually
     receive these messages by email, this form can later be
     connected to a service like Formspree, EmailJS, or a
     backend script. */
  const contactForm = document.querySelector('.contact-form');
  if (contactForm){
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const successMsg = document.querySelector('.form-success');
      contactForm.reset();
      if (successMsg){
        successMsg.classList.add('show');
        setTimeout(() => successMsg.classList.remove('show'), 5000);
      }
    });
  }

});
