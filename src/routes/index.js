import React from "reactn";
import {Redirect, Route, Switch} from "react-router-dom";
import {Chats} from "../pages";

export const Routes = () => {


    return (
        <Switch>
            <Route exact
                   path="/chats"
                   component={Chats}
            />
            <Redirect to="/chats"/>
        </Switch>
    );
};
