const Task = require('../resources/TasksResource');
class TaskController {
    constructor(req) {
        this.req = req;
    }

    static Index(req) {
        return Task.getAllTasks();
    }

    static Show(req) {
        const allTasks  = JSON.parse(Task.getAllTasks());
        const id = req.params.id;

        let arr = []
        allTasks.forEach(item=>{
            arr.push(item)
        })
        let task = arr.filter(item => parseInt(item.id) == req.params.id);
        console.log("task=> ",task);

        return !task.length ? false : task;
    }

    static IndexTasklist(req){
        return Task.getTasklist()
    }

    static addTask(req){
        const toAdd = JSON.parse(Task.getAllTasks()).find(item => item.id == req.params.id);
        const checker = JSON.parse(Task.getTasklist()).find(item => item.id == req.params.id);
        let message = '';
        let code = '';

        if(toAdd && !checker){
            Task.addToMyTask(toAdd);
            code = 200;
            message = `Task Added ${this.IndexTasklist(req)}`
        }else{
            if(!toAdd){
                code = 404;
                message = 'Task Not Found';
            }
            else if(checker){
                code = 400;
                message = `Task Already Present in taskList: ${JSON.stringify(checker)}`;
            }
        }

        return { message , code };
    }

    static createTask(req){
        // console.log(req.body)
        const length  = JSON.parse(Task.getAllTasks()).length;

        // console.log('len=> ',length)
        const taskToAdd = {
            id: length +1 , task: { assignee: req.body.assignee, assigner: req.body.assigner, details: req.body.details },
            priority: req.body.priority
        }

        return Task.addTask(taskToAdd);

    }

    static removeTask(req){
        const toRemove = JSON.parse(Task.getAllTasks()).find(item => item.id == req.params.id);
        const checker = JSON.parse(Task.getTasklist()).find(item => item.id == req.params.id);
        let message = '';
        let code = '';

        console.log(toRemove)
        console.log(checker)

        if(toRemove && checker){
            Task.removeMyTask(toRemove);
            code = 200;
            message = `Task Removed ${this.IndexTasklist(req)}`
        }else{
            if(!toRemove){
                code = 404;
                message = 'Task Not Found';
            }
            else if(!checker){
                code = 400;
                message = `Task Not Present in taskList: ${JSON.stringify(toRemove)}`;
            }
        }

        return { message , code };
    }
}

module.exports = TaskController;
