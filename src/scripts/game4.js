/* Configuração para identificar o tipo de dispositivo */

const UIManager = {
    isTouchDevice: false,
    deviceType: 'desktop',

    init() {
        this.isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0)
        
        const width = window.innerWidth
        if (this.isTouchDevice) {
            this.deviceType = width > 1024 ? 'tablet' : 'mobile'
        } else {
            this.deviceType = 'desktop'
        }

        this.applyInterface()
    },

    applyInterface() {
        const controls = document.getElementById('mobile-controls')
        if (!controls) return

        // Lógica de exibição:
        // Se for mobile ou tablet, mostramos os controles de toque.
        if (this.isTouchDevice) {
            controls.style.display = 'grid' // Ou 'flex', dependendo do seu CSS
            console.log(`[UI] Modo ${this.deviceType} ativado.`)
        } else {
            controls.style.display = 'none'
            console.log("[UI] Modo Desktop ativado. Controles ocultos.")
        }
    }
}

// Inicializa a detecção ao carregar a página
window.addEventListener('DOMContentLoaded', () => UIManager.init())

const ROWS = 25
const COLS = 40
const TILE_SIZE = 80

let player = {
  x: 14,
  y: 15,
  hp: 3,
  friends: 0,
  followers: 0
}

let facing = "right"
let pauseGame = true
let activeInterval = null

const map = [
    "AAAAAAAAWWWWWWWWWWWWWWWWAAAAAAAAAAAAAAAA",
    "AAAAAAAAAWWWWWWWWWWWWWAAAAAAAAAAAAAAAAAA",
    "AAAAAAAAAAWWWWWWWWWWAAAAAAAAAAAAAAAAAAAA",
    "WA.,.,.,.,.WWWWWWWW,.T.,.,.,.,.,.,.,.,AA",
    "WW,.,T,.,PWWWWWWW.,.,T,.,.,.M.,.,.,.,.AA",
    "WWW,.TWWWWWWWWWW.,.,.T.,.,.,.,.,.,.,.,AA",
    "WWWWWTWWWWWWWW,.,.,.,TTTTTTTTTT.,.,.,.AA",
    "WWWWPTWWWWWW.,.,.,.,.,.,.,.,.,T,.,.,.,AA",
    "WWWW,T,.,.,.,.,.,.,.,.,.,.,.,.T.,.,.,.AA",
    "WW.,.T.,.,.,.,.,.,O,.,.,.,.,.,T,.,.,.,AA",
    "WA,.,T,.,.,.,.,.,.,.,.,.,.,.,.T.,.,.,.AA",
    "WA.,.TT,.,.,.,.,.,.,.,.,.,.,.,T,.,.,.,AA",
    "AA,.,.TTTTTTTTTTTTTTTTTTTTTTTTT.,.,.,.AA",
    "AA.,.,.,.C.,.,.,.,.,.,.,.,.,.,.,.,.,.,AA",
    "AA,.,.,.,.,.,.,.,.,.,TTTT.,.,.,.,.,.,.AA",
    "AA.,.M.,.,.,.,.,.,.,.T.,T,.,.,.,.,.,.,AA",
    "AA,.,M,.,.,.,.,.,.,.,T,.T.,.,.,.,.,.,.AA",
    "AA.,.,.,.,.,.,.,.,.,.T.,T,.,.,.,.,.,.,AA",
    "AA,.,.,.,.,.,.,.,.,.,T,.T.,.,.,.,.,.,.AA",
    "AA.,.,.,.O.,.,.,.,.,.T.,T,.,.,.,C,.,.,AA",
    "AA,.,.,.,.,.,.,.,.,.,T,.T.,.,.,.,.,.,.AA",
    "AA.,.,.,.,.,.,.,.,.,.T.,M,.,.,.,.,.,.,AA",
    "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
    "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
    "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
]

const moldes = {
  'W': createMold('water'),
  'A': createMold('tree'),
  '.': createMold('grass'),
  ',': createMold('grass2'),
  'T': createMold('dirt'),
  'P': createMold('minigame-spot'),
  'M': createMold('minigame-spot'),
  'O': createMold('minigame-spot'),
  'C': createMold('minigame-spot')
}

function createMold(classe) {
  const div = document.createElement('div')
  div.className = `piece ${classe}`
  return div
}

function renderMap() {
  const board = document.getElementById('game-board')
  if (!board) return
  
  board.innerHTML = ""
  board.style.gridTemplateColumns = `repeat(${COLS}, ${TILE_SIZE}px)`
  board.style.gridTemplateRows = `repeat(${ROWS}, ${TILE_SIZE}px)`

  const frag = document.createDocumentFragment()
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      const char = map[y][x]
      const clone = moldes[char].cloneNode(true)

      if (['P', 'M', 'O', 'C'].includes(char)) {
        clone.innerText = char
      }

      frag.appendChild(clone)
    }
  }
  board.appendChild(frag)
  updateCamera()
  
  const uiHearts = document.getElementById('ui-hearts')
  const heartsEl = document.getElementById('mg-hearts')
  if (uiHearts) uiHearts.innerText = player.hp
  if (heartsEl) heartsEl.innerText = player.hp
}

function updateCamera(isResizing = false) {
  const board = document.getElementById('game-board')
  const playerDiv = document.getElementById('player')
  
  if (!board || !playerDiv) return

  if (isResizing) {
    board.classList.remove('smooth-move')
  } else {
    board.classList.add('smooth-move')
  }

  const centerX = window.innerWidth / 2
  const centerY = window.innerHeight / 2

  const playerWorldX = (player.x * TILE_SIZE) + (TILE_SIZE / 2)
  const playerWorldY = (player.y * TILE_SIZE) + (TILE_SIZE / 2)

  const offX = centerX - playerWorldX
  const offY = centerY - playerWorldY
  
  board.style.transform = `translate(${offX}px, ${offY}px)`

  const scale = (facing === "left") ? -1 : 1
  playerDiv.style.transform = `translate(-50%, -50%) scaleX(${scale})`
}

document.addEventListener("keydown", (e) => {
  if (pauseGame) return

  let newX = player.x
  let newY = player.y

  const key = e.key.toLowerCase()
  if (key === 'arrowup' || key === 'w') newY--
  if (key === 'arrowdown' || key === 's') newY++
  if (key === 'arrowleft' || key === 'a') {
    newX--
    facing = "right"
  }
  if (key === 'arrowright' || key === 'd') {
    newX++
    facing = "left"
  }

  if (newY >= 0 && newY < ROWS && newX >= 0 && newX < COLS) {
    const charArray = map[newY].split('')
    const tile = charArray[newX]
    
    if (tile !== 'W' && tile !== 'A') { 
      player.x = newX
      player.y = newY
      updateCamera()
        
      if (['P', 'M', 'O', 'C'].includes(tile)) {
        openMinigame(tile, newX, newY, charArray)
      }
    }
  }
})

/* LÓGICA DOS MINIJOGOS */

function openMinigame(type, x, y, charArray) {
  pauseGame = true
  const container = document.getElementById('minigame-container')
  const content = document.getElementById('mg-content')
  
  if (container) container.style.display = 'flex'
  if (content) content.innerHTML = ""

  if (type === 'P') playFishing(x, y, charArray)
  if (type === 'M') playMemory(x, y, charArray)
  if (type === 'O') playDnD(x, y, charArray)
  if (type === 'C') playCatch(x, y, charArray)
}

function closeMinigame() {
  const container = document.getElementById('minigame-container')
  if (container) container.style.display = 'none'
  pauseGame = false
}

function reduceHP() {
  player.hp--
  const uihp = document.getElementById('hp')
  const uiHearts = document.getElementById('ui-hearts')
  const heartsEl = document.getElementById('mg-hearts')
  if (uiHearts) {
    setTimeout(() => {
      uiHearts.innerText = player.hp
    }, 3000)
    uiHearts.innerText = 'Você perdeu 1 ponto'
  }
  
  if (heartsEl) {
    setTimeout(() => {
      heartsEl.innerText = player.hp
    }, 2000)
    heartsEl.innerText = 'Você perdeu 1 ponto'
  }

  if (player.hp <= 0) {
    closeMinigame()
    pauseGame = true
    //document.getElementById('game-over').style.display = 'flex'
    uiHearts.innerText = ''
    uihp.innerText = 'Você perdeu! 😭'
    uihp.style.background = 'rgba(238, 238, 238, 0.9)'
    uihp.style.color = 'rgba(100, 100, 100, 0.9)'

    setTimeout(() => {
      restartGame()
    }, 3000)
  }
}

function winMinigame(x, y, charArray) {
  player.friends++
  const progEl = document.getElementById('prog')
  if (progEl) progEl.innerText = `${player.friends}/10`

  charArray[x] = '.'
  map[y] = charArray.join('')

  const index = y * COLS + x
  const board = document.getElementById('game-board')
  if (board && board.children[index]) {
    board.children[index].className = 'piece grass'
  }
  
  closeMinigame()

  if (player.friends >= 10) {
    window.alert("Parabéns! Você resgatou todos os 10 amigos!")
  }
}

function setupMobileButtons() {
    const btns = {
        'btn-up': [0, -1, facing],
        'btn-down': [0, 1, facing],
        'btn-left': [-1, 0, "right"],
        'btn-right': [1, 0, "left"]
    }

    for (const [id, [dx, dy, dir]] of Object.entries(btns)) {
        const el = document.getElementById(id)
        if (el) {
            el.addEventListener('touchstart', (e) => {
                e.preventDefault()
                handleMove(player.x + dx, player.y + dy, dir)
            }, {passive: false})
        }
    }
}

/* MINIJOGOS */

function playFishing(x, y, charArray) {
  document.getElementById('mg-title').innerText = "Pesca do Cavalo"
  document.getElementById('mg-desc').innerHTML = "Para pescar, clique quando ficar <strong>VERDE</strong>!"
  const content = document.getElementById('mg-content')
  const btn = document.createElement('button')
  
  btn.innerText = "Procurando peixe..."
  btn.style.padding = "20px"
  btn.style.background = "#e74c3c"
  btn.style.color = "#fff"
  btn.style.borderRadius = "10px"
  btn.style.cursor = "pointer"

  let catched = false
  let timeout = setTimeout(() => {
    btn.innerText = "PESCAR AGORA!!"
    btn.style.background = "#2ecc71"
    catched = true
  }, Math.random() * 2000 + 1000)

  btn.onclick = () => {
    if (catched) winMinigame(x, y, charArray)
    else {
      clearTimeout(timeout)
      reduceHP()
      closeMinigame()
    }
  }
  content.appendChild(btn)
}

function playMemory(x, y, charArray) {
  document.getElementById('mg-title').innerText = "Jogo da Memória"
  document.getElementById('mg-desc').innerText = "Ache os pares!"
  const content = document.getElementById('mg-content')

  let cards = ['🐿️', '🐿️', '🦝', '🦝', '🦌', '🦌']
  cards.sort(() => Math.random() - 0.5)

  let firstCard = null
  let canClick = true // Trava para evitar bugs de cliques rápidos
  let pairs = 0
  let errors = 0

  cards.forEach(emoji => {
    const card = document.createElement('div')
    card.className = 'mg-card'
    card.innerText = '❓'
    card.style.background = '#8b8b8b'
    card.style.borderRadius = '5px'
    card.style.userSelect = 'none'
    card.onclick = () => {
      if (!canClick || card.innerText !== '❓' || firstCard === card) return
      card.innerText = emoji
      card.style.background = '#b9b9b9'

      if (!firstCard) {
        firstCard = card
      } else {
        if (firstCard.innerText === emoji) {
          pairs++
          firstCard = null
          if (pairs === 3) setTimeout(() => winMinigame(x, y, charArray), 500)
        } else {
          canClick = false
          let prev = firstCard
          firstCard = null
          setTimeout(() => {
            card.innerText = '❓'
            prev.innerText = '❓'
            canClick = true
          }, 700)
          errors++
          if (errors >= 2) {
            setTimeout(() => {
              reduceHP()
            }, 500)
          }
        }
      }
    }
    content.appendChild(card)
  })
}

function playDnD(x, y, charArray) {
  document.getElementById('mg-title').innerText = "Colheita de Pinhão"
  document.getElementById('mg-desc').innerText = "Clique no pinhão e depois no cesto!"
  const content = document.getElementById('mg-content')
  const p = document.createElement('div')
  const c = document.createElement('div')
  p.innerText = "🌰"
  p.style.fontSize = "50px"
  p.style.cursor = "pointer"
  c.innerText = "🧺"
  c.style.fontSize = "50px"
  c.style.cursor = "pointer"

  let selected = false
  p.onclick = () => { 
    selected = true
    p.style.transform = "scale(1.2)"
    p.style.opacity = "0.5"
  }
  c.onclick = () => {
    if (selected) winMinigame(x, y, charArray)
    else {
      reduceHP()
      closeMinigame()
    }
  }
  content.append(p, c)
}

function playCatch(x, y, charArray) {
    document.getElementById('mg-title').innerText = "Pega o Graxaim!"
    document.getElementById('mg-desc').innerText = "Clique nele antes do tempo acabar!"
    
    const content = document.getElementById('mg-content')
    const timePanel = document.getElementById('counter')
    const header = document.getElementById('mg-header')
    const heartsBox = document.querySelector('.hearts-box')

    header.insertBefore(timePanel, heartsBox)

    timePanel.style.display = 'block'
    let time = 5
    timePanel.innerText = `Tempo: 0${time}s`

    const animal = document.createElement('div')
    animal.className = 'mg-target'
    animal.innerText = "🦝"
    animal.style.fontSize = "50px"
    animal.style.display = "flex"
    animal.style.alignItems = "center"
    animal.style.justifyContent = "center"

    // Limpa qualquer intervalo antigo antes de começar
    if (activeInterval) clearInterval(activeInterval)

    activeInterval = setInterval(() => {
        time--
        timePanel.innerText = `Tempo: 0${time}s`

        const posX = Math.random() * 200 - 100
        const posY = Math.random() * 80 - 40
        animal.style.transform = `translate(${posX}px, ${posY}px)`

        if (time <= 0) {
            clearInterval(activeInterval)
            activeInterval = null
            timePanel.style.display = 'none'
            reduceHP()
            closeMinigame()
        }
    }, 1000)

    animal.onclick = () => {
        clearInterval(activeInterval)
        activeInterval = null
        animal.innerText = "😵"
        timePanel.style.display = 'none'
        setTimeout(() => winMinigame(x, y, charArray), 300)
    }

    content.appendChild(animal)
}

// ATUALIZE sua função closeMinigame para isso:
function closeMinigame() {
    const container = document.getElementById('minigame-container')
    const timePanel = document.getElementById('counter')

    // Para o cronômetro se ele estiver rodando (evita perder vida após fechar)
    if (activeInterval) {
        clearInterval(activeInterval)
        activeInterval = null
    }

    if (timePanel) timePanel.style.display = 'none'
    if (container) container.style.display = 'none'
    
    pauseGame = false
}

/* FUNÇÕES DOS MENUS (ADICIONADAS) */

document.addEventListener("keydown", (e) => {
    const key = e.key
    const mainMenu = document.getElementById('main-menu')
    const pauseMenu = document.getElementById('pause-menu')
    const gameOverMenu = document.getElementById('game-over')

    // Verifica se a tecla pressionada foi Espaço
    if (key === " " || key === "Spacebar") {
        e.preventDefault() // Impede a página de rolar

        // 1. Se o Menu Principal estiver visível, inicia o jogo
        if (window.getComputedStyle(mainMenu).display !== 'none') {
            startGame()
            return
        }

        // 2. Se o Menu de Game Over estiver visível, recarrega a página
        if (gameOverMenu && window.getComputedStyle(gameOverMenu).display === 'flex') {
            restartGame()
            return
        }

        // 3. Alternar entre Pausa e Play durante o jogo
        // Se o minijogo estiver aberto, ignoramos o espaço para não bugar
        const mgContainer = document.getElementById('minigame-container')
        if (mgContainer && mgContainer.style.display === 'flex') return

        if (!pauseGame) {
            pause()
        } else if (window.getComputedStyle(pauseMenu).display !== 'none') {
            play()
        }
    }
    
    // Atalho extra: Tecla ESC para pausar/despausar
    if (key === "Escape") {
        if (!pauseGame) pause()
        else if (pauseMenu.style.display === 'flex') play()
    }
})

function startGame() {
  document.getElementById('main-menu').style.display = 'none'
  document.getElementById('player').style.display = 'block'
  pauseGame = false
  renderMap()
}

function pause() {
  const pauseMenu = document.getElementById('pause-menu')
  pauseMenu.style.display = 'flex'
  pauseGame = true
}

function play() {
  const pauseMenu = document.getElementById('pause-menu')
  pauseMenu.style.display = 'none'
  pauseGame = false
}

function restartGame() {
  location.reload()
}

function backToIndex() {
  window.location.href = 'index.html'
}

window.addEventListener('resize', () => {
    updateCamera(true)
})

window.onload = () => {
    UIManager.init()
    setupMobileButtons()
    renderMap()
}
