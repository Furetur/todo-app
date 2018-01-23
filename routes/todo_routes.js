const ObjectID = require('mongodb').ObjectID;
const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
    action: String,
    status: String,
    organised: Boolean,
    date: Date
});

const Todo = mongoose.model('Todo', todoSchema);

module.exports = function(app, db){

    //get a to-do
    app.get('/todo/:id', (req, res) => {
        const id = req.params.id;


        Todo.findById(id).exec().then(todo => {
            console.log('found a todo:', todo);
            res.send(todo);
        }).catch(e => {
            console.warn('error while getting a todo:', e);
        })
    });

    app.get('/todos/', (req, res) => {
        Todo.find().exec().then(todos => {
            console.log('found todos:', todos);
            res.send(todos)
        }).catch(e => {
            console.warn('error while getting todos:', e);
        })
    });


    app.delete('/todos/', (req, res) => {
        Todo.remove().exec().then(result => {
            console.log('deleted all:', result);
            res.send(result)
        }).catch(e => {
            console.warn('error while deleting all:', e);
        })
    })

    //add a to-do
    app.post('/todo', (req, res) => {
        const todo = new Todo({
            action: req.body.action,
            status: req.body.status,
            date: req.body.date,
            organised: req.body.organised
        });

        todo.save().then(savedTodo => {
            console.log('saved:', savedTodo);
            res.send(savedTodo)
        }).catch(e => {
            console.warn('error while saving a todo:', e);
        })

    });

    //delete a to-do
    app.delete('/todo/:id', (req, res) => {
        const id = req.params.id;

        Todo.findByIdAndRemove(id).exec().then(deletedTodo => {
            console.log('deleted todo:', deletedTodo);
            res.send(deletedTodo);
        }).catch(e => {
            console.warn('error while deleting a todo:', e);
        });
    });

    app.put('/todo/:id', (req, res) => {
        const id = req.params.id;


        Todo.findByIdAndUpdate(id, req.body).exec().then(updatedTodo => {
            console.log('updated todo:', updatedTodo);
            res.send(updatedTodo);
        }).catch(e => {
            console.warn('error while updating a todo:', e);
        });
    })

};