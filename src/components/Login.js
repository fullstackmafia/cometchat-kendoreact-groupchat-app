import React from "react";
import { Redirect } from "react-router-dom";
import chat from "../lib/chat";
import spinner from "../logo.svg";
import { Button } from '@progress/kendo-react-buttons';
import { Input } from '@progress/kendo-react-inputs';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      authorize: false,
      user: null,
      submit: false,
      errorMessage: ""
    };
  }

  onSubmit = e => {
    if (this.state.username !== "") {
      e.preventDefault();
      this.login();
    }
  };

  login = () => {
    this.toggleIsSubmitting();
    chat
      .login(this.state.username)
      .then(user => {
        this.setState({
          user,
          authorize: true
        });
      })
      .catch(error => {
          this.setState({
            errorMessage: "Please enter a valid username"
          });
          this.toggleIsSubmitting();
          console.log(error);
      });
  };

  toggleIsSubmitting = () => {
    this.setState(prevState => ({
      submit: !prevState.submit
    }));
  };

  handleInputChange = e => {
    this.setState({
      username: e.target.value
    });
  };

  render() {
    if (this.state.authorize) {
      return (
        <Redirect
          to={{
            pathname: "/chat",
            state: { user: this.state.user }
          }}
        />
      );
    }

    return (
       <div>
        <form className="k-form" onSubmit={this.onSubmit}>
        <fieldset>
          <Input
           name="username"
           label="Username"
           required={true}
           style={{ width: '100%'}}
           value={this.username}
           onChange={this.handleInputChange}
           type="text"
           />

          <span className="error">{this.state.errorMessage}</span>
          {this.state.submit ? (
            <img src={spinner} alt="Spinner component" className="App-logo" />
          ) : (
            <Button
              primary={true}
              type="submit"
              disabled={this.state.username === ""}
            >Sign In</Button>
          )}
          </fieldset>
        </form>
      </div>
    );
  }
}

export default Login;