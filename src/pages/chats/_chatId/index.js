import React, {useEffect, useGlobal, useState} from "reactn";
import {BaseLayout} from "../../../components";
import {useParams} from "react-router";
import {Conversation} from "./Conversation";
import {database} from "../../../database";

export const Chat = () => {
    const [globalUser] = useGlobal("user");
    const [title, setTitle] = useState("");

    const {chatId} = useParams();

    useEffect(() => {
        const chat = database
            .collection("chats")
            .doc(chatId)
            .get();

        if (chat.users.length === 2) {
            const userId = chat.users.find(userId => userId !== globalUser.id);

            const user = database
                .collection("users")
                .doc(userId)
                .get();

            return setTitle(`Message to ${user.nickname}`);
        }
    }, [chatId, globalUser.id]);

    return (
        <BaseLayout title={title}>
            <Conversation chatId={chatId}/>
        </BaseLayout>
    )
};
