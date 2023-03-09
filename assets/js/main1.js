const btnOpenNewTask = document.querySelector('.new__task')
const formEdit = document.getElementById('form-edit');
const formInput  = document.getElementById('form-input');
const countTodo = document.getElementById('todo-list-count-text');
const countDoing = document.getElementById('doing-list-count-text');
const countDone = document.getElementById('done-list-count-text');
const closeFormEdit = document.getElementById('close-form-edit');
const addItem = document.getElementById('add-todo');
const ToDo = document.getElementById('todo-list');
const Doing = document.getElementById('doing-list');
const Done = document.getElementById('done-list');
const closeFormInput = document.getElementById('close-form-input');

let data = [
	{
		category:"",
		title: "",
		content: "",
		date: "",
		type: ""
	}
]

btnOpenNewTask.addEventListener('click', function() {
    formInput.classList.add('enable');
	addItem = document.getElementById('add-todo');
	
	console.log(closeFormInput);
	
})

if (localStorage.getItem('todo') == null) {
	localStorage.setItem('todo', JSON.stringify(data));
} else {
	data = JSON.parse(localStorage.getItem('todo'));
}
console.log(addItem);

closeFormInput.addEventListener('click', function() {
    formInput.classList.remove('enable');
})

closeFormEdit.addEventListener('click', function() {
    formEdit.classList.remove('enable');
})

addItem.addEventListener('click', function() {
	let title = document.getElementById('title').value;
	let content = document.getElementById('content').value;
	// let date =  new Date.toLocaleDateString();
    let date = getCurrentDate();
	let category = document.getElementById('category').value;
	
	if( title  != '' && document.getElementById('title').classList.contains('error')) {
		document.getElementById('title').classList.remove('error');
	} else if(title == '') document.getElementById('title').classList.add('error');

	if( content  != '' && document.getElementById('content').classList.contains('error')) {
		document.getElementById('content').classList.remove('error');
	}   else if(content == '')  document.getElementById('content').classList.add('error');

	if( category  != '' && document.getElementById('category').classList.contains('error')) {
		document.getElementById('category').classList.remove('error');
	}   else if(category == '')  document.getElementById('category').classList.add('error');

	if( title != '' && content != '' && date != '' && category != '') {
		let todo = {
			category: category,
			title: title,
			content: content,
			date: date,
			type: 'todo'
		}
		data.push(todo);
		console.log(data);
		formInput.classList.remove('enable');
		pushTodo();
		localStorage.setItem('todo', JSON.stringify(data));
	}
})


let currentEdit = 0;
//get element type checkbox input
let checkbox = document.querySelectorAll('.choosetype');
pushTodo();

let btnSubmitEdit = document.getElementById('add-todo-edit');
btnSubmitEdit.addEventListener('click',function(){
	let title = document.getElementById('title-edit').value;
	let content = document.getElementById('content-edit').value;
	let date =  getCurrentDate()
	let category = document.getElementById('category-edit').value;
	let type = '';
	for(var i =0 ; i < checkbox.length; i++){
		if(checkbox[i].checked == true) type = checkbox[i].value;
	}
	if( title  != '' && document.getElementById('title-edit').classList.contains('error')) {
		document.getElementById('title-edit').classList.remove('error');
	} else if(title == '') document.getElementById('title-edit').classList.add('error');

	if( content  != '' && document.getElementById('content-edit').classList.contains('error')) {
		document.getElementById('content-edit').classList.remove('error');
	}   else if(content == '')  document.getElementById('content-edit').classList.add('error');

	if( category  != '' && document.getElementById('category-edit').classList.contains('error')) {
		document.getElementById('category-edit').classList.remove('error');
	}   else if(category == '')  document.getElementById('category-edit').classList.add('error');

	if( title != '' && content != '' && date != '' && category != '') {
		let todo = {
			category: category,
			title: title,
			content: content,
			date: date,
			type: type
		}
		data[currentEdit] = todo;
		console.log(data);
		formEdit.classList.remove('enable');
		pushTodo();
		localStorage.setItem('todo',JSON.stringify(data));

	}
})

const draggbles = document.querySelectorAll(".shallow-draggable")
const containers = document.querySelectorAll(".draggable-container")

draggbles.forEach((draggble) => {
	//for start dragging costing opacity
	draggble.addEventListener("dragstart", () => {
		draggble.classList.add("dragging")
	})

	//for end the dragging opacity costing
	draggble.addEventListener("dragend", () => {
		draggble.classList.remove("dragging")
	})
})
//shit
let currentDragId = null;
containers.forEach((container) => {
	container.addEventListener("dragover", function (e) {
		console.log("dragover",e)
		e.preventDefault()
		const afterElement = dragAfterElement(container, e.clientY)
		const dragging = document.querySelector(".dragging")
		if (afterElement == null) {
			container.appendChild(dragging)
		} else {
			console.log("is",afterElement)
			container.insertBefore(dragging, afterElement)
		}
	})
})

function pushTodo(){
	let x=0;y=0;z =0;
	ToDo.innerHTML = '';
	Doing.innerHTML = '';
	Done.innerHTML = '';
	data.forEach(function(item,index) {
	if(item.type == 'todo'){
		x++;
		ToDo.innerHTML += 
		`<div class="todo-list shallow-draggable" draggable="true" id="${index}">
		<div class="todo-item">
		<div class="todo-item-header">
			<span class="todo-item-header-category">${item.category}</span>
			<div class="too-item-header-action">
                <i class="fa-solid fa-pen-to-square edit" onclick="editItem(${index})"></i>
				<i class="fa-solid fa-trash del" onclick="remove(${index})"></i>
			</div>
		</div>
		<p class="todo-title">${item.title}</p>
		<div class="line-item"></div>
		<p class="todo-content">
			${item.content}
		</p>
		<div class="time">
        <i style="font-size: 13px;" class="fa-regular fa-clock clock"></i>
		<p class="time-text">${item.date}</p>
		</div>
	</div>
	</div>`;
	countTodo.innerHTML = x;
	} else if (item.type == 'doing'){
		y++;
		Doing.innerHTML += 
		`<div class="todo-list shallow-draggable" draggable="true" id="${index}">
		<div class="todo-item">
		<div class="todo-item-header">
			<span class="todo-item-header-category">${item.category}</span>
			<div class="too-item-header-action">
				<i class="fa-solid fa-pen-to-square edit" onclick="editItem(${index})"></i>
				<i class="fa-solid fa-trash del" onclick="remove(${index})"></i>
			</div>
		</div>
		<p class="todo-title">${item.title}</p>
		<div class="line-item"></div>
		<p class="todo-content">
			${item.content}
		</p>
		<div class="time">
        <i style="font-size: 13px;" class="fa-regular fa-clock clock"></i>
		<p class="time-text">${item.date}</p>
		</div>
	</div>
	</div>`
	countDoing.innerHTML = y;
	} else {
		z++;
		Done.innerHTML += `
		<div class="todo-list shallow-draggable" draggable="true" id="${index}">
		<div class="todo-item">
                        <div class="todo-item-header">
                            <span class="todo-item-header-category">${item.category}</span>
                            <div class="too-item-header-action">
                            <i class="fa-solid fa-pen-to-square edit" onclick="editItem(${index})"></i>
                            <i class="fa-solid fa-trash del" onclick="remove(${index})"></i>
                            </div>
                        </div>
                        <p class="todo-title">${item.title}</p>
                        <div class="line-item"></div>
                        <p class="todo-content">
                            ${item.content}
                        </p>
                        <div class="time">
                        <i style="font-size: 13px;" class="fa-regular fa-clock clock"></i>
                        <p class="time-text">21:22</p>
                        </div>
                    </div>
					</div>`
					countDone.innerHTML = z;
	}
})
};

function editItem(obj){
	currentEdit = obj;
	formEdit.classList.add('enable');
	console.log(data[obj].title);
	document.getElementById('title-edit').value = data[obj].title;
	document.getElementById('content-edit').value = data[obj].content;
	document.getElementById('category-edit').value = data[obj].category;
	switch(data[obj].type){
		case 'todo':
			choose(0);
			break;
		case 'doing':
			choose(1);
			break;
		case 'done':
			choose(2);
			break;
	}
	console.log(data[0]);
}

function choose(val){
	for(var i =0 ; i < checkbox.length; i++){
			checkbox[i].checked = false;
	}
	checkbox[val].checked = true;
}

function dragAfterElement(container, y) {
	const draggbleElements = [...container.querySelectorAll(".shallow-draggable:not(.dragging)")]

	return draggbleElements.reduce(
		(closest, child) => {
			const box = child.getBoundingClientRect()
			const offset = y - box.top - box.height / 2
			if (offset < 0 && offset > closest.offset) {
				return { offset: offset, element: child }
			} else {
				return closest
			}
		},
		{ offset: Number.NEGATIVE_INFINITY }
	).element
}

function closeInput(){
	console.log('close');
	formInput.classList.remove('enable');
}
function closeEdit(){
	formEdit.classList.remove('enable');
}

function remove(val){
	data.splice(val,1);
	pushTodo();
	localStorage.setItem('todo',JSON.stringify(data));
}

const getCurrentDate = () => {
    let today = new Date()
    const dd = String(today.getDate()).padStart(2, '0')
    const mm = String(today.getMonth() + 1).padStart(2, '0')
    const yyyy = today.getFullYear()

    today = mm + '/' + dd + '/' + yyyy
    return today
}



