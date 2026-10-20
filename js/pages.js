/* Содержимое страниц. Каждая страница помещается на один экран; длинное листается кнопками. Тексты — из js/data.js */
window.PAGES=(function(){
  var E=function(t){return window.esc(t)};
  var top=function(title,lead,extra){return '<div class="top"><div><h1>'+E(title)+'</h1>'+(lead?'<p>'+E(lead)+'</p>':'')+'</div>'+(extra||'')+'</div>'};
  var screen=function(inner){return '<section class="screen"><div class="wrap">'+inner+'</div></section>'};
  var tick=function(a){return '<ul class="tick">'+a.map(function(i){return '<li>'+E(i)+'</li>'}).join('')+'</ul>'};
  var provTile=function(p){return '<article class="card tile"><div class="ph" style="background-image:url(photos/'+p.img+'.jpg)"></div><div class="in"><span class="tagline">'+E(p.cat)+(p.sub?' · '+E(p.sub):'')+'</span><h3>'+E(p.name)+'</h3><p>'+E(p.text)+'</p><div class="meta"><span class="rate">★ '+E(p.rating)+'</span><span>'+E(p.price)+'</span></div></div></article>'};
  var postTile=function(p){return '<a class="card tile" href="post.html?id='+p.id+'"><div class="ph" style="background-image:url(photos/'+p.img+'.jpg)'+(p.img==='planner'?';background-position:center 65%':'')+'"></div><div class="in"><span class="pill" style="align-self:flex-start;margin:0">'+E(p.tag)+'</span><h3>'+E(p.title)+'</h3><p>'+E(p.lead.length>110?p.lead.slice(0,107)+'…':p.lead)+'</p></div></a>'};
  var stepCards=function(a){return '<div class="row" style="grid-template-columns:repeat(auto-fit,minmax(200px,1fr))">'+a.map(function(s,i){return '<div class="card"><div class="num">'+(i+1)+'</div><h3>'+E(s[0])+'</h3><p>'+E(s[1])+'</p></div>'}).join('')+'</div>'};
  var ps=function(){return innerWidth>=900?3:(innerWidth>=600?2:1)};
  /* листалка: items — массив, draw(items) -> html плиток */
  function paged(root,items,draw){
    var pg=0,size=ps();
    var box=root;box.innerHTML='<div class="tile-grid" data-g></div><div class="pager"><button class="arrow" data-p aria-label="Назад">←</button><span data-n></span><button class="arrow" data-nx aria-label="Вперёд">→</button></div>';
    var render=function(){size=ps();var n=Math.max(1,Math.ceil(items.length/size));if(pg>=n)pg=n-1;
      box.querySelector('[data-g]').innerHTML=items.slice(pg*size,pg*size+size).map(draw).join('')||'<div class="empty" style="grid-column:1/-1">Пока нет занятий в этой категории — загляните позже.</div>';
      box.querySelector('[data-n]').textContent='Страница '+(pg+1)+' из '+n;
      box.querySelector('[data-p]').disabled=pg===0;box.querySelector('[data-nx]').disabled=pg>=n-1;box.style.display='contents'};
    box.querySelector('[data-p]').onclick=function(){pg--;render()};box.querySelector('[data-nx]').onclick=function(){pg++;render()};
    window.addEventListener('resize',render);
    return {reset:function(list){items=list;pg=0;render()},render:render};
  }
  function tabs(root,labels,panes){
    root.innerHTML='<div class="tabs">'+labels.map(function(l,i){return '<button class="tab'+(i?'':' on')+'" data-t="'+i+'">'+E(l)+'</button>'}).join('')+'</div>'+panes.map(function(p,i){return '<div class="pane'+(i?'':' on')+'" data-pane="'+i+'">'+p+'</div>'}).join('');
    $$('.tab',root).forEach(function(b){b.onclick=function(){var i=b.getAttribute('data-t');$$('.tab',root).forEach(function(x){x.classList.toggle('on',x===b)});$$('.pane',root).forEach(function(x){x.classList.toggle('on',x.getAttribute('data-pane')===i)})}});
  }
  var form=function(id,fields,btn){return '<form id="'+id+'" class="card" style="align-self:start">'+fields.map(function(f){return '<div class="field"><label for="'+id+f[0]+'">'+f[1]+'</label>'+(f[2]==='area'?'<textarea id="'+id+f[0]+'" name="'+f[0]+'" required></textarea>':'<input id="'+id+f[0]+'" name="'+f[0]+'" type="'+(f[2]||'text')+'" required>')+'</div>'}).join('')+'<button class="btn btn-primary" type="submit">'+btn+'</button></form>'};
  var wireForm=function(id,key,okMsg){var f=document.getElementById(id);if(!f)return;f.addEventListener('submit',function(e){e.preventDefault();var o={};Array.prototype.forEach.call(f.elements,function(el){if(el.name)o[el.name]=el.value});if(key)saveLocal(key,o);f.reset();toast(okMsg)})};
  var wireReels=function(root){
    var ov=document.createElement('div');ov.className='ov';ov.innerHTML='<button class="x" aria-label="Закрыть">×</button><div id="ovBody"></div>';document.body.appendChild(ov);
    var close=function(){ov.classList.remove('open');document.getElementById('ovBody').innerHTML=''};
    ov.addEventListener('click',function(e){if(e.target===ov||e.target.className==='x')close()});document.addEventListener('keydown',function(e){if(e.key==='Escape')close()});
    $$('.reel',root).forEach(function(b){b.addEventListener('click',function(){var id=b.getAttribute('data-v');document.getElementById('ovBody').innerHTML='<video src="videos/'+id+'.mp4" poster="videos/'+id+'.jpg" controls autoplay playsinline></video>';ov.classList.add('open')})});
  };

  return {
  home:function(m,S){var h=S.home;
    m.innerHTML=screen('<div class="hero-fit"><div><h1>'+E(h.title)+'</h1><p>'+E(h.lead)+'</p><div class="hero-actions"><a class="btn btn-primary" href="catalog.html">Найти занятие</a><a class="btn btn-line" href="organizers.html">Я организатор</a></div></div>'+
      '<div class="hero-img"><img src="photos/lesson.jpg" alt="Занятие в студии"><div class="hero-badge"><b>'+E(h.stat)+'</b>'+E(h.statText)+'</div></div></div>'+
      '<div class="feat">'+h.features.map(function(f){return '<div class="card tint"><h3>'+E(f[0])+'</h3><p>'+E(f[1])+'</p></div>'}).join('')+'</div>');
  },
  catalog:function(m,S){
    m.innerHTML=screen(top('Каталог занятий','Выберите категорию или найдите по названию.','<input class="search" id="q" type="search" placeholder="Поиск: плавание, английский…" aria-label="Поиск" style="margin:0;max-width:300px">')+'<div class="chips" id="chips" style="margin:0;flex:none"></div><div class="body" id="pg"></div><div class="note" style="margin:0;flex:none;font-size:13px;padding:6px 12px">'+E(S.catalogNote)+'</div>');
    var cat=(new URLSearchParams(location.search).get('cat'))||'Все',q='';
    var P=paged($('#pg'),S.catalog,provTile);
    var flt=function(){return S.catalog.filter(function(p){return (cat==='Все'||p.cat===cat)&&(!q||(p.name+' '+p.text+' '+p.sub+' '+p.cat).toLowerCase().indexOf(q)>-1)})};
    var chips=function(){$('#chips').innerHTML=S.categories.map(function(c){return '<button class="chip'+(c===cat?' on':'')+'" data-c="'+E(c)+'">'+E(c)+'</button>'}).join('');$$('.chip').forEach(function(b){b.onclick=function(){cat=b.getAttribute('data-c');chips();P.reset(flt())}})};
    $('#q').addEventListener('input',function(e){q=e.target.value.trim().toLowerCase();P.reset(flt())});chips();P.reset(flt());
  },
  how:function(m,S){
    m.innerHTML=screen(top('Как это работает','Выберите раздел.')+'<div class="body" id="tb"></div>');
    var faq='<div style="max-width:820px">'+S.faq.map(function(f){return '<details><summary>'+E(f[0])+'</summary><p>'+E(f[1])+'</p></details>'}).join('')+'</div>';
    var ver='<div class="split"><div class="card tint"><h3>'+E(S.verification.title)+'</h3><p>'+E(S.verification.text)+'</p></div><div class="card sand"><h3>'+E(S.loyalty.title)+'</h3><p>'+E(S.loyalty.text)+'</p>'+tick(S.loyalty.items.map(function(i){return i[0]+': '+i[1]}))+'</div></div>';
    tabs($('#tb'),['4 шага','Верификация и баллы','Вопросы и ответы'],['<div>'+stepCards(S.steps)+'</div>',ver,faq]);
  },
  orgs:function(m,S){
    m.innerHTML=screen(top('Организаторам','Клиенты, оплата и расписание в одном месте. Учебный проект: заявка остаётся в вашем браузере.')+'<div class="body"><div class="split"><div style="display:flex;flex-direction:column;gap:12px;min-height:0"><div class="card sand"><h3>'+E(S.audience.orgs.title)+'</h3>'+tick(S.audience.orgs.items)+'</div><div class="card tint"><h3>Как подключиться</h3>'+tick(S.orgSteps.map(function(s,i){return (i+1)+'. '+s[0]}))+'</div></div><div><div style="font-family:var(--serif);font-size:22px;color:var(--olive);font-weight:700;margin-bottom:8px">Оставьте заявку</div>'+form('orgForm',[['name','Название студии или имя'],['email','Email','email'],['msg','О себе и направлении (танцы, английский…)','area']],'Отправить заявку')+'</div></div></div>');
    wireForm('orgForm','skillspot_org_requests','Заявка отправлена — спасибо! (демо-режим)');
  },
  blog:function(m,S){
    var tags=['Все'];S.posts.forEach(function(p){if(tags.indexOf(p.tag)<0)tags.push(p.tag)});var cur='Все';
    m.innerHTML=screen(top('Блог','Новости, гиды и полезные материалы.')+'<div class="chips" id="chips" style="margin:0;flex:none"></div><div class="body" id="pg"></div>');
    var P=paged($('#pg'),S.posts,postTile);var flt=function(){return S.posts.filter(function(p){return cur==='Все'||p.tag===cur})};
    var chips=function(){$('#chips').innerHTML=tags.map(function(t){return '<button class="chip'+(t===cur?' on':'')+'" data-t="'+E(t)+'">'+E(t)+'</button>'}).join('');$$('.chip').forEach(function(b){b.onclick=function(){cur=b.getAttribute('data-t');chips();P.reset(flt())}})};
    chips();P.reset(flt());
  },
  post:function(m,S){
    var id=new URLSearchParams(location.search).get('id'),i=S.posts.map(function(p){return p.id}).indexOf(id);
    if(i<0){m.innerHTML=screen(top('Статья не найдена','')+'<p><a class="btn btn-primary" href="blog.html">Все статьи</a></p>');return}
    var p=S.posts[i];document.title=p.title+' — SkillSpot';
    var units=[];p.body.forEach(function(b){if(/^<h2/.test(b)||!units.length||units[units.length-1].h){ if(/^<h2/.test(b)){units.push({h:1,html:b,len:b.length})}else{units.push({html:b,len:b.replace(/<[^>]+>/g,'').length})} }else{units.push({html:b,len:b.replace(/<[^>]+>/g,'').length})}});
    var pages=[],cur=[],len=0;
    for(var k=0;k<units.length;k++){var u=units[k],nxt=u.h&&units[k+1]?units[k+1].len:0;
      if(cur.length&&len+u.len+nxt>900){pages.push(cur);cur=[];len=0}
      cur.push(u.html);len+=u.len}
    if(cur.length)pages.push(cur);var n=pages.length,pg=0;
    m.innerHTML=screen('<div class="split" style="grid-template-columns:.8fr 1.2fr"><div style="display:flex;flex-direction:column;gap:12px;min-height:0"><a href="blog.html" style="font-weight:700">← Все статьи</a><span class="pill" style="align-self:flex-start;margin:0">'+E(p.tag)+'</span><h1 style="font-size:clamp(22px,4vh,30px);margin:0">'+E(p.title)+'</h1><div class="cover-s" style="background-image:url(photos/'+p.img+'.jpg)'+(p.img==='planner'?';background-position:center 65%':'')+'"></div></div>'+
      '<div style="display:flex;flex-direction:column;gap:12px;min-height:0"><div class="read" id="rd"></div><div class="pager"><button class="arrow" id="pp" aria-label="Назад">←</button><span id="pn"></span><button class="arrow" id="pnx" aria-label="Вперёд">→</button><a class="btn btn-mustard" id="pcta" href="catalog.html" style="display:none;padding:9px 20px">Открыть каталог</a></div></div></div>');
    var draw=function(){$('#rd').innerHTML=pages[pg].join('');$('#rd').scrollTop=0;$('#pn').textContent='Страница '+(pg+1)+' из '+n;$('#pp').disabled=pg===0;$('#pnx').disabled=pg>=n-1;$('#pcta').style.display=pg>=n-1?'inline-block':'none'};
    $('#pp').onclick=function(){if(pg>0){pg--;draw()}};$('#pnx').onclick=function(){if(pg<n-1){pg++;draw()}};
    document.addEventListener('keydown',function(e){if(e.key==='ArrowRight')$('#pnx').click();if(e.key==='ArrowLeft')$('#pp').click()});draw();
  },
  videos:function(m,S){
    m.innerHTML=screen(top('Видео','Короткие ролики из студий: нажмите, чтобы смотреть.')+'<div class="body"><div class="grid g5">'+S.videos.map(function(v){return '<button type="button" class="reel" data-v="'+v.id+'" style="background-image:url(videos/'+v.id+'.jpg)" aria-label="Смотреть: '+E(v.title)+'"><span class="play">▶</span><span class="reel-cap"><b>'+E(v.title)+'</b><span>'+E(v.desc)+'</span></span></button>'}).join('')+'</div></div>');
    wireReels(m);
  },
  about:function(m,S){var A=S.about,cur=0;
    m.innerHTML=screen(top(A.title,'')+'<div class="body" id="tb"></div>');
    var info='<div class="split"><div>'+A.paragraphs.map(function(p){return '<p style="margin:0 0 10px">'+E(p)+'</p>'}).join('')+'</div><div class="card tint" style="align-self:start"><h3>Задачи проекта</h3>'+tick(A.goals)+'</div></div>';
    var deck='<div class="slide-view"><img id="dimg" src="'+S.deck[0]+'" alt="Слайд презентации"></div><div class="pager"><button class="arrow" id="dp" aria-label="Назад">←</button><span id="dn">1 из '+S.deck.length+'</span><button class="arrow" id="dnx" aria-label="Вперёд">→</button><a class="btn btn-line" href="'+S.deckFile+'" download style="padding:8px 18px">Скачать PDF</a></div>';
    var team='<div class="row" style="grid-template-columns:repeat(auto-fit,minmax(200px,1fr))">'+A.team.map(function(t){return '<div class="card tint center"><div class="num" style="margin:0 auto 10px;width:60px;height:60px;font-size:24px">'+E(t[0].split(' ').map(function(w){return w[0]}).join(''))+'</div><h3>'+E(t[0])+'</h3><p>'+E(t[1])+'</p></div>'}).join('')+'</div><p class="note" style="margin:0">'+E(A.course)+'</p>';
    tabs($('#tb'),['О проекте','Презентация','Команда'],[info,deck,team]);
    var show=function(i){cur=(i+S.deck.length)%S.deck.length;$('#dimg').src=S.deck[cur];$('#dn').textContent=(cur+1)+' из '+S.deck.length};
    $('#dp').onclick=function(){show(cur-1)};$('#dnx').onclick=function(){show(cur+1)};
  },
  contacts:function(m,S){var C=S.contacts;
    m.innerHTML=screen(top('Контакты','Напишите нам — ответим на вопросы о платформе и размещении занятий.')+'<div class="body"><div class="split"><div class="card tint" style="align-self:start"><h3>Связаться</h3><p><b>Email:</b> '+E(C.email)+'</p><p><b>Город:</b> '+E(C.address)+'</p><p style="font-size:13.5px">'+E(C.note)+'</p></div>'+form('cForm',[['name','Имя'],['email','Email','email'],['msg','Сообщение','area']],'Отправить')+'</div></div>');
    wireForm('cForm','skillspot_messages','Сообщение отправлено — спасибо! (демо-режим, без реальной отправки)');
  },
  login:function(m,S){
    m.innerHTML=screen(top('Вход в SkillSpot','Демонстрационная версия: вход не подключён к реальным аккаунтам.')+'<div class="body" style="align-items:center;justify-content:center"><div style="width:100%;max-width:460px">'+form('lForm',[['email','Email','email'],['pass','Пароль','password']],'Войти')+'<p class="center" style="margin-top:12px">Нет аккаунта? <a href="catalog.html">Откройте каталог</a> — регистрация для просмотра не нужна.</p></div></div>');
    wireForm('lForm',null,'Демо-режим: вход пока не подключён к реальному серверу');
  }};
})();
