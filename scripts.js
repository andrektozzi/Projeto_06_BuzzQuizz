pegarQuizzes ();

function pegarQuizzes () {
    let promisse = axios.get("https://mock-api.driven.com.br/api/v6/buzzquizz/quizzes");
    promisse.then(listarQuizzes)
}

function listarQuizzes (quizzes) {
    const listaQuizzes = document.querySelector(".lista-todos-os-quizzes ul");
    for (let i = 0; i < quizzes.data.length; i++) {
        listaQuizzes.innerHTML += `<li id="${quizzes.data[i].id}" class="quizz-listado" onclick="iniciarQuizz(this)"><img src="${quizzes.data[i].image}" alt="" > <span>${quizzes.data[i].title}</span></li>`
    }
    
}

function randomizer() { 
    return Math.random() - 0.5; 
}

function iniciarQuizz (quizz) {
    let promisse = axios.get(`https://mock-api.driven.com.br/api/v6/buzzquizz/quizzes/${quizz.id}`);
    promisse.then(resposta => {
        window.scrollTo(0, 0)
        let quizzSelecionado = resposta.data
        document.querySelector(".banner-image").src = quizzSelecionado.image
        document.querySelector(".titulo-quizz").innerHTML = quizzSelecionado.title
        document.querySelector(".titulo-quizz").id = resposta.data.id
                

        for (let i = 0; i < quizzSelecionado.questions.length; i++) {
            document.querySelector(".questoes-quizz").innerHTML += `<li class="pergunta"><header class="titulo-pergunta" style="background-color:${quizzSelecionado.questions[i].color}"><span>${quizzSelecionado.questions[i].title}</span></header><ul class="respostas"></ul></li>`

                    
            window.listaRespostas = []
            for (let j = 0; j < quizzSelecionado.questions[i].answers.length; j++) {
                listaRespostas.push(`<li id="${quizzSelecionado.questions[i].answers[j].isCorrectAnswer}" class="resposta"><div class="imagem-resposta" onclick="selecionarResposta(this)" ><img src="${quizzSelecionado.questions[i].answers[j].image}" alt=""></div><span>${quizzSelecionado.questions[i].answers[j].text}</span></li>`)
            }
            window.respostasRandomizadas = listaRespostas.sort(randomizer)
            console.log(respostasRandomizadas)
            for (let k = 0; k < respostasRandomizadas.length; k++) {
                document.querySelector(".questoes-quizz").children[i].children[1].innerHTML += respostasRandomizadas[k]
            }

        }

        document.querySelector(".pagina-quizz").classList.remove("escondido")
        document.querySelector(".lista-quizz").classList.add("escondido")
    })
}


function selecionarResposta (selecionada) {
    if (!(selecionada.parentElement.parentElement.innerHTML.includes("selecionada"))) {
        selecionada.parentElement.classList.add("selecionada")
        
        for (let i = 0; i < selecionada.parentElement.parentElement.children.length; i++) {
            if (!(selecionada.parentElement.parentElement.children[i].id === "true")) {
                selecionada.parentElement.parentElement.children[i].classList.add("vermelho")
            } else {
                selecionada.parentElement.parentElement.children[i].classList.add("verde")
            }
            
        }

        for (let i = 0; i < selecionada.parentElement.parentElement.children.length; i++) {
            if (!(selecionada.parentElement.parentElement.children[i] === selecionada.parentElement)) {
                selecionada.parentElement.parentElement.children[i].classList.add("opaco")
            } 
        }

        if (document.querySelectorAll(".selecionada").length === document.querySelectorAll(".pergunta").length) {
            let promisse = axios.get(`https://mock-api.driven.com.br/api/v6/buzzquizz/quizzes/${document.querySelector(".titulo-quizz").id}`);
            promisse.then(mostrarResultado)

            function mostrarResultado (quizz) {
                let valorResultado = Math.round(document.querySelectorAll(".selecionada.verde").length / document.querySelectorAll(".pergunta").length * 100)
                let listaNiveis = quizz.data.levels.sort( (a, b) => b.minValue - a.minValue);
                for (let j = 0; j < listaNiveis.length; j++) {
                    if (valorResultado >= listaNiveis[j].minValue) {
                        document.querySelector(".questoes-quizz").innerHTML += `<li class="resultado-quizz"><header>${valorResultado}% de acerto: ${listaNiveis[j].title}</header><div class="resultados"><img src="${listaNiveis[j].image}" alt=""><span>${listaNiveis[j].text}</span></div></l1>`
                        break;
                    }
                }
            }
        }
        
        for (let i = 0; i < document.querySelector(".questoes-quizz").children.length; i++) {
            if (document.querySelector(".questoes-quizz").children[i].innerHTML == selecionada.parentElement.parentElement.parentElement.innerHTML){
                function proximaPergunta () {
                    document.querySelector(".questoes-quizz").children[i + 1].scrollIntoView({behavior: "smooth"})
                }
                setTimeout(proximaPergunta, 2000)
            }

        }

    }
    
}


function reiniciarQuizz () {
    document.querySelectorAll(".resposta").forEach(element => {
        element.classList.remove("selecionada")
        element.classList.remove("verde")
        element.classList.remove("vermelho")
        element.classList.remove("opaco")
    })
    if (document.querySelector(".questoes-quizz").children.length > document.querySelectorAll(".pergunta").length) {
        document.querySelector(".questoes-quizz").lastChild.remove()
    }
    window.scrollTo(0, 0)
}

function voltarHome () {
    window.location.reload()
}
