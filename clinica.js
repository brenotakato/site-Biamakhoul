(function () {
  var $ = function (s, c) { return (c || document).querySelector(s); }, $$ = function (s, c) { return [].slice.call((c || document).querySelectorAll(s)); };
  // menu móvel
  var bg = $('#burger'), mn = $('#menu');
  bg.addEventListener('click', function () { var a = mn.classList.toggle('aberto'); bg.setAttribute('aria-expanded', a); });
  $$('#menu a').forEach(function (a) { a.addEventListener('click', function () { mn.classList.remove('aberto'); }); });
  // aparecer ao rolar
  $$('.secao .trilho > *, .card-t, .ba, .g-item').forEach(function (e) { e.classList.add('rev'); });
  var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('on'); io.unobserve(e.target); } }); }, { threshold: .12 }) : null;
  $$('.rev').forEach(function (e) { io ? io.observe(e) : e.classList.add('on'); });
  // painel de tratamento
  var dlg = $('#dlg'), dc = $('#dlg-c');
  $$('.card-t').forEach(function (b) {
    b.addEventListener('click', function () {
      var t = $('#trat-' + b.getAttribute('data-trat')); dc.innerHTML = ''; dc.appendChild(t.content.cloneNode(true));
      if (dlg.showModal) dlg.showModal(); else dlg.setAttribute('open', '');
    });
  });
  dlg.addEventListener('click', function (e) { if (e.target === dlg || e.target.hasAttribute('data-fechar')) dlg.close(); });
  // lightbox
  var lb = $('#lb'), lbi = $('img', lb), lista = [], pos = 0;
  function abrir(i) { pos = (i + lista.length) % lista.length; lbi.src = lista[pos]; if (!lb.open) lb.showModal(); }
  document.addEventListener('click', function (e) {
    var z = e.target.closest('[data-zoom]'); if (!z) return;
    var img = $('img', z); if (!img) return;
    var grupo = $$('[data-zoom]', z.parentNode.classList.contains('galeria') ? z.parentNode : z.closest('.minis') || z.parentNode);
    lista = grupo.map(function (g) { var i = $('img', g); return i ? i.src : null; }).filter(Boolean);
    abrir(lista.indexOf(img.src));
  });
  lb.addEventListener('click', function (e) {
    if (e.target === lb || e.target.hasAttribute('data-fechar')) lb.close();
    else if (e.target.classList.contains('ant')) abrir(pos - 1);
    else if (e.target.classList.contains('prox')) abrir(pos + 1);
  });
  document.addEventListener('keydown', function (e) {
    if (!lb.open) return; if (e.key === 'Escape') lb.close(); if (e.key === 'ArrowLeft') abrir(pos - 1); if (e.key === 'ArrowRight') abrir(pos + 1);
  });
  var tx = 0; lb.addEventListener('touchstart', function (e) { tx = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', function (e) { var dx = e.changedTouches[0].clientX - tx; if (Math.abs(dx) > 50) abrir(pos + (dx < 0 ? 1 : -1)); });
  // antes e depois
  $$('[data-ba]').forEach(function (f) { var r = $('input', f); r.addEventListener('input', function () { f.style.setProperty('--pos', r.value + '%'); }); });
  // passos acendem ao rolar
  var ps = $('#passos'), itens = $$('.passo', ps);
  function passos() {
    var r = ps.getBoundingClientRect(), vh = window.innerHeight, ref = vh * .6;
    var p = Math.min(1, Math.max(0, (ref - r.top) / r.height)); ps.style.setProperty('--prog', p.toFixed(3));
    itens.forEach(function (it) { it.classList.toggle('on', it.getBoundingClientRect().top < ref); });
  }
  var tick = false; window.addEventListener('scroll', function () { if (!tick) { tick = true; requestAnimationFrame(function () { passos(); tick = false; }); } }, { passive: true }); passos();
  // item do menu da seção atual
  var links = $$('#menu a'), secs = links.map(function (a) { return $(a.getAttribute('href')); });
  if (io) { var so = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) links.forEach(function (a) { a.classList.toggle('ativo', a.getAttribute('href') === '#' + e.target.id); }); }); }, { rootMargin: '-45% 0px -50% 0px' }); secs.forEach(function (s) { if (s) so.observe(s); }); }
  // dica do slider: balança uma vez ao aparecer
  if (io) { var dio = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('dica'); dio.unobserve(e.target); } }); }, { threshold: .6 }); $$('.ba-img').forEach(function (b) { dio.observe(b); }); }
})();
