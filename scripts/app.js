import * as controller from "./controller.js";
import { getData, putData } from "./requester.js";



const app = Sammy("#root", function() {
    this.use("Handlebars", "hbs");

    this.get("#/home", controller.loadHomePage.bind(this));

    this.get("#/", controller.loadHomePage.bind(this));

    this.get("#/articles", controller.loadArticles.bind(this));

    this.get("#/article/:id", controller.loadSingleArticle.bind(this));

    this.get("#/about", controller.loadAboutPage.bind(this));

    this.get("#/register", controller.loadRegisterPage.bind(this));

    this.post("#/register", controller.registerProceed.bind(this));

    this.get("#/login", controller.loadLoginPage.bind(this));

    this.post("#/login", controller.loginProceed.bind(this));

    this.get("#/logout", controller.logoutProceed.bind(this));

    this.get("#/create", controller.createArticle.bind(this));

    this.post("#/create", controller.createProceed.bind(this));

    this.get("#/edit/:id", controller.editEvent.bind(this));

    this.post("#/edit/:id", controller.editEventProceed.bind(this));

    this.get("#/delete/:id", controller.deleteArticle.bind(this));

    this.get("#/likes/:id", controller.likesCounting.bind(this));

});


app.run("#/home");