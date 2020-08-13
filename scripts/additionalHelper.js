export function showUser(ctx) {
    ctx.isAuth = localStorage.getItem("authtoken") !== null;
    ctx.email = localStorage.getItem("email");
    ctx.id = localStorage.getItem("userId");
    if (ctx.email !== null) {
        ctx.name = ctx.email.match(/^[A-Za-z]+[^@]*/gim)[0];
    }
}

export function saveSession(userInfo) {
    localStorage.setItem("userId", userInfo.objectId);
    localStorage.setItem("authtoken", userInfo["user-token"]);
    localStorage.setItem("email", userInfo.email);
}

export function emailIsValid(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}