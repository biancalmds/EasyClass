const url = "http://127.0.0.1:5000/api/professores";

// ABRIR E FECHAR MODAL DE CADASTRO
const modalCadastro = document.getElementById("modal-cadastro");
document.getElementById("btn-cadastrar").addEventListener("click", () => {
  modalCadastro.showModal();
});
document.getElementById("fechar-cadastro").addEventListener("click", () => {
  modalCadastro.close();
});

// SEÇÃO CADASTRAR
const formCadastro = document.getElementById("form-cadastra-professor");
formCadastro.addEventListener("submit", async (e) => {
  e.preventDefault();

  const dadosProfessor = {
    nome: formCadastro.nome.value,
    idade: parseInt(formCadastro.idade.value),
    materia: formCadastro.materia.value,
    observacoes:
      formCadastro.observacoes.value.trim() === ""
        ? "Nenhuma"
        : formCadastro.observacoes.value.trim(),
  };

  const resposta = await fetch(url, {
    method: "POST",
    body: JSON.stringify(dadosProfessor),
    headers: { "Content-type": "application/json" },
  });
});

// SEÇÃO LER
const tabelaProfessor = document.getElementById("tabela-professores");
document.getElementById("btn-listar").addEventListener("click", async () => {
  tabelaProfessor.innerHTML = "";
  tabelaProfessor.innerHTML = `
          <thead>
            <tr>
                <th>Id</th>
                <th>Nome</th>
                <th>Idade</th>
                <th>Matéria</th>
                <th>Observações</th>
                <th>Turmas</th>
                <th colspan=2 >Ações</th>
            </tr>
          </thead>`;
  const tbody = document.createElement("tbody");
  const resposta = await fetch(url);
  const dados = await resposta.json();
  dados.map((professor) => {
    const trProfessor = document.createElement("tr");
    trProfessor.innerHTML = `
                <td>${professor.id}</td>
                <td>${professor.nome}</td>
                <td>${professor.idade}</td>
                <td>${professor.materia}</td>
                <td>${professor.observacoes}</td>
                <td>${professor.turmas.map((turma) => turma.materia)}</td>
                <td><a href="#" onclick = "editarProfessor(${
                  professor.id
                })">Editar</a></td>
                <td><a href="#" onclick = "excluirProfessor(${
                  professor.id
                })">Excluir</a></td>`;
    tbody.appendChild(trProfessor);
  });
  tabelaProfessor.appendChild(tbody);
});

// SEÇÃO EDITAR
const modalAtualizacao = document.getElementById("modal-atualizacao");

async function editarProfessor(id) {
  const formAtualizacao = document.getElementById("form-atualiza-professor");
  const resposta = await fetch(`${url}/${id}`);
  const dados = await resposta.json();

  formAtualizacao["id-professor"].value = dados.id;
  formAtualizacao["update-nome"].value = dados.nome;
  formAtualizacao["update-idade"].value = dados.idade;
  formAtualizacao["update-materia"].value = dados.materia;
  formAtualizacao["update-observacoes"].value = dados.observacoes;

  modalAtualizacao.showModal();
  document
    .getElementById("fechar-atualizacao")
    .addEventListener("click", () => {
      modalAtualizacao.close();
    });
}

document
  .getElementById("form-atualiza-professor")
  .addEventListener("submit", async (e) => {
    const idProfessor = document.getElementById("id-professor").value;
    e.preventDefault();

    const formAtualizacao = e.target;
    const dadosProfessor = {
      nome: formAtualizacao["update-nome"].value,
      idade: parseInt(formAtualizacao["update-idade"].value),
      materia: formAtualizacao["update-materia"].value,
      observacoes: formAtualizacao["update-observacoes"].value,
    };

    const resposta = await fetch(`${url}/${idProfessor}`, {
      method: "PUT",
      body: JSON.stringify(dadosProfessor),
      headers: { "Content-type": "application/json" },
    });
  });

//SEÇÃO EXCLUIR
async function excluirProfessor(id) {
  const resposta = await fetch(`${url}/${id}`, {
    method: "DELETE",
  });
  document.getElementById("btn-listar").click();
}
