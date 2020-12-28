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

/* create todo without list selection error */
document.getElementById('todo-form').onsubmit = function(e) {
    e.preventDefault();
    document.getElementById('error').innerText = 'You should select a List first!'
    document.getElementById('error').className = '';
    }
    