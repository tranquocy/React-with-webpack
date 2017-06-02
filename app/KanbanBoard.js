import React, { Component } from 'react';
import PropTypes from 'prop-types';
import List from './List';
import update from 'react-addons-update';
import 'babel-polyfill';

const API_URL = 'http://kanbanapi.pro-react.com';
const API_HEADERS = {
  'Content-Type': 'application/json',
  Authorization: 'any-string-you-like'// The Authorization is not needed for local server
};

class KanbanBoardContainer extends Component {
  constructor(){
    super(...arguments);
    this.state = {
      cards: []
    };
  }
  componentDidMount(){
    fetch(API_URL+'/cards', {headers: API_HEADERS})
    .then((response) => response.json())
    .then((responseData) => {
      this.setState({cards: responseData});
    })
    .catch((error) => {
      console.log('Error fetching and parsing data', error);
    });
  }
  addTask(cardId, taskName){
    // Find the index of the card
    let cardIndex = this.state.cards.findIndex((card)=>card.id == cardId);
    // Create a new task with the given name and a temporary ID
    let newTask = {id:Date.now(), name:taskName, done:false};
    // Create a new object and push the new task to the array of tasks
    let nextState = update(this.state.cards, {
      [cardIndex]: {
      tasks: {$push: [newTask] }
      }
    });
    // set the component state to the mutated object
    this.setState({cards:nextState});
    // Call the API to add the task on the server
    fetch(`${API_URL}/cards/${cardId}/tasks`, {
      method: 'post',
      headers: API_HEADERS,
      body: JSON.stringify(newTask)
    })
    .then((response) => response.json())
    .then((responseData) => {
      // When the server returns the definitive ID
      // used for the new Task on the server, update it on React
      newTask.id=responseData.id
      this.setState({cards:nextState});
    });
  }
  deleteTask(cardId, taskId, taskIndex){
    // Find the index of the card
    let cardIndex = this.state.cards.findIndex((card)=>card.id == cardId);
    // Create a new object without the task
    let nextState = update(this.state.cards, {
    [cardIndex]: {
      tasks: {$splice: [[taskIndex,1]] }
    }
    });
    // set the component state to the mutated object
    this.setState({cards:nextState});
    // Call the API to remove the task on the server
    fetch(`${API_URL}/cards/${cardId}/tasks/${taskId}`, {
      method: 'delete',
      headers: API_HEADERS
    });
  }
  toggleTask(cardId, taskId, taskIndex){
    // Find the index of the card
    let cardIndex = this.state.cards.findIndex((card)=>card.id == cardId);
    // Save a reference to the task's 'done' value
    let newDoneValue;
    // Using the $apply command, you will change the done value to its opposite
    let nextState = update(this.state.cards, {
      [cardIndex]: {
        tasks: {
          [taskIndex]: {
            done: { $apply: (done) => {
              newDoneValue = !done
              return newDoneValue;
              }
            }
          }
        }
      }
    });
    // set the component state to the mutated object
    this.setState({cards:nextState});
    // Call the API to toggle the task on the server
    fetch(`${API_URL}/cards/${cardId}/tasks/${taskId}`, {
    method: 'put',
    headers: API_HEADERS,
    body: JSON.stringify({done:newDoneValue})
    });
  }
  render() {
    return (
      <KanbanBoard  cards={this.state.cards} 
                    taskCallbacks={{
                      toggle: this.toggleTask.bind(this),
                      delete: this.deleteTask.bind(this),
                      add: this.addTask.bind(this) }}/>
    )
  }
};

class KanbanBoard extends React.Component {
  render(){
    return (
      <div className="app">
        <List id='todo' title="To Do" taskCallbacks={this.props.taskCallbacks} cards={
          this.props.cards.filter((card) => card.status === "todo")
        } />
        <List id='in-progress' title="In Progress" taskCallbacks={this.props.taskCallbacks} cards={
          this.props.cards.filter((card) => card.status === "in-progress")
        } />
        <List id='done' title='Done' taskCallbacks={this.props.taskCallbacks} cards={
          this.props.cards.filter((card) => card.status === "done")
        } />
      </div>
    );
  }
};

KanbanBoard.propTypes = {
  cards: React.PropTypes.arrayOf(PropTypes.object),
  taskCallbacks: PropTypes.object
};
export default KanbanBoardContainer;