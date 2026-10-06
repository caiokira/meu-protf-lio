const cabecalho = document.querySelector('.cabecalho');
const botaoMenu = document.querySelector('.menu-toggle');
const menu = document.querySelector('.menu');
const linksMenu = document.querySelectorAll('.menu a');

// Fundo do cabeçalho ao rolar a página
function atualizarCabecalho() {
    cabecalho.classList.toggle('rolado', window.scrollY > 20);
}

window.addEventListener('scroll', atualizarCabecalho, { passive: true });
atualizarCabecalho();

// Menu mobile
function alternarMenu(abrir) {
    menu.classList.toggle('aberto', abrir);
    cabecalho.classList.toggle('menu-aberto', abrir);
    botaoMenu.setAttribute('aria-expanded', String(abrir));
    botaoMenu.setAttribute('aria-label', abrir ? 'Fechar menu' : 'Abrir menu');
    botaoMenu.querySelector('i').className = abrir ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
}

botaoMenu.addEventListener('click', () => {
    alternarMenu(!menu.classList.contains('aberto'));
});

linksMenu.forEach(link => {
    link.addEventListener('click', () => alternarMenu(false));
});

document.addEventListener('keydown', evento => {
    if (evento.key === 'Escape') alternarMenu(false);
});

// Destaca no menu a seção visível
const secoes = document.querySelectorAll('main section[id]');

const observadorSecoes = new IntersectionObserver(entradas => {
    entradas.forEach(entrada => {
        if (!entrada.isIntersecting) return;

        linksMenu.forEach(link => {
            link.classList.toggle('ativo', link.getAttribute('href') === `#${entrada.target.id}`);
        });
    });
}, { rootMargin: '-50% 0px -50% 0px' });

secoes.forEach(secao => observadorSecoes.observe(secao));

// Animação de entrada dos elementos
const elementosRevelar = document.querySelectorAll('.revelar');

const observadorRevelar = new IntersectionObserver((entradas, observador) => {
    entradas.forEach(entrada => {
        if (!entrada.isIntersecting) return;

        entrada.target.classList.add('visivel');
        observador.unobserve(entrada.target);
    });
}, { threshold: 0.12 });

elementosRevelar.forEach(elemento => observadorRevelar.observe(elemento));

// Ano atual no rodapé
document.getElementById('ano').textContent = new Date().getFullYear();
