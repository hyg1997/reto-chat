import React, {setGlobal, useEffect, useState} from "reactn";
import {database} from "../database";
import {withAuthentication} from "./withAuthentication";

export const withConfiguration = Component => () => {
    const [isLoadingConfig, setIsLoadingConfig] = useState(true);

    useEffect(() => {
        const initializeConfig = async () => {
            const sessionUserId = sessionStorage.getItem("userId");

            const user = database
                .collection("users")
                .doc(sessionUserId)
                .get();

            await setGlobal({
                user
            });

            setIsLoadingConfig(false);
        };

        initializeConfig();
    }, []);

    const ComponentWithAuthentication = withAuthentication(Component);

    return isLoadingConfig
        ? null
        : <ComponentWithAuthentication/>
};
