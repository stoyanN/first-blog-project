import { getData, putData, deleteData, postData } from "./requester.js";
import { showUser, saveSession, emailIsValid } from "./additionalHelper.js";

let partials = {
    header: "./templates/common/header.hbs",
    footer: "./templates/common/footer.hbs"
};

export async function loadHomePage(ctx) {
    showUser(ctx);

    ctx.loadPartials(partials).partial("./templates/homePage.hbs");
}

export async function loadArticles(ctx) {
    showUser(ctx);
    if (ctx.isAuth) {
        let allArticles = await getData("Kinvey", "appdata", "articles");
        ctx.articles = allArticles;
    }
    ctx.loadPartials(partials).partial("./templates/articles.hbs");
}

export function loadSingleArticle(ctx) {
    let id = ctx.params.id;
    getData("Kinvey", "appdata", `articles/${id}`)
        .then(articleInfo => {
            ctx.orientation = articleInfo.orientation;
            ctx.imageURL = articleInfo.imageURL;
            ctx.likesCounter = articleInfo.likesCounter;
            ctx.description = articleInfo.description;
            ctx.title = articleInfo.title;
            ctx._id = articleInfo._id;
            ctx.isAuthor = localStorage.getItem("userId") === articleInfo._acl.creator;

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
        postData("Basic", "user", "", { username, password })
            .then(userInfo => {
                saveSession(userInfo);
                ctx.redirect("#/home");

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

    postData("Basic", "user", "login", { username, password })
        .then(userInfo => {
            saveSession(userInfo);
        })
        .then(function() {
            ctx.redirect("#/about");
        })
        .catch(err => {
            alert("Something went wrong! Please try again!");
        });
}

export function logoutProceed(ctx) {
    postData("Kinvey", "user", "_logout")
        .then(() => {
            localStorage.clear();
        })
        .then(function() {
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
    let { imageURL, description, orientation, title } = ctx.params;

    if (imageURL && description && orientation && title) {
        let obj = {
            imageURL,
            description,
            orientation,
            title,
            likesCounter: 0
        };

        postData("Kinvey", "appdata", "articles", obj)
            .then(() => {
                ctx.redirect("#/articles");
            })
            .catch(err => alert(err));
    }

}

export function loadDetailsPage(ctx) {
    let id = ctx.params.id;

    getData("Kinvey", "appdata", `articles/${id}`)
        .then(currentArticle => {
            ctx.title = currentArticle.title;
            ctx.category = currentArticle.category;
            ctx.content = currentArticle.content;
            ctx.creator = currentArticle.creator;
            ctx._id = currentArticle._id;
            ctx.isAuthor = localStorage.getItem("userId") === currentArticle._acl.creator;

            showUser(ctx);
            ctx.loadPartials(partials).partial("./templates/detailsPage.hbs");
        });
}

export function deleteArticle(ctx) {
    let id = ctx.params.id;

    deleteData("Kinvey", "appdata", `articles/${id}`)
        .then(() => ctx.redirect("#/articles"))
        .catch(err => alert(err));

}

export async function editEvent(ctx) {
    showUser(ctx);

    let currentArticle = await getData("Kinvey", "appdata", `articles/${ctx.params.id}`);
    ctx.title = currentArticle.title;
    ctx.imageURL = currentArticle.imageURL;
    ctx.orientation = currentArticle.orientation;
    ctx.creator = currentArticle.creator;
    ctx._id = currentArticle._id;
    ctx.description = currentArticle.description;
    ctx.isAuthor = localStorage.getItem("userId") === currentArticle._acl.creator;

    await ctx.loadPartials(partials).partial("./templates/edit-article.hbs");
}

export function editEventProceed(ctx) {
    showUser(ctx);
    let id = ctx.params.id;
    let {
        imageURL,
        description,
        orientation,
        title
    } = ctx.params;

    getData("Kinvey", "appdata", `articles/${id}`).then(allInfo => {
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
            putData("Kinvey", "appdata", `articles/${id}`, allInfo)
                .then(() => {
                    ctx.redirect("#/articles");
                })
                .catch(err => alert(err));
        })
        .catch(err => alert(err));
}

export function likesCounting(ctx) {
    let id = ctx.params.id;

    getData("Kinvey", "appdata", `articles/${id}`)
        .then(articleInfo => {
            articleInfo.likesCounter += 1;
            return articleInfo;
        })
        .then(newData => {
            putData("Kinvey", "appdata", `articles/${id}`, newData);
        })
        .then(() => {
            ctx.redirect(`#/article/${id}`);
        })
        .catch(err => alert(err));
}