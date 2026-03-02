let gameState = {
    currentScene: 'start',
    characters: [],
    tips: 0,
    path: 'neutro',
    visitedScenes: new Set()
};

// Dados das cenas (EDITAR AQUI)
const scenes = {
    start: {
        text: `NUMA TRISTEZA SEM FIM,
A MÃE COMEÇOU A GRITAR:
— QUERO-QUERO, MEU FILHINHO,
APAREÇA LIGEIRINHO.
DE TÃO NERVOSA E CANSADA,
NÃO CONSEGUIU MAIS CAMINHAR,
NEM MAIS ASAS TINHA PARA O VOO,
NEM FORÇA PARA PROCURAR.
O PAI, COM MAIS DOIS FILHOTINHOS,
AGORA ERAM TRÊS QUERO-QUEROS A ANDAR,
TRISTES, SEGUIAM PELO CAMPO,
SEM SABER ONDE PROCURAR.
PEDIRAM AJUDA A QUEM PASSAVA
—CAPIVARA, AMIGA QUERIDA,
MEU FILHINHO SUMIU NO CAMINHO,
ESTÁ SOZINHO NESTA VIDA!`,
        art: "background: linear-gradient(45deg, #90EE90, #228B22);",
        artLabel: "Mãe aflita no campo",
        choices: [
            { text: "AJUDE A CAPIVARA A PROCURAR", next: 'capivaraAjuda', effect: { characters: ['Capivara'] } },
            { text: "IGNORE A PEDIDO E SIGA CAMINHO", next: 'start' },
            { text: "PROCURE SÓ PELO SEU FILHOTE", next: 'start' }
        ]
    },
    capivaraAjuda: {
        text: `— AMIGO, VOU AJUDAR,
DISSE A CAPIVARA, SEM HESITAR.
À MAMÃE, RESOLVEU ACONSELHAR:
— MAMÃE QUERO-QUERO, FIQUE AÍ A ESPERAR;
LOGO, LOGO, TEU FILHOTE IRÁ VOLTAR.
ALI FICOU A MAMÃE, SEM PARAR DE CHAMAR:
—CADÊ MEU QUERO-QUERO, QUE TANTO ESPERO?
SAÍRAM, ENTÃO, QUATRO AMIGOS
PELO CAMPO AFORA A ANDAR.
LOGO AVISTARAM UM CAVALO,
PASTANDO À BEIRA DO RIO E A RELINCHAR.
A GEADA ESTAVA FORTE,
O FRIO ERA DE ARREPIAR
E O CAVALO, BEM LIGEIRO,
PRA COCHEIRA IRIA RETORNAR.`,
        art: "background: linear-gradient(45deg, #D2B48C, #8B4513);",
        artLabel: "Capivara e amigos",
        choices: [
            { text: "PERGUNTE AO CAVALO PELO QUERO-QUERO", next: 'cavaloPergunta', effect: { characters: ['Cavalo'] } },
            { text: "NÃO PERGUNTE, SÓ SIGA EM FRENTE", next: 'start' },
            { text: "ESQUEÇA E VOLTE A CASA", next: 'start' }
        ]
    },
    cavaloPergunta: {
        text: `— AMIGO CAVALO! —DISSE A CAPIVARA COM ATENÇÃO.
— UM FILHOTE DE QUERO-QUERO SUMIU ESTA MANHÃ.
— NÃO VI NADA, NÃO... —RESPONDEU O CAVALO,
COM PRONTIDÃO.
— MAS, QUEM SABE, VAMOS PERGUNTAR PARA A JAÇANÃ?
AGORA ERAM CINCO AMIGOS,
SEGUINDO NA MESMA MISSÃO.`,
        art: "background: linear-gradient(45deg, #FF4500, #FFD700);",
        artLabel: "Cavalo conversando",
        choices: [
            { text: "SIGA A JAÇANÃ, ELA PODE SABER", next: 'jacanaUne', effect: { characters: ['Jaçanã'] } },
            { text: "PROSSEGUIR SEM PERGUNTAR A NINGUÉM", next: 'start' },
            { text: "RETORNAR COM O GRUPO", next: 'start' }
        ]
    },
    jacanaUne: {
        text: `JAÇANÃ OUVIU A HISTÓRIA
E TOMOU A FIRME DECISÃO:
— IREI JUNTO E TEREMOS A VITÓRIA.
— COMIGO É AGILIDADE E AÇÃO.
FORAM ENTÃO SEIS AMIGOS EM BUSCA DO QUERO-QUERO
SEM DEMORA, SEM ESPERA E NEM LERO-LERO
A URUTU APARECEU NUM SILÊNCIO FATAL,
PRONTA, CERTEIRA, PARA O BOTE FINAL.`,
        art: "background: linear-gradient(45deg, #708090, #4682B4);",
        artLabel: "Jaçanã decide ficar",
        choices: [
            { text: "CONVITE URUTU A SE JUNTAR", next: 'urutuConvida', effect: { characters: ['Urutu'] } },
            { text: "IGNORAR A URUTU E SE APRESSAR", next: 'start' },
            { text: "DETÊ-LA E VOLTAR PARA TRÁS", next: 'start' }
        ]
    },
    urutuConvida: {
        text: `— CALMA AÍ! — GRITOU JAÇANÃ — NINGUÉM QUER TEU MAL!
— NÃO ERA PARA VOCÊS... BEM CAPAZ.
DISSE A COBRA, MUITO SAGAZ.
— MAS, DIGAM LOGO, MEUS AMIGOS:
— QUE PROCURA É ESTA TÃO AUDAZ?
A CAPIVARA EXPLICOU:
— AMIGA URUTU, VIU POR AÍ
UM QUERO-QUERO FILHOTE PASSAR?
— NÃO SEI DE NADA, NÃO... — RESPONDEU A COBRA.
MAS VOU COM VOCÊS AJUDAR!
AGORA ERAM SETE AMIGOS,
SEGUINDO FIRMES PELO CAMINHO,`,
        art: "background: linear-gradient(45deg, #556B2F, #808000);",
        artLabel: "Urutu hesitante",
        choices: [
            { text: "CONVITE GRAXAIM PARA AJUDAR", next: 'graxaimAjuda', effect: { characters: ['Graxim'] } },
            { text: "SUSPEITE DA COBRA E VÁ EMBORA", next: 'start' },
            { text: "TENTE CAMINHO ALTERNATIVO", next: 'start' }
        ]
    },
    graxaimAjuda: {
        text: `AO OUVIR TODA A HISTÓRIA,
PENSOU LOGO EM SUA FAMA:
—VÃO ACHAR QUE FUI EU...
—PRECISO MUDAR ESTE PANORAMA.
ENTÃO, FALOU COM CONVICÇÃO:
— EU AJUDO, SIM, E É DE CORAÇÃO!
— ATÉ ANTES DA NOITE ESSE FILHOTE
VOLTARÁ PARA O NINHO, SEM DISCUSSÃO.
DITO ISTO, ERAM OITO AMIGOS,
PREOCUPADOS E PROCURANDO A SOLUÇÃO.
SEGUINDO JUNTOS, PASSO A PASSO,
COM ESPERANÇA E DETERMINAÇÃO.
DE REPENTE, A URUTU LEMBROU:
— AINDA NA MADRUGADA, OUVI CANTAR
UM CARCARÁ QUE AQUI PASSOU,
RASGANDO O CÉU DESTE LUGAR.`,
        art: "background: linear-gradient(45deg, #FFFF00, #FFA500);",
        artLabel: "Graxim reflexivo",
        choices: [
            { text: "SIGA A PISTA DO BEM-TE-VI", next: 'carcaraFinal', effect: { characters: ['Bem-te-vi', 'Carcará'] } },
            { text: "DESISTIR DA BUSCA", next: 'start' },
            { text: "PROCURAR EM OUTRA DIREÇÃO", next: 'start' }
        ]
    },
    carcaraFinal: {
        text: `— O BEM-TE-VI ANIMADO, RESPONDEU:
— SEI SIM, POSSO INDICAR!
VI UM NINHO NUM PÉ DE UMBU,
QUANDO O SOL COMEÇOU A DESPONTAR.
COM O ACEITE DO BEM-TE-VI,
AGORA ERAM NOVE AMIGOS A CAMINHAR,
PELOS CAMPOS, PELAS TRILHAS,
SEM PARAR DE PROCURAR.
— SEI QUE SABEM DA FAMA.
DISSE O BEM-TE-VI COM CAUTELA.
— SERIA UMA TRISTEZA..., MAS
NÃO VOU JULGAR SEM SABER DA NOVELA.
A CAPIVARA ENTÃO FALOU:
— NÃO VAMOS PARAR, NEM DESISTIR!
— A NOITE AINDA NÃO CHEGOU,
A ALEGRIA NESTES PAGOS IRÁ RESSURGIR.
SEGUIRAM TODOS COM CUIDADO,
NUMA ANDANÇA SILENCIOSA,
CONFIANTES NA CAPIVARA,
CORAJOSA E GENEROSA.
CAPIVARA SABIA BEM
O TAMANHO DA MISSÃO:
LEVAR O FILHOTE SÃO E SALVO
ENSINANDO A TODOS A COMPAIXÃO.
AO AVISTAR O CARCARÁ,
FALOU FIRME, COM EDUCAÇÃO:
— CARO AMIGO, VENHO EXPLICAR
PORQUE ESTAMOS EM TRIBULAÇÃO:
— ESTES POBRES QUERO-QUEROS
PROCURAM UM FILHOTE PERDIDO.
SERÁ QUE PODE NOS AJUDAR,
A ENCONTRAR O DESPROTEGIDO?
O CARACARÁ ESTICANDO O PENACHO,
OLHOU LÁ EMBAIXO E SORRIU:
— QUE COINCIDÊNCIA, MINHA AMIGA!
O FILHOTE CHEGOU AQUI E ME VIU.
ESTAVA PERDIDO, COM MEDO E COM FRIO.
— TREMENDO, O COITADINHO,
SEM SABER O QUE FAZER,
RESOLVI TRAZÊ-LO PARA O NINHO
PARA CUIDAR, PROTEGER E AQUECER.
E CONTINUOU, EM TOM CERTEIRO:
— ENTREGO AGORA O AVENTUREIRO,
MAS QUE SIRVA DE LIÇÃO:
O MUNDO FORA DO NINHO,
EXIGE CUIDADO E ATENÇÃO.
— MELHOR É SER SEMPRE CAUTELOSO,
DO QUE SER VALENTE E NÃO PENSAR.
— VIVE MAIS QUEM OBSERVA
E SABE A HORA DE ESPERAR.
— DITO ISTO, VENHA AQUI, AMIGO QUERO-QUERO.
— SUBA E PEGUE TEU FILHOTE.
— TUDO O QUE FALEI É SINCERO
E AGORA ME DEIXE LONGE DOS HOLOFOTES.
— MINHA PREOCUPAÇÃO É COM OS MEUS,
HÁ MUITOS PREDADORES POR AÍ.
— E VOCÊS, AÍ EMBAIXO, CUIDEM DOS SEUS.
— BOA COMIDA E AFETO TEM PARA OS MEUS AQUI.
O FILHOTE FOI ENTÃO LEVADO
DE VOLTA AO NINHO, COM A MAMÃE.
SEGURO, QUENTINHO E AMADO.
E ASSIM, DEZ BONS AMIGOS
APRENDERAM NAQUELE DIA:
QUE AMIZADE É ESTENDER A PATA,
A ASA, A VOZ COM ALEGRIA.
NO CAMPO, NO CÉU, NO CHÃO,
NINGUÉM CAMINHA SOZINHO,
QUANDO HÁ CUIDADO E UNIÃO,
TODO FILHOTE ENCONTRA O CAMINHO.
QUANDO O FILHOTE VOLTOU,
A MAMÃE PAROU DE CHAMAR.
— CADÊ MEU QUERO-QUERO QUE TANTO ESPERO?
O CAMPO FICOU MAIS CALMO,
O CÉU VOLTOU A CLAREAR.
MAS, EM OUTROS CAMPOS, POR AÍ,
QUANDO O DIA COMEÇA A CLAREAR,
UM QUERO-QUERO VOA AFLITO,
SEM SABER ONDE POUSAR.
E A MAMÃE CLAMA AO MUNDO INTEIRO:
— CADÊ MEU QUERO-QUERO, QUE TANTO ESPERO?`,
        art: "background: linear-gradient(45deg, #FF0000, #DC143C);",
        artLabel: "Desfecho no umbu",
        choices: []
    }
};


// função utilitária para embaralhar um array
function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
}

// Inicializar jogo
function initGame() {
    updateDisplay();
    updateStats();
}

// Atualizar tela atual
function updateDisplay() {
    const currentScene = scenes[gameState.currentScene];

    // Arte
    document.getElementById('artContainer').style.cssText = currentScene.art || '';
    document.getElementById('artContainer').innerHTML = `
        <div style="font-size: 1.5rem;">${currentScene.artLabel || 'CENA ATIVA'}</div>
    `;

    // Texto
    document.getElementById('storyText').textContent = currentScene.text;

    // Escolhas
    const choicesContainer = document.getElementById('choicesContainer');
    choicesContainer.innerHTML = '';

    if (currentScene.choices && currentScene.choices.length > 0) {
        // copie e embaralhe as opções para não ficar sempre na mesma ordem
        const options = [...currentScene.choices];
        shuffleArray(options);
        options.forEach(choice => {
            const btn = document.createElement('button');
            btn.className = 'choice-btn';
            btn.textContent = choice.text;
            btn.onclick = () => makeChoice(choice);
            choicesContainer.appendChild(btn);
        });
    } else {
        // Fim de jogo -- mensagem de conclusão e botões
        const congrats = document.createElement('div');
        congrats.className = 'ending';
        congrats.textContent = 'PARABÉNS, VOCÊ CONCLUIU A HISTÓRIA!';
        choicesContainer.appendChild(congrats);

        const siteBtn = document.createElement('button');
        siteBtn.className = 'choice-btn';
        siteBtn.textContent = 'Voltar ao site principal';
        siteBtn.onclick = () => {
            // substituir pela URL real mais tarde
            window.location.href = 'https://example.com';
        };
        choicesContainer.appendChild(siteBtn);

        const restartBtnInner = document.createElement('button');
        restartBtnInner.className = 'choice-btn';
        restartBtnInner.textContent = 'Reiniciar jogo';
        restartBtnInner.onclick = restartGame;
        choicesContainer.appendChild(restartBtnInner);
    }
}

// Fazer escolha
function makeChoice(choice) {
    // Aplicar efeitos (definir objeto vazio caso não exista)
    const eff = choice.effect || {};
    if (eff.characters) {
        gameState.characters.push(...eff.characters);
    }
    if (eff.tips) {
        gameState.tips += eff.tips;
    }
    if (eff.path) {
        gameState.path = eff.path;
    }

    // Ir para próxima cena
    gameState.currentScene = choice.next;
    gameState.visitedScenes.add(gameState.currentScene);

    // Pequena transição
    document.body.style.opacity = '0.5';
    setTimeout(() => {
        updateDisplay();
        updateStats();
        document.body.style.opacity = '1';
    }, 300);
}

// Atualizar estatísticas
function updateStats() {
    document.getElementById('charStat').textContent =
        gameState.characters.length > 0 ? gameState.characters.join(', ') : 'Nenhum';
    document.getElementById('tipsStat').textContent = gameState.tips;
    document.getElementById('pathStat').textContent =
        gameState.path.charAt(0).toUpperCase() + gameState.path.slice(1);
}

// Reiniciar jogo
function restartGame() {
    gameState = {
        currentScene: 'start',
        characters: [],
        tips: 0,
        path: 'neutro',
        visitedScenes: new Set()
    };
    updateDisplay();
    updateStats();
}

// Iniciar quando carregar
window.onload = initGame;