var configDefault = require('./config-default.json');

const getMenu = (req, res) => {
    let menu = [];
    menu = menu.concat(configDefault.menu);
    let user = {};
    user.isAdmin = true;
    if (req.session.user && req.session.user.isAuthenticated) {
        menu.push(["Profile", "/profile", "menuItem"]);
        menu.push(["Hello " + req.session.username, "/profile", "menuItem right"]);
        menu.push(["Logout", "/logout", "menuItem right"]);
        user.isAdmin = req.session.user.isAdmin;
        if (user.isAdmin) {
            menu.push(["Admin Page", "/admin", "menuItem"]);
        }
    }
    else {
        menu.push(["Create Account", "/create", "menuItem right"]);
        menu.push(["Login", "/login", "menuItem right"]);
    }
    console.log(menu);
    return {
        user,
        menu
    };
};

exports.getMenu = getMenu;