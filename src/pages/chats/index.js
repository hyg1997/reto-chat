import React, {Fragment, useEffect, useGlobal, useState} from "reactn";
import {BaseLayout, List, Title} from "../../components";
import {database} from "../../database";
import {Link, useHistory} from "react-router-dom";
import moment from "moment";
import {dateFormat} from "../../utils";
import {Select} from "antd";
import {get} from "lodash";

export const Chats = () => {
    const [globalUser] = useGlobal("user");
    const [userChats, setUserChats] = useState([]);
    const [chats, setChats] = useState([]);
    const [users, setUsers] = useState([]);

    const history = useHistory();

    useEffect(() => {
        const _chats = database
            .collection("chats")
            .get();

        const _userChats = _chats
            .filter(chat => chat.users.includes(globalUser.id));

        const _users = database
            .collection("users")
            .where(user => user.id !== globalUser.id);

        setChats(_chats);
        setUserChats(_userChats);
        setUsers(_users);
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

    const openPrivateChat = userId => {
        let chat = database
            .collection("chats")
            .where(chat => {
                const users = get(chat, "users", []);

                if (users.length > 2) return false;

                if (!users.includes(userId)) return false;

                return users.includes(globalUser.id);
            });

        if (chat.length) return history.push(`/chats/${chat[0].id}`);

        chat = database
            .collection("chats")
            .doc()
            .set({
                private: true,
                messages: [],
                users: [globalUser.id, userId],
                lastTimeMessage: moment().format(dateFormat)
            });

        history.push(`/chats/${chat.id}`);
    };

    return (
        <BaseLayout title="Chats">
            <Title>
                Search Groups and Users
            </Title>
            <Select showSearch
                    placeholder="Search user or group"
                    autoClearSearchValue
                    onSelect={(value, option) =>
                        option.props.type === "chat" ? history.push(`/chats/${value}`) : openPrivateChat(value)
                    }
                    optionFilterProp="label"
                    style={{width: "100%", marginBottom: "1rem"}}>
                {
                    chats
                        .filter(chat => !chat.private)
                        .map(chat =>
                            <Select.Option key={chat.id}
                                           type="chat"
                                           label={chat.name}
                                           value={chat.id}>
                                <b>Group: </b>{chat.name}
                            </Select.Option>
                        )
                }
                {
                    users
                        .map(user =>
                            <Select.Option key={user.id}
                                           type="user"
                                           label={user.nickname}
                                           value={user.id}>
                                <b>User: </b>{user.nickname}
                            </Select.Option>
                        )
                }
            </Select>
            <Title>
                My Chats
            </Title>
            <List dataSource={userChats}
                  height="80%"
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
                          <div>
                              <h3>
                                  {renderCategory(chat.categoryId)}
                              </h3>
                              <h5>
                                  {moment(chat.lastTimeMessage, dateFormat).fromNow()}
                              </h5>
                          </div>
                      </List.Item>
                  )}/>
        </BaseLayout>
    )
};
