import React, {Fragment, useGlobal, useState} from "reactn";
import {Icon, Input, Layout, Menu, Modal} from "antd";
import styled from "styled-components";
import {Link, useHistory} from "react-router-dom";
import {useEffect} from "react";
import {database} from "../database";
import {dateFormat, validateNickname} from "../utils";
import {get, orderBy} from "lodash";
import moment from "moment";

export const BaseLayout = props => {
    const [globalUser, setGlobalUser] = useGlobal("user");
    const [categories, setCategories] = useState([]);
    const [users, setUsers] = useState([]);
    const [isVisibleNicknameModal, setIsVisibleNicknameModal] = useState(false);
    const [nickname, setNickname] = useState(globalUser.nickname);
    const [collapsed, setCollapsed] = useState(false);
    const [usersCollapsed, setUsersCollapsed] = useState(false);

    const history = useHistory();

    const route = window.location.href;
    const currentKey = route.split("/")[3];

    const toggleMenu = () => setCollapsed(prevCollapsed => !prevCollapsed);
    const toggleUsers = () => setUsersCollapsed(prevUsersCollapsed => !prevUsersCollapsed);

    useEffect(() => {
        const _categories = database
            .collection("categories")
            .get();

        setCategories(_categories);
    }, []);

    useEffect(() => {
        database
            .collection("users")
            .onSnapshot(snapshot => {
                const orderedUsers = orderBy(snapshot, ["nickname"], "asc");

                setUsers(orderedUsers.filter(user => user.id !== globalUser.id));
            });
    }, [globalUser.id]);

    const isNicknameExists = nickname => database
        .collection("users")
        .where(user => user.nickname === nickname)
        .length;

    const editNickname = async () => {
        const validationError = validateNickname(nickname);

        if (validationError) return alert(validationError);

        if (isNicknameExists(nickname)) return alert("Nickname already exists");

        database
            .collection("users")
            .doc(globalUser.id)
            .set({
                nickname
            });

        await setGlobalUser({...globalUser, nickname});
        setIsVisibleNicknameModal(false);
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
        <Layout style={{height: "100vh"}}>
            <Sider trigger={null}
                   collapsedWidth={0}
                   collapsible
                   collapsed={collapsed}>
                <Menu theme="dark"
                      mode="inline"
                      defaultSelectedKeys={[currentKey]}
                      defaultOpenKeys={["categories"]}>
                    <Menu.Item key="chats">
                        <Link to="/chats">
                            <Icon type="message"/>
                            <span>Chats</span>
                        </Link>
                    </Menu.Item>
                    <Menu.SubMenu key="categories"
                                  title={
                                      <Fragment>
                                          <Icon type="solution"/>
                                          <span>Categories</span>
                                      </Fragment>
                                  }>
                        {
                            categories.map(category =>
                                <Menu.Item key={category.id}>
                                    <Link to={`/categories/${category.id}`}
                                          type={collapsed ? "menu-unfold" : null}>
                                        {category.name}
                                    </Link>
                                </Menu.Item>
                            )
                        }
                    </Menu.SubMenu>
                    <Menu.Item key="logoout"
                               onClick={() => window.close()}>
                        <Link to="/">
                            <Icon type="poweroff"/>
                            <span>Log Out</span>
                        </Link>
                    </Menu.Item>
                </Menu>
            </Sider>
            <Layout>
                <Header>
                    <div>
                        <Trigger type={collapsed ? "menu-unfold" : "menu-fold"}
                                 onClick={toggleMenu}/>
                        <span>ANONYMOUS CHAT - {props.title}</span>
                    </div>
                    <Nickname>
                        <Icon type="edit"
                              onClick={() => setIsVisibleNicknameModal(true)}/>
                        {globalUser.nickname}
                        <Trigger type={usersCollapsed ? "pic-right" : "menu"}
                                 onClick={toggleUsers}/>
                    </Nickname>
                </Header>
                <Content>
                    {props.children}
                </Content>
            </Layout>
            <Sider trigger={null}
                   collapsedWidth={0}
                   collapsible
                   theme="light"
                   collapsed={usersCollapsed}
                   direction="right">
                <UserHeader>
                    Users
                </UserHeader>
                <UsersContainer>
                    {
                        users.map(user =>
                            <User key={user.id}
                                  onClick={() => openPrivateChat(user.id)}>
                                {user.nickname}
                            </User>
                        )
                    }
                </UsersContainer>
            </Sider>
            <Modal visible={isVisibleNicknameModal}
                   destroyOnClose
                   onOk={editNickname}
                   onCancel={() => setIsVisibleNicknameModal(false)}
                   title="Update nickname">
                <Input defaultValue={nickname}
                       onPressEnter={editNickname}
                       onChange={event => setNickname(event.target.value)}/>
            </Modal>
        </Layout>
    )
};

const Sider = styled(Layout.Sider)`
  height: 100vh;
  z-index: 900;
  ${props => get(props, "direction", "left")}: 0;
  top: 0;
  box-shadow: 2px 3px 4px #444;
  padding-top: 4rem;
`;

const Header = styled(Layout.Header)`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  position: fixed;
  z-index: 1000;
  left: 0;
  right: 0;
  background-color: white;
  padding: 0;
  border-bottom: black solid 1px;
  
  span {
    font-size: 20px;
    font-weight: 700;
  }
`;

const Trigger = styled(Icon)`
  padding: 0 1.5rem;
  font-size: 18px;
`;

const Nickname = styled.div`
  display: inline-block;
  font-size: 16px;
  i {
    font-weight: bold;
    font-size: 18px;
    margin-right: 0.5rem;
    cursor: pointer;
  }
`;

const Content = styled(Layout.Content)`
  padding: 5.5rem 1.5rem 1.5rem;
  background-color: white;
`;

const UserHeader = styled.h3`
  padding: 1rem;
  margin: 0;
`;

const UsersContainer = styled.div`
  padding: 0 1rem 1rem;
  overflow-y: scroll;
  height: 90%;
`;

const User = styled.p`
  padding-bottom: 0.5rem;
  width: 100%;
  margin: 0;
  
  :hover {
    color: #1890ff;
    cursor: pointer;
  }
`;
