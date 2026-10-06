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

// Repositórios recentes via API do GitHub
const USUARIO_GITHUB = 'caiokira';
const listaRepos = document.getElementById('repos');

const coresLinguagens = {
    JavaScript: '#f1e05a',
    TypeScript: '#3178c6',
    HTML: '#e34c26',
    CSS: '#663399',
    Python: '#3572a5',
};

function formatarData(dataIso) {
    return new Date(dataIso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
}

function criarCardRepo(repo) {
    const item = document.createElement('li');
    item.className = 'repo';

    const link = document.createElement('a');
    link.href = repo.html_url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';

    const nome = document.createElement('span');
    nome.className = 'repo-nome';
    nome.innerHTML = '<i class="fa-regular fa-folder"></i>';
    nome.append(repo.name);

    const descricao = document.createElement('p');
    descricao.className = 'repo-descricao';
    descricao.textContent = repo.description || 'Sem descrição.';

    const meta = document.createElement('div');
    meta.className = 'repo-meta';

    if (repo.language) {
        const linguagem = document.createElement('span');
        linguagem.className = 'repo-linguagem';
        linguagem.style.setProperty('--cor-linguagem', coresLinguagens[repo.language] || '#8b5cf6');
        linguagem.textContent = repo.language;
        meta.append(linguagem);
    }

    const atualizado = document.createElement('span');
    atualizado.innerHTML = '<i class="fa-regular fa-clock"></i>';
    atualizado.append(`Atualizado em ${formatarData(repo.pushed_at)}`);
    meta.append(atualizado);

    link.append(nome, descricao, meta);
    item.append(link);
    return item;
}

function mostrarErroRepos() {
    listaRepos.innerHTML = `
        <li class="repos-erro">
            Não foi possível carregar os repositórios agora.
            <a href="https://github.com/${USUARIO_GITHUB}?tab=repositories" target="_blank" rel="noopener noreferrer">Ver direto no GitHub</a>
        </li>`;
}

async function carregarRepos() {
    try {
        const resposta = await fetch(`https://api.github.com/users/${USUARIO_GITHUB}/repos?sort=pushed&per_page=20`);
        if (!resposta.ok) throw new Error(`Erro ${resposta.status}`);

        const repos = await resposta.json();
        const recentes = repos.filter(repo => !repo.fork).slice(0, 6);

        if (recentes.length === 0) throw new Error('Nenhum repositório encontrado');

        listaRepos.replaceChildren(...recentes.map(criarCardRepo));
    } catch (erro) {
        mostrarErroRepos();
    }
}

if (listaRepos) carregarRepos();
