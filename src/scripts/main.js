/* =====================================================================
   Hydrosyng Oil & Gas Ltd — site scripts
   Vanilla JS, no dependencies. Progressive enhancement only.
   ===================================================================== */
(function () {
  "use strict";

  /* ---------- Mobile nav toggle ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var body = document.body;
  if (toggle) {
    toggle.addEventListener("click", function () {
      body.classList.toggle("nav-open");
      var open = body.classList.contains("nav-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    document.querySelectorAll(".menu a").forEach(function (a) {
      a.addEventListener("click", function () {
        if (!a.parentElement.classList.contains("has-drop")) {
          body.classList.remove("nav-open");
          toggle.setAttribute("aria-expanded", "false");
        }
      });
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") { body.classList.remove("nav-open"); toggle.setAttribute("aria-expanded", "false"); }
    });
  }

  /* ---------- Sticky header shadow on scroll ---------- */
  var header = document.querySelector(".site-header");
  if (header) {
    var onScroll = function () { header.classList.toggle("scrolled", window.scrollY > 8); };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- Hero slider ---------- */
  var slider = document.querySelector(".hero-slider");
  if (slider) {
    var hsSlides = [].slice.call(slider.querySelectorAll(".hs-slide"));
    var hsDots = [].slice.call(slider.querySelectorAll(".hs-dots button"));
    var hsIdx = Math.max(0, hsSlides.findIndex(function (s) { return s.classList.contains("is-active"); }));
    var hsTimer = null;
    var hsReduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var hsGo = function (n) {
      hsIdx = (n + hsSlides.length) % hsSlides.length;
      hsSlides.forEach(function (s, i) { s.classList.toggle("is-active", i === hsIdx); });
      hsDots.forEach(function (d, i) { d.classList.toggle("is-active", i === hsIdx); });
    };
    var hsStop = function () { if (hsTimer) { clearInterval(hsTimer); hsTimer = null; } };
    var hsStart = function () { if (hsReduce || hsSlides.length < 2) return; hsStop(); hsTimer = setInterval(function () { hsGo(hsIdx + 1); }, 6000); };
    var hsNext = slider.querySelector(".hs-arrow.next");
    var hsPrev = slider.querySelector(".hs-arrow.prev");
    if (hsNext) hsNext.addEventListener("click", function () { hsGo(hsIdx + 1); hsStart(); });
    if (hsPrev) hsPrev.addEventListener("click", function () { hsGo(hsIdx - 1); hsStart(); });
    hsDots.forEach(function (d, i) { d.addEventListener("click", function () { hsGo(i); hsStart(); }); });
    slider.addEventListener("mouseenter", hsStop);
    slider.addEventListener("mouseleave", hsStart);
    hsStart();
  }

  // Tracks whether IntersectionObserver actually fires; a failsafe reveals
  // everything if it never does, so no section can stay stuck invisible.
  var ioActivity = false;

  /* ---------- Scroll reveal ---------- */
  var reveals = document.querySelectorAll(".reveal");
  var revealAll = function () { reveals.forEach(function (el) { el.classList.add("in"); }); };
  if ("IntersectionObserver" in window && reveals.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { ioActivity = true; en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    revealAll();
  }

  /* ---------- Animated counters ---------- */
  var counters = document.querySelectorAll("[data-count]");
  var runCount = function (el) {
    if (el.dataset.counted) return;
    el.dataset.counted = "1";
    var target = parseFloat(el.getAttribute("data-count"));
    var dec = (target % 1 !== 0) ? 1 : 0;
    var dur = 1600, start = null;
    var step = function (ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = (target * eased).toFixed(dec).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = target.toLocaleString(undefined, { minimumFractionDigits: dec });
    };
    requestAnimationFrame(step);
  };
  var setFinal = function (el) {
    if (el.dataset.counted) return;
    el.dataset.counted = "1";
    var target = parseFloat(el.getAttribute("data-count"));
    var dec = (target % 1 !== 0) ? 1 : 0;
    el.textContent = target.toLocaleString(undefined, { minimumFractionDigits: dec });
  };
  var countAll = function () { counters.forEach(function (el) { setFinal(el); }); };
  if ("IntersectionObserver" in window && counters.length) {
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { ioActivity = true; runCount(en.target); co.unobserve(en.target); }
      });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { co.observe(el); });
  } else {
    counters.forEach(function (el) { el.textContent = el.getAttribute("data-count"); });
  }

  /* Failsafe: if IntersectionObserver never fired, don't leave content hidden */
  window.addEventListener("load", function () {
    setTimeout(function () { if (!ioActivity) { revealAll(); countAll(); } }, 1800);
  });

  /* ---------- Accordions (FAQ / careers) ---------- */
  document.querySelectorAll(".acc-head").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var item = btn.closest(".acc-item");
      var accBody = item.querySelector(".acc-body");
      var open = item.classList.contains("open");
      var group = btn.closest(".accordion");
      if (group && group.hasAttribute("data-single")) {
        group.querySelectorAll(".acc-item.open").forEach(function (o) {
          if (o !== item) { o.classList.remove("open"); o.querySelector(".acc-body").style.maxHeight = null; }
        });
      }
      if (open) { item.classList.remove("open"); accBody.style.maxHeight = null; }
      else { item.classList.add("open"); accBody.style.maxHeight = accBody.scrollHeight + "px"; }
    });
  });

  /* ---------- Contact form validation + mailto fallback ---------- */
  // The site is static (GitHub Pages), so the form opens the visitor's email
  // app pre-filled. Swap to a form service (Formspree / Web3Forms) any time
  // by changing the <form> action; validation below still applies.
  var form = document.querySelector("form[data-validate]");
  if (form) {
    var setError = function (field, on) { field.classList.toggle("error", on); };
    form.addEventListener("submit", function (e) {
      var valid = true;
      form.querySelectorAll("[required]").forEach(function (input) {
        var field = input.closest(".field");
        var val = (input.value || "").trim();
        var bad = !val;
        if (input.type === "email" && val) bad = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
        if (field) setError(field, bad);
        if (bad) valid = false;
      });
      if (!valid) {
        e.preventDefault();
        var first = form.querySelector(".field.error input, .field.error textarea, .field.error select");
        if (first) first.focus();
        return;
      }
      if (form.getAttribute("data-mode") === "mailto") {
        e.preventDefault();
        var to = form.getAttribute("data-mailto") || "info@hydrosyng.com.ng";
        var get = function (n) { var el = form.querySelector('[name="' + n + '"]'); return el ? el.value.trim() : ""; };
        var subject = encodeURIComponent("Website enquiry — " + (get("subject") || "General"));
        var lines = [
          "Name: " + get("name"),
          "Email: " + get("email"),
          "Phone: " + get("phone"),
          "Company: " + get("company"),
          "Service: " + get("subject"),
          "",
          get("message")
        ].join("\n");
        window.location.href = "mailto:" + to + "?subject=" + subject + "&body=" + encodeURIComponent(lines);
        var status = form.querySelector(".form-status");
        if (status) { status.className = "form-status ok"; status.textContent = "Opening your email app to send the message…"; }
      }
    });
    form.querySelectorAll("input, textarea, select").forEach(function (input) {
      input.addEventListener("input", function () { var f = input.closest(".field"); if (f) f.classList.remove("error"); });
    });
  }

  /* ---------- Logo fallback: show wordmark if the image is missing ---------- */
  document.querySelectorAll("img[data-logo]").forEach(function (img) {
    var swap = function () {
      var fb = img.parentElement.querySelector(".brand-fallback");
      if (fb) { img.style.display = "none"; fb.style.display = "flex"; }
    };
    img.addEventListener("error", swap);
    if (img.complete && img.naturalWidth === 0) swap();
  });

  /* ---------- Current year in footer ---------- */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
