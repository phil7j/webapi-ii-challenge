const router = require('express').Router();

const data = require('../data/db');

router.post('/:id/comments', (req,res)=>{

    console.log("Data recieved from Body", req.body);
    const {text, id} = req.body;

    // No name or bio in Body? That returns an error
    !text || !id ? res.status(400).json({errorMessage: "Please provide text and post ID for the comment."}) :

    data.insertComment(req.body)
    .then(response => {
        console.log("Succes, Here is comment ID", response)
        data.findCommentsById(response)
            .then( response => {
                res.status(201).json(response)
            })
            .catch(err => {
                res.status(500).json({ error: "There was an error while saving the comment to the database" })
            })
    })
    .catch( err => {
        res.status(404).json({ message: "The post with the specified ID does not exist." })
    })
})

router.get('/:id', (req,res)=>{
    const id = req.params.id

    data.findById(id)
        .then(response => {
          !response ? res.status(404).json({message: "The post with the specified ID does not exist."}) :
          res.status(200).json(response)
        })
        .catch( err => {
            res.status(500).json({error: "The post information could not be retrieved."})
        })
})

router.delete('/:id', (req,res)=> {
    const id = req.params.id;
    // first find by ID
   let post = data.findById(id)
        .then( response => {
            !response ? res.status(404).json({message: "The post with the specified ID does not exist."}):
            res.status(200);
            return response;
        }).catch( err => {
            res.status(500).json({error: "The post could not be removed"})
        })
    //delete post and return it
      data.remove(id)
        .then( response => {
            res.status(200).json(post);
        })
        .catch( err => {
            res.status(500).json({error: "The post could not be removed" })
        })
})

router.put('/id', (req,res) => {
    const id = req.params.id;
    const {title, contents} = req.body;

    !title || !contents ? res.status(400).json({ errorMessage: "Please provide title and contents for the post."}) :
    data.findById(id)
        .then( post => {
            data.update(id,req.body)
                .then( response => {
                    res.status(200).json(post)
                })
                .catch( err => {
                    res.status(500).json({error: "The post information could not be modified." })
                })
        }
        )
        .catch( err => {
            res.status(404).json({message: "The post with the specified ID does not exist."})
        })
})

// export default router;
module.exports = router;