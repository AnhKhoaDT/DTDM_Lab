// elements
const radioViewOptions = document.querySelectorAll("input[name='view-option']");
const listView = document.getElementById("list-view");
const boardView = document.getElementById("board-view");
const allTasksCTA = document.getElementById("all-tasks-cta");
const addTaskCTA = document.getElementById("add-task-cta");
const setTaskOverlay = document.getElementById("set-task-overlay");
const closeButtons = document.querySelectorAll(".close-button");
const viewTaskOverlay = document.getElementById("view-task-overlay");
const deleteTaskCTA = document.getElementById("delete-task-cta");
const notification = document.getElementById("notification");
const taskFormHeader = document.getElementById('task-form-header');
const dateFilterInput = document.getElementById('date-filter-input');
const editTaskButton = document.querySelector('.view-task-overlay .control-buttons-container button:first-child');
const updateTaskOverlay = document.getElementById("update-task-overlay");
const updateTaskForm = document.querySelector('#update-task-overlay form');
let activeOverlay = null;

const API_BASE_URL = 'http://localhost:3000/api/task';

const getToken = () => localStorage.getItem('token');

const showNotification = (message, isSuccess = true) => {
    const notification = document.getElementById('notification');
    notification.querySelector('p').textContent = message;
    notification.classList.remove('green-background', 'red-background');
    notification.classList.add(isSuccess ? 'green-background' : 'red-background');
    notification.style.display = 'flex';
    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000);
};

// Hàm chuyển đổi định dạng ngày sang dd/mm/yyyy
const formatDateToDDMMYYYY = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
};

const fetchAllTasks = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/all`, {
            headers: {
                'Authorization': `Bearer ${getToken()}`
            }
        });
        const data = await response.json();
        const { toDoTasks, doingTasks, doneTasks } = data;
        renderTasks(toDoTasks || [], doingTasks || [], doneTasks || []);
    } catch (error) {
        showNotification('Error loading tasks', false);
    }
};

const renderTasks = (toDoTasks, doingTasks, doneTasks) => {
    const todoList = document.querySelector('.list-container.pink ul');
    const doingList = document.querySelector('.list-container.blue ul');
    const doneList = document.querySelector('.list-container.green ul');
    const todoBoard = document.querySelector('#board-view .tasks-list.pink');
    const doingBoard = document.querySelector('#board-view .tasks-list.blue');
    const doneBoard = document.querySelector('#board-view .tasks-list.green');

    todoList.innerHTML = '';
    doingList.innerHTML = '';
    doneList.innerHTML = '';
    todoBoard.innerHTML = '';
    doingBoard.innerHTML = '';
    doneBoard.innerHTML = '';

    toDoTasks.forEach(task => {
        const taskItemList = createTaskElement(task, 'list');
        const taskItemBoard = createTaskElement(task, 'board');
        todoList.appendChild(taskItemList);
        todoBoard.appendChild(taskItemBoard);
    });

    doingTasks.forEach(task => {
        const taskItemList = createTaskElement(task, 'list');
        const taskItemBoard = createTaskElement(task, 'board');
        doingList.appendChild(taskItemList);
        doingBoard.appendChild(taskItemBoard);
    });

    doneTasks.forEach(task => {
        const taskItemList = createTaskElement(task, 'list');
        const taskItemBoard = createTaskElement(task, 'board');
        doneList.appendChild(taskItemList);
        doneBoard.appendChild(taskItemBoard);
    });
};

const createTaskElement = (task, viewType) => {
    const li = document.createElement('li');
    li.className = 'task-item';
    const dueDateFormatted = formatDateToDDMMYYYY(task.due_date); // Định dạng dd/mm/yyyy
    if (viewType === 'board') {
        li.innerHTML = `
            <button class="task-button" data-id="${task.id}">
                <div>
                    <p class="task-name">${task.name}</p>
                    <p class="task-due-date">Due on ${dueDateFormatted}</p>
                </div>
                <iconify-icon icon="material-symbols:arrow-back-ios-rounded" style="color: black" width="18" height="18" class="arrow-icon"></iconify-icon>
            </button>
        `;
    } else {
        li.innerHTML = `
            <button class="task-button" data-id="${task.id}">
                <p class="task-name">${task.name}</p>
                <p class="task-due-date">Due on ${dueDateFormatted}</p>
                <iconify-icon icon="material-symbols:arrow-back-ios-rounded" style="color: black" width="18" height="18" class="arrow-icon"></iconify-icon>
            </button>
        `;
    }
    return li;
};

// ** Event Listeners ** //

radioViewOptions.forEach((radioButton) => {
    radioButton.addEventListener("change", (event) => {
        const viewOption = event.target.value;
        switch (viewOption) {
            case "list":
                boardView.classList.add("hide");
                listView.classList.remove("hide");
                break;
            case "board":
                listView.classList.add("hide");
                boardView.classList.remove("hide");
                break;
        }
    });
});

addTaskCTA.addEventListener("click", () => {
    setTaskOverlay.classList.remove("hide");
    taskFormHeader.textContent = 'Add Task';
    document.getElementById('submit-button').textContent = 'Add Task';
    document.querySelector('#set-task-overlay form').reset();
    delete setTaskOverlay.dataset.taskId;
    activeOverlay = setTaskOverlay;
    document.body.classList.add("overflow-hidden");
});

const addTaskForm = document.querySelector('.set-task-overlay form');
addTaskForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(addTaskForm);
    const taskData = {
        name: formData.get('name'),
        description: formData.get('description'),
        due_date: formData.get('due-date')
    };

    try {
        const response = await fetch(`${API_BASE_URL}/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            },
            body: JSON.stringify(taskData)
        });
        if (response.ok) {
            showNotification('Task created successfully');
            setTaskOverlay.classList.add('hide');
            activeOverlay = null;
            document.body.classList.remove("overflow-hidden");
            fetchAllTasks();
        }
    } catch (error) {
        showNotification('Error creating task', false);
    }
});

function addCloseButtonListeners() {
    document.querySelectorAll(".close-button").forEach((button) => {
        button.addEventListener("click", () => {
            const overlay = button.closest('.overlay');
            if (overlay) {
                overlay.classList.add("hide");
                activeOverlay = null;
                document.body.classList.remove("overflow-hidden");
            }
        });
    });
}

deleteTaskCTA.addEventListener("click", async () => {
    const taskId = viewTaskOverlay.dataset.taskId;
    try {
        const response = await fetch(`${API_BASE_URL}/delete`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            },
            body: JSON.stringify({ id: taskId })
        });
        if (response.ok) {
            showNotification('Task deleted successfully');
            activeOverlay.classList.add("hide");
            activeOverlay = null;
            document.body.classList.remove("overflow-hidden");
            fetchAllTasks();
        }
    } catch (error) {
        showNotification('Error deleting task', false);
    }
});

dateFilterInput.addEventListener('change', async (e) => {
    try {
        const response = await fetch(`${API_BASE_URL}/due-date?date=${e.target.value}`, {
            headers: {
                'Authorization': `Bearer ${getToken()}`
            }
        });
        const { toDoTasks, doingTasks, doneTasks } = await response.json();
        renderTasks(toDoTasks, doingTasks, doneTasks);
    } catch (error) {
        showNotification('Error filtering tasks', false);
    }
});

document.querySelector('.sign-out-cta').addEventListener('click', () => {
    localStorage.removeItem('token');
    window.location.href = './login.html';
});

document.addEventListener('click', async (e) => {
    const taskButton = e.target.closest('.task-button');
    if (taskButton) {
        const taskId = taskButton.dataset.id;
        try {
            const response = await fetch(`${API_BASE_URL}/id/${taskId}`, {
                headers: {
                    'Authorization': `Bearer ${getToken()}`
                },
                method: 'GET'
            });
            const { task } = await response.json();

            viewTaskOverlay.dataset.taskId = taskId;
            document.querySelector('#task-name').textContent = task.name;
            document.querySelector('#task-description').textContent = task.description;
            document.querySelector('#task-due-date-container .value').textContent = formatDateToDDMMYYYY(task.due_date);
            document.querySelector('.status-value span:nth-child(2)').textContent =
                (task.status === 'to_do') ? 'To do' : (task.status === 'doing') ? 'Doing' : 'Done';
            const circle = document.querySelector('.status-value .circle');
            circle.className = 'circle';
            switch (task.status) {
                case 'to_do':
                    circle.classList.add('pink-background');
                    break;
                case 'doing':
                    circle.classList.add('blue-background');
                    break;
                case 'done':
                    circle.classList.add('green-background');
                    break;
            }
            viewTaskOverlay.classList.remove("hide");
            activeOverlay = viewTaskOverlay;
            document.body.classList.add("overflow-hidden");
        } catch (error) {
            showNotification('Error loading task details', false);
        }
    }
});

allTasksCTA.addEventListener('click', async () => {
    dateFilterInput.value = '';
    fetchAllTasks();
});

editTaskButton.addEventListener('click', function () {
    const taskData = {
        name: document.querySelector('#task-name').textContent.trim(),
        description: document.querySelector('#task-description').textContent.trim(),
        due_date: document.querySelector('#task-due-date-container .value').textContent.trim(),
        status: document.querySelector('.status-value span:nth-child(2)').textContent.trim()
    };

    viewTaskOverlay.classList.add('hide');
    updateTaskOverlay.classList.remove('hide');
    activeOverlay = updateTaskOverlay;

    document.getElementById('update-name').value = taskData.name;
    document.getElementById('update-description').value = taskData.description;
    // Chuyển từ dd/mm/yyyy sang yyyy-mm-dd để điền vào input type="date"
    const [day, month, year] = taskData.due_date.split('/');
    document.getElementById('update-due-date').value = `${year}-${month}-${day}`;
    document.getElementById('update-status').value = taskData.status;
    updateTaskOverlay.dataset.taskId = viewTaskOverlay.dataset.taskId;
    document.body.classList.add("overflow-hidden");
});

updateTaskForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(updateTaskForm);
    const taskData = {
        id: updateTaskOverlay.dataset.taskId,
        name: formData.get('name'),
        description: formData.get('description'),
        due_date: formData.get('due-date'), // Chuyển từ yyyy-mm-dd sang ISO
        status: formData.get('status') === 'To do' ? 'to_do' : formData.get('status') === 'Doing' ? 'doing' : 'done'
    };

    try {
        const response = await fetch(`${API_BASE_URL}/update`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            },
            body: JSON.stringify(taskData)
        });

        if (response.ok) {
            showNotification('Task updated successfully');
            updateTaskOverlay.classList.add('hide');
            activeOverlay = null;
            document.body.classList.remove("overflow-hidden");
            fetchAllTasks();
        } else {
            throw new Error('Failed to update task');
        }
    } catch (error) {
        showNotification('Error updating task', false);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    if (!getToken()) {
        window.location.href = './login.html';
    } else {
        fetchAllTasks();
    }
    addCloseButtonListeners();
});