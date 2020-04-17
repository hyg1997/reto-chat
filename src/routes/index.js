import React from "reactn";
import {Redirect, Route, Switch} from "react-router-dom";
import {Home} from "../pages";

export const Routes = () => {


    return (
        <Switch>
            <Route exact
                   path="/home"
                   component={Home}
            />
            <Redirect to="/home"/>
        </Switch>
    );
};
