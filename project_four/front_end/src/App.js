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
      redirect: false
    };
  }

  componentDidMount(){
    // this.getTasks();
    // this.getGoals();
    // this.createTask();
    //this.createGoal();
  }

  componentDidUpdate(prevProps) {
    if (this.state.redirect) {
      this.setState({redirect: false})
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
        this.setState({ user: data });
      })
      .catch(e => {
        alert(e);
      });
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
      this.setState({redirect: true})
    });
  };

  createGoal = (userInfo) => {
    const mock ={
      user_id: 1,
      description:"more text",
      name:"Testing another Goal",
      status:"in progress"
    }

    fetch("http://localhost:5000/createGoal/1", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(mock)
    }).then(res => {
    });
  };

  getGoals = () => {
    fetch("http://localhost:5000/goals/1")
    .then(res => res.json())
    .then(data => this.setState({goals: data}))
  }

  getTasks = () => {
    fetch("http://localhost:5000/tasks/1")
    .then(res => res.json())
    .then(data => this.setState({tasks: data}))
  }

  createTask = () => {
    const mock ={
      goal_id: 1,
      description:"more text",
      name:"Testing another Task",
      status:"in progress"
    }

    fetch("http://localhost:5000/createTask/1", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(mock)
    }).then(res => {
    });
  };

  editGoal = () => {};

  editTask = () => {};

  render() {
    const BoardComponent = () => <Board name="props" />;
    const EditGoalComponent = () => <EditGoal name="props" />;
    const EditTaskComponent = () => <EditTask name="props" />;
    const GoalListerComponent = () => <GoalLister getGoals={this.getGoals} name="props" />;
    const LoginComponent = () => (
      <Login login={this.handleLogin} name="props" />
    );
    const TaskListerComponent = () => <TaskLister getTasks={this.getTasks} name="props" />;
    const NotFound = () => <NoFound name="props" />;
    const HomeComponent = () => <Activity name="props" />;
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
