let [vitorias, perdas, desistencias] = [0, 0, 0]
let jogoRodando, resposta, respostaUnderline, respostasErradas
let contadorVidas = 0

const vidas = document.getElementById('hearts')

const tituloJogo = document.querySelector('h1')
const palavras = [
  'ALURA',
  'ORACLE',
  'CHALLENGE',
  'FORCA',
  'HTML',
  'CSS',
  'JAVASCRIPT'
]

const inicioJogo = new Audio('./songs/a-caminho-da-forca-inicio-short.wav')
const hanging = new Audio('./songs/enforcado.wav')
const hanging2 = new Audio('./songs/enforcado2.wav')
const somJogando = new Audio('./songs/jogo-rodando.wav')
const acertou = new Audio('./songs/acertou.wav')
const errou = new Audio('./songs/errou.wav')
const somFundo = new Audio('./songs/inicio-jogo.mp3')
const gameOver = new Audio('./songs/enforcado.wav')
const gameOverVoice = new Audio('./songs/game-over-voice.wav')
const vitoria = new Audio('./songs/vitoria.mp3')

hideAll('#contador span')
hideAll('#hearts')
hideAll('#forca')
entradaJogo()

function entradaJogo() {
  inicioJogo.play()
  inicioJogo.loop = false
  // break
  // somFundo.play()
}

document.querySelector('#novo-jogo').addEventListener('click', novoJogo)

function novoJogo() {
  if (jogoRodando)
    // Caso o último jogo não tenha terminado antes do click de "Novo Jogo"
    desistir()

  jogoRodando = true //Jogo inicia
  inicioJogo.pause() // Pausa som de entrada
  somJogando.play()
  somJogando.loop = true
  hanging2.pause() // Pausa o som da forca ao clicar em nova partida
  tituloJogo.innerText = 'Jogo da Forca'
  tituloJogo.setAttribute('status', 'normal') //Sem cor
  unhideAll('#hearts')
  resposta = novaPalavraAleatoria()

  // mostra a resposta no console
  console.log(
    'Hey Você esta trapaceando! ' +
      'Feche o console!!! A resposta é "' +
      resposta +
      '"'
  )

  limpaTeclado()
  respostasErradas = 0
  respostaUnderline = [] //respostaUnderline é a mistura com letras sublinhadas

  for (var i of resposta) respostaUnderline.push('_')
  atualizarExibirPalavra() // Exibe as letras com traços em baixo
  desenhaForca() //Desenha Forca
}

function novaPalavraAleatoria() {
  return palavras[Math.floor(Math.random() * palavras.length)]
}

function confereChave() {
  // onclick event
  var letraChave = this.innerText.toUpperCase()

  // Quando a letra esta igual
  if (resposta.toUpperCase().includes(letraChave)) {
    //atualiza a palavra exibida

    for (var i in respostaUnderline) {
      if (resposta[i] == letraChave) respostaUnderline[i] = resposta[i]
    }

    atualizarExibirPalavra()

    if (respostaUnderline.includes('_') == false)
      // Venceu
      escapou()

    this.classList.toggle('letra-correta', true) // Mude a cor e desabilite o click do mouse
    this.removeEventListener('click', confereChave)
    acertou.play()
  } else {
    // Quando erra a letra
    this.classList.toggle('letra-incorreta', true) // Mude a cor e desabilite o click do mouse
    this.removeEventListener('click', confereChave)
    respostasErradas++
    desenhaForca()
  }
}

function atualizarExibirPalavra() {
  var display = ''
  for (var i of respostaUnderline) display += i + ' '
  display.slice(0, -1)
  document.querySelector('#palavra-chave').textContent = display
}

function desistir() {
  desistencias++ //adiciona + 1 ao contador desistencias
  contadorVidas++
  perdeVidas(contadorVidas)
  document.querySelector('#desistencias').innerText = desistencias
  unhideAll('.desistencias')
}

function desenhaForca() {
  //draw the hangman
  switch (respostasErradas) {
    case 0:
      hideAll('svg *')
      // hideAll('svg path *')
      break
    case 1:
      // unhideAll('.forca')
      unhideAll('.forca')
      errou.play()
      break
    case 2:
      unhideAll('.cabeca')
      errou.play()
      break
    case 3:
      unhideAll('.corpo')
      errou.play()
      break
    case 4:
      unhideAll('.braco-esq')
      errou.play()
      break
    case 5:
      unhideAll('.braco-dir')
      errou.play()
      break
    case 6:
      unhideAll('.perna-esq')
      errou.play()
      break
    case 7:
      unhideAll('.perna-dir')
      hanging2.pause()
      enforcado()
      break
    default:
      novoJogo()
  }
}
// Perdeu  a partida
function enforcado() {
  jogoRodando = false
  setTimeout(() => {
    tituloJogo.innerText = 'Você foi enforcado!'
    tituloJogo.setAttribute('status', 'enforcado')
  }, 200)

  hanging2.play()
  perdas++
  contadorVidas++
  perdeVidas(contadorVidas)
  removeAllListeners()
  unhideAll('.perdas')
  document.querySelector('#perdas').innerText = perdas
  // Mostra a resposta certa
  var display = ''
  for (var i of resposta) display += i + ' '
  display.slice(0, -1)
  document.querySelector('#palavra-chave').textContent = display
}
// Venceu a Partida
function escapou() {
  jogoRodando = false
  tituloJogo.innerText = 'Você escapou!!'
  tituloJogo.setAttribute('status', 'escapou')
  playSound('success')
  vitorias++
  removeAllListeners()
  unhideAll('.vitorias')
  document.querySelector('#vitorias').innerText = vitorias

  if (vitorias === 6) {
    tituloJogo.innerText = 'VOCÊ VENCEU!!!'
    tituloJogo.setAttribute('status', 'escapou')
    vitoria.play()
  }
}

function removeAllListeners() {
  //impede o usuário de continuar clicando após o jogo terminar
  for (let i of document.querySelectorAll('#teclado a')) {
    i.removeEventListener('click', confereChave)
    i.classList.toggle('finalizou', true)
  }
}

function limpaTeclado() {
  for (var i of document.querySelectorAll('#teclado div')) //limpa o teclado
    i.innerText = ''
  preencherLinhas(1, 'QWERTYUIOP')
  preencherLinhas(2, 'ASDFGHJKL')
  preencherLinhas(3, 'ZXCVBNM')
}

function preencherLinhas(linhaNum, linhaLetras) {
  //desenha o teclado e anexa os listeners
  for (let i of linhaLetras) {
    let tecla = document.createElement('a')
    tecla.id = i.toUpperCase()
    tecla.append(i)
    tecla.addEventListener('click', confereChave)
    document.querySelector('#teclado--linha' + linhaNum).append(tecla)
  }
  for (let i = 0; i < 6; i++) {
    vidas.children[i].src = 'img/heart.png'
  }
}

function hideAll(elemento) {
  for (let i of document.querySelectorAll(elemento))
    i.classList.toggle('esconder', true)
}
function unhide(elemento) {
  document.querySelector(elemento).classList.toggle('esconder', false)
}
function unhideAll(elemento) {
  for (let i of document.querySelectorAll(elemento))
    i.classList.toggle('esconder', false)
}

function playSound(status) {
  if (status === 'success') {
    const audio = new Audio(`./songs/success.mp3`)
    audio.play()
  } else {
    const audio = new Audio(`./songs/error.wav`)
    audio.play()
  }
}

function perdeVidas(pontos) {
   const lifes = document
     .querySelector('#hearts')
     .querySelectorAll('img:not(.esconder)')

   lifes[0].classList.add('esconder')
   playSound('error')

   if (lifes.length === 1) {
     setTimeout(() => {
       fimDeJogo()
     }, 200)
   }

//    switch (pontos) {
//     case 1:
//        hideAll('#heart6')
//        playSound('error')
//        break
//      case 2:
//        hideAll('#heart5')
//        playSound('error')
//        break
//      case 3:
//      hideAll('#heart4')
//      playSound('error')
//        break
//      case 4:
//       hideAll('#heart3')
//       playSound('error')
//       break
//     case 5:
//       hideAll('#heart2')
//      playSound('error')
//      break
//      case 6:
//       hideAll('#heart1')
//       playSound('error')

//       setTimeout(() => {
//         fimDeJogo()
//       }, 200)
//        break
//    }
}

function fimDeJogo() {
  hanging2.pause()
  somJogando.pause()
  gameOverVoice.play()
  tituloJogo.innerText = 'GAME OVER'
  tituloJogo.setAttribute('status', 'enforcado')

  removeAllListeners()

  setTimeout(() => {
    gameOverVoice.pause()
    gameOver.play()
    setTimeout(() => {
      location.reload()
    }, 21000)
  }, 3020)
}
