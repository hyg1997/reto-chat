import React, {Fragment, useGlobal, useState} from "reactn";
import {Icon, Input, Layout, Menu, Modal} from "antd";
import styled from "styled-components";
import {Link} from "react-router-dom";
import {useEffect} from "react";
import {database} from "../database";

export const BaseLayout = props => {
    const [globalUser, setGlobalUser] = useGlobal("user");
    const [categories, setCategories] = useState([]);
    const [isVisibleNicknameModal, setIsVisibleNicknameModal] = useState(false);
    const [nickname, setNickname] = useState(globalUser.nickname);
    const [collapsed, setCollapsed] = useState(false);

    const toggleMenu = () => setCollapsed(prevCollapsed => !prevCollapsed);

    useEffect(() => {
        const _categories = database
            .collection("categories")
            .get();

        setCategories(_categories);
    }, []);

    const isNicknameExists = nickname => database
        .collection("users")
        .where(user => user.nickname === nickname)
        .length;

    const editNickname = async () => {
        if (nickname.length < 6) return alert("Nickname must contain at least 6 characters");

        const regCheck = /^[A-Za-z0-9-]/;

        if (!regCheck.test(nickname)) return alert("Nickname can only contain alphanumeric characters and hypehns(-)");

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

    return (
        <Layout>
            <Sider trigger={null}
                   collapsedWidth={0}
                   collapsible
                   collapsed={collapsed}>
                <Menu theme="dark"
                      mode="inline"
                      defaultSelectedKeys={["chats"]}
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
                                          type={collapsed ? "menu-unfold" : null}
                                          onClick={toggleMenu}>
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
                        {globalUser.nickname}
                        <Icon type="edit"
                              onClick={() => setIsVisibleNicknameModal(true)}/>
                    </Nickname>
                </Header>
                <Content>
                    {props.children}
                </Content>
            </Layout>
            <Modal visible={isVisibleNicknameModal}
                   destroyOnClose
                   onOk={editNickname}
                   onCancel={() => setIsVisibleNicknameModal(false)}
                   title="Update nickname">
                <Input defaultValue={nickname}
                       onChange={event => setNickname(event.target.value)}/>
            </Modal>
        </Layout>
    )
};

const Sider = styled(Layout.Sider)`
  height: 100vh;
  position: fixed;
  z-index: 900;
  left: 0;
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
  padding-right: 1.5rem;
  font-size: 16px;
  i {
    font-weight: bold;
    font-size: 18px;
    margin-left: 1rem;
    cursor: pointer;
  }
`;

const Content = styled(Layout.Content)`
  padding: 5.5rem 1.5rem 0;
  background-color: white;
`;
