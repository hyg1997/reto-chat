import React, {setGlobal, useEffect, useState} from "reactn";
import moment from "moment"
import "moment/locale/es";
import {database} from "../database";
import {withAuthentication} from "./withAuthentication";

export const withConfiguration = Component => () => {
    const [isLoadingConfig, setIsLoadingConfig] = useState(true);

    useEffect(() => {
        const initializeConfig = async () => {
            const sessionUserId = sessionStorage.getItem("userId");

            console.log("sessionUserId", sessionUserId);

            const user = database
                .collection("users")
                .doc(sessionUserId)
                .get();

            await setGlobal({
                user,
                currentConfig: {}
            });

            moment.locale("es");

            setIsLoadingConfig(false);
        };

        initializeConfig();
    }, []);

    const ComponentWithAuthentication = withAuthentication(Component);

    return isLoadingConfig
        ? null
        : <ComponentWithAuthentication/>
};
