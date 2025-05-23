function verificaIdade(campoId) {
  const campo_idade = document.getElementById(campoId);
  var hoje = new Date();
  var data_nascimento = new Date(document.getElementById(campoId).value);
  var idade = hoje.getFullYear() - data_nascimento.getFullYear();
  var mes = hoje.getMonth() - data_nascimento.getMonth();

  if (mes < 0 || (mes == 0 && hoje.getDay() < data_nascimento.getDay())) {
    idade--;
  }

  if (idade > 100) {
    campo_idade.setCustomValidity("Algo está errado com a idade.");
  } else if (idade < 18) {
    campo_idade.setCustomValidity("A idade precisa ser maior que 18 anos.");
  } else {
    campo_idade.setCustomValidity("");
  }
}
