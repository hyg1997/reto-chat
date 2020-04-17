export const setItemInLocalStorage = (key, value) => localStorage.setItem(key, JSON.stringify(value, null, 2));
export const getItemInLocalStorage = (key) => JSON.parse(localStorage.getItem(key));
