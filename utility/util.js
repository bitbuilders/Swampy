var configDefault = require('../config/menu.json');

// const getMenu = (req, res) => {
//     let menu = [];
//     menu = menu.concat(configDefault.menu);
//     let user = {};
//     user.isAdmin = true;
//     if (req.session.user && req.session.user.isAuthenticated) {
//         menu.push(["Profile", "/Profile", "menuItem"]);
//         menu.push(["Hello " + req.session.username, "/Profile", "menuItem right"]);
//         menu.push(["Logout", "/Auth/Logout", "menuItem right"]);
//         user.isAdmin = req.session.user.isAdmin;
//         if (user.isAdmin) {
//             menu.push(["Admin Page", "/Admin", "menuItem"]);
//         }
//     }
//     else {
//         menu.push(["Create Account", "/Auth/Register", "menuItem right"]);
//         menu.push(["Login", "/Auth/login", "menuItem right"]);
//     }
//     console.log(menu);
//     return {
//         user,
//         menu
//     };
// };

const getMenu = (user) => {
    let menu = [];
    menu = menu.concat(configDefault.menu);
    // if (user && user.isAuthenticated) {
    if (user) {
        menu.push(["Profile", "/Profile", "menuItem"]);
        menu.push(["Hello " + user.username, "/Profile", "menuItem right"]);
        menu.push(["Logout", "/Auth/Logout", "menuItem right"]);
        if (user.isAdmin) {
            menu.push(["Admin Page", "/Admin", "menuItem"]);
        }
    }
    else {
        menu.push(["Create Account", "/Auth/Register", "menuItem right"]);
        menu.push(["Login", "/Auth/login", "menuItem right"]);
    }
    return menu;
};

function getUser(req, res) {
    var session = req.session;
    var user = session.user;
    return user;
}

exports.getMenu = getMenu;
exports.getUser = getUser;