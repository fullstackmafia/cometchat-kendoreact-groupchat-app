import { CometChat } from "@cometchat-pro/chat";
import config from "../config";

export default class ArmyChat {
  static LISTENER_KEY_MESSAGE = "msglistener";

  static APPID = config.APPID;
  static APIKEY = config.APIKEY;
  static LISTENER_KEY_GROUP = "grouplistener";

  static initChat() {
    return CometChat.init(ArmyChat.APPID);
  }

  static grabTextMessage(uid, text, msgType) {
    if (msgType === "user") {
      return new CometChat.TextMessage(
        uid,
        text,
        CometChat.MESSAGE_TYPE.TEXT,
        CometChat.RECEIVER_TYPE.USER
      );
    } else {
      return new CometChat.TextMessage(
        uid,
        text,
        CometChat.MESSAGE_TYPE.TEXT,
        CometChat.RECEIVER_TYPE.GROUP
      );
    }
  }

  static grabLoggedinUser() {
    return CometChat.getLoggedinUser();
  }

  static login(UID) {
    return CometChat.login(UID, this.APIKEY);
  }

  static grabGroupMessages(GUID, callback, limit = 30) {
    const messagesRequest = new CometChat.MessagesRequestBuilder()
      .setGUID(GUID)
      .setLimit(limit)
      .build();

    callback();

    return messagesRequest.fetchPrevious();
  }

  static pushGroupMessage(UID, message) {
    const textMessage = this.grabTextMessage(UID, message, "group");
    return CometChat.sendMessage(textMessage);
  }

  static joinGroup(GUID) {
    return CometChat.joinGroup(GUID, CometChat.GROUP_TYPE.PUBLIC, "");
  }

  static addMessageListener(callback) {
    CometChat.addMessageListener(
      this.LISTENER_KEY_MESSAGE,
      new CometChat.MessageListener({
        onTextMessageReceived: textMessage => {
          callback(textMessage);
        }
      })
    );
  }
}