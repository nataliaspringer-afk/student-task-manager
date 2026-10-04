
document.addEventListener("DOMContentLoaded", ()=> {
    const storedTasks = JSON.parse(localStorage.getItem('tasks'));

    if(storedTasks){
        storedTasks.forEach((task)=> tasks.push(task));
        updateTasksList();
        updateStats();
    }
})

let tasks = [];

const saveTasks = ()=>{
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

const addTask = () => {
    const taskInput = document.getElementById('taskInput');
    const text = taskInput.value.trim();

    if (text) {
        tasks.push({
            text: text,
            completed: false
        });

        updateTasksList();
        updateStats();
        saveTasks();

        taskInput.value = '';
    }
};

const toggleTaskComplete = (index) =>{
    tasks[index].completed = !tasks[index].completed;
    updateTasksList();
    updateStats();
    saveTasks();
}

const deleteTask = (index) =>{
    tasks.splice(index, 1);
    updateTasksList();
    updateStats();
    saveTasks();
}

const editTask = (index) => {
    const taskInput = document.getElementById('taskInput');
    taskInput.value = tasks[index].text;

    tasks.splice(index, 1);
    updateTasksList();
    updateStats();
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
saveTasks();