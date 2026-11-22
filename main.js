// Mobile menu
(function () {
  var btn = document.querySelector('.menu-btn');
  var nav = document.getElementById('mainnav');
  if (btn && nav) {
    btn.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
  }

  // Project filters
  var filters = document.querySelectorAll('.filters button');
  var grid = document.getElementById('projectGrid');
  filters.forEach(function (b) {
    b.addEventListener('click', function () {
      var f = b.getAttribute('data-filter');
      filters.forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
      if (!grid) return;
      grid.querySelectorAll('figure').forEach(function (fig) {
        fig.style.display = (f === 'all' || fig.getAttribute('data-cat') === f) ? '' : 'none';
      });
    });
  });

  var SUBURBS = {
'north-epping': 'North Epping',
    'westleigh': 'Westleigh',
    'west-pennant-hills': 'West Pennant Hills',
    'beecroft': 'Beecroft',
    'cherrybrook': 'Cherrybrook',
    'winston-hills': 'Winston Hills',
    'thornleigh': 'Thornleigh',
    'pennant-hills': 'Pennant Hills',
    'normanhurst': 'Normanhurst'
  };

  function param(name) {
    try {
      return new URLSearchParams(window.location.search).get(name) || '';
    } catch (e) {
      return '';
    }
  }

  function slugify(value) {
    return String(value || '')
      .trim()
      .toLowerCase()
      .replace(/&/g, ' and ')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }

  // Capture UTM parameters (and the page URL) into any quote form so FormSubmit emails include them.
  document.querySelectorAll('form.quote').forEach(function (form) {
    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content'].forEach(function (key) {
      var el = form.querySelector('input[name="' + key + '"]');
      if (el && !el.value) el.value = param(key);
    });
    var page = form.querySelector('input[name="page_url"]');
    if (page) page.value = window.location.href;
  });

  // Flyer landing section: personalise heading, suburb field and "heard about us"
  // from utm_content (e.g. /flyer?utm_source=flyer&utm_medium=letterbox&utm_content=thornleigh).
  var flyer = document.getElementById('flyer-landing');
  if (flyer) {
    var raw = param('utm_content') || param('suburb') || '';
    var slug = slugify(raw);
    var name = SUBURBS[slug];
    if (name) {
      var heading = flyer.querySelector('[data-flyer-heading]');
      if (heading) heading.innerHTML = 'Re-roofing in <span>' + name + '</span>';
      var sub = flyer.querySelector('[data-flyer-sub]');
      if (sub) {
        sub.textContent = 'Thanks for picking up our ' + name +
          ' flyer. Request an obligation-free quote for a tile-to-Colorbond or metal-to-metal re-roof, and get a fixed-price written quote.';
      }
      var linkWrap = flyer.querySelector('.flyer-suburb-link');
      var link = flyer.querySelector('[data-flyer-suburb-link]');
      if (link && linkWrap) {
        link.href = '/' + slug;
        link.textContent = 'More about re-roofing in ' + name;
        linkWrap.hidden = false;
      }
      var suburbInput = document.getElementById('suburb');
      if (suburbInput && !suburbInput.value) suburbInput.value = name;
      var heard = document.getElementById('heard');
      if (heard) heard.value = 'Flyer in my letterbox';
      var subject = document.querySelector('form.quote input[name="_subject"]');
      if (subject) subject.value = 'New flyer enquiry from ' + name + ' – Tanios Roofing';
    }
  } else {
    // On suburb pages, if the visitor arrived from a flyer URL, set "heard about us".
    if (param('utm_medium') === 'letterbox' || param('utm_source') === 'flyer') {
      var heard2 = document.getElementById('heard');
      if (heard2 && !heard2.getAttribute('data-locked')) heard2.value = 'Flyer in my letterbox';
    }
  }

  // Quote form
  var form = document.getElementById('quoteForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      var ok = true;
      ['name', 'phone', 'suburb'].forEach(function (id) {
        var el = form.querySelector('#' + id);
        if (!el) return;
        if (!el.value.trim()) { el.style.borderColor = '#C8161D'; ok = false; } else { el.style.borderColor = ''; }
      });
      if (!ok) { e.preventDefault(); return; }
      // On the live site the form posts to FormSubmit, which emails the enquiry to info@taniosroofinggroup.com.au.
      if (/taniosroofinggroup\.com\.au$/.test(location.hostname)) return;
      e.preventDefault();
      var thanks = document.getElementById('thanks');
      if (thanks) thanks.style.display = 'block';
      var submit = form.querySelector('button[type=submit]');
      if (submit) submit.disabled = true;
    });
  }

  document.querySelectorAll('.yr').forEach(function (s) { s.textContent = new Date().getFullYear(); });
})();
