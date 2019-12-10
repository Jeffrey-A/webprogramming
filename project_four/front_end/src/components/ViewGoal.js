import React from "react";
import TaskCard from "./TaskCard";
import CreateTask from "./CreateTask";
import EditGoal from "./EditGoal";

class ViewGoal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fetchTasks: [],
      isCreatingTask: false,
      isEditingGoal: false
    };
  }
  componentDidMount() {
    const { goalId } = this.props;
    fetch(`http://localhost:5000/tasks/${goalId}`)
      .then(res => res.json())
      .then(data => this.setState({ fetchTasks: data }));
  }

  displayTasks = () => {
    const { fetchTasks } = this.state;
    const container = [];
    fetchTasks.forEach(task => {
      container.push(
        <TaskCard key={task.id} title={task.name} status={task.status} />
      );
    });

    if (!container.length) {
      return <p>Sorry, there are not tasks for this goal</p>;
    }

    return container;
  };

  createTask = () => {
    this.setState({ isCreatingTask: true });
  };

  editGoal = () => this.setState({ isEditingGoal: true });

  cancelGoalEdit = () => this.setState({ isEditingGoal: false });

  cancelTaskCreation = () => this.setState({ isCreatingTask: false });

  render() {
    const { name, reason, description, deleteGoal, goalId } = this.props;
    const { isCreatingTask, isEditingGoal } = this.state;

    if (isCreatingTask) {
      return <CreateTask cancel={this.cancelTaskCreation} />;
    }

    if (isEditingGoal) {
      return <EditGoal cancel={this.cancelGoalEdit} />;
    }

    return (
      <div className="overlay">
        <span className="closeModal" onClick={this.props.hide}>
          X
        </span>

        <div className="view-goal">
          <div>
            <h2>{name}</h2>
          </div>

          <div>
            <button onClick={this.createTask}>Add Task</button>
            <button onClick={this.editGoal}>Edit Goal</button>
            <select>
              <option>Status</option>
              <option>Not started</option>
              <option>In progress</option>
              <option>On hold</option>
              <option>Complete</option>
            </select>
            <button onClick={() => deleteGoal(goalId)}>Delete</button>
          </div>

          <div>
            <h3>Why I want to do it</h3>
            <p>{reason}</p>

            <h3>Descriptions</h3>
            <p>{description}</p>
          </div>

          <div>
            <h3>Daily Tasks</h3>
            <div>{this.displayTasks()}</div>
          </div>
        </div>
      </div>
    );
  }
}

export default ViewGoal;
