import React from "react";
import { Link } from "react-router-dom";
import { SearchInput } from "evergreen-ui";

class Nav extends React.Component {
  getLinks = () => {
    let user = window.localStorage.getItem("userSession");
    if (user) {
      user = JSON.parse(user);
      return (
        <ul className="right-nav">
          <Link to="/">Home</Link>
          <Link to="/">Activity</Link>
          <Link to="/goals">Goals</Link>
          <Link to="/board">Board</Link>
          <Link to="/tasks">Tasks</Link>
          <span>{user.user_name}</span>
          <a href="#" onClick={() => this.props.logout()}>
            LogOut
          </a>
        </ul>
      );
    }

    return (
      <ul className="right-nav">
        <Link to="/">Home</Link>
        <Link to="/login">LogIn</Link>
        <Link to="/register">Register</Link>
      </ul>
    );
  };
  render() {
    return (
      <div className="main-nav">
        <ul className="left-nav">
          <Link to="/">Logo</Link>
        </ul>
        {this.getLinks()}
      </div>
    );
  }
}

export default Nav;
