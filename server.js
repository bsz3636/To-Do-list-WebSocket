const express = require('express');
const socket = require('socket.io');

const app = express();

const server = app.listen(process.env.PORT || 8000, () => {
  console.log('Server is running...');
});
const io = socket(server);

const tasks = [];
console.log('tasks',tasks );

app.use((req, res) => {
  res.status(404).send({ message: 'Not found...' });
});

io.on('connection', (socket) => {
  socket.emit('updateData', tasks);

  socket.on('addTask', (task) => { 
    tasks.push(task);
    socket.broadcast.emit('addTask', task);
  });

  socket.on('removeTask', (taskId) => {
    const taskIdIndex = tasks.findIndex(task => task.id === taskId);
    tasks.splice(taskIdIndex, 1);
    socket.broadcast.emit('removeTask', taskId);
  });

  socket.on('updateTask', (task) => {
    tasks.push(task);
    socket.broadcast.emit('updateTask', task);
  });
});