var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var builtin = require("./built-in/index");
var ext = require("../../extensions.config");
var extensions = builder(__spreadArray(__spreadArray([], ext, true), builtin, true));
var root = {
    load: function (extName) {
        var ext = extensions[extName];
        if (ext)
            return ext;
        if (!ext)
            throw new Error("Extension ".concat(extName, " not found"));
    }
};
function builder(data) {
    var build = {};
    data.forEach(function (ext) {
        build[ext.name] = ext.callback;
    });
    return build;
}
module.exports = root;
