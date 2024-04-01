const exp = require('express');
const Joi = require('joi');
const path = require('path');
// const axios = require('axios');
const fileStream = require('fs');
const app = exp();


app.use(exp.json()) // Middleware to use json

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

app.get('/api/tasks/:id',(req,res) => {
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

app.get('/api/taskList',(req,res) => {
    res.send(JSON.stringify(taskList))
}) // Get All Tasks in TaskList.

app.get('/api/tasks',(req,res) => {
    res.send(JSON.stringify(allTasks))
}) // Get All Tasks.

app.put('/api/taskList/add/:id',(req,res) => {

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
}) // Add/Append a Task to TaskList.

app.post('/api/taskList/new',(req,res) => {
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

app.delete('/api/taskList/remove/:id',(req,res) => {
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

app.get('/api/taskList/saveTasks',async (req, res) => {
    let toWrite = JSON.stringify(taskList);
    fileStream.writeFileSync('TaskList.json',toWrite)
    let filePath = path.join(__dirname,'TaskList.json')
    res.download(filePath)

}) // Write All Available in the tasks and return/save a file with json.

// app.get('/api/taskList/:name/bio',async (req, res) => {
//     let url = `https://www.theaudiodb.com/api/v1/json/2/search.php?s=${req.params.name}`
//     // let url_dos = `https://www.theaudiodb.com/api/v1/json/2/search.php?s=${req.params.name}`
//
//     const schema = Joi.object({
//         name: Joi.string().min(3).required()
//     })
//
//     const result = schema.validate(req.params);
//
//     const errors = [];
//     if (result.error) {
//         result.error.details.forEach(item => {
//             errors.push(item.message);
//         })
//
//         res.status(400).send(errors)
//     }
//     try {
//         const response = await axios.get(url);
//         // const response = await app.fetch(url);
//         res.json(response.data);
//     } catch (error) {
//         console.error('Error fetching third-party API:', error);
//         res.status(500).send('Failed to fetch data');
//     }
// }) // OpenAPI to get Artist Biography.

const port = process.env.PORT || 3000
app.listen(port,() => console.log(`listening on port ${port} ...`))