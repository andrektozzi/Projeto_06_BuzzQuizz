if (localStorage.getItem("IDsLocal") == null) {
    localStorage.setItem("IDsLocal", "[]")
}
pegarQuizzes ();

function pegarQuizzes () {
    let promisse = axios.get("https://mock-api.driven.com.br/api/v6/buzzquizz/quizzes");
    promisse.then(listarQuizzes)
}



function listarQuizzes (quizzes) {
    const listaQuizzes = document.querySelector(".lista-todos-os-quizzes ul");
    const listaSeusQuizzes = document.querySelector(".lista-seus-quizzes ul");

    let IDsCriadosString = localStorage.getItem("IDsLocal")
    window.IDsCriados = JSON.parse(IDsCriadosString)

    for (let i = 0; i < quizzes.data.length; i++) {
        if (IDsCriados.includes(quizzes.data[i].id)) {
            document.querySelector(".lista-seus-quizzes").classList.remove("escondido")
            document.querySelector(".lista-vazia-quizz").classList.add("escondido")
            listaSeusQuizzes.innerHTML += `<li id="${quizzes.data[i].id}" class="quizz-listado" onclick="iniciarQuizz(this)"><img src="${quizzes.data[i].image}" alt="" > <span>${quizzes.data[i].title}</span></li>`
        } else {
            listaQuizzes.innerHTML += `<li id="${quizzes.data[i].id}" class="quizz-listado" onclick="iniciarQuizz(this)"><img src="${quizzes.data[i].image}" alt="" > <span>${quizzes.data[i].title}</span></li>`
        }
    }
    
}

function randomizer() { 
    return Math.random() - 0.5; 
}
function iniciarQuizzBotao (botao) {
    iniciarQuizz(botao.parentElement.children[1])
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

function isImage(url) {
    return /\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(url);
}

function criarQuizz() {
    window.scrollTo(0, 0)
    document.querySelector(".novo-quizz").innerHTML = `<h1 class="etapa">Comece pelo começo</h1><section class="criar-quizz basicas"><input type="text" class="basicas-titulo" placeholder="Título do seu quizz"><input type="text" class="basicas-imagem" placeholder="URL da imagem do seu quizz"><input type="text" class="basicas-perguntas" placeholder="Quantidade de perguntas do quizz"><input type="text" class="basicas-niveis" placeholder="Quantidade de níveis do quizz"></section><button class="botao-etapa" onclick="iniciarEtapa2()">Prosseguir pra criar perguntas</button>`
    document.querySelector(".novo-quizz-perguntas").innerHTML = `<h1 class="etapa">Crie suas perguntas</h1>`
    document.querySelector(".novo-quizz-niveis").innerHTML = `<h1 class="etapa">Agora, decida os níveis</h1>`
    document.querySelector(".novo-quizz-pronto").innerHTML = `<h1 class="etapa">Seu quizz está pronto!</h1>`
    document.querySelector(".novo-quizz").classList.remove("escondido")
    document.querySelector(".lista-quizz").classList.add("escondido")

}

function abrirSectionPerguntas (selecionado) {
    
    selecionado.parentElement.classList.remove("fechado")
    selecionado.parentElement.innerHTML = `<h2>Pergunta ${selecionado.parentElement.id}</h2><input type="text" class="pergunta${selecionado.parentElement.id}-titulo" placeholder="Texto da pergunta"><input type="text" class="pergunta${selecionado.parentElement.id}-cor" placeholder="Cor de fundo da pergunta"><h2>Resposta correta</h2><input type="text" class="pergunta${selecionado.parentElement.id}-resposta-correta criarResposta correta" placeholder="Resposta correta"><input type="text" class="pergunta${selecionado.parentElement.id}-resposta-correta-imagem" placeholder="URL da imagem"><h2>Respostas incorretas</h2><input type="text" class="pergunta${selecionado.parentElement.id}-resposta-incorreta1 criarResposta" placeholder="Resposta incorreta 1"><input type="text" class="pergunta${selecionado.parentElement.id}-resposta-incorreta1-imagem" placeholder="URL da imagem 1"><input type="text" class="pergunta${selecionado.parentElement.id}-resposta-incorreta2 criarResposta" placeholder="Resposta incorreta 2"><input type="text" class="pergunta${selecionado.parentElement.id}-resposta-incorreta2-imagem" placeholder="URL da imagem 2"><input type="text" class="pergunta${selecionado.parentElement.id}-resposta-incorreta3 criarResposta" placeholder="Resposta incorreta 3"><input type="text" class="pergunta${selecionado.parentElement.id}-resposta-incorreta3-imagem" placeholder="URL da imagem 3"></input>`
}

function iniciarEtapa2 () {
    if (document.querySelector(".basicas-titulo").value.length >= 20 && document.querySelector(".basicas-titulo").value.length <= 65 && isImage(document.querySelector(".basicas-imagem").value) && document.querySelector(".basicas-perguntas").value >= 3 && document.querySelector(".basicas-niveis").value >= 2) {
        window.scrollTo(0, 0)

        for (let i = 0; i < document.querySelector(".basicas-perguntas").value; i++) {
            document.querySelector(".novo-quizz-perguntas").innerHTML += `<section id="${i+1}" class="criar-quizz perguntas pergunta${i + 1} fechado"><h2>Pergunta ${i + 1}</h2><ion-icon name="create-outline" style="font-size:28px" onclick="abrirSectionPerguntas(this)"></ion-icon></section>`
        }
        document.querySelector(".novo-quizz-perguntas").innerHTML += `<button class="botao-etapa" onclick="iniciarEtapa3()">Prosseguir pra criar níveis</button>`

        document.querySelector(".novo-quizz-perguntas").classList.remove("escondido")
        document.querySelector(".novo-quizz").classList.add("escondido")
    } else {
        alert("Preencha os dados corretamente")
    }
}

function abrirSectionNiveis (selecionado) {
    selecionado.parentElement.classList.remove("fechado")
    selecionado.parentElement.innerHTML = `<h2>Nível ${selecionado.parentElement.id}</h2><input type="text" class="nivel${selecionado.parentElement.id}-titulo" placeholder="Título do nível"><input type="text" class="nivel${selecionado.parentElement.id}-acerto" placeholder="% de acerto mínima"><input type="text" class="nivel${selecionado.parentElement.id}-imagem" placeholder="URL da imagem do nível"><input type="text" class="nivel${selecionado.parentElement.id}-descricao" placeholder="Descrição do nível">`
}

function iniciarEtapa3 () {
    function verificarCor (string) {
        if (string.length == 7 && string.charAt(0) == "#") {
            let result = string.match(/[0-9A-Fa-f]{6}/g);
            return (result !== null);
        }
        return false
    }

    for (let i = 0; i < document.querySelectorAll(".perguntas").length; i++) {
        if (!(document.querySelector(`.pergunta${i+1}-titulo`).value.length >= 20 && document.querySelector(`.pergunta${i+1}-resposta-correta`).value !== "" && document.querySelector(`.pergunta${i+1}-resposta-incorreta1`).value !== "" && isImage(document.querySelector(`.pergunta${i+1}-resposta-correta-imagem`).value) && isImage(document.querySelector(`.pergunta${i+1}-resposta-incorreta1-imagem`).value) && ((document.querySelector(`.pergunta${i+1}-resposta-incorreta2`).value == "" && document.querySelector(`.pergunta${i+1}-resposta-incorreta2-imagem`).value == "" && document.querySelector(`.pergunta${i+1}-resposta-incorreta3`).value == "" && document.querySelector(`.pergunta${i+1}-resposta-incorreta3-imagem`).value == "") || (document.querySelector(`.pergunta${i+1}-resposta-incorreta2`).value !== "" && document.querySelector(`.pergunta${i+1}-resposta-incorreta2-imagem`).value !== "" && isImage(document.querySelector(`.pergunta${i+1}-resposta-incorreta2-imagem`).value) && document.querySelector(`.pergunta${i+1}-resposta-incorreta3`).value !== "" && document.querySelector(`.pergunta${i+1}-resposta-incorreta3-imagem`).value !== "" && isImage(document.querySelector(`.pergunta${i+1}-resposta-incorreta3-imagem`).value)) || (document.querySelector(`.pergunta${i+1}-resposta-incorreta2`).value !== "" && document.querySelector(`.pergunta${i+1}-resposta-incorreta2-imagem`).value !== "" && isImage(document.querySelector(`.pergunta${i+1}-resposta-incorreta2-imagem`).value) && document.querySelector(`.pergunta${i+1}-resposta-incorreta3`).value == "" && document.querySelector(`.pergunta${i+1}-resposta-incorreta3-imagem`).value == "")) && verificarCor(document.querySelector(`.pergunta${i+1}-cor`).value))) {
            alert("Preencha os dados corretamente")
            break;
        } else {

        }
        if (i == 0) {
            window.scrollTo(0, 0)

            for (let k = 0; k < document.querySelector(".basicas-niveis").value; k++) {
                document.querySelector(".novo-quizz-niveis").innerHTML += `<section id="${k+1}" class="criar-quizz niveis nivel${k + 1} fechado"><h2>Nível ${k + 1}</h2><ion-icon name="create-outline" style="font-size:28px" onclick="abrirSectionNiveis(this)"></ion-icon></section>`
            }
            document.querySelector(".novo-quizz-niveis").innerHTML += `<button class="botao-etapa" onclick="enviarQuizz()">Finalizar Quizz</button>`

            document.querySelector(".novo-quizz-niveis").classList.remove("escondido")
            document.querySelector(".novo-quizz-perguntas").classList.add("escondido")
        }
    }
}

function verificarNivelMinimo () {
    for (let j = 0; j < document.querySelectorAll(".niveis").length; j++) {
        if (document.querySelector(`.nivel${j+1}-acerto`).value == 0 ) { 
            return true
        }
    }
    return false
}

function checarResposta (resposta) {
    return resposta.classList.contains("correta")

}

function formatarQuizzCriado () {
    let perguntasCriadas = []
    for (let i = 0; i < document.querySelector(".basicas-perguntas").value; i++) {
        let respostasCriadas = []
        if (document.querySelector(`.pergunta${i+1}-resposta-incorreta3`).value != "") {
            respostasCriadas.push({text: document.querySelector(`.pergunta${i+1}-resposta-correta`).value , image: document.querySelector(`.pergunta${i+1}-resposta-correta-imagem`).value, isCorrectAnswer: checarResposta(document.querySelector(`.pergunta${i+1}-resposta-correta`))}, {text: document.querySelector(`.pergunta${i+1}-resposta-incorreta1`).value , image: document.querySelector(`.pergunta${i+1}-resposta-incorreta1-imagem`).value, isCorrectAnswer: checarResposta(document.querySelector(`.pergunta${i+1}-resposta-incorreta1`))}, {text: document.querySelector(`.pergunta${i+1}-resposta-incorreta2`).value , image: document.querySelector(`.pergunta${i+1}-resposta-incorreta2-imagem`).value, isCorrectAnswer: checarResposta(document.querySelector(`.pergunta${i+1}-resposta-incorreta2`))}, {text: document.querySelector(`.pergunta${i+1}-resposta-incorreta3`).value , image: document.querySelector(`.pergunta${i+1}-resposta-incorreta3-imagem`).value, isCorrectAnswer: checarResposta(document.querySelector(`.pergunta${i+1}-resposta-incorreta3`))})
        } 
        else if (document.querySelector(`.pergunta${i+1}-resposta-incorreta2`).value != "" && document.querySelector(`.pergunta${i+1}-resposta-incorreta3`).value == "") {
            respostasCriadas.push({text: document.querySelector(`.pergunta${i+1}-resposta-correta`).value , image: document.querySelector(`.pergunta${i+1}-resposta-correta-imagem`).value, isCorrectAnswer: checarResposta(document.querySelector(`.pergunta${i+1}-resposta-correta`))}, {text: document.querySelector(`.pergunta${i+1}-resposta-incorreta1`).value , image: document.querySelector(`.pergunta${i+1}-resposta-incorreta1-imagem`).value, isCorrectAnswer: checarResposta(document.querySelector(`.pergunta${i+1}-resposta-incorreta1`))}, {text: document.querySelector(`.pergunta${i+1}-resposta-incorreta2`).value , image: document.querySelector(`.pergunta${i+1}-resposta-incorreta2-imagem`).value, isCorrectAnswer: checarResposta(document.querySelector(`.pergunta${i+1}-resposta-incorreta2`))})
        } else if (document.querySelector(`.pergunta${i+1}-resposta-incorreta2`).value == "") {
            respostasCriadas.push({text: document.querySelector(`.pergunta${i+1}-resposta-correta`).value , image: document.querySelector(`.pergunta${i+1}-resposta-correta-imagem`).value, isCorrectAnswer: checarResposta(document.querySelector(`.pergunta${i+1}-resposta-correta`))}, {text: document.querySelector(`.pergunta${i+1}-resposta-incorreta1`).value , image: document.querySelector(`.pergunta${i+1}-resposta-incorreta1-imagem`).value, isCorrectAnswer: checarResposta(document.querySelector(`.pergunta${i+1}-resposta-incorreta1`))})
        }
        perguntasCriadas.push({title: document.querySelector(`.pergunta${i+1}-titulo`).value, color: document.querySelector(`.pergunta${i+1}-cor`).value, answers: respostasCriadas})

    }

    let niveisCriados = []
    for (let k = 0; k < document.querySelector(".basicas-niveis").value; k++) {
        niveisCriados.push({title: document.querySelector(`.nivel${k+1}-titulo`).value, image: document.querySelector(`.nivel${k+1}-imagem`).value, text: document.querySelector(`.nivel${k+1}-descricao`).value, minValue: document.querySelector(`.nivel${k+1}-acerto`).value})
    }

    quizzFormatado = {title: document.querySelector(".basicas-titulo").value, image: document.querySelector(".basicas-imagem").value, questions: perguntasCriadas, levels: niveisCriados}
    return quizzFormatado
}

function enviarQuizz () {

    for (let i = 0; i < document.querySelectorAll(".niveis").length; i++) {
        if (!(document.querySelector(`.nivel${i+1}-titulo`).value.length >= 10 && document.querySelector(`.nivel${i+1}-acerto`).value >= 0 && document.querySelector(`.nivel${i+1}-acerto`).value <= 100 && isImage(document.querySelector(`.nivel${i+1}-imagem`).value) && document.querySelector(`.nivel${i+1}-descricao`).value.length >= 30 && verificarNivelMinimo() )) {
            alert("Preencha os dados corretamente")
            break;
        } else {

        }
        if (i == 0) {

            let requisicao = axios.post("https://mock-api.driven.com.br/api/v6/buzzquizz/quizzes", formatarQuizzCriado())
            requisicao.then(finalizarQuizz)

            function finalizarQuizz (quizzCriado) {
                document.querySelector(".novo-quizz-pronto").innerHTML += `<div id="${quizzCriado.data.id}" class="quizz-finalizado" onclick="iniciarQuizz(this)"><img src="${quizzCriado.data.image}" alt="" > <span>${quizzCriado.data.title}</span></div><button class="botao-etapa" onclick="iniciarQuizzBotao(this)">Acessar Quizz</button><button class="home" onclick="voltarHome()">Voltar pra home</button>`


                let listaIDLocal = localStorage.getItem("IDsLocal")
                let listaIDLocalarray = JSON.parse(listaIDLocal)
                listaIDLocalarray.push(quizzCriado.data.id)
                let listaIDLocalstring = JSON.stringify(listaIDLocalarray)
                localStorage.setItem("IDsLocal", listaIDLocalstring)

            }

            document.querySelector(".novo-quizz-pronto").classList.remove("escondido")
            document.querySelector(".novo-quizz-niveis").classList.add("escondido")
        }

    }
}