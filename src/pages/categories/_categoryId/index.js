import React, {useEffect, useGlobal, useState} from "reactn";
import {BaseLayout} from "../../components";
import {Button, Checkbox, Modal} from "antd";
import {database} from "../../database";


export const Category = () => {
    const [globalIsVisibleCategoriesModal, setGlobalIsVisibleCategoriesModal] = useGlobal("isVisibleCategoriesModal");
    const [globalCategories, setGlobalCategories] = useGlobal("categories");
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
                   title="Choose your categories (at least 2)"
                   visible={globalIsVisibleCategoriesModal}
                   footer={[
                       <Button type="primary"
                               onClick={() => setGlobalIsVisibleCategoriesModal(false)}
                               disabled={globalCategories.length < 2}>
                           Continue
                       </Button>
                   ]}>
                <Checkbox.Group onChange={categories => setGlobalCategories(categories)}
                                options={
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
