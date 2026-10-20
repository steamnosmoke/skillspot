/* Шапка, подвал, меню, уведомления. Обычно править не нужно. */
(function(){
  document.body.classList.add('fit');
  var S=window.SITE, page=document.body.getAttribute('data-page')||'';
  var file=(location.pathname.split('/').pop()||'index.html');
  window.$=function(s,r){return (r||document).querySelector(s)};
  window.$$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
  window.esc=function(t){return String(t).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})};
  window.toast=function(msg){var t=$('#toast');t.textContent=msg;t.classList.add('show');clearTimeout(t._t);t._t=setTimeout(function(){t.classList.remove('show')},3800)};
  window.saveLocal=function(key,obj){try{var a=JSON.parse(localStorage.getItem(key)||'[]');a.push(Object.assign({date:new Date().toISOString()},obj));localStorage.setItem(key,JSON.stringify(a))}catch(e){}};

  var nav=S.nav.map(function(n){return '<a href="'+n[1]+'"'+(n[1]===file?' class="on"':'')+'>'+n[0]+'</a>'}).join('');
  $('#site-header').outerHTML=
   '<header class="hdr"><div class="wrap"><a class="logo" href="index.html"><img src="assets/mark.png" alt="">'+esc(S.brand.name)+'</a>'+
   '<nav class="nav" id="nav" aria-label="Основное меню">'+nav+'</nav>'+
   '<a class="btn btn-line login-top" href="login.html">Войти</a>'+
   '<button class="burger" id="burger" aria-label="Меню">☰</button></div></header>';
  $('#burger').addEventListener('click',function(){$('#nav').classList.toggle('open')});

  var fcol=function(t,items){return '<div><h4>'+t+'</h4>'+items.map(function(i){return '<a href="'+i[1]+'">'+i[0]+'</a>'}).join('')+'</div>'};
  $('#site-footer').outerHTML=
   '<footer class="mini"><div class="wrap"><span>'+S.nav.map(function(n){return '<a href="'+n[1]+'">'+n[0]+'</a>'}).join('')+'</span><span>'+esc(S.brand.footer)+'</span></div></footer>'+
   '<div class="toast" id="toast" role="status"></div>';

  document.title=document.title||S.brand.name;
  if(window.PAGES&&PAGES[page])PAGES[page]($('#main'),S);
  var io='IntersectionObserver' in window?new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.1}):null;
  $$('.reveal').forEach(function(e){io?io.observe(e):e.classList.add('in')});
})();
