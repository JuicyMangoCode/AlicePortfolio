class Task {
    constructor(title, description = '', dueDate = '') {
        this.id = Math.ceil(Math.random() * 100);
        this.title = title;
        this.description = description;
        this.completed = false;
        this.creationTime = new Date().toLocaleString();
        this.dueDate = dueDate;
    }
}

class TaskManager {
    constructor() {
        this.tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        this.toasts = JSON.parse(localStorage.getItem('toasts')) || [];
    }

    addTask(title, description, dueDate) {
        const newTask = new Task(title, description, dueDate);
    
        this.tasks.push(newTask);
        localStorage.setItem('tasks', JSON.stringify(this.tasks));

        this.showToast(`Task added successfully! Title: "${title}"`);
    }

    removeTask(id) {
        const taskToRemove = this.tasks.find((task) => task.id == id);
        if (taskToRemove) {
            this.tasks = this.tasks.filter((task) => task.id != id);
            localStorage.setItem('tasks', JSON.stringify(this.tasks));

            this.showToast(`Task removed successfully! Title: "${taskToRemove.title}"`);
        }
    }

    updateTask(id, title, description, dueDate) {
        let taskIndexToUpdate = this.tasks.findIndex((task) => task.id == id);
        if (taskIndexToUpdate !== -1) {
            const oldTitle = this.tasks[taskIndexToUpdate].title;
            const oldDescription = this.tasks[taskIndexToUpdate].description;
            const oldDueDate = this.tasks[taskIndexToUpdate].dueDate;

            this.tasks[taskIndexToUpdate].title = title ?? oldTitle;
            this.tasks[taskIndexToUpdate].description = description ?? oldDescription;
            this.tasks[taskIndexToUpdate].dueDate = dueDate ?? oldDueDate;
            localStorage.setItem('tasks', JSON.stringify(this.tasks));
            
            if (title && title !== oldTitle) {
                this.showToast(`Task updated successfully! Old Title: "${oldTitle}", New Title: "${this.tasks[taskIndexToUpdate].title}"`);
            } else {
                this.showToast(`Task updated successfully! Title: "${this.tasks[taskIndexToUpdate].title}"`);
            }
        }
    }

    toggleTaskCompletion(id) {
        let taskIndexToUpdate = this.tasks.findIndex((task) => task.id == id);
        if (taskIndexToUpdate !== -1) {
            const oldStatus = this.tasks[taskIndexToUpdate].completed;
            this.tasks[taskIndexToUpdate].completed = !oldStatus;
            localStorage.setItem('tasks', JSON.stringify(this.tasks));
            this.showToast(`Task marked as ${this.tasks[taskIndexToUpdate].completed ? 'completed' : 'uncompleted'}! Title: "${this.tasks[taskIndexToUpdate].title}"`);
        }
    }

    showToast(message) {
        const toast = { message, time: new Date().toLocaleString() };
        this.toasts.push(toast);
        localStorage.setItem('toasts', JSON.stringify(this.toasts));
        displayCurrentToast(message);
        displayToastHistory();
    }

    clearToastHistory() {
        this.toasts = [];
        localStorage.setItem('toasts', JSON.stringify(this.toasts));
        displayToastHistory();
    }
}

let taskManager = new TaskManager();

function displayTasks() {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let taskList = document.getElementById('taskList');
    let completedTaskList = document.getElementById('completedTaskList');

    taskList.innerHTML = '';
    completedTaskList.innerHTML = '';

    tasks.forEach((task) => {
        let listItem = document.createElement('li');
        listItem.className = 'list-group-item d-flex justify-content-between align-items-center border border-primary rounded mb-2';

        let dueDateClass = '';
        if (task.dueDate) {
            const currentDate = new Date();
            const dueDate = new Date(task.dueDate);
            const timeDiff = dueDate - currentDate;
            const daysDiff = timeDiff / (1000 * 3600 * 24);

            if (daysDiff < 0) {
                dueDateClass = 'text-danger';
            } else if (daysDiff <= 3) {
                dueDateClass = 'text-warning';
            }
        }

        listItem.innerHTML = `
            <div>
                <span>${task.title}</span>
                <br>
                <small>${task.description.replace(/\n/g, '<br>')}</small>
                <br>
                <br>
                <small class="text-muted">Created on: ${task.creationTime}</small>
                <br>
                <small class="${dueDateClass}">Due Date: ${task.dueDate || 'N/A'}</small>
            </div>
            <div>
                <button class="btn btn-danger btn-sm me-2" onclick="removeTask(${task.id})">Delete</button>
                <button class="btn btn-success btn-sm me-2" onclick="toggleTaskCompletion(${task.id})">${task.completed ? 'Uncomplete' : 'Complete'}</button>
                <button class="btn btn-primary btn-sm" onclick="openEditModal(${task.id})">Edit</button>
            </div>
        `;
        if (task.completed) {
            completedTaskList.appendChild(listItem);
        } else {
            taskList.appendChild(listItem);
        }
    });
}

function displayCurrentToast(message) {
    let toastContainer = document.querySelector('.toast-container');
    let toast = document.createElement('div');

    toast.className = 'toast show';
    toast.innerHTML = `
        <div class="toast-header">
            <strong class="me-auto">Notification</strong>
            <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div class="toast-body">
            ${message}
        </div>
    `;

    toastContainer.appendChild(toast);

    setTimeout(() => {
        toast.classList.remove('show');
        toast.classList.add('hide');
        setTimeout(() => {
            toastContainer.removeChild(toast);
        }, 1000);
    }, 5000);
}

function displayToastHistory() {
    let toasts = JSON.parse(localStorage.getItem('toasts')) || [];
    let toastHistoryList = document.getElementById('toastHistoryList');
    toastHistoryList.innerHTML = '';

    toasts.forEach((toast) => {
        let listItem = document.createElement('li');
        listItem.className = 'list-group-item';
        listItem.innerHTML = `
            <div>
                <strong>${toast.message}</strong>
                <br>
                <small class="text-muted">${toast.time}</small>
            </div>
        `;
        toastHistoryList.appendChild(listItem);
    });
}

window.onload = () => {
    displayTasks();
    displayToastHistory();

    document.getElementById('toggleToastHistory').addEventListener('click', toggleToastHistory);
};

function addTask() {
    let taskInput = document.getElementById('taskInput').value;
    let taskDescription = document.getElementById('taskDescription').value;
    let taskDueDate = document.getElementById('taskDueDate').value;

    if (taskInput) {
        taskManager.addTask(taskInput, taskDescription, taskDueDate);
        displayTasks();
    }
}

function removeTask(id) {
    taskManager.removeTask(id);
    displayTasks();
}

function toggleTaskCompletion(id) {
    taskManager.toggleTaskCompletion(id);
    displayTasks();
}

function openEditModal(id) {
    let task = taskManager.tasks.find(task => task.id == id);

    if (task) {
        document.getElementById('editTaskId').value = task.id;
        document.getElementById('editTaskTitle').value = task.title;
        document.getElementById('editTaskDescription').value = task.description;
        document.getElementById('editTaskDueDate').value = task.dueDate;

        let editModal = new bootstrap.Modal(document.getElementById('editTaskModal'));
        editModal.show();
    }
}

function saveTaskChanges() {
    let taskId = document.getElementById('editTaskId').value;
    let newTitle = document.getElementById('editTaskTitle').value;
    let newDescription = document.getElementById('editTaskDescription').value;
    let newDueDate = document.getElementById('editTaskDueDate').value;

    taskManager.updateTask(taskId, newTitle, newDescription, newDueDate);
    displayTasks();

    let editModal = bootstrap.Modal.getInstance(document.getElementById('editTaskModal'));
    editModal.hide();
}

function toggleToastHistory() {
    let toastHistoryContainer = document.querySelector('.toast-history-container');

    if (toastHistoryContainer.style.display === 'none' || toastHistoryContainer.style.display === '') {
        toastHistoryContainer.style.display = 'block';
    } else {
        toastHistoryContainer.style.display = 'none';
    }
}

function clearToastHistory() {
    taskManager.clearToastHistory();
}
