from flask import Flask, render_template, request, redirect, url_for, jsonify, abort
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
import sys

app = Flask(__name__)
# postgres를 설치하고 로컬서버에 todoapp이라는 db를 만드셔야 합니다.
# 그 후에 아래 data base uri configuration을 바꿔주세요.
# 'postgres://YourUsername:Password@localhost:5432/todoapp' 
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgres://postgres:1111@localhost:5432/todoapp'
db = SQLAlchemy(app)

# migrate = Migrate(app, db)

# migration을 활용하는게 좋으나, 다운받아서 테스트 해보시는 분들의 편의를 위해 31, 32번
# 라인에서 db를 초기화 시키도록 코드해두었습니다.


class Todo(db.Model):
    __tablename__ = 'todos'
    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.String(), nullable=False)
    completed = db.Column(db.Boolean, nullable=False, default=False)
    list_id = db.Column(db.Integer, db.ForeignKey('todolists.id'), nullable=False)

    def __repr__(self):
        return f'<Todo {self.id} {self.description}>'

class TodoList(db.Model):
    __tablename__ = 'todolists'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(), nullable=False)
    todos = db.relationship('Todo', backref='list', lazy=True)

# This will reset the db
db.drop_all()
db.create_all()


@app.route('/todos/create', methods=['POST'])
def create_todo():
    error = False
    body = {}
    # todo가 session close or 커밋할때 expire 됨으로 리턴용 variable을 따로 만듬
    # id는 커밋이후에 생성되므로 body 구성은 커밋이후에 해야한다
    try:
        description = request.get_json()['description']
        list_id = request.get_json()['list_id']
        todo = Todo(description=description, completed=False)
        active_list = TodoList.query.get(list_id)
        todo.list = active_list
        db.session.add(todo)
        db.session.commit()
        body['id'] = todo.id
        body['description'] = todo.description
        body['completed'] = todo.completed
    except:
        error = True
        db.session.rollback()
        print(sys.exc_info())
    finally:
        db.session.close()
    if error:
        abort(400)
    if not error:
        return jsonify(body)

@app.route('/todos/<todo_id>/set-completed', methods=['POST'])
def set_completed_todo(todo_id):
    try:
        completed = request.get_json()['completed']
        todo = Todo.query.get(todo_id)
        todo.completed = completed
        db.session.commit()
    except:
        db.session.rollback()
    finally:
        db.session.close()
    return jsonify({'success': True})

@app.route('/todos/<todo_id>/delete', methods=['DELETE'])
def delete_todo(todo_id):
    try:
        Todo.query.filter_by(id=todo_id).delete()
        db.session.commit()
    except:
        db.session.rollback()
    finally:
        db.session.close()
    return jsonify({'success': True})

@app.route('/lists/<list_id>')
def get_list_todos(list_id):
    active_list = TodoList.query.get(list_id)

    if active_list == None:
        return redirect(url_for('get_main_page'))

    else:
        return render_template(
            'active_list.html',
            lists = TodoList.query.order_by('id').all(), 
            active_list = active_list,
            todos=Todo.query.filter_by(list_id=list_id).order_by('id').all()
            )

@app.route('/')
def get_main_page():
    return render_template('main.html', lists = TodoList.query.order_by('id').all())

@app.route('/lists/create', methods=['POST'])
def create_list():
    error = False
    body = {}
    try:
        name = request.get_json()['name']
        todolist = TodoList(name=name)
        db.session.add(todolist)
        db.session.commit()
        body['id'] = todolist.id
        body['name'] = todolist.name
    except:
        db.session.rollback()
        error = True
        print(sys.exc_info)
    finally:
        db.session.close()
    if error:
        abort(500)
    else:
        return jsonify(body)

@app.route('/lists/<list_id>/delete', methods=['DELETE'])
def delete_list(list_id):
    error = False
    try:
        list = TodoList.query.get(list_id)
        for todo in list.todos:
            db.session.delete(todo)

        db.session.delete(list)
        db.session.commit()
    except:
        db.session.rollback()
        error = True
    finally:
        db.session.close()
    if error:
        abort(500)
    else:
        return jsonify({'success': True})


@app.route('/lists/<list_id>/set-completed', methods=['POST'])
def set_completed_list(list_id):
    error= False

    try:
        list = TodoList.query.get(list_id)

        for todo in list.todos:
            todo.completed = True

        db.session.commit()
    
    except:
        db.session.rollback()
        error=True
    finally:
        db.session.close()
    if error:
        abort(500)
    else:
        return '', 200