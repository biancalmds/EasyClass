import pytest
from config import app, db
from professor.professor_model import Professor

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

def test_get_professores(client):
    response = client.get("/api/professores")
    assert response.status_code == 200
    assert isinstance(response.json, list)

def test_create_professor(client):
    novo_professor = {
        "nome": "Professor Teste",
        "idade": 40,
        "materia": "Matemática",
        "observacoes": "Doutor em álgebra"
    }
    response = client.post("/api/professores", json=novo_professor)
    assert response.status_code == 200

def test_update_professor(client):
    novo_professor = {
        "nome": "Professor Teste",
        "idade": 40,
        "materia": "Matemática",
        "observacoes": "Doutor em álgebra"
    }
    client.post("/api/professores", json=novo_professor)
    response = client.put("/api/professores/1", json={
        "nome": "Professor Atualizado",
        "idade": 45,
        "materia": "Física",
        "observacoes": "Pós-doutorado em mecânica quântica"
    })
    assert response.status_code == 200

def test_delete_professor(client):
    novo_professor = {
        "nome": "Professor Teste",
        "idade": 40,
        "materia": "Matemática",
        "observacoes": "Doutor em álgebra"
    }
    client.post("/api/professores", json=novo_professor)
    response = client.delete("/api/professores/1")
    assert response.status_code == 200
    assert response.json["message"] == "Professor excluído com sucesso "
