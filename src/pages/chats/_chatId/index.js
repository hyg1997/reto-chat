import React, {useEffect, useGlobal, useState} from "reactn";
import {BaseLayout} from "../../../components";
import {useHistory, useParams} from "react-router";
import {Conversation} from "./Conversation";
import {database} from "../../../database";

export const Chat = () => {
    const [globalUser] = useGlobal("user");
    const [title, setTitle] = useState("");

    const {chatId} = useParams();
    const history = useHistory();

    useEffect(() => {
        const chat = database
            .collection("chats")
            .doc(chatId)
            .get();

        if (chat.private) {
            if (!chat.users.includes(globalUser.id)) return history.goBack();

            const userId = chat.users.find(userId => userId !== globalUser.id);

            const user = database
                .collection("users")
                .doc(userId)
                .get();

            return setTitle(`Message to ${user.nickname}`);
        }

        database
            .collection("chats")
            .doc(chat.id)
            .set({
                users: [...chat.users.filter(user => user.id !== globalUser.id), globalUser.id]
            });

        setTitle(chat.name)
    }, [chatId, globalUser.id]);

    return (
        <BaseLayout title={title}>
            <Conversation chatId={chatId}/>
        </BaseLayout>
    )
};
