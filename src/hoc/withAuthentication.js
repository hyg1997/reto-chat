import React, {useEffect, useGlobal, useState} from "reactn";
import {v1 as uuid} from "uuid";
import {database} from "../database";

export const withAuthentication = Component =>
    () => {
        const [globalUser, setGlobalUser] = useGlobal("user");
        const [isLoadingAuth, setIsLoadingAuth] = useState(true);

        useEffect(() => {
            const createUser = async () => {
                const userId = uuid();

                const user = database
                    .collection("users")
                    .doc(userId)
                    .set({
                        id: userId,
                        nickname: userId,
                        chats: []
                    });

                sessionStorage.setItem("userId", userId);

                await setGlobalUser(user);

                setIsLoadingAuth(false)
            };

            if (globalUser) {
                return setIsLoadingAuth(false);
            }

            createUser();
        }, [setGlobalUser, globalUser]);

        return isLoadingAuth
            ? null
            : <Component/>;

    };
