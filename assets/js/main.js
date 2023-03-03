const inputsForm = document.querySelectorAll('#input__element')
const formTodoElement = document.querySelector('.task-form')
const overlayElement = document.querySelector('.overlay')
const btnOpenNewTask = document.querySelector('.new__task')
const iconClose = document.querySelector('.icon-close')
const titleForm = document.querySelector('.task-form .title')
const btnSubmitForm = document.querySelector('.task-form .btn-submit')
const status = document.querySelector('.status')
const btnSubmit = document.querySelector('.btn-submit')
const listTodoElement = document.querySelector('.list-todo')
const listTodoDoingElement = document.querySelector('.list-todo.doing')
const listTodoFinishedElemnt = document.querySelector('.list-todo.finished')
const statusTodo = document.querySelectorAll('input[name=status]')


let isEdit = false

let todos = JSON.parse(localStorage.getItem('todos')) || []
let todo = {
    id: '',
    category: '',
    title: '',
    content: '',
    status: '',
    date: '',
}

const TODO_TYPE = 'TODO_TYPE'
const TODO_DOING_TYPE = 'TODO_DOING_TYPE'
const TODO_FINISHED_TYPE = 'TODO_FINISHED_TYPE'

const callAPI = async (url, method, data = null) => {
    const parameter = {
        method,
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        ...(method !== 'DELETE' && {
            headers: {
                'Content-Type': 'application/json',
            },
        }),

        ...(method !== 'GET' && { body: JSON.stringify(data) }),
    }

    const done = await fetch(url, parameter)
    const result = await done.json()
    return result;
}

const handleChangeInput = (e) => {
    const parentElement = e.target.parentElement
    todo[e.target.name] = e.target.value

    if (!e.target.value) {
        parentElement.style.borderColor = 'black'
    } else {
        parentElement.style.borderColor = '#00e64d'
    }
}
inputsForm.forEach((inputItem) => {
    inputItem.addEventListener('change', handleChangeInput)
})

const validTodo = () => {
    let count = 0
    inputsForm.forEach((inputItem) => {
        if (inputItem.value == '') {
            const parentElement = inputItem.parentElement
            parentElement.style.borderColor = 'red'
            count += 1
        }
    })
    return !count ? true : false
}

// const clearFormTodoValue = () => {
//     inputsForm.forEach((inputItem) => {
//         const parentElement = inputItem.parentElement
//         inputItem.value = ''
//         parentElement.style.borderColor = 'black'
//     })
// }

const getCurrentDate = () => {
    let today = new Date()
    const dd = String(today.getDate()).padStart(2, '0')
    const mm = String(today.getMonth() + 1).padStart(2, '0')
    const yyyy = today.getFullYear()

    today = mm + '/' + dd + '/' + yyyy
    return today
}

const generateTodoHTML = (todolist) => {
    return ` 
        <div class="container__card">
            <p class="container__card-category">${todolist.category}</p>
            <h2 class="title">
                ${todolist.title}
            </h2>
            <p class="description">
                ${todolist.content}
            </p>
            <p class="date">
                <i class="fas fa-clock"></i>
                ${todolist.date}
            </p>
            <div class="container__card-action" >
                <i class="fas fa-edit" onclick="handleEdit(${todolist.id})"></i>
                <i class="fas fa-trash-alt" onclick="handleDelete(${todo.id})"></i>
            </div>
        </div>
    `
}

const handleEdit = (id) => {
    displayForm(true)
    isEdit = true

    titleForm.innerText = 'Edit Todo'
    btnSubmitForm.innerText = 'Edit'
    status.style.display = 'flex'
    const todoFinded = todos.find((todo) => todo.id == id)
    todo = todoFinded
    inputsForm.forEach((inputForm) => {
        inputForm.value = todoFinded[inputForm.name]
    })
    statusTodo.forEach((st) => {
        if (st.value == todoFinded.status) {
            st.checked = true
        }
    })
}

const handleDelete = async (id) => {
    try {
        await callAPI(
            `https://637b954d10a6f23f7fad790a.mockapi.io/todo/${id}`,
            'DELETE'
        )
        todos = todos.filter((todo) => todo.id != id)
        localStorage.setItem('todos', JSON.stringify(todos))
        render()
    } catch (error) {
        console.log(error)
    }
}

const render = () => {
    let htmlTodos = ''
    let htmlTodosDoing = ''
    let htmlTodosFinished = ''

    todos.forEach((todo) => {
        switch (todo.status) {
            case TODO_TYPE: {
                htmlTodos += generateTodoHTML(todo)
                
                break
            }
            case TODO_DOING_TYPE: {
                htmlTodosDoing += generateTodoHTML(todo)
                

                break
            }
            case TODO_FINISHED_TYPE: {
                htmlTodosFinished += generateTodoHTML(todo)
                
                break
            }
        }
    })
    listTodoElement.innerHTML = htmlTodos
    listTodoDoingElement.innerHTML = htmlTodosDoing
    listTodoFinishedElemnt.innerHTML = htmlTodosFinished


}

const addTodo = async () => {
    const newTodo = {
        ...todo,
        id: Math.random(),
        status: TODO_TYPE,
        date: getCurrentDate(),
    }

    try {
        const data = await callAPI(
            'https://63f1c676aab7d09125fb305f.mockapi.io/todo',
            'POST',
            newTodo
        )
        todos.push(data)
        localStorage.setItem('todos', JSON.stringify(todos))
        render()
        clearFormTodoValue()
    } catch (error) {
        console.log(error)
    }
}

const updateTodo = async () => {
    let valueStatus = ''
    statusTodo.forEach((st) => {
        if (st.checked) {
            valueStatus = st.value
        }
    })
    const todoUpadte = { ...todo, status: valueStatus }
    try {
        const data = await callAPI(
            `https://63f1c676aab7d09125fb305f.mockapi.io/todo/${todoUpadte.id}`,
            'PUT',
            todoUpadte
        )
        todos = todos.map((it) => (it.id == data.id ? data : it))
        localStorage.setItem('todos', JSON.stringify(todos))
        render()
    } catch (error) {
        console.log(error)
    }
}

btnSubmit.addEventListener('click', async (e) => {
    e.preventDefault()
    if (validTodo()) {
        if (isEdit) {
            updateTodo()
        } else {
            addTodo()
        }
    } else {
        console.log('error')
    }
})

const clearFormTodoValue = () => {
    inputsForm.forEach((inputItem) => {
        const parentElement = inputItem;
        inputItem.value = ''
        parentElement.style.borderColor = 'black'
    })
}

const displayForm = (status) => {
    formTodoElement.style.display = status ? 'block' : 'none'
    overlayElement.style.display = status ? 'block' : 'none'
}

btnOpenNewTask.addEventListener('click', () => {
    displayForm(true)
})

iconClose.addEventListener('click', () => {
    displayForm(false)
    if (isEdit) {
        isEdit = false
        titleForm.innerText = 'Add New Todo'
        btnSubmitForm.innerText = 'Submit'
        // status.style.display = 'none'   
        clearFormTodoValue()
    }
})
render();