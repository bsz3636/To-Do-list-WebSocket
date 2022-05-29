import React from 'react';
import io from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';

class App extends React.Component {

  state = {
    tasks: [],
    taskName: '',
  }


  componentDidMount() {
    this.socket = io('localhost:8000', { transports: ['websocket'] });
    this.socket.on('removeTasks', id => this.removeTask(id));
    this.socket.on('addTask', newTasks => this.addTask(newTasks));
    this.socket.on('updateTask', task => this.updateTask(task));
  };

  updateTasks = newTasks => {
    this.setState({ tasks: newTasks });
  };

  removeTask = (id, local = false) => {
    this.setState({
      tasks: this.state.tasks.filter(task => task.id !== id),
    });
    if (local) {
      this.socket.emit('removeTask', id);
    }
  };

  addTask = task => {
    this.setState({
      tasks: [...this.state.tasks, task]
    });
  };

  submitForm = event => {
    event.preventDefault();
    const id = uuidv4();
    const newTask = {id, name: this.state.taskName};
    this.addTask(newTask);
    this.socket.emit('addTask', newTask);
    this.setState({taskName: ''})
  };

  render() {
    return (
      <div className="App">

        <header>
          <h1>ToDoList.app</h1>
        </header>

        <section className="tasks-section" id="tasks-section">
          <h2>Tasks</h2>

          <ul className="tasks-section__list" id="tasks-list">
            {this.state.tasks.map(({ id, name }) => (
              <li className="task">
                {name}
                <button 
                  onClick={() => this.removeTask(id, true)}
                  className='btn btn--red'>
                  Remove
                </button>
              </li>
            ))}
          </ul>

          <form id="add-task-form" onSubmit={event => this.submitForm(event)}>
            <input 
            className="text-input" 
            autocomplete="off" 
            type="text" 
            placeholder="Type your description" 
            id="task-name" 
            value={this.state.taskName}
            onChange={event => this.setState({ taskName: event.target.value })}/>
            <button className="btn" type="submit">Add</button>
          </form>

        </section>
      </div>
    );
  };

};

export default App;
