import React, {Fragment, useEffect, useGlobal, useState} from "reactn";
import {BaseLayout} from "../../components";
import {List} from "antd";
import {database} from "../../database";
import {Link} from "react-router-dom";
import moment from "moment";
import {dateFormat} from "../../utils";

export const Chats = () => {
    const [globalUser] = useGlobal("user");
    const [chats, setChats] = useState([]);

    useEffect(() => {
        const _chats = database
            .collection("chats")
            .where(chat => chat.users.includes(globalUser.id));

        setChats(_chats);
    }, [globalUser.id]);

    const renderChatUsers = users => {
        const mappedUsers = users
            .filter(userId => userId !== globalUser.id)
            .map(userId => {
                const user = database
                    .collection("users")
                    .doc(userId)
                    .get();

                return user.nickname;
            });

        return mappedUsers.join(", ");
    };

    const renderCategory = categoryId => {
        if (!categoryId) return;

        const category = database
            .collection("categories")
            .doc(categoryId)
            .get();


        return category.name;
    };

    return (
        <BaseLayout title="Chats">
            <List dataSource={chats}
                  renderItem={chat => (
                      <List.Item key={chat.id}>
                          <List.Item.Meta title={
                              <Link to={`/chats/${chat.id}`}>
                                  <h1>
                                      {chat.name || `Conversation with ${renderChatUsers(chat.users)}`}
                                  </h1>
                              </Link>
                          }
                                          description={
                                              <Fragment>
                                                  <b>
                                                      Members:&nbsp;
                                                  </b>
                                                  {renderChatUsers(chat.users)}
                                              </Fragment>
                                          }
                          />
                          <h3>
                              {renderCategory(chat.categoryId)}
                          </h3>
                          <h5>
                              {moment(chat.lastTimeMessage, dateFormat).fromNow()}
                          </h5>
                      </List.Item>
                  )}/>
        </BaseLayout>
    )
};
