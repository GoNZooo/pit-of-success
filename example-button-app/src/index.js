"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = void 0;
var pos = __importStar(require("pit-of-success"));
var React = __importStar(require("react"));
var application = {
    mount: function (document) {
        var element = document.getElementById("root");
        if (element === null)
            throw new Error("Unable to mount application");
        return element;
    },
    initialState: { count: 0 },
    postInitialization: function (state) { return state; },
    handleServerEvent: function (_event, state) {
        return state;
    },
    handleClientEvent: function (event, state) {
        switch (event.type) {
            case "Increment": {
                return __assign(__assign({}, state), { count: state.count + 1 });
            }
            case "Decrement": {
                return __assign(__assign({}, state), { count: state.count - 1 });
            }
            case "Reset": {
                return __assign(__assign({}, state), { count: 0 });
            }
            default:
                pos.assertUnreachable(event);
        }
    },
    render: function (_a) {
        var state = _a.state, dispatchClientEvent = _a.dispatchClientEvent;
        var handleIncrement = function (_e) {
            dispatchClientEvent({ type: "Increment" });
        };
        var handleDecrement = function (_e) {
            dispatchClientEvent({ type: "Decrement" });
        };
        var handleReset = function (_e) {
            dispatchClientEvent({ type: "Reset" });
        };
        return (React.createElement(React.Fragment, null,
            React.createElement("button", { onClick: handleDecrement }, "-"),
            React.createElement("button", { onClick: handleReset }, "0"),
            React.createElement("button", { onClick: handleIncrement }, "+"),
            React.createElement("div", null, state.count)));
    },
};
var main = function () {
    pos.runApplication(application);
};
exports.main = main;
