import React, {useEffect, useState} from "react";
import {BaseLayout} from "../../components";
import {Checkbox, Modal} from "antd";
import {database} from "../../database";


export const Home = () => {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const _categories = database
            .collection("categories")
            .get();

        setCategories(_categories);
    }, []);

    return (
        <BaseLayout title="Home">
            <h1>
                Hola
            </h1>
            <Modal centered
                   title="Choose your categories (at least 1)"
                   visible>
                <Checkbox.Group options={
                    categories
                        .map(category => ({
                            value: category.id,
                            label: category.name
                        }))
                }/>
            </Modal>
        </BaseLayout>
    )
};
