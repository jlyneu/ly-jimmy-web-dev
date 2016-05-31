(function() {
    angular
        .module("WebAppMaker")
        .config(Config);
    function Config($routeProvider) {
        $routeProvider
            .when("/login", {
                templateUrl: "/assignment/client/views/user/login.view.client.html",
                controller: "LoginController",
                controllerAs: "model"
            }).when("/", {
                templateUrl: "/assignment/client/views/user/login.view.client.html",
                controller: "LoginController",
                controllerAs: "model"
            }).when("/register", {
                templateUrl: "/assignment/client/views/user/register.view.client.html",
                controller: "RegisterController",
                controllerAs: "model"
            }).when("/user/:userId", {
                templateUrl: "/assignment/client/views/user/profile.view.client.html",
                controller: "ProfileController",
                controllerAs: "model"
            }).when("/user/:userId/website", {
                templateUrl: "/assignment/client/views/website/website-list.view.client.html",
                controller: "WebsiteListController",
                controllerAs: "model"
            }).when("/user/:userId/website/new", {
                templateUrl: "/assignment/client/views/website/website-new.view.client.html",
                controller: "NewWebsiteController",
                controllerAs: "model"
            }).when("/user/:userId/website/:websiteId", {
                templateUrl: "/assignment/client/views/website/website-edit.view.client.html",
                controller: "EditWebsiteController",
                controllerAs: "model"
            }).when("/user/:userId/website/:websiteId/page", {
                templateUrl: "/assignment/client/views/page/page-list.view.client.html",
                controller: "PageListController",
                controllerAs: "model"
            }).when("/user/:userId/website/:websiteId/page/new", {
                templateUrl: "/assignment/client/views/page/page-new.view.client.html",
                controller: "NewPageController",
                controllerAs: "model"
            }).when("/user/:userId/website/:websiteId/page/:pageId", {
                templateUrl: "/assignment/client/views/page/page-edit.view.client.html",
                controller: "EditPageController",
                controllerAs: "model"
            }).when("/user/:userId/website/:websiteId/page/:pageId/widget", {
                templateUrl: "/assignment/client/views/widget/widget-list.view.client.html",
                controller: "WidgetListController",
                controllerAs: "model"
            }).when("/user/:userId/website/:websiteId/page/:pageId/widget/new", {
                templateUrl: "/assignment/client/views/widget/widget-chooser.view.client.html",
                controller: "NewWidgetController",
                controllerAs: "model"
            }).when("/user/:userId/website/:websiteId/page/:pageId/widget/:widgetId", {
                templateUrl: "/assignment/client/views/widget/widget-edit.view.client.html",
                controller: "EditWidgetController",
                controllerAs: "model"
            }).otherwise({
                redirectTo: "/"
            });
    }
})();