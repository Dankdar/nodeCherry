const exp = require('express');
const Joi = require('joi');
const axios = require('axios');
const fileStream = require('fs');
const path = require('path');
// const app = exp();
const router = exp.Router();
const TaskController = require('../../controllers/TaskController');

router.get('/taskList',(req,res) => {
    // res.send(JSON.stringify(taskList))
    res.send(TaskController.IndexTasklist(req));

}) // Get All Tasks in TaskList.

router.get('/:id',(reqs,res) => {
    const result = TaskController.Show(req);
    return !result ? res.status(404).send(`Could Not Find Task With Given Id: ${req.params.id}`) : res.send(JSON.stringify(result));
}) // Get Specific Task in TaskList.

router.get('/',(req,res) => {
    res.send(TaskController.Index(req));
}) // Get All Tasks.

router.put('/add/:id',(req,res) => {
    const { message , code } = TaskController.addTask(req);
    res.status(code ?? 500).send(message)
}) // Add a Task to TaskList.

router.post('/taskList/new',(req,res) => {
    // res.send(req.body)
    const schema = Joi.object({
        assignee: Joi.string().min(3).required(),
        assigner: Joi.string().min(3).required(),
        details: Joi.string().required(),
        priority: Joi.string().required()
    })

    const result = schema.validate(req.body);

    const errors = [];
    if(result.error){
        result.error.details.forEach(item => {
            errors.push(item.message);
        })

        res.status(400).send(errors);
    }

    res.status(200).send(TaskController.createTask(req))

    // const trackToAdd = {
    //     id: allTasks.length +1 , task: { assignee: req.body.assignee, assigner: req.body.assigner, details: req.body.details },
    //     priority: req.body.priority
    // }
    // allTasks.push(trackToAdd);
    // res.send(allTasks)

}) // Create a new Task and add into AllTasks.

router.delete('/taskList/remove/:id',(req,res) => {
    const { message , code } = TaskController.removeTask(req);
    res.status(code ?? 500).send(message)

    // const toRemove = allTasks.find(item => item.id == req.params.id);
    // const checker = taskList.find(item => item.id == req.params.id);
    // if(toRemove && checker){
    //     let newtaskList = [];
    //     taskList.forEach(item=>{
    //         if(item.id != checker.id) newtaskList.push(item);
    //     })
    //     taskList = newtaskList;
    //     res.send(taskList)
    // }else{
    //     if(!toRemove){
    //         res.status(404).send('Track Not Found');
    //     }
    //     else if(!checker){
    //         res.status(400).send(`Track Not Present in taskList: ${JSON.stringify(toRemove)}`);
    //     }
    // }
}) // Remove Task from Tasklist.

router.get('/taskList/saveTasks',async (req, res) => {
    let toWrite = JSON.stringify(taskList);
    fileStream.writeFileSync('TaskList.json',toWrite)
    let filePath = path.join(__dirname,'TaskList.json')
    res.download(filePath)

}) // Write All Available in the tasks and return/save a file with json.

module.exports = router;
