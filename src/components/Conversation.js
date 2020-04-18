import React, {useEffect, useGlobal, useState} from "reactn";
import styled from "styled-components";
import {database} from "../database";
import {Icon, Input, Modal} from "antd";
import moment from "moment";
import {dateFormat} from "../utils";
import {get} from "lodash";

export const Conversation = props => {
    const [globalUser] = useGlobal("user");
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        database
            .collection("chats")
            .onSnapshot(snapshot => {
                const _chat = snapshot.find(chat => chat.id === props.chatId);

                const _messages = _chat.messages.map(messageId => database
                    .collection("messages")
                    .doc(messageId)
                    .get()
                );

                setMessages(_messages);
            });
    }, [props.chatId]);

    const sendMessage = () => {
        const _message = database
            .collection("messages")
            .doc()
            .set({
                content: message,
                userId: globalUser.id,
                chatId: props.chatId,
                sentDate: moment().format(dateFormat)
            });

        const newValue = [...messages.map(message => message.id), _message.id];

        database
            .collection("chats")
            .doc(props.chatId)
            .set({
                lastTimeMessage: moment().format(dateFormat),
                messages: newValue
            });

        window.dispatchEvent(new StorageEvent("storage", {
            key: "forceEvent"
        }));

        setMessage(null);
    };

    const confirmDelete = message => {
        Modal.confirm({
            title: "Are you sure to delete this message?",
            content: `Trying to delete message: "${message.content}"`,
            okType: "danger",
            onOk: () => deleteMessage(message)
        })
    };

    const deleteMessage = message => {
        const hiddenFor = get(message, "hiddenFor", []);
        database
            .collection("messages")
            .doc(message.id)
            .set({
                hiddenFor: [...hiddenFor, globalUser.id]
            });

        window.dispatchEvent(new StorageEvent("storage", {
            key: "forceEvent"
        }));
    };

    const renderUser = userId => {
        const user = database
            .collection("users")
            .doc(userId)
            .get();

        return user.nickname;
    };

    return (
        <Container>
            <MessagesContainer>
                {
                    messages.map(message =>
                        !get(message, "hiddenFor", []).includes(globalUser.id) &&
                        (
                            <Message key={message.id}
                                     isSender={message.userId === globalUser.id}>
                                {message.content}
                                <label>
                                    {renderUser(message.userId)}
                                </label>
                                <span>
                                    {message.sentDate}
                                </span>
                                {
                                    message.userId === globalUser.id &&
                                    <Icon type="delete"
                                          onClick={() => confirmDelete(message)}
                                          theme="filled"/>
                                }
                            </Message>
                        )
                    )
                }
            </MessagesContainer>
            <InputContainer>
                <Input value={message}
                       placeholder="Write your message here..."
                       onChange={event => setMessage(event.target.value)}
                       onPressEnter={sendMessage}/>
            </InputContainer>
        </Container>
    );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
`;

const MessagesContainer = styled.div`
  padding-top: 1rem;
  overflow: scroll;
`;

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 1.5rem;
`;

const Message = styled.div`
  position: relative;
  display: block;
  height: fit-content;
  text-overflow: fade;
  hyphens: auto;
  white-space: pre-line;
  width: 60%;
  border-radius: 0.5rem;
  margin-bottom: 2rem;
  margin-left: ${props => props.isSender ? "auto" : 0};
  padding: 1rem 5.5rem 1rem 1rem;
  background-color: ${props => props.isSender ? "#f4fff3" : "aliceblue"};
  
  span {
    position: absolute;
    bottom: 0;
    right: 0;
    font-size: 8px;
    padding: 0 0.5rem 0.5rem 0;
  }
  
  label {
    position: absolute;
    top: -1.25rem;
    left: 0;
    z-index: 100;
    font-size: 12px;
    color: darkgray;
  }
  
  i {
    cursor: pointer;
    position: absolute;
    right: 0;
    bottom: 50%;
    padding-right: 1rem;
    opacity: 0.1;
    font-size: 14px;
    
    :hover {
      transition: opacity 1s;
      opacity: 1;
    }
  }
`;
