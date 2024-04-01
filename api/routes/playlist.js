const exp = require('express');
const Joi = require('joi');
const axios = require('axios');
const router = exp.Router();

let playlist = [
    {
        id: 1 , track: { "nujabes":"luv sic pt.2" } ,
        genre:"hip-rap"
    },
    {
        id: 2 , track: { "kanye": "moon" } ,
        genre:"hip-hop"
    },
    {
        id: 3 , track: { "hozier": "too sweet" } ,
        genre:"indie-rock"
    },
    {
        id: 4 , track: { "joywave": "scared" } ,
        genre:"indie-punk"
    },
]

const allTracks = [
    {
        id: 1 , track: { artist: "nujabes", name:"luv sic pt.2" },
        genre:"hip-rap"
    },
    {
        id: 2 , track: { artist: "kanye", name: "moon" } ,
        genre:"hip-hop"
    },
    {
        id: 3 , track: { artist: "hozier", name: "too sweet" } ,
        genre:"indie-rock"
    },
    {
        id: 4 , track: { artist: "joywave", name : "scared" } ,
        genre:"indie-punk"
    },
    {
        id: 5 , track: { artist: "lord huron", name: "yawning grave, frozen coffin" } ,
        genre:"indie-rock"
    },
    {
        id: 6 , track: { artist: "mf doom", name: "books of war" } ,
        genre:"hip-rap"
    },
]

router.get('/:id',(req,res) => {
    // res.send('hello getter method request');
    // res.send(req.params.id);
    const track = playlist.filter(item=>item.id==req.params.id);
    // const track = playlist.find(item=>item.id==req.params.id);
    // res.send(JSON.stringify(track.length));
    // res.send(track);
    return !track.length ? res.status(404).send(`Could Not Find Track With Given Id: ${req.params.id}`) : res.send(JSON.stringify(track));

    // if(track.length){
    //     return track;
    // }
    // else{
    //     res.status(404).send(`Could Not Find Track With Given Id: ${req.params.id}`)
    // }
})

router.get('/',(req,res) => {
    res.send(JSON.stringify(playlist))
})

router.get('/tracks',(req,res) => {
    res.send(JSON.stringify(allTracks))
})

router.put('/add/:id',(req,res) => {

    const toAdd = allTracks.find(item => item.id == req.params.id);
    const checker = playlist.find(item => item.id == req.params.id);
    if(toAdd && !checker){
        playlist.push(toAdd)
        res.send(playlist)
    }else{
        if(!toAdd){
            res.status(404).send('Track Not Found');
        }
        else if(checker){
            res.status(400).send(`Track Already Present in PlayList: ${JSON.stringify(checker)}`)
        }
    }

    // res.send(JSON.stringify(playlist))
})

router.post('/new',(req,res) => {
    // res.send(req.body)
    const schema = Joi.object({
        name: Joi.string().min(3).required(),
        artist: Joi.string().min(3).required(),
        genre: Joi.string().nullable()
    })

    // const result = Joi.validate(req.body,schema);
    const result = schema.validate(req.body);
    // res.send(result);

    const errors = [];
    if(result.error){
        result.error.details.forEach(item => {
            errors.push(item.message);
        })

        res.status(400).send(errors)
    }
    const trackToAdd = {
        id: allTracks.length +1 , track: { artist: req.body.artist, name: req.body.name }
    }
    allTracks.push(trackToAdd);
    res.send(allTracks)

})

router.delete('/remove/:id',(req,res) => {
    const toRemove = allTracks.find(item => item.id == req.params.id);
    const checker = playlist.find(item => item.id == req.params.id);
    // res.send(toRemove);
    if(toRemove && checker){
        let newPlaylist = [];
        playlist.forEach(item=>{
            if(item.id != checker.id) newPlaylist.push(item);
        })
        // for (let i = 0; i < playlist.length; i++) {
        //     if (playlist[i].id != req.params.id) { // Use strict comparison (===)
        //         newPlaylist.push(playlist[i]);
        //     }
        // }

        playlist = newPlaylist;
        res.send(playlist)
    }else{
        if(!toRemove){
            res.status(404).send('Track Not Found');
        }
        else if(!checker){
            res.status(400).send(`Track Not Present in PlayList: ${JSON.stringify(toRemove)}`)
        }
    }
})

router.get('/:name/bio',async (req, res) => {
    let url = `https://www.theaudiodb.com/api/v1/json/2/search.php?s=${req.params.name}`
    // let url_dos = `https://www.theaudiodb.com/api/v1/json/2/search.php?s=${req.params.name}`

    const schema = Joi.object({
        name: Joi.string().min(3).required()
    })

    const result = schema.validate(req.params);

    const errors = [];
    if (result.error) {
        result.error.details.forEach(item => {
            errors.push(item.message);
        })

        res.status(400).send(errors)
    }
    try {
        const response = await axios.get(url);
        // const response = await app.fetch(url);
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching third-party API:', error);
        res.status(500).send('Failed to fetch data');
    }
})

module.exports = router