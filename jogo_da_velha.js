var partidaCorrente = {};
var jogoCorrent = [
  "", "", "", 
  "", "", "", 
  "", "", ""
];

var turno = "X";

function definirJogada(index) {
  console.log("Teste", partidaCorrente);
  jogoCorrent[index] = turno;

  for(let i = 0; i < jogoCorrent.length; i++){
    document.getElementById("td" + i).innerText = jogoCorrent[i] ?? "";
  }

  // Chamar a função que verifica se houve vencedor
  put(partidaCorrente.id, jogoCorrent);
  turno = turno == "X" ? "O" : "X";
}