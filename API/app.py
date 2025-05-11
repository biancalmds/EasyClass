from swagger.swagger_config import configure_swagger
from config import Config, db
from flask import Flask
from flask_cors import CORS
from alunos.alunos_routes import alunos_blueprint
from turma.turma_routes import turmas_blueprint
from professor.professor_routes import professores_blueprint

app = Flask(__name__)
app.config.from_object(Config)      # <-- primeiro aplica a configuração
db.init_app(app)                    # <-- depois inicializa o SQLAlchemy

CORS(app)

# Registra blueprints
app.register_blueprint(alunos_blueprint, url_prefix='/api')
app.register_blueprint(turmas_blueprint, url_prefix='/api')
app.register_blueprint(professores_blueprint, url_prefix='/api')

# Swagger
configure_swagger(app)

# Cria as tabelas
with app.app_context():
    db.create_all()

if __name__ == '__main__':
   app.run(host=app.config["HOST"], port=app.config['PORT'], debug=app.config['DEBUG'])
