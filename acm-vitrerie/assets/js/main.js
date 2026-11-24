/* =====================================================================
   ACM VITRERIE — interactions du site
   Vanilla JS, aucune dépendance, aucune requête réseau.
   ===================================================================== */
(function () {
  'use strict';

  var root = document.documentElement;
  root.classList.add('motion');

  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ------------------------------------------------------------------
     1. Header : état « collé » au défilement
     ------------------------------------------------------------------ */
  var header = $('#header');
  var onScroll = function () {
    if (!header) return;
    header.classList.toggle('is-stuck', window.scrollY > 40);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ------------------------------------------------------------------
     2. Menu mobile (drawer)
     ------------------------------------------------------------------ */
  var burger = $('#burger');
  var drawer = $('#drawer');
  var scrim  = $('#scrim');

  function setDrawer(open) {
    if (!drawer || !burger) return;
    drawer.classList.toggle('is-open', open);
    scrim.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    burger.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
    drawer.setAttribute('aria-hidden', open ? 'false' : 'true');
    document.body.style.overflow = open ? 'hidden' : '';
  }

  if (burger) {
    burger.addEventListener('click', function () {
      setDrawer(!drawer.classList.contains('is-open'));
    });
  }
  if (scrim) scrim.addEventListener('click', function () { setDrawer(false); });
  $$('#drawer a').forEach(function (a) {
    a.addEventListener('click', function () { setDrawer(false); });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') setDrawer(false);
  });
  window.addEventListener('resize', function () {
    if (window.innerWidth > 980) setDrawer(false);
  });

  /* ------------------------------------------------------------------
     3. Révélations au défilement
     ------------------------------------------------------------------ */
  var revealables = $$('.reveal');
  if ('IntersectionObserver' in window && !reduced) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting || entry.boundingClientRect.top < 0) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    revealables.forEach(function (el) { io.observe(el); });
  } else {
    revealables.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ------------------------------------------------------------------
     4. Lien de navigation actif (scroll spy)
     ------------------------------------------------------------------ */
  var navLinks = $$('.nav a');
  var sections = navLinks.map(function (a) {
    return document.querySelector(a.getAttribute('href'));
  }).filter(Boolean);

  if ('IntersectionObserver' in window && sections.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (a) {
          a.classList.toggle('is-active', a.getAttribute('href') === '#' + entry.target.id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ------------------------------------------------------------------
     5. Boutons « magnétiques »
     ------------------------------------------------------------------ */
  if (!reduced && window.matchMedia('(hover: hover)').matches) {
    $$('.magnetic').forEach(function (btn) {
      btn.addEventListener('mousemove', function (e) {
        var r = btn.getBoundingClientRect();
        var dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
        var dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
        btn.style.transform = 'translate3d(' + (dx * 7).toFixed(2) + 'px,' + (dy * 5).toFixed(2) + 'px,0)';
      });
      btn.addEventListener('mouseleave', function () {
        btn.style.transform = '';
      });
      btn.addEventListener('blur', function () { btn.style.transform = ''; });
    });

    /* Halo suivant le curseur sur les cartes de prestations */
    $$('.service-card').forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var r = card.getBoundingClientRect();
        card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        card.style.setProperty('--my', (e.clientY - r.top) + 'px');
      });
    });
  }

  /* ------------------------------------------------------------------
     6. Compteurs animés
     ------------------------------------------------------------------ */
  var counters = $$('[data-count]');
  function runCounter(el) {
    var target = parseFloat(el.getAttribute('data-count')) || 0;
    if (reduced) { el.textContent = String(target); return; }
    var dur = 1500, start = null;
    function step(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = String(Math.round(target * eased));
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if ('IntersectionObserver' in window) {
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { runCounter(entry.target); co.unobserve(entry.target); }
      });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { co.observe(el); });
  } else {
    counters.forEach(runCounter);
  }

  /* ------------------------------------------------------------------
     7. Filtres de la galerie
     ------------------------------------------------------------------ */
  var filters = $$('.filter');
  var items   = $$('#gallery .g-item');

  function restartAnim(el, delay) {
    el.style.animation = 'none';
    /* reflow */
    void el.offsetWidth;
    el.style.animation = '';
    el.style.animationDelay = (delay * 70) + 'ms';
  }

  filters.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var cat = btn.getAttribute('data-filter');
      filters.forEach(function (b) { b.classList.toggle('is-active', b === btn); });
      var shown = 0;
      items.forEach(function (item) {
        var match = cat === 'all' || item.getAttribute('data-cat') === cat;
        item.classList.toggle('is-hidden', !match);
        if (match) {
          restartAnim(item, shown);
          shown++;
        }
      });
    });
  });

  /* ------------------------------------------------------------------
     8. Bloc « avant / après »
     ------------------------------------------------------------------ */
  var ba = $('#baDemo');
  var baBadge = $('#baBadge');
  var baBtns = $$('.ba-toggle button');

  baBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var state = btn.getAttribute('data-state');
      var isApres = state === 'apres';
      if (ba) ba.classList.toggle('is-apres', isApres);
      baBtns.forEach(function (b) { b.classList.toggle('is-active', b === btn); });
      if (baBadge) {
        baBadge.textContent = isApres ? 'Après' : 'Avant';
        baBadge.classList.toggle('is-apres', isApres);
      }
    });
  });

  /* ------------------------------------------------------------------
     9. Zone d'intervention : pastilles + carte
     ------------------------------------------------------------------ */
  /* Textes volontairement neutres : le registre national des entreprises ne publie
     aucune zone d'intervention. Les communes listées sont une proposition à valider
     par ACM Vitrerie (PLACEHOLDER dans index.html). */
  var TOWNS = {
    'Villeurbanne': {
      title: 'Villeurbanne — siège social',
      text: '40 rue Mal Foch, 69100 Villeurbanne. Siège social d\'ACM VITRERIE et point de départ des interventions sur l\'agglomération lyonnaise.',
      note: 'siège, 40 rue Mal Foch (69100)'
    },
    'Lyon': {
      title: 'Lyon — cœur de la métropole',
      text: 'Lyon, chef-lieu de la métropole. Intervention à confirmer par ACM Vitrerie.',
      note: 'agglomération lyonnaise'
    },
    'Bron': {
      title: 'Bron — est de la métropole',
      text: 'Bron, commune voisine de Villeurbanne, à l\'est de la métropole. Intervention à confirmer par ACM Vitrerie.',
      note: 'commune voisine de Villeurbanne'
    },
    'Vénissieux': {
      title: 'Vénissieux — sud lyonnais',
      text: 'Vénissieux, au sud de l\'agglomération lyonnaise. Intervention à confirmer par ACM Vitrerie.',
      note: 'sud de l\'agglomération'
    },
    'Caluire-et-Cuire': {
      title: 'Caluire-et-Cuire — nord de Lyon',
      text: 'Caluire-et-Cuire, au nord de Lyon. Intervention à confirmer par ACM Vitrerie.',
      note: 'nord de la métropole'
    },
    'Meyzieu': {
      title: 'Meyzieu — axe est',
      text: 'Meyzieu, sur l\'axe est de la métropole. Intervention à confirmer par ACM Vitrerie.',
      note: 'axe est de la métropole'
    },
    'Vaulx-en-Velin': {
      title: 'Vaulx-en-Velin — axe est',
      text: 'Vaulx-en-Velin, sur l\'axe est de la métropole. Intervention à confirmer par ACM Vitrerie.',
      note: 'axe est de la métropole'
    },
    'Saint-Priest': {
      title: 'Saint-Priest — sud-est',
      text: 'Saint-Priest, au sud-est de la métropole. Intervention à confirmer par ACM Vitrerie.',
      note: 'sud-est de la métropole'
    },
    'Rillieux-la-Pape': {
      title: 'Rillieux-la-Pape — nord de la métropole',
      text: 'Rillieux-la-Pape, au nord de la métropole. Intervention à confirmer par ACM Vitrerie.',
      note: 'nord de la métropole'
    },
    'Genas': {
      title: 'Genas — Sud-Est lyonnais',
      text: 'Genas, au sud-est de l\'agglomération lyonnaise. Le nom commercial « GENAS VITRERIE » figure au registre. Intervention à confirmer par ACM Vitrerie.',
      note: 'sud-est de la métropole'
    }
  };

  var pills   = $$('#pills .pill');
  var markers = $$('.map-wrap .marker');
  var zTitle = $('#zoneTitle'), zText = $('#zoneText'), zMeta = $('#zoneMeta');
  var mTown  = $('#mapTown'),  mNote  = $('#mapNote');

  function selectTown(name) {
    var data = TOWNS[name];
    if (!data) return;
    pills.forEach(function (p) { p.classList.toggle('is-active', p.getAttribute('data-town') === name); });
    markers.forEach(function (m) { m.classList.toggle('is-active', m.getAttribute('data-town') === name); });
    if (zTitle) zTitle.textContent = data.title;
    if (zText)  zText.textContent  = data.text;
    if (zMeta)  zMeta.textContent  = 'Enseigne : ACM VITRERIE – BATIVERRE · SIREN 808 431 985 · NAF 43.34Z';
    if (mTown)  mTown.textContent  = name;
    if (mNote)  mNote.textContent  = data.note;
  }

  pills.forEach(function (p) {
    p.addEventListener('click', function () { selectTown(p.getAttribute('data-town')); });
  });
  markers.forEach(function (m) {
    m.addEventListener('click', function () { selectTown(m.getAttribute('data-town')); });
    m.style.cursor = 'pointer';
  });

  /* ------------------------------------------------------------------
     10. FAQ — accordéon (une seule réponse ouverte à la fois)
     ------------------------------------------------------------------ */
  var faqItems = $$('#faqList .faq-item');
  faqItems.forEach(function (item) {
    var btn = $('.faq-q', item);
    if (!btn) return;
    btn.addEventListener('click', function () {
      var open = item.classList.contains('is-open');
      faqItems.forEach(function (other) {
        other.classList.remove('is-open');
        var ob = $('.faq-q', other);
        if (ob) ob.setAttribute('aria-expanded', 'false');
      });
      if (!open) {
        item.classList.add('is-open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ------------------------------------------------------------------
     11. Formulaire de devis (validation front-end uniquement)
     ------------------------------------------------------------------ */
  var form = $('#quoteForm');
  var ok   = $('#formOk');

  function fieldOf(input) { return input.closest('.field'); }

  function setError(input, hasError) {
    var f = fieldOf(input);
    if (f) f.classList.toggle('has-error', hasError);
    input.setAttribute('aria-invalid', hasError ? 'true' : 'false');
  }

  function validateField(input) {
    var v = (input.value || '').trim();
    var okv = true;
    if (input.type === 'email') {
      okv = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(v);
    } else if (input.type === 'number') {
      okv = v !== '' && !isNaN(parseFloat(v)) && parseFloat(v) > 0;
    } else if (input.type === 'tel') {
      okv = (v.replace(/[^0-9]/g, '').length >= 8);
    } else {
      okv = v !== '';
    }
    setError(input, !okv);
    return okv;
  }

  if (form) {
    var fields = $$('input, select, textarea', form).filter(function (el) {
      return el.type !== 'file' && el.hasAttribute('required');
    });

    fields.forEach(function (input) {
      input.addEventListener('blur', function () { validateField(input); });
      input.addEventListener('input', function () {
        var f = fieldOf(input);
        if (f && f.classList.contains('has-error')) validateField(input);
      });
      input.addEventListener('change', function () {
        if (input.tagName === 'SELECT') validateField(input);
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var firstBad = null;
      fields.forEach(function (input) {
        var good = validateField(input);
        if (!good && !firstBad) firstBad = input;
      });
      if (firstBad) {
        firstBad.focus();
        firstBad.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'center' });
        return;
      }
      /* Aucune donnée n'est envoyée : simple confirmation d'état. */
      var code = 'ACMV-' + String(Math.floor(1000 + Math.random() * 9000));
      var ref = $('#refCode');
      if (ref) ref.textContent = code;
      form.style.display = 'none';
      if (ok) ok.classList.add('is-on');
      if (ok) ok.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'center' });
    });

    var reset = $('#resetForm');
    if (reset) {
      reset.addEventListener('click', function () {
        form.reset();
        $$('.field', form).forEach(function (f) { f.classList.remove('has-error'); });
        var dz = $('#dropzone');
        if (dz) dz.classList.remove('is-filled');
        var dt = $('#dropTitle'), dh = $('#dropHint');
        if (dt) dt.textContent = 'Ajouter une photo';
        if (dh) dh.textContent = 'JPEG ou PNG — une photo nette de la vitre suffit';
        ok.classList.remove('is-on');
        form.style.display = '';
        var first = $('select, input', form);
        if (first) first.focus();
      });
    }
  }

  /* ------------------------------------------------------------------
     12. Ajout de photos (aperçu local uniquement, aucun envoi)
     ------------------------------------------------------------------ */
  var drop = $('#dropzone');
  var fileInput = $('#f-photo');
  var dropTitle = $('#dropTitle');
  var dropHint = $('#dropHint');

  function showFiles(files) {
    if (!files || !files.length) return;
    if (drop) drop.classList.add('is-filled');
    if (dropTitle) dropTitle.textContent = files.length === 1 ? files[0].name : files.length + ' photos sélectionnées';
    if (dropHint) dropHint.textContent = 'Fichier prêt — il sera transmis avec votre demande de devis.';
  }

  if (fileInput) {
    fileInput.addEventListener('change', function () { showFiles(fileInput.files); });
  }
  if (drop) {
    ['dragenter', 'dragover'].forEach(function (evt) {
      drop.addEventListener(evt, function (e) {
        e.preventDefault(); drop.classList.add('is-over');
      });
    });
    ['dragleave', 'drop'].forEach(function (evt) {
      drop.addEventListener(evt, function (e) {
        e.preventDefault(); drop.classList.remove('is-over');
      });
    });
    drop.addEventListener('drop', function (e) {
      var dt = e.dataTransfer;
      if (dt && dt.files && dt.files.length) {
        if (fileInput) {
          try { fileInput.files = dt.files; } catch (err) { /* navigateur ancien */ }
        }
        showFiles(dt.files);
      }
    });
  }

  /* ------------------------------------------------------------------
     13. Année du pied de page
     ------------------------------------------------------------------ */
  var year = $('#year');
  if (year) year.textContent = String(new Date().getFullYear());

})();
