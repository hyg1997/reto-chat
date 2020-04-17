export const validateNickname = nickname => {
    if (nickname.length < 6) return "Nickname must contain at least 6 characters";

    const regCheck = /^[A-Za-z0-9-]/;

    if (!regCheck.test(nickname)) return "Nickname can only contain alphanumeric characters and hypehns(-)";

    return null;
};
