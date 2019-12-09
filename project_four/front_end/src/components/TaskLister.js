import React from "react";
import Nav from "./Nav";
import TaskCard from "./TaskCard";
import ViewTask from "./ViewTask";
import  CreateTask  from './CreateTask';

class TaskLister extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isCreatingTask: false,
      isViewingTask: false,
      taskInfo: ""
    };
  }
  displayTasks = () => {
    const { tasks } = this.props;
    const allTasks = [];
    tasks.forEach(tasksArray => {
      tasksArray.forEach(task => {
        allTasks.push(task);
      });
    });

    return allTasks.map(task => (
      <TaskCard
        viewTask={()=> this.viewTask(task)}
        key={task.id}
        title={task.name}
        status={task.status}
      />
    ));
  };

  addTask = () => {
    this.setState({ isCreatingTask: true });
  };

  viewTask = taskInfo => {
    this.setState({ isViewingTask: true, taskInfo });
  };

  hideModal = () => {
    this.setState({
      isViewingTask: false,
      isCreatingTask: false,
      taskInfo: ""
    });
  };

  displayTask = () => {
    const { taskInfo } = this.state;
    return (
      <ViewTask
        taskId={taskInfo.id}
        title={taskInfo.name}
        description={taskInfo.description}
        hide={this.hideModal}
      />
    );
  };

  render() {
    const {isViewingTask, isCreatingTask} = this.state;
    return (
      <div>
        <Nav logout={this.props.logout} />
        <h1>TaskLister</h1>
        <button onClick={this.addTask}>Create Goal</button>
        <div>{this.displayTasks()}</div>
        {isCreatingTask ? <CreateTask hide={this.hideModal} /> : null}
        {isViewingTask ? this.displayTask() : null}
      </div>
    );
  }
}

export default TaskLister;
