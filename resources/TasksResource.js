const filestream = require('fs');

class Task {
    constructor(assignee, assigner, details, priority) {
        this.assignee = assignee;
        this.assigner = assigner;
        this.details = details;
        this.priority = priority;
    }

    static getAllTasks() {
        try {
            return filestream.readFileSync('resources/storage/AllTasks.json', 'utf8');
        } catch (err) {
            console.error(err);
        }
    }

    static getTasklist() {
        try {
            return filestream.readFileSync('resources/storage/MyTaskList.json', 'utf8');
        } catch (err) {
            console.error(err);
        }
    }

    static addTask(task) {
        try {
            let data = JSON.parse(filestream.readFileSync('resources/storage/AllTasks.json', 'utf8'));
            let toWrite = [];
            data.forEach(item => {toWrite.push(item)})
            toWrite.push(task)
            filestream.writeFileSync('resources/storage/AllTasks.json',JSON.stringify(toWrite), (err)=>{
                if( err ) {
                    throw err;
                }
            });
            return this.getAllTasks();
        } catch (err) {
            console.error(err);
        }
    }

    static addToMyTask(task) {
        try {
            let data = JSON.parse(filestream.readFileSync('resources/storage/MyTaskList.json', 'utf8'));
            let toWrite = [];
            data.forEach(item => {toWrite.push(item)})
            toWrite.push(task)
            filestream.writeFileSync('resources/storage/MyTaskList.json',JSON.stringify(toWrite), (err)=>{
                if( err ) {
                    throw err;
                }
            });
        } catch (err) {
            console.error(err);
        }
    }

    static removeMyTask(task) {
        try {
            let data = JSON.parse(filestream.readFileSync('resources/storage/MyTaskList.json', 'utf8'));
            let toWrite = [];
            data.forEach(item => { if(item.id!=task.id) toWrite.push(item)} )
            filestream.writeFileSync('resources/storage/MyTaskList.json',JSON.stringify(toWrite), (err)=>{
                if( err ) {
                    throw err;
                }
            });
        } catch (err) {
            console.error(err);
        }
    }
}

module.exports = Task;
