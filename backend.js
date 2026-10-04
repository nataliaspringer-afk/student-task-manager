let tasks = [];

document.addEventListener("DOMContentLoaded", () => {
    const storedTasks = JSON.parse(localStorage.getItem('tasks'));

    if (storedTasks) {
        tasks = storedTasks;
    }

    updateTasksList();
    updateStats();
    updateUpcomingTasks();
    updateToday();
    updateTheme();
});

const saveTasks = () => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
};

const getDaysRemaining = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate + 'T00:00:00');

    today.setHours(0, 0, 0, 0);

    const difference = due - today;

    return Math.ceil(difference / (1000 * 60 * 60 * 24));
};

const getDateStatus = (dueDate) => {
    const daysLeft = getDaysRemaining(dueDate);

    if (daysLeft < 0) {
        return {
            text: `Overdue by ${Math.abs(daysLeft)} day${Math.abs(daysLeft) === 1 ? '' : 's'}`,
            className: 'overdue'
        };
    }

    if (daysLeft === 0) {
        return {
            text: 'Due today',
            className: 'today'
        };
    }

    if (daysLeft === 1) {
        return {
            text: 'Due tomorrow',
            className: 'today'
        };
    }

    return {
        text: `${daysLeft} days left`,
        className: 'upcoming'
    };
};

const addTask = () => {
    const taskInput = document.getElementById('taskInput');
    const dateInput = document.getElementById('dueDate');
    const categoryInput = document.getElementById('category');

    const text = taskInput.value.trim();
    const dueDate = dateInput.value;
    const category = categoryInput.value;

    if (text && dueDate) {
        tasks.push({
            text: text,
            dueDate: dueDate,
            category: category,
            completed: false
        });

        tasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

        updateTasksList();
        updateStats();
        updateUpcomingTasks();
        updateToday();
        saveTasks();

        taskInput.value = '';
        dateInput.value = '';
        categoryInput.value = 'School';
    }
};

const toggleTaskComplete = (index) => {
    tasks[index].completed = !tasks[index].completed;

    updateTasksList();
    updateStats();
    updateUpcomingTasks();
    updateToday();
    saveTasks();
};

const deleteTask = (index) => {
    tasks.splice(index, 1);

    updateTasksList();
    updateStats();
    updateUpcomingTasks();
    updateToday();
    saveTasks();
};

const editTask = (index) => {
    const taskInput = document.getElementById('taskInput');
    const dateInput = document.getElementById('dueDate');
    const categoryInput = document.getElementById('category');

    taskInput.value = tasks[index].text;
    dateInput.value = tasks[index].dueDate;
    categoryInput.value = tasks[index].category || 'School';

    tasks.splice(index, 1);

    updateTasksList();
    updateStats();
    updateUpcomingTasks();
    updateToday();
    saveTasks();

    taskInput.focus();
};

const updateStats = () => {
    const completedTasks = tasks.filter(task => task.completed).length;
    const totalTasks = tasks.length;

    const progress = totalTasks === 0
        ? 0
        : (completedTasks / totalTasks) * 100;

    const progressBar = document.getElementById('progress');
    const progressText = document.getElementById('progress-text');
    const progressMessage = document.getElementById('progress-message');
    const numbers = document.getElementById('numbers');

    progressBar.style.width = `${progress}%`;

    numbers.innerText = `${completedTasks} / ${totalTasks}`;
    progressText.innerText = `${completedTasks} of ${totalTasks} tasks completed`;

    if (totalTasks === 0) {
        progressMessage.innerText = 'Ready when you are!';
    } else if (progress === 100) {
        progressMessage.innerText = 'Everything is done! 🎉';
        confettiBlast();
    } else if (progress >= 75) {
        progressMessage.innerText = 'Almost there! 💪';
    } else if (progress >= 50) {
        progressMessage.innerText = 'Making progress...';
    } else {
        progressMessage.innerText = 'Keep going!';
    }
};

const updateTasksList = () => {
    const taskList = document.getElementById('task-list');

    taskList.innerHTML = '';

    tasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

    if (tasks.length === 0) {
        taskList.innerHTML = `
            <li class="empty-state">
                <div class="empty-icon">📋</div>
                <strong>No tasks yet</strong>
                <span>Add your first task above to get started.</span>
            </li>
        `;

        return;
    }

    tasks.forEach((task, index) => {
        const listItem = document.createElement('li');
        const status = getDateStatus(task.dueDate);

        listItem.innerHTML = `
            <div class="taskItem">
                <div class="task ${task.completed ? 'completed' : ''}">
                    <input
                        type="checkbox"
                        class="checkbox"
                        ${task.completed ? 'checked' : ''}
                    >

                    <div class="task-content">
                        <p>${task.text}</p>

                        <div class="task-details">
                            <span class="category-badge">${task.category || 'School'}</span>
                            <span class="date-badge ${status.className}">
                                ${new Date(task.dueDate + 'T00:00:00').toLocaleDateString()} · ${status.text}
                            </span>
                        </div>
                    </div>
                </div>

                <div class="icons">
                    <img src="./images/edit.png" onclick="editTask(${index})">
                    <img src="./images/bin.png" onclick="deleteTask(${index})">
                </div>
            </div>
        `;

        listItem.addEventListener('change', () => toggleTaskComplete(index));

        taskList.appendChild(listItem);
    });
};

const updateUpcomingTasks = () => {
    const upcomingList = document.getElementById('upcoming-tasks');

    upcomingList.innerHTML = '';

    const upcomingTasks = tasks
        .filter(task => !task.completed && task.dueDate)
        .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
        .slice(0, 3);

    if (upcomingTasks.length === 0) {
        upcomingList.innerHTML = `
            <li class="empty-state">
                <div class="empty-icon">🎉</div>
                <strong>You're all caught up!</strong>
                <span>No upcoming tasks to worry about.</span>
            </li>
        `;

        return;
    }

    upcomingTasks.forEach(task => {
        const item = document.createElement('li');
        const status = getDateStatus(task.dueDate);

        item.innerHTML = `
            <div class="upcoming-task">
                <div class="upcoming-task-info">
                    <div class="upcoming-dot"></div>

                    <div>
                        <strong>${task.text}</strong>
                        <span>
                            ${task.category || 'School'} ·
                            ${new Date(task.dueDate + 'T00:00:00').toLocaleDateString()}
                        </span>
                    </div>
                </div>

                <span class="date-badge ${status.className}">
                    ${status.text}
                </span>
            </div>
        `;

        upcomingList.appendChild(item);
    });
};

const updateToday = () => {
    const todayDate = document.getElementById('today-date');
    const todayCount = document.getElementById('today-count');

    const today = new Date();

    todayDate.innerText = today.toLocaleDateString(undefined, {
        weekday: 'long',
        month: 'long',
        day: 'numeric'
    });

    const todayString =
        `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    const count = tasks.filter(
        task => !task.completed && task.dueDate === todayString
    ).length;

    todayCount.innerText = count;
};

const updateTheme = () => {
    const savedTheme = localStorage.getItem('theme');
    const themeToggle = document.getElementById('themeToggle');

    if (savedTheme === 'dark') {
        document.body.classList.add('dark');
        themeToggle.innerText = '☀️';
    } else {
        document.body.classList.remove('dark');
        themeToggle.innerText = '🌙';
    }
};

document.getElementById('themeToggle').addEventListener('click', () => {
    document.body.classList.toggle('dark');

    const isDark = document.body.classList.contains('dark');

    localStorage.setItem('theme', isDark ? 'dark' : 'light');

    document.getElementById('themeToggle').innerText =
        isDark ? '☀️' : '🌙';
});

document.getElementById('taskform').addEventListener('submit', (event) => {
    event.preventDefault();
    addTask();
});

updateTasksList();
updateStats();
updateUpcomingTasks();
updateToday();
