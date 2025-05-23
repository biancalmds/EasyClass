const url = "http://127.0.0.1:5000/api/professores";

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
const tabelaProfessor = document.getElementById("tabela-professores");
document.getElementById("btn-listar").addEventListener("click", async () => {
  try {
    const resposta = await fetch(url);
    const dados = await resposta.json();

    if (dados.length > 0) {
      const img = document.getElementById("image");
      img.style.display = "none";
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
      dados.map((professor) => {
        const trProfessor = document.createElement("tr");
        trProfessor.innerHTML = `
                <td data-label="Id">${professor.id}</td>
                <td data-label="Nome">${professor.nome}</td>
                <td data-label="Idade">${professor.idade}</td>
                <td data-label="Matéria">${professor.materia}</td>
                <td data-label="Observações">${professor.observacoes}</td>
                <td data-label="Turmas">${professor.turmas.map((turma) => turma.materia)}</td>
                <td><button type="button" onclick = "editarProfessor(${
                  professor.id
                })">Editar</button></td>
                <td><button type="button" onclick="excluirProfessor(${
                  professor.id
                })">Excluir</button></td>`;
        tbody.appendChild(trProfessor);
      });
      tabelaProfessor.appendChild(tbody);
    } else {
      Swal.fire({
        title: "Não foi possível listar os professores",
        text: "Não existem professores cadastrados ainda!",
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
const formCadastro = document.getElementById("form-cadastra-professor");
formCadastro.addEventListener("submit", async (e) => {
  try {
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

    modalCadastro.close();
    Swal.fire({
      icon: "success",
      title: "Sucesso!",
      text: "Professor cadastrado com sucesso!",
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

async function editarProfessor(id) {
  const formAtualizacao = document.getElementById("form-atualiza-professor");
  try {
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
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Algo deu errado, tente novamente mais tarde.",
    });
  }
}

document
  .getElementById("form-atualiza-professor")
  .addEventListener("submit", async (e) => {
    const idProfessor = document.getElementById("id-professor").value;
    try {
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
      modalAtualizacao.close();
      Swal.fire({
        icon: "success",
        title: "Sucesso!",
        text: "Dados do professor atualizados com sucesso!",
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

//SEÇÃO EXCLUIR
async function excluirProfessor(id) {
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
        text: "Os dados do professor foram excluídos com sucesso!",
        icon: "success",
      });
      document.getElementById("btn-listar").click();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Algo deu errado, verifique se o professor está vinculado a uma turma ou tente novamente mais tarde.",
      });
    }
  }
}
