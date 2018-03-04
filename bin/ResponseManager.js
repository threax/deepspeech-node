"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var uuidv1 = require("uuid/v1");
var ResponseManager = (function () {
    function ResponseManager() {
        this.responses = {};
    }
    ResponseManager.prototype.addResponse = function (response) {
        var name = uuidv1();
        while (this.responses[name] !== undefined) {
            name = uuidv1();
        }
        this.responses[name] = response;
        return name;
    };
    ResponseManager.prototype.getResponse = function (name) {
        var response = this.responses[name];
        if (response) {
            delete this.responses[name];
        }
        return response;
    };
    return ResponseManager;
}());
exports.ResponseManager = ResponseManager;
