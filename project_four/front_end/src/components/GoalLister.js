import React from "react";
import Nav from "./Nav";
import GoalCard from "./GoalCard";
import CreateGoal from "./CreateGoal";
import { Link, Redirect } from "react-router-dom";
import ViewGoal from "./ViewGoal";
import AddIcon from "../assets/add.png";
import { SearchInput } from "evergreen-ui";
import { join } from "path";
import _ from "lodash";

class GoalLister extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isCreatingGoal: false,
      isViewingGoal: false,
      goalInfo: "",
      searchTerm: "",
      goals: this.props.goals
    };

    this.handleInputChange = e => {
      const searchTerm = e.target.value;
      let user = window.localStorage.getItem("userSession");
      user = JSON.parse(user);

      if (!searchTerm) {
        fetch(`/goals/${user.id}`)
          .then(res => res.json())
          .then(data => {
            this.setState({ goals: data });
          });
      } else {
        fetch(`/goals/${user.id}/${searchTerm}`)
          .then(res => res.json())
          .then(data => {
            this.setState({ goals: data });
          });
      }
    };
  }

  displayGoals = () => {
    const { goals } = this.state;
    if (goals.length) {
      return goals.map(goal => (
        <GoalCard
          handleClick={() => this.viewGoal(goal)}
          key={goal.id}
          title={goal.name}
          status={goal.status}
        />
      ));
    }

    return <h1>Sorry, not goals</h1>;
  };

  addGoal = () => {
    this.setState({ isCreatingGoal: true });
  };

  viewGoal = goalInfo => {
    this.setState({ isViewingGoal: true, goalInfo });
  };

  hideModal = () => {
    this.setState({
      isViewingGoal: false,
      isCreatingGoal: false,
      goalInfo: ""
    });
  };

  submitGoalInfo = goalInfo => {
    this.hideModal();
    this.props.createGoal(goalInfo);
  };

  displayGoal = () => {
    const { goalInfo } = this.state;
    const { deleteGoal, editGoal, createTask } = this.props;
    return (
      <ViewGoal
        goalId={goalInfo.id}
        name={goalInfo.name}
        reason={goalInfo.reason}
        status={goalInfo.status}
        description={goalInfo.description}
        hide={this.hideModal}
        deleteGoal={deleteGoal}
        editGoal={editGoal}
        createTask={createTask}
      />
    );
  };

  render() {
    const { isCreatingGoal, isViewingGoal, goalInfo } = this.state;
    const { redirect, createGoal, tasks, deleteGoal } = this.props;
    const shouldHaveOverlay = isCreatingGoal || isViewingGoal;

    if (redirect) {
      return <Redirect to="/" />;
    }

    return (
      <div className="main-wrapper">
        <Nav logout={this.props.logout} />
        <div className="goal-lister-container">
          <div className="goal-lister-header">
            <h1>GoalLister</h1>
            <div>
              <button className="add-goal-btn" onClick={this.addGoal}>
                Create Goal
              </button>
            </div>
          </div>

          <div className="goal-lister-input-container">
            <SearchInput
              onChange={e => this.handleInputChange(e)}
              placeholder="Filter goals by name..."
              width="100%"
            />
          </div>

          <div className="goals-gird-container">{this.displayGoals()}</div>

          {isCreatingGoal ? (
            <CreateGoal
              hide={this.hideModal}
              createGoal={this.submitGoalInfo}
            />
          ) : null}
          {isViewingGoal ? this.displayGoal() : null}
        </div>
      </div>
    );
  }
}

export default GoalLister;
