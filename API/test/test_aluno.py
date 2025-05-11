import pytest
from config import app, db
from alunos.alunos_model import Aluno

def test_calcular_idade():
    from datetime import date
    aluno = Aluno(nome="Teste", data_nascimento=date(2000, 1, 1), nota_primeiro_semestre=8.0, nota_segundo_semestre=7.0, turma_id=1, media_final=7.5)
    assert aluno.calcular_idade() == (date.today().year - 2000)

@pytest.fixture
def client():
    app.config["TESTING"] = True
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///:memory:"
    with app.test_client() as client:
        with app.app_context():
            db.create_all()
        yield client
        with app.app_context():
            db.drop_all()

def test_get_alunos(client):
    response = client.get("/api/alunos")
    assert response.status_code == 200
    assert isinstance(response.json, list)

def test_create_aluno(client):
    # Certifique-se de que a turma exista antes de criar o aluno
    turma_data = {
        'materia': 'Matemática',
        'descricao': 'Turma de Matemática 101',
        'ativo': True,
        'professor_id': 1  # Supondo que você tenha um professor com id 1
    }

    # Crie a turma, caso não exista
    turma_response = client.post('/api/turmas', json=turma_data)
    turma_id = turma_response.json['id']  # Supondo que o id da turma seja retornado

    # Agora, crie o aluno com o id da turma criada
    aluno_data = {
        'nome': 'João',
        'idade': 18,
        'turma_id': turma_id,  # Usando o id da turma criada
    }

    # Criação do aluno
    response = client.post('/api/alunos', json=aluno_data)
    
    # Verifique se o aluno foi criado com sucesso
    assert response.status_code == 201
    assert response.json['nome'] == aluno_data['nome']
    assert response.json['turma_id'] == aluno_data['turma_id']


def test_update_aluno(client):
    novo_aluno = {
        "nome": "Aluno Teste",
        "data_nascimento": "2005-05-20",
        "nota_primeiro_semestre": 8.5,
        "nota_segundo_semestre": 9.0,
        "turma_id": 1
    }
    client.post("/api/alunos", json=novo_aluno)
    response = client.put("/api/alunos/1", json={"nome": "Aluno Atualizado", "data_nascimento": "2005-05-20", "nota_primeiro_semestre": 9.5, "nota_segundo_semestre": 9.5, "turma_id": 1})
    assert response.status_code == 200

def test_delete_aluno(client):
    novo_aluno = {
        "nome": "Aluno Teste",
        "data_nascimento": "2005-05-20",
        "nota_primeiro_semestre": 8.5,
        "nota_segundo_semestre": 9.0,
        "turma_id": 1
    }
    client.post("/api/alunos", json=novo_aluno)
    response = client.delete("/api/alunos/1")
    assert response.status_code == 200
    assert response.json["message"] == "Aluno excluído com sucesso "
