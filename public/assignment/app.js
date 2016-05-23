(function() {
    angular
        .module("WebAppMaker", ["ngRoute"])
        .config(Config);
    function Config($routeProvider) {
        $routeProvider
            .when("/login", {
            templateUrl: "/assignment/views/user/login.view.client.html"
        }).when("/", {
            templateUrl: "/assignment/views/user/login.view.client.html"
        }).when("/register", {
            templateUrl: "/assignment/views/user/register.view.client.html"
        }).when("/user/:uid", {
            templateUrl: "/assignment/views/user/profile.view.client.html"
        }).when("/user/:uid/website", {
            templateUrl: "/assignment/views/website/website-list.view.client.html"
        }).when("/user/:uid/website/new", {
            templateUrl: "/assignment/views/website/website-new.view.client.html"
        }).when("/user/:uid/website/:wid", {
            templateUrl: "/assignment/views/website/website-edit.view.client.html"
        }).when("/user/:uid/website/:wid/page", {
            templateUrl: "/assignment/views/page/page-list.view.client.html"
        }).when("/user/:uid/website/:wid/page/new", {
            templateUrl: "/assignment/views/page/page-new.view.client.html"
        }).when("/user/:uid/website/:wid/page/:pid", {
            templateUrl: "/assignment/views/page/page-edit.view.client.html"
        }).when("/user/:uid/website/:wid/page/:pid/widget", {
            templateUrl: "/assignment/views/widget/widget-list.view.client.html"
        }).when("/user/:uid/website/:wid/page/:pid/widget/new", {
            templateUrl: "/assignment/views/widget/widget-chooser.view.client.html"
        }).when("/user/:uid/website/:wid/page/:pid/widget/:wgid", {
            templateUrl: "/assignment/views/widget/widget-edit.view.client.html"
        }).otherwise({
            redirectTo: "/"
        })
    }
})();