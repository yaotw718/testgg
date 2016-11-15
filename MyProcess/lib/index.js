/**
 * Created by afterloe on 8/2/2016.
 */
const path = require("path");

module.exports = {
    windowHelper: require(path.join(__dirname, "windowBuilder")),
    netRequest: require(path.join(__dirname, "jobSystem"))
};