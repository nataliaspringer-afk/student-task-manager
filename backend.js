
document.addEventListener("DOMContentLoaded", ()=> {
    const storedTasks = JSON.parse(localStorage.getItem('tasks'));

    if(storedTasks){
        storedTasks.forEach((task)=> tasks.push(task));
        updateTasksList();
        updateStats();
        updateUpcomingTasks();
    }
})

let tasks = [];

const saveTasks = ()=>{
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

const getDaysRemaining = (dueDate) => {
    const today = new Date();
    const due = new Date('T00:00:00');

    today.setHours(0,0,0,0);

    const dateDiff = due - today;

    return Math.ceil(difference/(1000 * 60 * 60 * 24));

} // end method

const getDateStatus = (dueDate) => {
    const daysLeft = getDaysRemaining(dueDate);

    if (daysLeft < 0){
        return {
            text: `Overdue by ${Math.abs(daysLeft)} day ${Math.abs(daysLeft) === 1 ? '' : 's'}`,
            className: 'overdue'
        };
    }
    if (daysLeft === 0){
        return {
            text: 'Due today',
            className: 'today'
        };
    }
    if (daysLeft === 1){
        return {
            text: 'Due tomorrow',
            className: 'today'
        };
    }
        return {
            text: `${dueDate} days left`,
            className: 'upcoming'
        };
}

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
            completed: false
        });

        tasks.sort((a,b) => new Date(a.dueDate) - newDate(b.dueDate));

        updateTasksList();
        updateStats();
        updateUpcomingTasks();
        updateToday();
        saveTasks();

        taskInput.value = '';
        dateInput.value = '';
        categoryInput.value = 'School'; // default category of task
    }
};

const toggleTaskComplete = (index) =>{
    tasks[index].completed = !tasks[index].completed;
    updateTasksList();
    updateStats();
    updateUpcomingTasks();
    updateToday();
    saveTasks();
}

const deleteTask = (index) =>{
    tasks.splice(index, 1);
    updateTasksList();
    updateStats();
    updateUpcomingTasks();
    saveTasks();
}

const editTask = (index) => {
    const taskInput = document.getElementById('taskInput');
    taskInput.value = tasks[index].text;

    tasks.splice(index, 1);
    updateTasksList();
    updateStats();
    updateUpcomingTasks();
    saveTasks();
}

const updateStats = ()=> {
    const completedTasks = tasks.filter(task => task.completed).length;
    const totalTasks = tasks.length;
    const progress = (completedTasks/totalTasks) * 100;
    const progressBar = document.getElementById('progress');
    
    progressBar.style.width = `${progress}%`;

    document.getElementById('numbers').innerText = `${completedTasks} / ${totalTasks}`;
    if (tasks.length && completedTasks == totalTasks){
        confettiBlast();
    }
}

const updateTasksList = () => {
    const taskList = document.getElementById('task-list');
    taskList.innerHTML = '';

    tasks.forEach((task, index) => {
        const listItem = document.createElement('li');

        listItem.innerHTML = `
            <div class="taskItem">
                <div class="task ${task.completed ? 'completed' : ''}">
                    <input 
                        type="checkbox" 
                        class="checkbox" 
                        ${task.completed ? 'checked' : ''}
                    />

                    <p>${task.text}</p>
                </div>

                <div class="icons">
                    <img src="./images/edit.png" onclick="editTask(${index})"/>
                    <img src="./images/bin.png" onclick="deleteTask(${index})"/>
                </div>
            </div>
        `;

        listItem.addEventListener('change', () => toggleTaskComplete(index));

        taskList.appendChild(listItem);
        updateStats();
    });
};


document.getElementById('newTask').addEventListener('click', function(e) {
    e.preventDefault();

    addTask();
});

const updateUpcomingTasks = () =>{
    const upcomingList = document.getElementById('upcoming-tasks');
    upcomingList.innerHTML = '';

    const upcomingTasks = tasks.filter(task => !task.completed && task.dueDate);
    upcomingTasks = tasks.sort((a,b) => new Date(a.dueDate) - new Date(b.dueDate));
    upcomingTasks = tasks.slice(0,3);

    upcomingTasks.forEach(task => {
        const item = document.createElement('li');
        const date = new Date(task.dueDate + 'T00:00:00');
        item.innerHTML = `
            <div class="upcoming-task">
                <strong>${task.text}</strong>
                <span>${date.toLocalDateString()}</span>
            </div>
   `;
        upcomingList.appendChild(item);
    })
}
const confettiBlast = ()=>{
    function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
}
    confetti({
    angle: randomInRange(55, 125),
    spread: randomInRange(50, 70),
    particleCount: randomInRange(50, 100),
    origin: { y: .6 }
    });
}

updateTasksList();
updateStats();
updateUpcomingTasks();
saveTasks();
