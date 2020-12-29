/* LIST FUNCTIONALITY */

/* create list */
const todolist_input = document.getElementById('todolist-input')
document.getElementById('list-form').onsubmit = function (e) {
    e.preventDefault();
    const newListName = todolist_input.value;
    todolist_input.value = '';
    fetch('/lists/create', {
        method: 'POST',
        body: JSON.stringify({
            'name' : newListName
        }),
        headers: {
            'Content-type': 'application/json'
        }
    })
    .then(function (response) {
        return response.json();
    })
    .then(function (JsonResponse) {
        console.log('response', JsonResponse);

        const li = document.createElement('li');

        const listCheckbox = document.createElement('input');
        listCheckbox.className = 'list-check-completed';
        listCheckbox.type = 'checkbox';
        listCheckbox.setAttribute('data-id', JsonResponse.id);
        listCheckbox.onchange = (e) => {
            listCheckBoxChange(e)
        }
        li.appendChild(listCheckbox);

        const listName = document.createElement('a');
        listName.href = '/lists/' + JsonResponse.id
        listName.innerHTML = ' ' + JsonResponse.name
        li.appendChild(listName);

        const listDeleteBtn = document.createElement('button');
        listDeleteBtn.className = 'delete-list';
        listDeleteBtn.setAttribute('data-id', JsonResponse.id);
        listDeleteBtn.innerHTML = '&cross;';
        listDeleteBtn.onclick = (e) => {
            deleteList(e)
        }
        li.appendChild(listDeleteBtn);

        document.getElementById('lists').appendChild(li);

        document.getElementById('error').className = 'hidden';
    })
    .catch(function (err) {
        document.getElementById('error').className = '';
    })
}  


/* delete list */
const deleteListBtns = document.querySelectorAll(".delete-list");
const deleteList = function (e) {
    console.log("Delete event: ", e);
    const listId = e.target.dataset.id;

    fetch('/lists/' + listId + '/delete', {
        method: 'DELETE'
    })
    .then(function () {
        const item = e.target.parentElement;
        item.remove();
    })
    .catch(function (e) {
        console.error(e);
        document.getElementById("error").className = "";
    });
}
for (let i = 0; i < deleteListBtns.length; i++) {
    const deleteBtn = deleteListBtns[i];
    deleteBtn.onclick = (e) => {
        deleteList(e)
    }
}

/* list checkbox */
const listCheckboxes = document.querySelectorAll('.list-check-completed');
const listCheckBoxChange = function (e) {
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
for (let i = 0; i < listCheckboxes.length; i++) {
    const checkbox = listCheckboxes[i];    
    checkbox.onchange = (e) => {
        listCheckBoxChange(e)
    }
}


/* TODOS FUNCTIONALITY */

/* create todo without list selection error */
document.getElementById('todo-form').onsubmit = function(e) {
    e.preventDefault();
    document.getElementById('error').innerText = 'You should select a List first!'
    const descInput = document.getElementById('description');
    descInput.value = '';
    document.getElementById('error').className = '';
    }
    