from flask import Blueprint, request, jsonify, render_template, redirect, url_for
from .professor_model import ProfessorNaoEncontrado, listar_professores, professor_por_id, adicionar_professor, atualizar_professor, excluir_professor,excluir_todos_professores

from config import db

professores_blueprint = Blueprint('professores', __name__)


@professores_blueprint.route('/professores', methods=['GET'])
def get_professores():
    professores = listar_professores()
    return jsonify(professores)

@professores_blueprint.route('/professores/<int:id_professor>', methods=['GET'])
def get_professor(id_professor):
    try:
        professor = professor_por_id(id_professor)
        return jsonify(professor)
    except ProfessorNaoEncontrado:
        return jsonify({'message': 'Professor não encontrado'}), 404


@professores_blueprint.route('/professores', methods=['POST'])
def create_professor():
    data = request.json
    adicionar_professor(data)
    return jsonify(data), 200


@professores_blueprint.route('/professores/<int:id_professor>', methods=['PUT'])
def update_professor(id_professor):
    data = request.json
    try:
        professor = professor_por_id(id_professor)
        if not professor:
            return jsonify({'message': 'Professor não encontrado'}), 404
        atualizar_professor(id_professor, data)
        return jsonify(data), 200
    except ProfessorNaoEncontrado:
        return jsonify({'message': 'Professor não encontrado'}), 404

@professores_blueprint.route('/professores/<int:id_professor>', methods=['DELETE'])
def delete_professor(id_professor):
    try:
        excluir_professor(id_professor)
        return jsonify({'message': 'Professor excluído com sucesso '}), 200
    except ProfessorNaoEncontrado:
        return jsonify({'message': 'Professor não encontrado'}), 404

@professores_blueprint.route('/professores/deleteall', methods=['DELETE'])
def delete_all_professores():
    try:
        excluir_todos_professores()
        return jsonify({'message': 'Todos os professores foram excluídos com sucesso'}), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500
