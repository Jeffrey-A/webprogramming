import React from "react";
import Nav from "./Nav";

class Login extends React.Component {
  render() {
    return (
      <div>
        <Nav />
        <div className="login-register-form">
          <div>
            <input placeholder="username" />
            <input placeholder="password" />
            <button>Login</button>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
