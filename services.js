const endpoint = "http://127.0.0.1:5500/";
var dataHistoric = [];

/**
 * Serviço de exclusão da disputa pelo id
 * @param {number} item 
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

/**
 * Serviço de Consulta das disputas
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

/**
 * Função de inclusão da disputa no BD
 * @param {string} nomeX 
 * @param {string} nomeO 
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

/**
 * Função de verificação de vencedor (Analise de houve algum vencedor e atualiza no banco)
 * @param {number} disputa_id 
 * @param {array} jogo 
 */
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