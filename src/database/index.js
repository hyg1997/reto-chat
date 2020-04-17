import categories from "./categories";
import {getItemInLocalStorage, setItemInLocalStorage} from "../utils";
import {v1 as uuid} from "uuid";

setItemInLocalStorage("categories", categories);

export const database = {
    collection: collectionId => {
        if (!getItemInLocalStorage(collectionId)) setItemInLocalStorage(collectionId, []);

        const collection = getItemInLocalStorage(collectionId);

        return ({
            onSnapshot: listener => window.addEventListener("storage", event => {
                if (event.storageArea !== localStorage) return;

                if (event.key !== collectionId) return;

                const newValue = JSON.parse(event.newValue);

                listener(newValue);
            }),
            get: () => collection,
            where: query => collection.filter(query),
            doc: documentId => {
                let document;
                if (documentId) {
                    document = collection.find(document => document.id === documentId) || null;
                } else {
                    document = {id: uuid()}
                }

                return ({
                    get: () => documentId && document,
                    set: value => {
                        const dataType = typeof value;

                        if (!value || dataType !== "object") throw new Error(`Data can't be of type ${dataType}`);

                        const remainingDocuments = collection.filter(document => document.id !== documentId);

                        const updatedDocument = {...document, ...value};

                        const updatedCollection = [...remainingDocuments, updatedDocument];

                        setItemInLocalStorage(collectionId, updatedCollection);
                        return updatedDocument;
                    }
                });
            }
        });
    }
};
