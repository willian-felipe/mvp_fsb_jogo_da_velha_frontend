var partidaCorrente = {};
var jogoCorrent = [
  "", "", "",
  "", "", "",
  "", "", ""
];

var turno = "X";

/**
 * Função que defini qual posição foi escolhida
 * @param {number} index 
 */
function definirJogada(index) {
  if (jogoCorrent[index] !== "") {
    alert("Esta posição já foi escolhida!");
  } else {
    jogoCorrent[index] = turno;
    setPosicoes();

    // Chamar a função que verifica se houve vencedor
    put(partidaCorrente.id, jogoCorrent);
    turno = turno == "X" ? "O" : "X";
  }
}

/**
 * Função que exibe em tela os valores do selecionados do jogo
 */
function setPosicoes() {
  for (let i = 0; i < jogoCorrent.length; i++) {
    document.getElementById("td" + i).innerText = jogoCorrent[i];
    document.getElementById("td" + i).style.color = jogoCorrent[i] == "" ? "#000000" : jogoCorrent[i] == "X" ? "#002BFF" : "#0d7701";
  }
}

/**
 * Função que atualiza os nomes + pontuação dos jogadores
 */
function setJogadores() {
  document.getElementById("jogoNomeX").innerHTML = "<b>" + partidaCorrente.nomeX + "</b><br>" + partidaCorrente.pontosX;
  document.getElementById("jogoNomeO").innerHTML = "<b>" + partidaCorrente.nomeO + "</b><br>" + partidaCorrente.pontosO;
  document.getElementById("jogoVelha").innerHTML = "<b>Velha</b><br>" + partidaCorrente.velha;
}

/**
 * Função que verifica se houve vencedor com base no resultado obtido no backend
 * @param {object} data 
 */
function resultado(data) {
  setJogadores();

  if (data.finalizado) {
    let msgConfir = "O vencedor foi o jogador de: " + data.vencedor + ".";
    if (data.vencedor === "VELHA") {
      for (let i = 0; i < jogoCorrent.length; i++) {
        document.getElementById("td" + i).innerText = jogoCorrent[i];
        document.getElementById("td" + i).style.backgroundColor = "#ED9292";
      }

      msgConfir = "O vencedor foi a : " + data.vencedor + "."
    }

    setTimeout(function () {
      if (confirm(msgConfir + "\n\nDeseja iniciar uma 'NOVA PARTIDA'?")) {
        resetMatch();
      }
    }, 250);
  }
}

/**
 * Reinicializa uma Partida
 */
function resetMatch() {
  jogoCorrent = [
    "", "", "",
    "", "", "",
    "", "", ""
  ];

  turno = "X";
  setPosicoes();

  for (let i = 0; i < jogoCorrent.length; i++) {
    document.getElementById("td" + i).innerText = jogoCorrent[i];
    document.getElementById("td" + i).style.backgroundColor = "";
  }
}


/**
 * Função de controle visual para Criação do Jogo
 */
const criaJogo = () => {
  var containerHistoric = document.getElementById('containerHistoric');
  containerHistoric.style.display = "none";

  var containerJogo = document.getElementById('containerJogo');
  containerJogo.style.display = "block";
}

/**
 * Função de controle visual para retorno ao estágio inicial contendo o histórico de disputas
 */
const resetJogo = () => {
  var containerHistoric = document.getElementById('containerHistoric');
  containerHistoric.style.display = "block";

  var containerJogo = document.getElementById('containerJogo');
  containerJogo.style.display = "none";

  getList();
}

/**
 * Função de "Iniciar Disputa"
 */
const start = async () => {
  let nomeX = document.getElementById("nomeX").value;
  let nomeO = document.getElementById("nomeO").value;

  if (nomeX === '') {
    alert("Defina o nome do Jogador X!");
  } else if (nomeO === '') {
    alert("Defina o nome do Jogador O!");
  } else {
    post(nomeX, nomeO)
      .then(() => {
        criaJogo();
        alert("Disputa iniciada!");
      });
  }
}

/**
 * Função de Início
 */
const init = () => {
  resetJogo();
}

init();

/**
 * Inclusão do ícone + ação para exclusão da disputa
 * @param {object} parent 
 */
const includeBtnTrash = (parent) => {
  let img = document.createElement("img");
  img.src = "https://cdn-icons-png.flaticon.com/512/126/126468.png";
  img.style.width = "15px";
  img.style.height = "15px";
  img.className = "trash";

  parent.appendChild(img);
}

/**
 * Inclusão do botão para continuar a disputa
 * @param {object} parent 
 */
const includeBtnContinue = (parent) => {
  let span = document.createElement("span");
  let txt = document.createTextNode("Clique aqui!");
  span.className = "retomar";
  span.appendChild(txt);

  parent.appendChild(span);
}

/**
 * Função de exclusão da disputa
 */
const removeElement = () => {
  let trash = document.getElementsByClassName("trash");

  for (let i = 0; i < trash.length; i++) {
    trash[i].onclick = function () {
      let div = this.parentElement.parentElement;

      const jogX = div.getElementsByTagName('td')[0].innerHTML;
      const jogO = div.getElementsByTagName('td')[2].innerHTML;

      if (confirm("Você tem certeza que deseja excluir o histórico entre " + jogX + " vs " + jogO + "?")) {
        for (let i = 0; i < dataHistoric.length; i++) {
          if (jogX == dataHistoric[i].nomeX && jogO == dataHistoric[i].nomeO) {
            div.remove();
            deleteItem(dataHistoric[i].id);
            alert("A disputa entre " + jogX + " vs " + jogO + " foi excluída!");
            break;
          }
        }
      }
    }
  }
}

/**
 * Função para continuar a Disputa em outro momento
 */
const continuarDisputa = () => {
  let contPartida = document.getElementsByClassName("retomar");

  for (let i = 0; i < contPartida.length; i++) {
    contPartida[i].onclick = function () {
      let div = this.parentElement.parentElement;

      const jogX = div.getElementsByTagName('td')[0].innerHTML;
      const jogO = div.getElementsByTagName('td')[2].innerHTML;

      if (confirm("Deseja retomar a disputa entre " + jogX + " vs " + jogO + "?")) {
        for (let i = 0; i < dataHistoric.length; i++) {
          if (jogX == dataHistoric[i].nomeX && jogO == dataHistoric[i].nomeO) {
            partidaCorrente = dataHistoric[i];

            setJogadores();
            resetMatch();
            criaJogo();
            break;
          }
        }
      }
    }
  }
}

/**
 * Reinicializa a tabela de disputas
 */
const resetTable = () => {
  var table = document.getElementById('tblHistoric');
  const rows = Array.from(table.rows);

  // Para não deletar o título, o for irá parar de deletar no indice 0
  for (let i = (rows.length - 1); i > 0; i--) {
    table.deleteRow(i);
  }
}

/**
 * Função de inclusão dos itens na tabela
 * @param {object} item 
 */
const insertList = (item) => {
  var table = document.getElementById('tblHistoric');

  var itemRow = [item.nomeX, item.pontosX, item.nomeO, item.pontosO, item.velha];

  var row = table.insertRow();

  for (var i = 0; i < itemRow.length; i++) {
    var cel = row.insertCell(i);
    cel.textContent = itemRow[i];
  }
  includeBtnContinue(row.insertCell(-1));
  includeBtnTrash(row.insertCell(-1));

  document.getElementById("nomeX").value = "";
  document.getElementById("nomeO").value = "";

  continuarDisputa();
  removeElement();

}

/**
 * Ação do botão "Nova Partida"
 */
const btnNewMatch = async () => {
  resetMatch();
}

/**
 * Ação do botão "Finalizar Disputa"
 */
const btnFinish = async () => {
  resetJogo();
  alert("Disputa Finalizada!");
}