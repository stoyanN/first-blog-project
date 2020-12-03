import { getData, putData, deleteData, postData, logOutUser } from "./requester.js";
import { showUser, saveSession, emailIsValid } from "./additionalHelper.js";

let partials = {
    header: "./templates/common/header.hbs",
    footer: "./templates/common/footer.hbs"
};

export async function loadHomePage(ctx) {
    showUser(ctx);

    ctx.loadPartials(partials).partial("./templates/homepage.hbs");
}

export async function loadArticles(ctx) {
    showUser(ctx);
    if (ctx.isAuth) {
        let authToken = localStorage.getItem("authtoken");
        let allArticles = await getData("data", "articles", authToken);
        ctx.articles = allArticles;
    }
    ctx.loadPartials(partials).partial("./templates/articles.hbs");
}

export function loadSingleArticle(ctx) {
    let id = ctx.params.id;
    let authToken = localStorage.getItem("authtoken");

    getData("data", `articles/${id}`, authToken)
        .then(articleInfo => {
            ctx.orientation = articleInfo.orientation;
            ctx.imageURL = articleInfo.imageURL;
            ctx.likesCounter = articleInfo.likesCounter;
            ctx.description = articleInfo.description;
            ctx.title = articleInfo.title;
            ctx._id = articleInfo.objectId;
            ctx.isAuthor = localStorage.getItem("userId") === articleInfo.ownerId;

            showUser(ctx);
            ctx.loadPartials(partials).partial("./templates/single-article.hbs");
        });
}

export function createArticle(ctx) {
    showUser(ctx);
    ctx.loadPartials(partials).partial("./templates/create-article.hbs")
}

export function loadAboutPage(ctx) {
    showUser(ctx);
    ctx.loadPartials(partials).partial("./templates/about-me.hbs")
}

export function loadRegisterPage(ctx) {
    ctx.loadPartials(partials).partial("./templates/register.hbs");
}

export function registerProceed(ctx) {
    let { username, password } = ctx.params;
    let rePassword = ctx.params["rep-password"];

    if (password === rePassword && emailIsValid(username) && username && password && rePassword) {
        postData("users", "register", { email: username, password })
            .then(userInfo => {
                alert("Your registration was completed! Please Log In!");
                ctx.redirect("#/login");
            })
            .catch(err => {
                alert(err);
            });

    } else {
        alert("Something went wrong! Please try again!");
    }
}

export function loadLoginPage(ctx) {
    ctx.loadPartials(partials).partial("./templates/login.hbs");
}

export function loginProceed(ctx) {
    let { username, password } = ctx.params;

    postData("users", "login", { login: username, password })
        .then(userInfo => {
            saveSession(userInfo);
        })
        .then(function () {
            ctx.redirect("#/about");
        })
        .catch(err => {
            alert("Something went wrong! Please try again!");
        });
}

export function logoutProceed(ctx) {
    let authToken = localStorage.getItem("authtoken");

    logOutUser("users", "logout", authToken)
        .then(() => {
            localStorage.clear();
        })
        .then(function () {
            ctx.redirect("#/login");
        })
        .catch(err => alert(err));
}

export function loadCreatePage(ctx) {
    showUser(ctx);
    ctx.loadPartials(partials).partial("./templates/createPage.hbs");
}

export function createProceed(ctx) {
    showUser(ctx);
    let authToken = localStorage.getItem("authtoken");
    let { imageURL, description, orientation, title } = ctx.params;

    if (imageURL && description && orientation && title) {
        let obj = {
            imageURL,
            description,
            orientation,
            title,
            likesCounter: 0
        };

        postData("data", "articles", obj, authToken)
            .then(() => {
                ctx.redirect("#/articles");
            })
            .catch(err => alert(err));
    }

}

export function deleteArticle(ctx) {
    let id = ctx.params.id;
    let authToken = localStorage.getItem("authtoken");

    deleteData("data", `articles/${id}`, authToken)
        .then(() => ctx.redirect("#/articles"))
        .catch(err => alert(err));

}

export async function editEvent(ctx) {
    showUser(ctx);
    let authToken = localStorage.getItem("authtoken");

    let currentArticle = await getData("data", `articles/${ctx.params.id}`, authToken);
    ctx.title = currentArticle.title;
    ctx.imageURL = currentArticle.imageURL;
    ctx.orientation = currentArticle.orientation;
    ctx.creator = currentArticle.ownerId;
    ctx._id = currentArticle.objectId;
    ctx.description = currentArticle.description;
    ctx.isAuthor = localStorage.getItem("userId") === currentArticle.ownerId;

    await ctx.loadPartials(partials).partial("./templates/edit-article.hbs");
}

export function editEventProceed(ctx) {
    showUser(ctx);
    let authToken = localStorage.getItem("authtoken");
    let id = ctx.params.id;
    let {
        imageURL,
        description,
        orientation,
        title
    } = ctx.params;

    getData("data", `articles/${id}`, authToken).then(allInfo => {
        if (imageURL && description && orientation && title) {

            allInfo.imageURL = imageURL;
            allInfo.description = description;
            allInfo.orientation = orientation;
            allInfo.title = title;
            return allInfo;
        } else {
            alert("Something is wrong! Please try again!")
        }
    })
        .then(allInfo => {
            putData("data", `articles/${id}`, allInfo, authToken)
                .then(() => {
                    ctx.redirect("#/articles");
                })
                .catch(err => alert(err));
        })
        .catch(err => alert(err));
}

export function likesCounting(ctx) {
    let id = ctx.params.id;
    let authToken = localStorage.getItem("authtoken");

    getData("data", `articles/${id}`, authToken)
        .then(articleInfo => {
            articleInfo.likesCounter += 1;
            return articleInfo;
        })
        .then(newData => {
            putData("data", `articles/${id}`, newData, authToken);
        })
        .then(() => {
            ctx.redirect(`#/article/${id}`);
        })
        .catch(err => alert(err));
}