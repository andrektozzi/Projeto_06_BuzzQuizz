function comecarJogo () {
    let qtdCartas = parseInt(prompt("Com quantas cartas você quer jogar? \n Escolha um nº entre 4 e 14"));
    while ((qtdCartas % 2 !==0) || (qtdCartas < 4) || (qtdCartas > 14)){
        qtdCartas = parseInt(prompt("Você precisa escolher um nº par entre 4 e 14. \n Com quantas cartas você quer jogar?"));
    }
}
comecarJogo();