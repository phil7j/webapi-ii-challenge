const express = require('express');
const postsRouter = require('./posts/posts-router.js');
const data = require('./data/db');

// Express
const server = express();
server.use(express.json());

// Get on all posts
server.get('/api/posts', (req,res)=>{
    data.find()
    .then( data => {
        res.status(200).json(data)
    })
    .catch( err => {
        res.status(500).json({error: "The posts information could not be retrieved."})
    })
})

server.post('/api/posts', (req,res) =>{
    console.log("Data recieved from Body", req.body);
    const {title, contents} = req.body;

    // No title or contents in Body? That returns an error
    !title || !contents ? res.status(400).json({errorMessage: "Please provide title and contents for the post."}) :

    data.insert(req.body)
        .then( result => {
            data.findById(result.id).then(post => {
                res.status(201).json(post)
            } )
            .catch(error => res.status(500).json({error: "The post information could not be modified."}))

        })
        .catch( err => {
            res.status(500).json({ error: "There was an error while saving the post to the database" })
        })
})


server.use('/api/posts', postsRouter);

server.listen(8000, () => console.log('\nAPI running\n'));
