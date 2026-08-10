const check=document.getElementById('check'),themeBtn=document.getElementById('themeBtn'),links=document.querySelectorAll('.nav-link'),overlay=document.querySelector('.overlay');
const lightbox=document.getElementById('lightbox'),lightboxImg=document.getElementById('lightboxImg'),lightboxTitle=document.getElementById('lightboxTitle');
const closeLightbox=document.getElementById('closeLightbox');
document.getElementById('year').textContent=new Date().getFullYear();
if(localStorage.getItem('nk-theme')==='light'){document.body.classList.add('light');updateTheme();}
function updateTheme(){const light=document.body.classList.contains('light');themeBtn.querySelector('i').className=light?'fa-solid fa-sun':'fa-solid fa-moon';themeBtn.querySelector('span').textContent=light?'Light Mode':'Dark Mode';}
themeBtn.addEventListener('click',()=>{document.body.classList.toggle('light');localStorage.setItem('nk-theme',document.body.classList.contains('light')?'light':'dark');updateTheme();});
links.forEach(l=>l.addEventListener('click',()=>check.checked=false));overlay.addEventListener('click',()=>check.checked=false);
const sections=document.querySelectorAll('main section[id]');
const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)links.forEach(l=>l.classList.toggle('active',l.getAttribute('href')===`#${e.target.id}`));}),{rootMargin:'-35% 0px -55% 0px'});
sections.forEach(s=>observer.observe(s));
document.querySelectorAll('.gallery-card').forEach(card=>card.addEventListener('click',()=>{lightboxImg.src='photo.jpg';lightboxImg.alt=card.dataset.title;lightboxTitle.textContent=card.dataset.title;lightbox.classList.add('show');document.body.style.overflow='hidden';}));
function close(){lightbox.classList.remove('show');document.body.style.overflow='';}closeLightbox.addEventListener('click',close);lightbox.addEventListener('click',e=>{if(e.target===lightbox)close();});document.addEventListener('keydown',e=>{if(e.key==='Escape'){close();check.checked=false;}});
document.getElementById('contactForm').addEventListener('submit',e=>{e.preventDefault();const name=document.getElementById('name').value.trim();document.getElementById('formMessage').textContent=`Thanks ${name}! Your message has been received.`;e.target.reset();});
