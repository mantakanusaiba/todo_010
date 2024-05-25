document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('task-input');
    const addTaskBtn = document.getElementById('add-task-btn');
    const taskList = document.getElementById('task-list');
    const clearAllBtn = document.getElementById('clear-all-btn');

    // Load tasks from localStorage
    const loadTasks = () => {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(task => addTask(task.text, task.completed));
    };

    // Save tasks to localStorage
    const saveTasks = () => {
        const tasks = [];
        taskList.querySelectorAll('.task-item').forEach(item => {
            tasks.push({
                text: item.querySelector('.edit').value,
                completed: item.classList.contains('completed')
            });
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };

    const createTaskElement = (text, completed = false) => {
        const li = document.createElement('li');
        li.className = `task-item${completed ? ' completed' : ''}`;
        li.draggable = true;
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = completed;
        checkbox.addEventListener('change', () => {
            li.classList.toggle('completed');
            saveTasks();
        });

        const editInput = document.createElement('input');
        editInput.type = 'text';
        editInput.value = text;
        editInput.className = 'edit';
        editInput.addEventListener('change', saveTasks);

        const deleteBtn = document.createElement('button');
        deleteBtn.innerHTML = '✕';
        deleteBtn.addEventListener('click', () => {
            li.remove();
            saveTasks();
        });

        li.appendChild(checkbox);
        li.appendChild(editInput);
        li.appendChild(deleteBtn);

        return li;
    };

    const addTask = (text, completed = false) => {
        if (text.trim() === '') return;
        const taskElement = createTaskElement(text, completed);
        taskList.appendChild(taskElement);
        saveTasks();
    };

    addTaskBtn.addEventListener('click', () => {
        addTask(taskInput.value);
        taskInput.value = '';
    });

    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask(taskInput.value);
            taskInput.value = '';
        }
    });

    clearAllBtn.addEventListener('click', () => {
        taskList.innerHTML = '';
        saveTasks();
    });

    // Drag-and-drop functionality
    let dragSrcEl = null;

    const handleDragStart = (e) => {
        dragSrcEl = e.target;
        e.target.style.opacity = '0.4';
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (e) => {
        e.stopPropagation();
        if (dragSrcEl !== e.target) {
            taskList.insertBefore(dragSrcEl, e.target.nextSibling);
            saveTasks();
        }
        return false;
    };

    const handleDragEnd = (e) => {
        e.target.style.opacity = '1';
    };

    taskList.addEventListener('dragstart', handleDragStart);
    taskList.addEventListener('dragover', handleDragOver);
    taskList.addEventListener('drop', handleDrop);
    taskList.addEventListener('dragend', handleDragEnd);

    loadTasks();
});
