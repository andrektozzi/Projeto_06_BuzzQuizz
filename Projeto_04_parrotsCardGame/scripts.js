let numeroCartas = 0;
while ((numeroCartas % 2 !== 0) || (numeroCartas < 4) || (numeroCartas > 14)) {
    numeroCartas = prompt("Com quantas cartas você quer jogar? \nEscolha um nº par entre 4 e 14");
}

let rodada = 0;
let contadorRodadas = 0;
let jogadas = 0;
let checarCartas = [];
let checarIndices = [];
const conteudoCartas = ["fiestaparrot", "metalparrot", "unicornparrot", "explodyparrot", "bobrossparrot", "revertitparrot", "tripletsparrot"];
const baralho = [];

function formarBaralho() {
    for (let contador = 0; contador < (numeroCartas) / 2; contador++) {
        baralho.push(conteudoCartas[contador]);
        baralho.push(conteudoCartas[contador]);
    }
}

formarBaralho();

baralho.sort(embaralhar);

function embaralhar() {
    return Math.random() - 0.5;
}

function addCartas() {
    const elemento = document.querySelector(".tabuleiro");
    for (let contador = 0; contador < (numeroCartas) / 2; contador++) {
        let carta1 = "images/" + baralho[(2 * contador)] + ".gif";
        let carta2 = "images/" + baralho[(2 * contador) + 1] + ".gif";
        
        elemento.innerHTML +=
            `<div class="seletor">
            <div class="carta" onclick="virar(${2 * contador})">
                <div class="front-face carta${2 * contador} face"><img src="images/front 1.png"></div>
                <div class="back-face carta${2 * contador} face"><img src=${carta1}></div>
            </div>
            <div class="carta" onclick="virar(${2 * contador + 1})">
                <div class="front-face carta${2 * contador + 1} face"><img src="images/front 1.png"></div>
                <div class="back-face carta${2 * contador + 1} face"><img src=${carta2}></div>
            </div>
        </div>`;
    }
}

function virar(numero) {
    const frente = document.querySelector(".front-face.carta" + numero);
    const tras = document.querySelector(".back-face.carta" + numero);
    const possuiClasse = frente.classList.contains("virar");
    if (possuiClasse == false) {
        frente.classList.add("virar");
        tras.classList.add("desvirar");
        rodada++;
        jogadas++;
        checagem(numero);
    }
}

function desvirar() {

    const frentenovo = document.querySelector(".back-face.carta" + parametros[0]);
    frentenovo.classList.add("virar");
    const trasnovo = document.querySelector(".front-face.carta" + parametros[0]);
    trasnovo.classList.add("desvirar");

    const frente = document.querySelector(".front-face.carta" + parametros[0]);
    frente.classList.remove("desvirar");
    frente.classList.remove("virar");
    const tras = document.querySelector(".back-face.carta" + parametros[0]);
    tras.classList.remove("virar");
    tras.classList.remove("desvirar");

    const frentenovo2 = document.querySelector(".back-face.carta" + parametros[1]);
    frentenovo2.classList.add("virar");
    const trasnovo2 = document.querySelector(".front-face.carta" + parametros[1]);
    trasnovo2.classList.add("desvirar");

    const frente2 = document.querySelector(".front-face.carta" + parametros[1]);
    frente2.classList.remove("virar");
    frente2.classList.remove("desvirar");
    const tras2 = document.querySelector(".back-face.carta" + parametros[1]);
    tras2.classList.remove("desvirar");
    tras2.classList.remove("virar");

}

let parametros = [];

function checagem(numero) {
    checarIndices.push(numero);
    checarCartas.push(baralho[numero]);
    if (rodada == 2) {
        if (checarCartas[0] == checarCartas[1]) {
            contadorRodadas++;
        }
        else {
            parametros[0] = checarIndices[0];
            parametros[1] = checarIndices[1];
            setTimeout(desvirar, 1000);
            setTimeout(desvirar, 1000);
        }
        checarCartas = [];
        checarIndices = [];
        rodada = 0;
    }

    if (contadorRodadas == (numeroCartas / 2)) {
        setTimeout(finalizar, 1000);
    }
}

function finalizar() {
    let mensagem = "Você ganhou em " + jogadas + " jogadas e um total de " + segundos + " segundos!";
    alert(mensagem);
    clearInterval(relogio);
    FIM = true;
}

addCartas();

let FIM = false;
let segundos = 1;
const relogio = setInterval(temporizador, 1000);

function temporizador() {
    if (FIM == false) {
        const elemento = document.querySelector(".relogio");
        elemento.innerHTML = segundos;
        segundos++;
    }
}