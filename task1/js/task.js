const addTask = document.querySelector("#addTask")
const taskWrap = document.querySelector("#taskWrap")
const singleWrap = document.querySelector("#singleWrap")
const editWrap = document.querySelector("#editWrap")

const taskHeads = [
    { key: "id", default: Date.now() },
    { key: "status", default: false },
    { key: "taskTitle", default: null },
    { key: "taskContent", default: null },
    { key: "description", default: null },
]

const addFun = (e) => {
    e.preventDefault() // prevent auto-reload & sending attribute values in url
    const allTasks = readFromLocalStorage()
    const data = {}

    taskHeads.forEach(head => {
        console.log(head.key)
        if (head.default == null) data[head.key] = addTask.elements[head.key].value
        else data[head.key] = head.default
    })

    allTasks.push(data)
    writeToStorage(allTasks)
    addTask.reset()
    window.location.href = "index.html"
}

const readFromLocalStorage = (storageKey = "tasks", option = "array") => {
    let data
    try {
        data = localStorage.getItem(storageKey)
        if (option != "string") data = JSON.parse(data) || []
        if (!Array.isArray(data) && option == "array") throw new Error("invalid input")

    } catch (e) {
        data = []
    }
    return data
}

const writeToStorage = (data, storageKey = "tasks") => localStorage.setItem(storageKey, JSON.stringify(data))

if (addTask) addTask.addEventListener("submit", addFun)

// append html div for tasks
const createMyElement = (el, parent, classes, txt = null) => {
    const myEle = document.createElement(el)
    parent.appendChild(myEle)
    myEle.classList = classes
    if (txt) myEle.textContent = txt
    return myEle
}

const deleteTask = (i, allTasks) => {
    allTasks.splice(i, 1)
    writeToStorage(allTasks)
    drawData(allTasks)
}

const changeStatus = (i, allTasks) => {
    allTasks[i].status = !allTasks[i].status
    writeToStorage(allTasks)
    drawData(allTasks)
}

const showTask = (i, allTasks) => {
    writeToStorage(allTasks[i], "singleTask")
    writeToStorage(i, "singleIndex")
    window.location.href = "single.html"
}

const editTask = (i, allTasks) => {
    writeToStorage(allTasks[i], "singleTask")
    writeToStorage(i, "singleIndex")
    window.location.href = "edit.html"
}

const editSingleTask = (task, i, allTasks) => {
    console.log(task)
    for (var key in task) {
        for (let i = 0; i < editWrap.elements.length; i++) {
            if (editWrap.elements[i].name == key) editWrap.elements[i].value = task[key]
        }
    }
}

const saveEdit = (e) => {
    e.preventDefault()
    const allTasks = readFromLocalStorage()
    const task = readFromLocalStorage("singleTask", "object")
    const index = readFromLocalStorage("singleIndex", "string")
    for (key in task) {
        for (let i = 0; i < editWrap.elements.length; i++) {
            if (editWrap.elements[i].name == key) {
                task[key] = editWrap.elements[i].value
            }
        }
    }
    allTasks.splice(index, 1, task)
    writeToStorage(allTasks)
    writeToStorage(task, "singleTask")
    window.location.href = "index.html"
}

const drawSingleTask = (task, i, allTasks, container) => {

    const d1 = createMyElement("div", container, "col-4")
    let c;
    if (task.status) c = "p-2 border border-primary m-2 bg-primary"
    else c = "p-2 border border-primary m-2 bg-danger"

    const d2 = createMyElement("div", d1, c)

    taskHeads.forEach(head => createMyElement("h3", d2, "", task[head.key]))

    const delBtn = createMyElement("button", d2, "btn btn-danger m-2", "Delete")
    const editBtn = createMyElement("button", d2, "btn btn-warning m-2", "Edit")
    const showBtn = createMyElement("button", d2, "btn btn-success m-2", "Show")
    const statusBtn = createMyElement("button", d2, "btn btn-primary m-2", "Change status")

    delBtn.addEventListener("click", () => deleteTask(i, allTasks))
    editBtn.addEventListener("click", () => editTask(i, allTasks))
    showBtn.addEventListener("click", () => showTask(i, allTasks))
    statusBtn.addEventListener("click", () => changeStatus(i, allTasks))
}

const drawData = (allTasks) => {
    taskWrap.innerHTML = ""
    allTasks.forEach((task, i) => drawSingleTask(task, i, allTasks, taskWrap))
}

if (taskWrap) {
    const allTasks = readFromLocalStorage()
    drawData(allTasks)
}

if (singleWrap) {
    const allTasks = readFromLocalStorage()
    const singleTask = readFromLocalStorage("singleTask", "object")
    const i = readFromLocalStorage("singleIndex", "string")
    drawSingleTask(singleTask, i, allTasks, singleWrap)
}

if (editWrap) {
    const allTasks = readFromLocalStorage()
    const task = readFromLocalStorage("singleTask", "object")
    const i = readFromLocalStorage("singleIndex", "string")
    editSingleTask(task, i, allTasks)
    editWrap.addEventListener("submit", saveEdit)
}