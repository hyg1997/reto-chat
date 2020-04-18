import React, {Fragment, useEffect, useGlobal, useState} from "reactn";
import {Button, Icon, Input, List, Modal, Select} from "antd";
import {Link, useParams} from "react-router-dom";
import moment from "moment";
import {database} from "../../../database";
import {BaseLayout} from "../../../components";
import {dateFormat, validateChatName} from "../../../utils";
import {get} from "lodash";

export const Category = () => {
    const [globalUser] = useGlobal("user");
    const [chats, setChats] = useState([]);
    const [isVisibleCreateChatModal, setIsVisibleCreateChatModal] = useState(false);
    const [chatName, setChatName] = useState(null);
    const [users, setUsers] = useState([]);

    const {categoryId} = useParams();

    useEffect(() => {
        database
            .collection("categories")
            .onSnapshot(snapshot => {
                const _category = snapshot.find(category => category.id === categoryId);

                const _chats = get(_category, "chats", []).map(chatId => database
                    .collection("chats")
                    .doc(chatId)
                    .get()
                );

                setChats(_chats);
            })
    }, [globalUser.id, categoryId]);

    const renderCategory = categoryId => {
        if (!categoryId) return;

        const category = database
            .collection("categories")
            .doc(categoryId)
            .get();


        return category.name;
    };

    const renderUsers = () => {
        const users = database
            .collection("users")
            .get();

        return users.map(user =>
            <Select.Option key={user.id}
                           label={user.nickname}
                           value={user.id}>
                {user.nickname}
            </Select.Option>
        );
    };

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

    const createCategoryChat = () => {
        const trimmedChatName = chatName.trim();
        const validationError = validateChatName(chatName);

        if (validationError) return alert(validationError);

        if (users.length < 3) return alert("Select at least 3 Users");

        const _chat = database
            .collection("chats")
            .doc()
            .set({
                name: trimmedChatName,
                messages: [],
                users,
                categoryId,
                lastTimeMessage: moment().format(dateFormat)
            });

        database
            .collection("categories")
            .doc(categoryId)
            .set({chats: [...chats.map(chat => chat.id), _chat.id]});

        window.dispatchEvent(new StorageEvent("storage", {
            key: "forceEvent"
        }));

        setIsVisibleCreateChatModal(false);
    };

    return (
        <BaseLayout title="Chats">
            <Button icon="plus"
                    onClick={() => setIsVisibleCreateChatModal(true)}
                    type="primary"
                    size="large">
                {renderCategory(categoryId)} Chat
            </Button>
            <List size="large"
                  dataSource={chats}
                  renderItem={chat => (
                      <List.Item key={chat.id}
                                 actions={[
                                     <Fragment>
                                         <Icon type="message"/>
                                         &nbsp;
                                         {chat.messages.length}
                                     </Fragment>,
                                     <Fragment>
                                         <Icon type="usergroup-add"/>
                                         &nbsp;
                                         {chat.users.length}
                                     </Fragment>
                                 ]}>
                          <List.Item.Meta title={
                              <Link to={`/chats/${chat.id}`}>
                                  <h1>
                                      {chat.name}
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
                          <h5>
                              {moment(chat.lastTimeMessage, dateFormat).fromNow()}
                          </h5>
                      </List.Item>
                  )}/>
            <Modal destroyOnClose
                   title="Create Category Chat"
                   visible={isVisibleCreateChatModal}
                   onOk={createCategoryChat}
                   onCancel={() => setIsVisibleCreateChatModal(false)}>
                <Input placeholder="Name"
                       onChange={event => setChatName(event.target.value)}/>
                <Select mode="multiple"
                        onChange={value => setUsers(value)}
                        style={{width: "100%", marginTop: "1rem"}}
                        optionFilterProp="children"
                        optionLabelProp="label"
                        placeholder="Add users">
                    {renderUsers()}
                </Select>
            </Modal>
        </BaseLayout>
    )
};
