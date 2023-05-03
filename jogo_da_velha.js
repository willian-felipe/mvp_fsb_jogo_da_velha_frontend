var partidaCorrente = {};
var jogoCorrent = [
  "", "", "",
  "", "", "",
  "", "", ""
];

var turno = "X";

function definirJogada(index) {
  console.log("Teste", partidaCorrente);

  if (jogoCorrent[index] !== "") {
    alert("Está posição já foi escolhida!");
  } else {
    jogoCorrent[index] = turno;
    setPosicoes();
    

    // Chamar a função que verifica se houve vencedor
    put(partidaCorrente.id, jogoCorrent);
    turno = turno == "X" ? "O" : "X";
  }
}

function setPosicoes() {
  for (let i = 0; i < jogoCorrent.length; i++) {
    document.getElementById("td" + i).innerText = jogoCorrent[i];
    document.getElementById("td" + i).style.color = jogoCorrent[i] == "" ? "#000000" : jogoCorrent[i] == "X" ? "#002BFF" : "#0d7701";
  }
}

function setJogadores() {
  document.getElementById("jogoNomeX").innerHTML = "<b>" + partidaCorrente.nomeX + "</b><br>" + partidaCorrente.pontosX;
  document.getElementById("jogoNomeO").innerHTML = "<b>" + partidaCorrente.nomeO + "</b><br>" + partidaCorrente.pontosO;
  document.getElementById("jogoVelha").innerHTML = "<b>Velha</b><br>" + partidaCorrente.velha;
}

function resultado(data) {
  setJogadores();

  if (data.finalizado) {
    let msgConfir = "O vencedor foi o jogador de: " + data.vencedor + ".";
    if(data.vencedor === "VELHA") {
      for (let i = 0; i < jogoCorrent.length; i++) {
        document.getElementById("td" + i).innerText = jogoCorrent[i];
        document.getElementById("td" + i).style.backgroundColor = "#ED9292";
      }

      msgConfir = "O vencedor foi a : " + data.vencedor + "."
    }

    setTimeout(function() {
      if (confirm(msgConfir + "\n\nDeseja iniciar uma 'NOVA PARTIDA'?")) {
        resetMatch();
      }
    }, 250);
  }
}

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
    document.getElementById("td" + i).style.backgroundColor = "transparent";
  }
}

const put = async (disputa_id, jogo) => {
  const formData = new FormData();
  formData.append('disputa_id', disputa_id);

  for (let i = 0; i < jogo.length; i++) {
    formData.append('jogo', jogo[i]);
  }

  let url = endpoint + 'disputa/checaresultado';
  fetch(url, {
      method: 'put',
      body: formData
    })
    .then((response) => response.json())
    .then((data) => {
      partidaCorrente = data.partida;
      resultado(data);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}