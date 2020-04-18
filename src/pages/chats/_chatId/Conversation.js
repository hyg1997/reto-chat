import React, {useEffect, useGlobal, useState} from "reactn";
import styled from "styled-components";
import {database} from "../../../database";
import {Input} from "antd";
import moment from "moment";
import {dateFormat} from "../../../utils";

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

    return (
        <Container>
            <MessagesContainer>
                {
                    messages.map(message => {
                            return (
                                <Message key={message.id}
                                         isSender={message.userId === globalUser.id}>
                                    {message.content}
                                    <span>
                                        {message.sentDate}
                                    </span>
                                </Message>
                            );
                        }
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
  margin-bottom: 1rem;
  margin-left: ${props => props.isSender ? "auto" : 0};
  padding: 1rem;
  background-color: ${props => props.isSender ? "#f4fff3" : "aliceblue"};
  
  span {
    position: absolute;
    bottom: 0;
    right: 0;
    font-size: 8px;
    padding: 0 0.5rem 0.5rem 0;
  }
`;
