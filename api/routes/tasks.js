const exp = require('express');
const Joi = require('joi');
const axios = require('axios');
const fileStream = require('fs');
const path = require('path');
// const app = exp();
const router = exp.Router();

let taskList = [
    {
        id: 1 , task: { assignee: "Employee 1", assigner:"Manager 1", details:'Cleaning floors.' } ,
        priority:"High"
    },
    {
        id: 2 , task: { assignee: "Employee 2", assigner:"Manager 1", details:'Cleaning windows.' } ,
        priority:"Low"
    },
    {
        id: 3 , task: { assignee: "Employee 3", assigner:"Manager 1", details:'Cleaning roofs.' } ,
        priority:"Medium"
    },
    {
        id: 4 , task: { assignee: "Employee 4", assigner:"Manager 1", details:'Cleaning tables.' } ,
        priority:"High"
    },
]

const allTasks = [
    {
        id: 1 , task: { assignee: "Employee 1", assigner:"Manager 1", details:'Cleaning floors.' } ,
        priority:"High"
    },
    {
        id: 2 , task: { assignee: "Employee 2", assigner:"Manager 1", details:'Cleaning windows.' } ,
        priority:"Low"
    },
    {
        id: 3 , task: { assignee: "Employee 3", assigner:"Manager 1", details:'Cleaning roofs.' } ,
        priority:"Medium"
    },
    {
        id: 4 , task: { assignee: "Employee 4", assigner:"Manager 1", details:'Cleaning tables.' } ,
        priority:"High"
    },
    {
        id: 5 , task: { assignee: "Employee 5", assigner:"Manager 1", details:'Cleaning utensils.' } ,
        priority:"High"
    },
    {
        id: 6 , task: { assignee: "Employee 6", assigner:"Manager 1", details:'Cleaning equipment.' } ,
        priority:"High"
    },
]

router.get('/:id',(req,res) => {
    // res.send('hello getter method request');
    // res.send(req.params.id);
    const track = taskList.filter(item=>item.id==req.params.id);
    // const track = taskList.find(item=>item.id==req.params.id);
    // res.send(JSON.stringify(track.length));
    // res.send(track);
    return !track.length ? res.status(404).send(`Could Not Find Track With Given Id: ${req.params.id}`) : res.send(JSON.stringify(track));

    // if(track.length){
    //     return track;
    // }
    // else{
    //     res.status(404).send(`Could Not Find Track With Given Id: ${req.params.id}`)
    // }
}) // Get Specific Task in TaskList.

router.get('/taskList',(req,res) => {
    res.send(JSON.stringify(taskList))
}) // Get All Tasks in TaskList.

router.get('/',(req,res) => {
    res.send(JSON.stringify(allTasks))
}) // Get All Tasks.

router.put('/add/:id',(req,res) => {

    const toAdd = allTasks.find(item => item.id == req.params.id);
    const checker = taskList.find(item => item.id == req.params.id);
    if(toAdd && !checker){
        taskList.push(toAdd)
        res.send(taskList)
    }else{
        if(!toAdd){
            res.status(404).send('Track Not Found');
        }
        else if(checker){
            res.status(400).send(`Track Already Present in taskList: ${JSON.stringify(checker)}`)
        }
    }

    // res.send(JSON.stringify(taskList))
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

        res.status(400).send(errors)
    }
    const trackToAdd = {
        id: allTasks.length +1 , task: { assignee: req.body.assignee, assigner: req.body.assigner, details: req.body.details },
        priority: req.body.priority
    }
    allTasks.push(trackToAdd);
    res.send(allTasks)

}) // Create a new Task and add into AllTasks.

router.delete('/taskList/remove/:id',(req,res) => {
    const toRemove = allTasks.find(item => item.id == req.params.id);
    const checker = taskList.find(item => item.id == req.params.id);
    // res.send(toRemove);
    if(toRemove && checker){
        let newtaskList = [];
        taskList.forEach(item=>{
            if(item.id != checker.id) newtaskList.push(item);
        })
        // for (let i = 0; i < taskList.length; i++) {
        //     if (taskList[i].id != req.params.id) { // Use strict comparison (===)
        //         newtaskList.push(taskList[i]);
        //     }
        // }

        taskList = newtaskList;
        res.send(taskList)
    }else{
        if(!toRemove){
            res.status(404).send('Track Not Found');
        }
        else if(!checker){
            res.status(400).send(`Track Not Present in taskList: ${JSON.stringify(toRemove)}`)
        }
    }
}) // Remove Task from Tasklist.

router.get('/taskList/saveTasks',async (req, res) => {
    let toWrite = JSON.stringify(taskList);
    fileStream.writeFileSync('TaskList.json',toWrite)
    let filePath = path.join(__dirname,'TaskList.json')
    res.download(filePath)

}) // Write All Available in the tasks and return/save a file with json.

module.exports = router;
