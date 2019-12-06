import React from "react";
import "./App.css";

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Link, Redirect } from "react-router-dom";

// Components
import Board from "./components/Board";
import EditGoal from "./components/EditGoal";
import EditTask from "./components/EditTask";
import GoalLister from "./components/GoalLister";
import Login from "./components/Login";
import Register from "./components/Register";
import TaskLister from "./components/TaskLister";
import Nav from "./components/Nav";
import Activity from "./components/Activity";
import NoFound from "./components/NoFoundPage";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      redirect: false,
      user: null,
      goals: [],
      tasks: []
    };
  }

  apiRequestLoop = inp => {
    let promiseArray = [];
    for (let i = 0; i < inp.length; i++) {
      promiseArray.push(
        fetch(`http://localhost:5000/tasks/${inp[i].id}`).then(response =>
          response.json()
        )
      );
    }
    return Promise.all(promiseArray);
  };

  componentDidMount() {
    let user = window.localStorage.getItem("userSession");
    if (user) {

      user = JSON.parse(user);

      fetch(`http://localhost:5000/goals/${user.id}`)
        .then(res => res.json())
        .then(goals => {
          return this.apiRequestLoop(goals).then(tasks => ({goals, tasks}));
        })
        .then(tasksAndGoals => {
          this.setState({
            user,
            goals: tasksAndGoals.goals,
            tasks: tasksAndGoals.tasks
          });
        });
    }
  }

  componentDidUpdate(prevProps) {
    if (this.state.redirect) {
      this.setState({ redirect: false });
    }
  }

  handleLogin = userInfo => {
    fetch("http://localhost:5000/login", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ ...userInfo })
    })
      .then(res => res.json())
      .then(data => {
        window.localStorage.setItem("userSession", JSON.stringify(data));
        this.setState({ user: data, redirect: true });
        
      })
      .catch(e => {
        alert(e);
      });
  };

  handleLogOut = () => {
    window.localStorage.clear();
    this.setState({ user: null, goals:[], tasks:[], redirect: true });
  };

  registerUser = userInfo => {
    fetch("http://localhost:5000/register", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ ...userInfo })
    }).then(res => {
      this.setState({ redirect: true });
    });
  };

  createGoal = userInfo => {
    const mock = {
      user_id: 1,
      description: "more text",
      name: "Testing another Goal",
      status: "in progress"
    };

    fetch("http://localhost:5000/createGoal/1", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(mock)
    }).then(res => {});
  };

  getGoals = () => {
    fetch("http://localhost:5000/goals/1")
      .then(res => res.json())
      .then(data => this.setState({ goals: data }));
  };

  getTasks = () => {
    fetch("http://localhost:5000/tasks/1")
      .then(res => res.json())
      .then(data => this.setState({ tasks: data }));
  };

  updateGoal = goalId => {
    fetch("http://localhost:5000/goals/1", {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        goalId: 2,
        newBody: `name = 'fake', description = 'fuck again'`
      })
    }).then(res => {});
  };

  updateTask = (taskId, newBody) => {
    fetch(`http://localhost:5000/tasks/${taskId}`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        taskId,
        newBody
      })
    }).then(res => {});
  };

  deleteGoal = goalId => {
    fetch(`http://localhost:5000/goals/${goalId}`, {
      method: "DELETE"
    }).then(res => {});
  };

  deleteTask = goalId => {
    fetch(`http://localhost:5000/tasks/${goalId}`, {
      method: "DELETE"
    }).then(res => {});
  };

  createTask = () => {
    const mock = {
      goal_id: 1,
      description: "more text",
      name: "Testing another Task",
      status: "in progress"
    };

    fetch("http://localhost:5000/createTask/1", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(mock)
    }).then(res => {});
  };

  editGoal = () => {};

  editTask = () => {};

  render() {
    const { goals, tasks } = this.state;

    const BoardComponent = () => (
      <Board name="props" logout={this.handleLogOut} />
    );
    const EditGoalComponent = () => <EditGoal name="props" />;
    const EditTaskComponent = () => <EditTask name="props" />;
    const GoalListerComponent = () => (
      <GoalLister
        logout={this.handleLogOut}
        goals={goals}
        tasks={tasks}
        redirect={this.state.redirect}
      />
    );
    const LoginComponent = () => (
      <Login login={this.handleLogin} redirect={this.state.redirect} />
    );
    const TaskListerComponent = () => (
      <TaskLister logout={this.handleLogOut} goals={goals} tasks={tasks} />
    );
    const NotFound = () => <NoFound name="props" logout={this.handleLogOut} />;
    const HomeComponent = () => (
      <Activity goals={goals} tasks={tasks} logout={this.handleLogOut} />
    );
    const RegisterComponent = () => (
      <Register
        redirect={this.state.redirect}
        registerUser={this.registerUser}
      />
    );

    return (
      <Router>
        <Switch>
          <Route exact path="/" component={HomeComponent} />
          <Route exact path="/tasks" component={TaskListerComponent} />
          <Route exact path="/editTask" component={EditTaskComponent} />
          <Route exact path="/goals" component={GoalListerComponent} />
          <Route exact path="/editGoal" component={EditGoalComponent} />
          <Route exact path="/login" component={LoginComponent} />
          <Route exact path="/board" component={BoardComponent} />
          <Route exact path="/register" component={RegisterComponent} />
          <Route component={NotFound} />
        </Switch>
      </Router>
    );
  }
}

export default App;
