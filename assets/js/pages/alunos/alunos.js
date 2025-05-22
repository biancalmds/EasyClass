const url = "http://127.0.0.1:5000/api/alunos";
const urlTurma = "http://127.0.0.1:5000/api/turmas";

const selects = document.getElementsByClassName("turma-select");
async function buscarTurmas() {
  const resposta = await fetch(urlTurma);
  const dados = await resposta.json();
  for (const select of selects) {
    dados.map((idTurma) => {
      const option = document.createElement("option");
      option.value = idTurma.id;
      option.innerText = `Turma ${idTurma.id}`;
      select.appendChild(option);
    });
  }
}
buscarTurmas();

// ABRIR E FECHAR MODAL DE CADASTRO
const modalCadastro = document.getElementById("modal-cadastro");
document.getElementById("btn-cadastrar").addEventListener("click", () => {
  modalCadastro.showModal();
});
document.getElementById("fechar-cadastro").addEventListener("click", () => {
  modalCadastro.close();
});

// SEÇÃO LER
const tabelaAluno = document.getElementById("tabela-alunos");
document.getElementById("btn-listar").addEventListener("click", async () => {
  try {
    const resposta = await fetch(url);
    const dados = await resposta.json();

    if (dados.length > 0) {
      const img = document.getElementById("image");
      img.style.display = "none";
      tabelaAluno.innerHTML = "";
      tabelaAluno.innerHTML = `
          <thead>
            <tr>
                <th>Id</th>
                <th>Nome</th>
                <th>Idade</th>
                <th>Data de nascimento</th>
                <th>Id da Turma</th>
                <th>Nota do 1° Semestre</th>
                <th>Nota do 2° Semestre</th>
                <th>Média Final</th>
                <th colspan=2 >Ações</th>
            </tr>
          </thead>`;
      const tbody = document.createElement("tbody");
      dados.map((aluno) => {
        const trAluno = document.createElement("tr");
        trAluno.innerHTML = `
                <td>${aluno.id}</td>
                <td>${aluno.nome}</td>
                <td>${aluno.idade}</td>
                <td>${aluno.data_nascimento}</td>
                <td>${aluno.turma_id}</td>
                <td>${aluno.nota_primeiro_semestre}</td>
                <td>${aluno.nota_segundo_semestre}</td>
                <td>${aluno.media_final}</td>
                <td><button type="button" onclick = "editarAluno(${aluno.id})">Editar</button></td>
                <td><button type="button" href="#" onclick = "excluirAluno(${aluno.id})">Excluir</button></td>`;
        tbody.appendChild(trAluno);
      });
      tabelaAluno.appendChild(tbody);
    } else {
      Swal.fire({
        title: "Não foi possível listar os alunos",
        text: "Não existem alunos cadastrados ainda!",
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
const formCadastro = document.getElementById("form-cadastra-aluno");
formCadastro.addEventListener("submit", async (e) => {
  try {
    e.preventDefault();
    const dadosAluno = {
      nome: formCadastro.nome.value,
      data_nascimento: formCadastro.dt_nascimento.value,
      nota_primeiro_semestre: formCadastro.nota1.value,
      nota_segundo_semestre: formCadastro.nota2.value,
      turma_id: parseInt(formCadastro.turma_id.value),
    };

    const resposta = await fetch(url, {
      method: "POST",
      body: JSON.stringify(dadosAluno),
      headers: { "Content-type": "application/json" },
    });

    modalCadastro.close();
    Swal.fire({
      icon: "success",
      title: "Sucesso!",
      text: "Aluno cadastrado com sucesso!",
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
async function editarAluno(id) {
  const formAtualizacao = document.getElementById("form-atualiza-aluno");
  try {
    const resposta = await fetch(`${url}/${id}`);
    const dados = await resposta.json();

    formAtualizacao["id-aluno"].value = dados.aluno.id;
    formAtualizacao["update-nome"].value = dados.aluno.nome;
    formAtualizacao["update-dt_nascimento"].value = dados.aluno.data_nascimento;
    formAtualizacao["update-turma_id"].value = dados.aluno.turma_id;
    formAtualizacao["update-nota1"].value = dados.aluno.nota_primeiro_semestre;
    formAtualizacao["update-nota2"].value = dados.aluno.nota_segundo_semestre;

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
  .getElementById("form-atualiza-aluno")
  .addEventListener("submit", async (e) => {
    const idAluno = document.getElementById("id-aluno").value;
    try {
      e.preventDefault();
      const formAtualizacao = e.target;
      const dadosAluno = {
        nome: formAtualizacao["update-nome"].value,
        data_nascimento: formAtualizacao["update-dt_nascimento"].value,
        nota_primeiro_semestre: parseInt(formAtualizacao["update-nota1"].value),
        nota_segundo_semestre: parseInt(formAtualizacao["update-nota2"].value),
        turma_id: formAtualizacao["update-turma_id"].value,
      };

      const resposta = await fetch(`${url}/${idAluno}`, {
        method: "PUT",
        body: JSON.stringify(dadosAluno),
        headers: { "Content-type": "application/json" },
      });
      modalAtualizacao.close();
      Swal.fire({
        icon: "success",
        title: "Sucesso!",
        text: "Dados do aluno cadastrados com sucesso!",
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
async function excluirAluno(id) {
  try {
    Swal.fire({
      title: "Você tem certeza?",
      text: "Você não poderá reverter essa ação!",
      icon: "warning",
      showCancelButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sim, desejo excluir!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const resposta = await fetch(`${url}/${id}`, {
          method: "DELETE",
        });
        Swal.fire({
          title: "Excluído!",
          text: "Os dados do aluno foram excluidos com sucesso!",
          icon: "success",
        });
        document.getElementById("btn-listar").click();
      }
    });
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Algo deu errado, tente novamente mais tarde.",
    });
  }
}
