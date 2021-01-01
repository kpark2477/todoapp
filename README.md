
### Todoapp
Python flask와 postgres, SQLAlchemy를 활용한 기본적인 CRUD app입니다.
Javascript fetch call을 활용하여 refresh를 최소화하여 이용할수 있게 구현되어 있습니다.

먼저 해야할 일 List를 만들고, 그 list안에 구체적인 task 항목들을 만들 수 있습니다.
list와 task 항목 왼편에 있는 checkbox와 우측에 있는 X버튼을 이용하여, 완료표시와 항목 지우기를 할 수 있습니다.

### Installing Dependencies

#### Python 3.7

Python 3.7 이상의 버전이 필요합니다.
[python docs](https://docs.python.org/3/using/unix.html#getting-and-installing-the-latest-version-of-python)

#### Virtual Enviornment

아래의 추가적인 python dependencies를 install할 때 virtual environment를 이용하실 것을 추천합니다.
[python docs](https://packaging.python.org/guides/installing-using-pip-and-virtual-environments/)


##### Key Dependencies (pip를 이용해서 install 해주세요.)

- [Flask](http://flask.pocoo.org/)  은 python의 backend microservices framework입니다. requests 와 responses를 처리하기 위해 이용됩니다.

- [SQLAlchemy](https://www.sqlalchemy.org/) 은 Python SQL toolkit 이자 ORM 입니다. postgres database를 다룹니다.

- [Flask-migrate](https://flask-migrate.readthedocs.io/en/latest/) data schema의 migration을 위하여 필요합니다. 

## Database Setup

PC에 postgres를 설치하시고 'todoapp'라는 이름으로 database를 생성해주세요.

app.py 10번 라인에 database path를 설정해주십시오.
default 값은 아래와 같습니다.
''postgres://postgres:1111@localhost:5432/todoapp''

-> 'postgresql://YourPostgresID:Password@localhost:5432/todoapp'

## Running the server

서버를 작동시키려면 terminal에서 아래와 같이 입력해주세요:

```bash
export FLASK_DEBUG=true
flask run
```

`FLASK_DEBUG` variable 을 `true` 로 세팅하면 file change를 detect하고 서버를 자동적으로 restart합니다.


## How to use

브라우저를 여시고 (크롬을 추천합니다)
http://localhost:5000/
로 들어가시면 투두앱을 이용하실 수 있습니다.


