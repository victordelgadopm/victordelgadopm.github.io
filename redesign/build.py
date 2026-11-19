import os
from bs4 import BeautifulSoup
R='/home/user/site'
src=open(f'{R}/index.html').read()
S=BeautifulSoup(src,'html.parser')
def outer(sel): return str(S.select_one(sel))
roles={k:outer(f'#role-{k}') for k in ['demand','rvtoad','kolo','kolo-skills','infinite','nitori']}
steps=outer('ol.steps')
cards=outer('div.cards')
pills=outer('ul.pills')
marquee_items=S.select_one('.marquee__track').decode_contents()
video_head=S.select_one('.video__copy').decode_contents()
ticks=outer('ul.ticks')
approach_lede=S.select_one('#approach .section__head p:not(.kicker)').decode_contents()

FONTS={
 '1':'family=Manrope:wght@500;600;700;800&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500',
 '2':'family=Plus+Jakarta+Sans:wght@500;600;700;800&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500',
 '3':'family=Archivo:wght@500;600;700;800;900&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500',
}
def head(k, light):
    return f'''<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <script>document.documentElement.classList.add("js")</script>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Victor Delgado | Product, Project, Marketing &amp; Demand Planning Leader</title>
  <meta name="robots" content="noindex, nofollow">
  <link rel="icon" href="assets/favicon.svg" type="image/svg+xml">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?{FONTS[k]}&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="base.css">
  {'<link rel="stylesheet" href="light-fixes.css">' if light else ''}
  <link rel="stylesheet" href="theme.css">
</head>'''

NAVLINKS='''<a href="#top" class="nav__logo nav__logo--inline" aria-label="Back to top">VD</a>
      <a href="#video">Video</a>
      <a href="#experience">Experience</a>
      <a href="#approach">Approach</a>
      <a href="#toolkit">Skills &amp; Tools</a>
      <a href="#contact" class="nav__pill">Let's connect</a>'''
MENU='''<button type="button" class="nav__menu" aria-expanded="false" aria-controls="navLinks"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>Menu</button>'''
def nav(extra=''):
    return f'''<header class="nav {extra}">
    <a href="#top" class="nav__logo" aria-label="Back to top">VD</a>
    <nav class="nav__links" id="navLinks" aria-label="Sections">
      {NAVLINKS}
    </nav>
    {MENU}
    <a href="#contact" class="btn btn--small nav__cta">Let's connect</a>
  </header>'''
PLAY='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>'
EMAIL_SVG='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16v12H4z" fill="none" stroke="currentColor" stroke-width="2"/><path d="M4 7l8 6 8-6" fill="none" stroke="currentColor" stroke-width="2"/></svg>'
LI_SVG='<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9.75h4v11H3zm7 0h3.8v1.5h.05c.53-1 1.83-1.75 3.4-1.75 3.6 0 4.25 2.2 4.25 5.1v6.15h-4v-5.45c0-1.3-.02-2.95-1.8-2.95-1.8 0-2.1 1.4-2.1 2.85v5.55H10z"/></svg>'
DL_SVG='<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M11 4h2v8.2l3.3-3.3 1.4 1.4L12 16l-5.7-5.7 1.4-1.4 3.3 3.3zM5 18h14v2H5z"/></svg>'
CONTACT_BTNS=f'''<div class="cta-row">
          <a href="mailto:vtdelg@gmail.com" class="btn btn--light magnetic">{EMAIL_SVG}Email me</a>
          <a href="https://www.linkedin.com/in/victordelgado-product" class="btn btn--ghost-light magnetic" target="_blank" rel="noopener">{LI_SVG}LinkedIn</a>
          <a href="assets/Victor-Delgado-Resume.pdf?v=20261119" download="Victor-Delgado-Resume.pdf" class="btn btn--ghost-light magnetic btn--resume">{DL_SVG}Download resume</a>
        </div>'''
VIDEO_SCREEN=f'''<div class="screen">
          <video id="resumeVideo" src="assets/video-resume.mp4" poster="assets/video-poster.jpg" preload="metadata" playsinline controls></video>
          <button class="video__play" type="button" aria-label="Play video resume">{PLAY}</button>
        </div>'''
ROTATOR='<p class="hero__rotator" aria-live="polite">I turn <span class="rotator"><span class="rotator__word">customer insight</span></span> into products customers want.</p>'
QUOTE='I thrive in ambiguity, adapt quickly, and love that no two days are the same!'
MORE="Don't see your role here? Reach out anyway. My experience carries across teams and industries."
TAIL='''<a href="#top" class="totop" aria-label="Back to top"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg></a>
  <script src="main.js"></script>
'''
FOOT='<footer class="footer"><p>© <span id="year">2026</span> Victor Delgado</p></footer>'
ALLROLES=''.join(roles[k] for k in ['demand','rvtoad','kolo','kolo-skills','infinite','nitori'])

# ---------------- OPTION 1: profile sidebar ----------------
o1=head('1',True)+f'''
<body class="o1">
  <div class="progress" aria-hidden="true"></div>
  <div class="side__track" aria-hidden="true"><span></span></div>
  {nav()}
  <aside class="side hero">
    <div class="side__photo tilt"><img src="assets/headshot.jpg" alt="Portrait of Victor Delgado" width="1000" height="1000"></div>
    <div class="side__body">
      <p class="eyebrow"><span class="dot-live"></span>Open to connecting</p>
      <h1 class="side__name">Victor Delgado</h1>
      <p class="side__title">Product, Project, Marketing &amp; Demand Planning Leader</p>
      <p class="side__lede">10+ years leading products <em>end to end</em>, from strategy to launch and growth.</p>
      {ROTATOR}
      <div class="side__cta">
        <a href="#video" class="btn magnetic">{PLAY}Watch my video resume</a>
        <a href="#experience" class="btn btn--ghost magnetic">See my work</a>
      </div>
    </div>
  </aside>
  <main id="top" class="main">
    <div class="strip" aria-hidden="true"><div class="marquee__track">{marquee_items}</div></div>
    <section id="video" class="section blk blk--video">
      <div class="blk__label">Video resume</div>
      <div class="blk__body vid">
        <div class="vid__copy"><h2>My career in <em>45 seconds</em>.</h2>
          <p>Short on time? Hit play for the highlights: consumer goods on Amazon, Target and Walmart, AI agent workflows for small businesses, and the product thinking that ties it all together.</p>
          {ticks}</div>
        <div class="vid__frame">{VIDEO_SCREEN}</div>
      </div>
    </section>
    <section id="experience" class="section blk">
      <div class="blk__label">Experience</div>
      <div class="blk__body"><h2 class="blk__h">Where I've made <em>an impact</em>.</h2>
      {ALLROLES}</div>
    </section>
    <section id="approach" class="section blk">
      <div class="blk__label">How I work</div>
      <div class="blk__body"><h2 class="blk__h">One playbook, from <em>first insight</em> to growth.</h2>
        <p class="blk__lede">{approach_lede}</p>
        {steps}</div>
    </section>
    <section id="toolkit" class="section blk">
      <div class="blk__label">Skills &amp; Tools</div>
      <div class="blk__body"><h2 class="blk__h">What I bring <em>to the table</em>.</h2>
        {cards}</div>
    </section>
    <section id="contact" class="section blk finale">
      <div class="blk__label">Let's connect</div>
      <div class="blk__body fin">
        <p class="fin__quote">{QUOTE}</p>
        <div class="fin__card">
          <img class="fin__photo" src="assets/headshot.jpg" alt="" width="1000" height="1000" loading="lazy">
          <div><h2 class="fin__title">Let's connect and find where I fit.</h2>
          <p class="fin__loc">Based in Huntington Beach, CA</p></div>
        </div>
        {CONTACT_BTNS}
        <p class="kicker">Experience across industries &amp; functions</p>
        {pills}
        <p class="fin__more">{MORE}</p>
      </div>
    </section>
    {FOOT}
  </main>
  {TAIL}  <script src="o1.js"></script>
</body></html>'''

# ---------------- OPTION 2: bento ----------------
o2=head('2',True)+f'''
<body class="o2">
  <div class="progress" aria-hidden="true"></div>
  {nav('nav--float')}
  <main id="top">
    <section class="hero bento bento--hero">
      <div class="tile t-intro">
        <p class="eyebrow"><span class="dot-live"></span>Open to connecting</p>
        <h1 class="b-name">Victor Delgado</h1>
        <p class="b-title">Product, Project, Marketing &amp; Demand Planning Leader</p>
        <p class="b-lede">10+ years leading products <em>end to end</em>, from strategy to launch and growth.</p>
        <div class="b-cta">
          <a href="#video" class="btn magnetic">{PLAY}Watch my video resume</a>
          <a href="#experience" class="btn btn--ghost magnetic">See my work</a>
        </div>
      </div>
      <div class="tile t-photo tilt"><img src="assets/headshot.jpg" alt="Portrait of Victor Delgado" width="1000" height="1000"></div>
      <div class="tile t-rot">{ROTATOR}</div>
      <div class="tile t-loc"><span class="t-k">Based in</span><strong>Huntington Beach, CA</strong></div>
      <div class="tile t-mq" aria-hidden="true"><div class="marquee__track">{marquee_items}</div></div>
    </section>

    <section id="video" class="section bento bento--video">
      <div class="tile t-vcopy"><p class="kicker">Video resume</p><h2>My career in <em>45 seconds</em>.</h2>
        <p>Short on time? Hit play for the highlights: consumer goods on Amazon, Target and Walmart, AI agent workflows for small businesses, and the product thinking that ties it all together.</p>{ticks}</div>
      <div class="tile t-video">{VIDEO_SCREEN}</div>
    </section>

    <section id="experience" class="section">
      <div class="b-head"><p class="kicker">Experience</p><h2>Where I've made <em>an impact</em>.</h2></div>
      <div class="bento bento--xp">{ALLROLES}</div>
    </section>

    <section id="approach" class="section">
      <div class="b-head"><p class="kicker">How I work</p><h2>One playbook, from <em>first insight</em> to growth.</h2><p>{approach_lede}</p></div>
      {steps}
    </section>

    <section id="toolkit" class="section">
      <div class="b-head"><p class="kicker">Skills &amp; Tools</p><h2>What I bring <em>to the table</em>.</h2></div>
      {cards}
    </section>

    <section id="contact" class="section finale bento bento--fin">
      <div class="tile t-fphoto"><img src="assets/headshot.jpg" alt="" width="1000" height="1000" loading="lazy"></div>
      <div class="tile t-fmain"><h2 class="fin__title">Let's connect and find where I fit.</h2>{CONTACT_BTNS}<p class="fin__loc">Based in Huntington Beach, CA</p></div>
      <div class="tile t-fquote"><p>{QUOTE}</p></div>
      <div class="tile t-fpills"><p class="kicker">Experience across industries &amp; functions</p>{pills}<p class="fin__more">{MORE}</p></div>
    </section>
  </main>
  {FOOT}
  {TAIL}
</body></html>'''

# ---------------- OPTION 3: cinematic + career timeline ----------------
TL=[('demand','Next','Sr. Strategic Demand Planner','Coming soon'),
    ('rvtoad','2026','Product Management Consultant','RVToad.com'),
    ('kolo','2025','Product Manager','Kolo AI'),
    ('infinite','2017','Product Development, Team Lead','Infinite Commerce'),
    ('nitori','2014','Procurement Manager','Nitori USA / Aki Home')]
tl_btns=''.join(f'<button type="button" role="tab" class="tl__stop" aria-selected="{"true" if i==0 else "false"}" data-panel="p-{k}"><span class="tl__yr">{y}</span><span class="tl__role">{r}</span><span class="tl__co">{c}</span></button>' for i,(k,y,r,c) in enumerate(TL))
panels=''.join(f'<div class="tl__panel" id="p-{k}" {"" if i==0 else "hidden"}>{roles[k]}{roles["kolo-skills"] if k=="kolo" else ""}</div>' for i,(k,y,r,c) in enumerate(TL))
o3=head('3',False)+f'''
<body class="o3">
  <div class="progress" aria-hidden="true"></div>
  {nav()}
  <main id="top">
    <section class="hero cine">
      <p class="eyebrow"><span class="dot-live"></span>Open to connecting</p>
      <h1 class="cine__name"><span class="cine__l1">Victor <span class="cine__photo tilt"><img src="assets/headshot.jpg" alt="" width="1000" height="1000"></span></span><span class="cine__l2">Delgado</span></h1>
      <div class="cine__row">
        <p class="cine__title">Product, Project, Marketing &amp; Demand Planning Leader</p>
        <div class="cine__mid"><p class="cine__lede">10+ years leading products <em>end to end</em>, from strategy to launch and growth.</p>{ROTATOR}</div>
        <div class="cine__cta">
          <a href="#video" class="btn magnetic">{PLAY}Watch my video resume</a>
          <a href="#experience" class="btn btn--ghost magnetic">See my work</a>
        </div>
      </div>
    </section>
    <div class="strip" aria-hidden="true"><div class="marquee__track">{marquee_items}</div></div>

    <section id="video" class="section theater">
      <p class="kicker">Video resume</p>
      <h2>My career in <em>45 seconds</em>.</h2>
      <p class="theater__lede">Short on time? Hit play for the highlights: consumer goods on Amazon, Target and Walmart, AI agent workflows for small businesses, and the product thinking that ties it all together.</p>
      <div class="theater__frame">{VIDEO_SCREEN}</div>
      {ticks}
    </section>

    <section id="experience" class="section tlsec">
      <p class="kicker">Experience</p>
      <h2>Where I've made <em>an impact</em>.</h2>
      <p class="tl__hint">Pick a stop on the timeline to open that role.</p>
      <div class="tl" role="tablist" aria-label="Career timeline">{tl_btns}</div>
      <div class="tl__panels">{panels}</div>
    </section>

    <section id="approach" class="section flow">
      <p class="kicker">How I work</p>
      <h2>One playbook, from <em>first insight</em> to growth.</h2>
      <p class="flow__lede">{approach_lede}</p>
      {steps}
    </section>

    <section id="toolkit" class="section kit">
      <p class="kicker">Skills &amp; Tools</p>
      <h2>What I bring <em>to the table</em>.</h2>
      {cards}
    </section>

    <section id="contact" class="section finale big">
      <h2 class="big__h">Let's connect<br>and find where I fit.</h2>
      <div class="big__row">
        <div class="big__me"><img class="fin__photo" src="assets/headshot.jpg" alt="" width="1000" height="1000" loading="lazy"><div><p class="fin__quote">{QUOTE}</p><p class="fin__loc">Based in Huntington Beach, CA</p></div></div>
        {CONTACT_BTNS}
      </div>
      <p class="kicker">Experience across industries &amp; functions</p>
      {pills}
      <p class="fin__more">{MORE}</p>
    </section>
  </main>
  {FOOT}
  {TAIL}
  <script>
  (() => {{
    const stops=[...document.querySelectorAll('.tl__stop')];
    stops.forEach(b=>b.addEventListener('click',()=>{{
      stops.forEach(x=>x.setAttribute('aria-selected', x===b));
      document.querySelectorAll('.tl__panel').forEach(p=>p.hidden = p.id!==b.dataset.panel);
      const p=document.getElementById(b.dataset.panel);
      p.querySelectorAll('.reveal').forEach(r=>r.classList.add('is-in'));
      dispatchEvent(new Event('resize'));
    }}));
  }})();
  </script>
</body></html>'''

for k,h in [('1',o1),('2',o2),('3',o3)]:
    d=f'{R}/redesign/{k}'; os.makedirs(d,exist_ok=True)
    open(f'{d}/index.html','w').write(h)
    for name,target in [('base.css','../../styles.css'),('main.js','../../main.js'),('assets','../../assets'),('light-fixes.css','../light-fixes.css')]:
        p=f'{d}/{name}'
        if not os.path.lexists(p): os.symlink(target,p)
print('built')
