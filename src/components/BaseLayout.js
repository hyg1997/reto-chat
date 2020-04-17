import React, {useState} from "reactn";
import {Icon, Layout, Menu} from "antd";
import styled from "styled-components";
import {Link} from "react-router-dom";

export const BaseLayout = props => {
    const [collapsed, setCollapsed] = useState(true);

    const route = window.location.href;
    const currentKey = route.split("/").pop();

    const toggle = () => setCollapsed(prevCollapsed => !prevCollapsed);

    return (
        <Layout>
            <Sider trigger={null}
                   collapsedWidth={0}
                   collapsible
                   collapsed={collapsed}>
                <Menu theme="dark"
                      mode="inline"
                      defaultSelectedKeys={[currentKey]}>
                    <Menu.Item key="guests">
                        <Link to="/guests"
                              type={collapsed ? "menu-unfold" : null}
                              onClick={toggle}>
                            <Icon type="solution"/>
                            <span>Guests</span>
                        </Link>
                    </Menu.Item>
                    <Menu.Item key="flt-operators">
                        <Link to="/flt-operators"
                              type={collapsed ? "menu-unfold" : null}
                              onClick={toggle}>
                            <Icon type="solution"/>
                            <span>FLT Operators</span>
                        </Link>
                    </Menu.Item>
                    <Menu.Item key="/"
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
                    <Trigger type={collapsed ? "menu-unfold" : "menu-fold"}
                             onClick={toggle}/>
                    <span>ANONYMOUS CHAT - {props.title}</span>
                </Header>
                <Content>
                    {props.children}
                </Content>
            </Layout>
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

const Content = styled(Layout.Content)`
  padding: 5.5rem 1.5rem 0;
  background-color: white;
`;
