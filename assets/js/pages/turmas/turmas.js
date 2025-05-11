const url = "http://127.0.0.1:5000/api/turmas";

// ABRIR E FECHAR MODAL DE CADASTRO
const modalCadastro = document.getElementById("modal-cadastro");
document.getElementById("btn-cadastrar").addEventListener("click", () => {
  modalCadastro.showModal();
});
document.getElementById("fechar-cadastro").addEventListener("click", () => {
  modalCadastro.close();
});

// SEÇÃO CADASTRAR
const formCadastro = document.getElementById("form-cadastra-turma");
formCadastro.addEventListener("submit", async (e) => {
  e.preventDefault();

  const dadosTurma = {
    materia: formCadastro.materia.value,
    descricao:
      formCadastro.descricao.value.trim() === ""
        ? "Nenhuma"
        : formCadastro.descricao.value.trim(),
    ativo: parseInt(formCadastro.status.value),
    professor_id: formCadastro.professor_id.value,
  };

  const resposta = await fetch(url, {
    method: "POST",
    body: JSON.stringify(dadosTurma),
    headers: { "Content-type": "application/json" },
  });
});

// SEÇÃO LER
const tabelaTurma = document.getElementById("tabela-turmas");
document.getElementById("btn-listar").addEventListener("click", async () => {
  tabelaTurma.innerHTML = "";
  tabelaTurma.innerHTML = `
            <tr>
                <th>Id</th>
                <th>Matéria</th>
                <th>Descrição</th>
                <th>Id do Professor</th>
                <th>Status</th>
            </tr>`;
  const resposta = await fetch(url);
  const dados = await resposta.json();
  dados.map((turma) => {
    const trTurma = document.createElement("tr");
    trTurma.innerHTML = `
                <td>${turma.id}</td>
                <td>${turma.materia}</td>
                <td>${turma.descricao}</td>
                <td>${turma.professor_id}</td>
                <td>${turma.ativo == true ? "Ativa" : "Inativa"}</td>
                <td><a href="#" onclick = "editarTurma(${
                  turma.id
                })">Editar</a></td>
                <td><a href="#" onclick = "excluirTurma(${
                  turma.id
                })">Excluir</a></td>`;
    tabelaTurma.appendChild(trTurma);
  });
});

// SEÇÃO EDITAR
const modalAtualizacao = document.getElementById("modal-atualizacao");

async function editarTurma(id) {
  const formAtualizacao = document.getElementById("form-atualiza-turma");
  const resposta = await fetch(`${url}/${id}`);
  const dados = await resposta.json();
  console.log(dados);

  formAtualizacao["id-turma"].value = dados.turma.id;
  formAtualizacao["update-materia"].value = dados.turma.materia;
  formAtualizacao["update-descricao"].value = dados.turma.descricao;
  formAtualizacao["update-professor_id"].value = dados.turma.professor_id;
  formAtualizacao["update-status"].options.value = dados.turma.ativo;

  modalAtualizacao.showModal();
  document
    .getElementById("fechar-atualizacao")
    .addEventListener("click", () => {
      modalAtualizacao.close();
    });
}

document
  .getElementById("form-atualiza-turma")
  .addEventListener("submit", async (e) => {
    const idTurma = document.getElementById("id-turma").value;
    e.preventDefault();

    const formAtualizacao = e.target;
    const dadosTurma = {
      materia: formAtualizacao["update-materia"].value,
      descricao: formAtualizacao["update-descricao"].value,
      ativo: parseInt(formAtualizacao["update-status"].value),
      professor_id: formAtualizacao["update-professor_id"].value
    };

    const resposta = await fetch(`${url}/${idTurma}`, {
      method: "PUT",
      body: JSON.stringify(dadosTurma),
      headers: { "Content-type": "application/json" },
    });
  });

// SEÇÃO EXCLUIR
async function excluirTurma(id) {
  const resposta = await fetch(`${url}/${id}`, {
    method: "DELETE",
  });
}
