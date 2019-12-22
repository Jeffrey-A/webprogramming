import React from "react";
import "./App.css";

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Link, Redirect } from "react-router-dom";

// Components
import Home from "./components/Home";
import Progress from "./components/Progress";
import Board from "./components/Board";
import EditGoal from "./components/EditGoal";
import EditTask from "./components/EditTask";
import GoalLister from "./components/GoalLister";
import Login from "./components/Login";
import Register from "./components/Register";
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

  componentDidMount() {
    let user = window.localStorage.getItem("userSession");
    if (user) {
      user = JSON.parse(user);
      this.fetchUserInfo(user).then(tasksAndGoals => {
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

  apiRequestLoop = inp => {
    let promiseArray = [];
    for (let i = 0; i < inp.length; i++) {
      promiseArray.push(
        fetch(`/tasks/${inp[i].id}`).then(response =>
          response.json()
        )
      );
    }
    return Promise.all(promiseArray);
  };

  fetchUserInfo = user => {
    return fetch(`/goals/${user.id}`)
      .then(res => res.json())
      .then(goals => {
        return this.apiRequestLoop(goals).then(tasks => ({ goals, tasks }));
      });
  };

  handleLogin = userInfo => {
    fetch("/login", {
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
        this.fetchUserInfo(data).then(tasksAndGoals => {
          this.setState({
            user: data,
            goals: tasksAndGoals.goals,
            tasks: tasksAndGoals.tasks,
            redirect: true
          });
        });
      })
      .catch(e => {
        alert("User no found!");
      });
  };

  handleLogOut = () => {
    window.localStorage.clear();
    this.setState({ user: null, goals: [], tasks: [], redirect: true });
  };

  registerUser = userInfo => {
    fetch("/register", {
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

  createGoal = goalInfo => {
    fetch(`/createGoal/${this.state.user.id}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(goalInfo)
    })
      .then(res => {
        alert("Goal Created!");
      })
      .then(() => this.getGoals())
      .catch(e => alert("Error!"));
  };

  getGoals = () => {
    fetch(`/goals/${this.state.user.id}`)
      .then(res => res.json())
      .then(data => this.setState({ goals: data }));
  };

  getTasks = () => {
    fetch("/tasks/1")
      .then(res => res.json())
      .then(data => this.setState({ tasks: data }));
  };

  updateTask = (taskId, newBody) => {
    fetch(`/tasks/${taskId}`, {
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
    fetch(`/goals/${goalId}`, {
      method: "DELETE"
    })
      .then(res => {
        if (res.status == 200) {
          this.fetchUserInfo(this.state.user).then(tasksAndGoals => {
            this.setState({
              goals: tasksAndGoals.goals,
              tasks: tasksAndGoals.tasks
            });
          });
        } else {
          alert("Error");
        }
      })
      .catch(e => alert("Error"));
  };

  deleteTask = goalId => {
    fetch(`/tasks/${goalId}`, {
      method: "DELETE"
    })
      .then(res => console.log(res))
      .catch(e => alert("Error"));
  };

  createTask = (goalId, taskBody) => {
    alert(taskBody.name);

    fetch(`/createTask/${goalId}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(taskBody)
    }).then(res => {
      if (res.status == 200) {
        alert("It worked");
      }
    });
  };

  getCompletedGoals() {
    fetch("/completed/goals/1")
      .then(res => res.json())
      .then(data => alert(data));
  }

  editGoal = (goalId, updatedBody) => {
    fetch(`/goals/${goalId}`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(updatedBody)
    }).then(res => {
      if (res.status == 200) {
        // alert("Change Saved");
        this.getGoals();
      } else {
        alert("Error");
      }
    });
  };

  editTask = () => {};

  render() {
    const { goals, tasks } = this.state;

    const BoardComponent = () => (
      <Board
        createGoal={this.createGoal}
        deleteGoal={this.deleteGoal}
        editGoal={this.editGoal}
        tasks={tasks}
        goals={goals}
        redirect={this.state.redirect}
        logout={this.handleLogOut}
      />
    );
    const EditGoalComponent = () => <EditGoal name="props" />;
    const EditTaskComponent = () => <EditTask name="props" />;
    const GoalListerComponent = () => (
      <GoalLister
        createGoal={this.createGoal}
        logout={this.handleLogOut}
        goals={goals}
        tasks={tasks}
        redirect={this.state.redirect}
        deleteGoal={this.deleteGoal}
        editGoal={this.editGoal}
      />
    );
    const LoginComponent = () => (
      <Login login={this.handleLogin} redirect={this.state.redirect} />
    );

    const NotFound = () => <NoFound name="props" logout={this.handleLogOut} />;
    const HomeComponent = () => (
      <Home goals={goals} tasks={tasks} logout={this.handleLogOut} />
    );

    const ProgressComponent = () => (
      <Progress goals={goals} tasks={tasks} logout={this.handleLogOut} />
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
          <Route exact path="/progress" component={ProgressComponent} />
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
