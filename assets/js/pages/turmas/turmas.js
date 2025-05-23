const url = "http://127.0.0.1:5000/api/turmas";
const urlProfessor = "http://127.0.0.1:5000/api/professores";

const selects = document.getElementsByClassName("professor-select");
async function buscarProfessor() {
  const resposta = await fetch(urlProfessor);
  const dados = await resposta.json();
  for (const select of selects) {
    dados.map((professor) => {
      const option = document.createElement("option");
      option.innerText = `${professor.id} - ${professor.nome}`;
      option.value = professor.id;
      select.appendChild(option);
    });
  }
}
buscarProfessor();

// ABRIR E FECHAR MODAL DE CADASTRO
const modalCadastro = document.getElementById("modal-cadastro");
document.getElementById("btn-cadastrar").addEventListener("click", () => {
  modalCadastro.showModal();
});
document.getElementById("fechar-cadastro").addEventListener("click", () => {
  modalCadastro.close();
  formCadastro.reset();
});

// SEÇÃO LER
const tabelaTurma = document.getElementById("tabela-turmas");
document.getElementById("btn-listar").addEventListener("click", async () => {
  try {
    const resposta = await fetch(url);
    const dados = await resposta.json();

    if (dados.length > 0) {
      const img = document.getElementById("image");
      img.style.display = "none";
      tabelaTurma.innerHTML = "";
      tabelaTurma.innerHTML = `
          <thead>
            <tr>
                <th>Id</th>
                <th>Matéria</th>
                <th>Descrição</th>
                <th>Id do Professor</th>
                <th>Status</th>
                <th colspan=2 >Ações</th>
            </tr>
          </thead>`;
      const tbody = document.createElement("tbody");
      dados.map((turma) => {
        const trTurma = document.createElement("tr");
        trTurma.innerHTML = `
                <td>${turma.id}</td>
                <td>${turma.materia}</td>
                <td>${turma.descricao}</td>
                <td>${turma.professor_id}</td>
                <td>${turma.ativo == true ? "Ativa" : "Inativa"}</td>
                <td><button type="button" onclick="editarTurma(${
                  turma.id
                })">Editar</button></td>
                <td><button type="button" onclick ="excluirTurma(${
                  turma.id
                })">Excluir</button></td>`;
        tbody.appendChild(trTurma);
      });
      tabelaTurma.appendChild(tbody);
    } else {
      Swal.fire({
        title: "Não foi possível listar as turmas",
        text: "Não existem turmas cadastradas ainda!",
        icon: "info",
      });
    }
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Algo deu errado, tente novamente mais tarde.",
    });
  }
});

// SEÇÃO CADASTRAR
const formCadastro = document.getElementById("form-cadastra-turma");
formCadastro.addEventListener("submit", async (e) => {
  try {
    e.preventDefault();
    const dadosTurma = {
      materia: formCadastro.materia.value,
      descricao:
        formCadastro.descricao.value.trim() === ""
          ? "Nenhuma"
          : formCadastro.descricao.value.trim(),
      ativo: parseInt(formCadastro.status.value),
      professor_id: parseInt(formCadastro.professor_id.value),
    };

    const resposta = await fetch(url, {
      method: "POST",
      body: JSON.stringify(dadosTurma),
      headers: { "Content-type": "application/json" },
    });

    modalCadastro.close();
    Swal.fire({
      icon: "success",
      title: "Sucesso!",
      text: "Turma cadastrada com sucesso!",
    });
  } catch (error) {
    modalCadastro.close();
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Algo deu errado, tente novamente mais tarde.",
    });
  } finally {
    document.getElementById("btn-listar").click();
    formCadastro.reset();
  }
});

// SEÇÃO EDITAR
const modalAtualizacao = document.getElementById("modal-atualizacao");
async function editarTurma(id) {
  const formAtualizacao = document.getElementById("form-atualiza-turma");
  try {
    const resposta = await fetch(`${url}/${id}`);
    const dados = await resposta.json();

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
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Algo deu errado, tente novamente mais tarde.",
    });
  }
}

document
  .getElementById("form-atualiza-turma")
  .addEventListener("submit", async (e) => {
    const idTurma = document.getElementById("id-turma").value;
    try {
      e.preventDefault();

      const formAtualizacao = e.target;
      const dadosTurma = {
        materia: formAtualizacao["update-materia"].value,
        descricao: formAtualizacao["update-descricao"].value,
        ativo: parseInt(formAtualizacao["update-status"].value),
        professor_id: formAtualizacao["update-professor_id"].value,
      };

      const resposta = await fetch(`${url}/${idTurma}`, {
        method: "PUT",
        body: JSON.stringify(dadosTurma),
        headers: { "Content-type": "application/json" },
      });
      modalAtualizacao.close();
      Swal.fire({
        icon: "success",
        title: "Sucesso!",
        text: "Dados da turma atualizados com sucesso!",
      });
      document.getElementById("btn-listar").click();
    } catch (error) {
      modalAtualizacao.close();
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Algo deu errado, tente novamente mais tarde.",
      });
    }
  });

// SEÇÃO EXCLUIR
async function excluirTurma(id) {
  const resultado = await Swal.fire({
    title: "Você tem certeza?",
    text: "Você não poderá reverter essa ação!",
    icon: "warning",
    showCancelButton: true,
    cancelButtonText: "Cancelar",
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Sim, desejo excluir!",
  });

  if (resultado.isConfirmed) {
    try {
      const resposta = await fetch(`${url}/${id}`, {
        method: "DELETE",
      });
      Swal.fire({
        title: "Excluído!",
        text: "Os dados da turma foram excluídos com sucesso!",
        icon: "success",
      });
      document.getElementById("btn-listar").click();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Algo deu errado, verifique se a turma possui alunos vinculados ou tente novamente mais tarde.",
      });
    }
  }
}
