import categories from "./categories";
import {getItemInLocalStorage, setItemInLocalStorage} from "../utils";

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
            doc: documentId => {

                const document = collection.find(document => document.id === documentId) || null;

                return ({
                    get: () => document,
                    set: value => {
                        const dataType = typeof value;

                        if (!value || dataType !== "object") throw new Error(`Data can't be of type ${dataType}`);

                        const remainingDocuments = collection.filter(document => document.id !== document);

                        const updatedDocument = {...document, ...value};

                        const updatedCollection = [...remainingDocuments, updatedDocument];

                        localStorage.setItem(collectionId, JSON.stringify(updatedCollection, null, 2));

                        return updatedDocument;
                    }
                });
            }
        });
    }
};
