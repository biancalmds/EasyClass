import pytest
from config import app, db
from turma.turma_model import Turma
from professor.professor_model import Professor

def test_listar_turmas(client):
    response = client.get('/api/turmas')
    assert response.status_code == 200
    assert isinstance(response.json, list)

def test_criar_turma(client):
    professor = Professor(nome='Teste Professor', idade=40, materia='Matemática')
    db.session.add(professor)
    db.session.commit()
    
    nova_turma = {
        "materia": "Matemática Avançada",
        "descricao": "Turma de Matemática Avançada para ensino médio",
        "ativo": True,
        "professor_id": professor.id
    }
    response = client.post('/api/turmas', json=nova_turma)
    assert response.status_code == 201
    assert response.json["message"] == "Turma criada com sucesso!"

def test_atualizar_turma(client):
    professor = Professor(nome='Teste Atualização', idade=35, materia='Física')
    db.session.add(professor)
    db.session.commit()
    
    turma = Turma(materia='Física', descricao='Turma de física', ativo=True, professor_id=professor.id)
    db.session.add(turma)
    db.session.commit()
    
    dados_atualizados = {
        "materia": "Física Quântica",
        "descricao": "Turma avançada de física quântica",
        "ativo": False,
        "professor_id": professor.id
    }
    response = client.put(f'/api/turmas/{turma.id}', json=dados_atualizados)
    assert response.status_code == 200
    assert response.json["materia"] == "Física Quântica"

def test_excluir_turma(client):
    professor = Professor(nome='Teste Exclusão', idade=50, materia='Química')
    db.session.add(professor)
    db.session.commit()
    
    turma = Turma(materia='Química Orgânica', descricao='Turma de química orgânica', ativo=True, professor_id=professor.id)
    db.session.add(turma)
    db.session.commit()
    
    response = client.delete(f'/api/turmas/delete/{turma.id}')
    assert response.status_code == 200
    assert response.json["message"] == "Turma excluída com sucesso"