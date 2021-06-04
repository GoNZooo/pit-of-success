"use strict";
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
exports.assertUnreachable = exports.runApplication = void 0;
var React = __importStar(require("react"));
var ReactDOM = __importStar(require("react-dom"));
function runApplication(application) {
    var rootElement = application.mount(window.document);
    ReactDOM.render(React.createElement(MainElement, { application: application }), rootElement);
}
exports.runApplication = runApplication;
var MainElement = function (_a) {
    var _b = _a.application, initialState = _b.initialState, postInitialization = _b.postInitialization, handleClientEvent = _b.handleClientEvent, handleServerEvent = _b.handleServerEvent, render = _b.render;
    var reducer = function (previousState, event) {
        switch (event.type) {
            case "FromClient": {
                return handleClientEvent(event.event, previousState);
            }
            case "FromServer": {
                return handleServerEvent(event.event, previousState);
            }
            default:
                return assertUnreachable(event);
        }
    };
    var _c = React.useReducer(reducer, initialState, postInitialization), state = _c[0], dispatch = _c[1];
    var ClientEvent = function (event) {
        return { type: "FromClient", event: event };
    };
    var ServerEvent = function (event) {
        return { type: "FromServer", event: event };
    };
    var dispatchClientEvent = function (event) {
        dispatch(ClientEvent(event));
    };
    var dispatchServerEvent = function (event) {
        dispatch(ServerEvent(event));
    };
    return React.createElement(React.Fragment, null, render({ state: state, dispatchClientEvent: dispatchClientEvent, dispatchServerEvent: dispatchServerEvent, ClientEvent: ClientEvent, ServerEvent: ServerEvent }));
};
function assertUnreachable(v) {
    throw new Error("Reached unreachable case: " + v);
}
exports.assertUnreachable = assertUnreachable;
