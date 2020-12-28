/* LIST FUNCTIONALITY */

/* create list */
const todolist_input = document.getElementById('todolist-input')
document.getElementById('list-form').onsubmit = function (e) {
    e.preventDefault();
    fetch('/lists/create', {
        method: 'POST',
        body: JSON.stringify({
            'name' : todolist_input.value
        }),
        headers: {
            'Content-type': 'application/json'
        }
    })
    .then(function (response) {
        return response.json();
    })
    .then(function (JsonResponse) {
        document.getElementById('error').className = 'hidden';
        window.location.reload(true);
    })
    .catch(function (err) {
        document.getElementById('error').className = '';
    })
}  

/* delete list */
const deleteListBtns = document.querySelectorAll(".delete-list");
for (let i = 0; i < deleteListBtns.length; i++) {
    const deleteBtn = deleteListBtns[i];
    deleteBtn.onclick = function (e) {
        console.log("Delete event: ", e);
        const listId = e.target.dataset.id;

        fetch('/lists/' + listId + '/delete', {
            method: 'DELETE'
        })
        .then(function () {
            window.location.reload(true);
        })
        .catch(function (e) {
            console.error(e);
            document.getElementById("error").className = "";
        });
        
    }
}

/* list checkbox */
const listCheckboxes = document.querySelectorAll('.list-check-completed');
for (let i = 0; i < listCheckboxes.length; i++) {
    const checkbox = listCheckboxes[i];
    
    checkbox.onchange = function (e) {
        if (e.target.checked) {
            const listId = e.target.dataset.id;
            fetch('/lists/' + listId + '/set-completed', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(function (jsonResponse) {
                document.getElementById('error').className = 'hidden';
            })
            .catch(function () {
                document.getElementById('error').className= '';             
            })
        }       
    }
}




/* TODOS FUNCTIONALITY */

/* create todos */
const descInput = document.getElementById('description');
document.getElementById('todo-form').onsubmit = function(e) {
    e.preventDefault();
    const desc = descInput.value;
    descInput.value = '';
    fetch('/todos/create', {
        method: 'POST',
        body: JSON.stringify({
            'description': desc,
            'list_id': {{ active_list.id }}
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(function(response) {
        console.log(response)
        return response.json();
    })
    .then(function(JsonResponse) {
        console.log('response', JsonResponse);

        const li = document.createElement('li');

        const checkbox = document.createElement('input');
        checkbox.className = 'todo-check-completed';
        checkbox.type = 'checkbox';
        checkbox.setAttribute('data-id', JsonResponse.id);
        li.appendChild(checkbox);
        checkbox.onchange = (e) => {
            todoCheckboxChange(e)
        }

        const text = document.createTextNode(' ' + JsonResponse.description);
        li.appendChild(text);

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-todo';
        deleteBtn.setAttribute('data-id', JsonResponse.id);
        deleteBtn.innerHTML = '&cross;';
        li.appendChild(deleteBtn);
        deleteBtn.onclick = (e) => {
            deleteTodos(e)
        }

        document.getElementById('todos').appendChild(li);
        document.getElementById('error').className = 'hidden';
    })
    .catch(function(err) {
        console.log('error', err)
        document.getElementById('error').className = '';
    })
    }


/* delete todos */
const deleteBtns = document.querySelectorAll('.delete-todo');
const deleteTodos = function (e) {
    const todoId = e.target.dataset['id'];
    fetch('/todos/' + todoId + '/delete', {
        method: 'DELETE'
    })
    .then(function(response) {
        console.log('response', response);
        const item = e.target.parentElement;
        item.remove();
    })
}
for (let i = 0; i < deleteBtns.length; i++) {
    const btn = deleteBtns[i];
    btn.onclick = (e) => {
        deleteTodos(e)
    }
}

/* checkbox todos */
const checkboxes = document.querySelectorAll('.todo-check-completed');
const todoCheckboxChange = function (e) {
    console.log('event', e);
    const newCompleted = e.target.checked;
    const todoID = e.target.dataset['id'];
    fetch('/todos/'+ todoID + '/set-completed', {
        method: 'POST',
        body: JSON.stringify({
            'completed': newCompleted
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(function() {
        document.getElementById('error').className = 'hidden';
    })
    .catch(function(err) {
    console.log('error', err)
    document.getElementById('error').className = '';
    })
}
for (let i = 0; i < checkboxes.length; i++) {
    const checkbox = checkboxes[i];
    checkbox.onchange = (e) => {
        todoCheckboxChange(e)
    }
}