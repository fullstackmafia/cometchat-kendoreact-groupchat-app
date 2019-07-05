import React from "react";
import { Redirect } from "react-router-dom";
import ArmyChat from "../lib/chat";
import config from "../config";
// import {Chat} from '@progress/kendo-react-conversational-ui';
import { Input } from '@progress/kendo-react-inputs';

class Groupchat extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      receiverID: "",
      messageText: null,
      groupMessage: [],
      user: {},
      authorize: true
    };
    this.GUID = config.GUID;
  }

  pushMessage = () => {
    ArmyChat.pushGroupMessage(this.GUID, this.state.messageText).then(
      message => {
        console.log("Message sent successfully:", message);
        this.setState({ messageText: null });
      },
      error => {
        if (error.code === "ERR_NOT_A_MEMBER") {
          ArmyChat.joinGroup(this.GUID).then(response => {
            this.pushMessage();
          });
        }
      }
    );
  };

 scrollToBottom = () => {
   const chat = document.getElementById("chatList");
   chat.scrollTop = chat.scrollHeight;
 };

  handleSubmit = event => {
    event.preventDefault();
    this.pushMessage();
    event.target.reset();
  };

  handleChange = event => {
    this.setState({ messageText: event.target.value });
  };

  grabUser = () => {
    ArmyChat
      .grabLoggedinUser()
      .then(user => {
        console.log("user details:", { user });
        this.setState({ user });
      })
      .catch(({ error }) => {
        if (error.code === "USER_NOT_LOGGED_IN") {
          this.setState({
            authorize: false
          });
        }
      });
  };

  messageListener = () => {
    ArmyChat.addMessageListener((data, error) => {
      if (error) return console.log(`error: ${error}`);
      this.setState(
        prevState => ({
          groupMessage: [...prevState.groupMessage, data]
        }),
        () => {
          this.scrollToBottom();
        }
      );
    });
  };

  componentDidMount() {
    this.grabUser();
    this.messageListener();
  }

  

  render() {
    const { authorize } = this.state;
    if (!authorize) {
      return <Redirect to="/" />;
    }
    return (
      <div className="chatWindow">
        <ul className="chat" id="chatList">
          {this.state.groupMessage.map(data => (
            <div key={data.id}>
              {this.state.user.uid === data.sender.uid ? (
                <li className="self">
                  <div className="msg">
                    <p>{data.sender.name}</p>
                    <div className="message"> {data.data.text}</div>
                  </div>
                </li>
              ) : (
                <li className="other">
                  <div className="msg">
                    <p>{data.sender.name}</p>
                    <div className="message"> {data.data.text} </div>
                  </div>
                </li>
              )}
            </div>
          ))}
        </ul>
        <div className="chatInputWrapper">
          <form onSubmit={this.handleSubmit}>
            <input
              className="textarea input"
              type="text"
              placeholder="Enter your message..."
              onChange={this.handleChange}
            />
          </form>
        </div>
      </div>
    );
  }
}

export default Groupchat;