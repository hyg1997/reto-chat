import React, {Fragment} from "reactn";
import {withConfiguration} from "./hoc";
import {createGlobalStyle} from "styled-components";
import {BrowserRouter} from "react-router-dom";
import {Routes} from "./routes";

const App = () => {

    const GlobalStyle = createGlobalStyle`
      body {
        margin: 0;
      }
    `;

    return (
        <Fragment>
            <GlobalStyle/>
            <BrowserRouter>
                <Routes/>
            </BrowserRouter>
        </Fragment>
    );
};

export default withConfiguration(App);
