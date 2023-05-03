const endpoint = "http://127.0.0.1:5500/";
var dataHistoric = [];

/*
  --------------------------------------------------------------------------------------
  Função para criar um botão close para cada item da lista
  --------------------------------------------------------------------------------------
*/
const insertButton = (parent) => {
  // <img src="https://cdn-icons-png.flaticon.com/512/126/126468.png" width="15px" height="15px"></img>

  let img = document.createElement("img");
  img.src = "https://cdn-icons-png.flaticon.com/512/126/126468.png";
  img.style.width = "15px";
  img.style.height = "15px";
  img.className = "trash";

  parent.appendChild(img);


  // let span = document.createElement("span");
  // let txt = document.createTextNode("\u00D7");
  // span.className = "close";
  // span.appendChild(txt);
  // parent.appendChild(span);
}

/*
  --------------------------------------------------------------------------------------
  Função para remover um item da lista de acordo com o click no botão close
  --------------------------------------------------------------------------------------
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

const resetTable = () => {
  var table = document.getElementById('tblHistoric');
  const rows = Array.from(table.rows);

  // Para não deletar o título, o for irá parar de deletar no indice 0
  for (let i = (rows.length - 1); i > 0; i--) {
    table.deleteRow(i);
  }
}

/*
  --------------------------------------------------------------------------------------
  Função para inserir items na lista apresentada
  --------------------------------------------------------------------------------------
*/
const insertList = (item) => {
  var table = document.getElementById('tblHistoric');

  var itemRow = [item.nomeX, item.pontosX, item.nomeO, item.pontosO, item.velha];

  var row = table.insertRow();

  for (var i = 0; i < itemRow.length; i++) {
    var cel = row.insertCell(i);
    cel.textContent = itemRow[i];
  }
  insertButton(row.insertCell(-1));

  document.getElementById("nomeX").value = "";
  document.getElementById("nomeO").value = "";

  removeElement();
}


/*
  --------------------------------------------------------------------------------------
  Função para deletar um item da lista do servidor via requisição DELETE
  --------------------------------------------------------------------------------------
*/
const deleteItem = (item) => {
  let url = endpoint + 'disputa?id=' + item;
  fetch(url, {
      method: 'delete'
    })
    .then((response) => response.json())
    .catch((error) => {
      console.error('Error:', error);
    });
}

/*
  --------------------------------------------------------------------------------------
  Função para obter a lista existente do servidor via requisição GET
  --------------------------------------------------------------------------------------
*/
const getList = async () => {
  let url = endpoint + 'disputas';
  fetch(url, {
      method: 'get',
    })
    .then((response) => response.json())
    .then((data) => {
      dataHistoric = data.disputas;

      resetTable();
      dataHistoric.forEach(item => insertList(item));
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

/*
  --------------------------------------------------------------------------------------
  Função para colocar um item na lista do servidor via requisição POST
  --------------------------------------------------------------------------------------
*/
const post = async (nomeX, nomeO) => {
  const formData = new FormData();
  formData.append('nomeX', nomeX);
  formData.append('nomeO', nomeO);

  let url = endpoint + 'disputa';
  fetch(url, {
      method: 'post',
      body: formData
    })
    .then((response) => response.json())
    .then((data) => {
      partidaCorrente = data;
      setJogadores();
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

const btnNewMatch = async () => {
  resetMatch();
}

const btnFinish = async () => {
  resetJogo();
  alert("Disputa Finalizada!");
}

/*
  --------------------------------------------------------------------------------------
  Função para adicionar um novo item com nome, quantidade e valor 
  --------------------------------------------------------------------------------------
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

const criaJogo = () => {
  var containerHistoric = document.getElementById('containerHistoric');
  containerHistoric.style.display = "none";

  var containerJogo = document.getElementById('containerJogo');
  containerJogo.style.display = "block";
}

const resetJogo = () => {
  var containerHistoric = document.getElementById('containerHistoric');
  containerHistoric.style.display = "block";

  var containerJogo = document.getElementById('containerJogo');
  containerJogo.style.display = "none";

  getList();
}

const init = () => {
  resetJogo();
}


/*
  --------------------------------------------------------------------------------------
  Chamada da função para carregamento inicial dos dados
  --------------------------------------------------------------------------------------
*/
init()