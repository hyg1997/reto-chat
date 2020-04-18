import React from "reactn";
import {Redirect, Route, Switch} from "react-router-dom";
import {Category, Chat, Chats} from "../pages";

export const Routes = () => {
    return (
        <Switch>
            <Route exact
                   path="/chats"
                   component={Chats}
            />
            <Route exact
                   path="/chats/:chatId"
                   component={Chat}>
            </Route>
            <Route exact
                   path="/categories/:categoryId"
                   component={Category}>
            </Route>
            <Redirect to="/chats"/>
        </Switch>
    );
};
