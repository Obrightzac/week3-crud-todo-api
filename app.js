const express = require('express');

const app = express();

app.use(express.json());

// In-memory database
let todos = [
    { id: 1, task: 'Learn Node.js', completed: false },
    { id: 2, task: 'Build CRUD API', completed: false },
];

// Generate unique IDs
let nextId = 3;



// 1. GET ALL TODOS

app.get('/todos', (req, res) => {

    res.status(200).json(todos);

});





// 3. CREATE A NEW TODO

app.post('/todos', (req, res) => {

    const { task } = req.body;

    if (!task || typeof task !== 'string' || !task.trim()) {
        return res.status(400).json({
            message: 'Task field is required'
        });
    }

    const newTodo = {
        id: nextId++,
        task: task.trim(),
        completed: false
    };

    todos.push(newTodo);

    res.status(201).json(newTodo);

});


// 4. UPDATE A TODO

app.patch('/todos/:id', (req, res) => {

    const id = parseInt(req.params.id);

    const todo = todos.find((t) => t.id === id);

    if (!todo) {
        return res.status(404).json({
            message: 'Todo not found'
        });
    }

    const { task, completed } = req.body;

    if (task !== undefined) {

        if (typeof task !== 'string' || !task.trim()) {
            return res.status(400).json({
                message: 'Task must be a non-empty string'
            });
        }

        todo.task = task.trim();
    }

    if (completed !== undefined) {

        if (typeof completed !== 'boolean') {
            return res.status(400).json({
                message: 'Completed must be true or false'
            });
        }

        todo.completed = completed;
    }

    res.status(200).json(todo);

});



// 5. DELETE A TODO

app.delete('/todos/:id', (req, res) => {

    const id = parseInt(req.params.id);

    const initialLength = todos.length;

    todos = todos.filter((t) => t.id !== id);

    if (todos.length === initialLength) {
        return res.status(404).json({
            message: 'Todo not found'
        });
    }

    res.status(204).send();

});


// 6. GET COMPLETED TODOS

app.get('/todos/completed', (req, res) => {

    const completed = todos.filter((t) => t.completed);

    res.status(200).json(completed);

});


// 7. GET ACTIVE TODOS

app.get('/todos/active', (req, res) => {

    const active = todos.filter((t) => !t.completed);

    res.status(200).json(active);

});


// 2. GET SINGLE TODO

app.get('/todos/:id', (req, res) => {

    const id = parseInt(req.params.id);

    const todo = todos.find((t) => t.id === id);

    if (!todo) {
        return res.status(404).json({
            message: 'Todo not found'
        });
    }

    res.status(200).json(todo);

});


// ERROR HANDLING

app.use((err, req, res, next) => {

    console.error(err);

    res.status(500).json({
        error: 'Server error!'
    });

});


// START SERVER

const PORT = 3002;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});