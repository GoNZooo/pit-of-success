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
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
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
    initialState: { activeTab: 0, tabs: [{ screen: { type: "Counter", count: 0 } }] },
    postInitialization: function (state) { return state; },
    handleServerEvent: function (_event, state) {
        return state;
    },
    handleClientEvent: function (event, state) {
        switch (event.type) {
            case "Increment": {
                var newTabs = modifyTab(state.tabs, event.index, incrementTab);
                return __assign(__assign({}, state), { tabs: newTabs });
            }
            case "Decrement": {
                var newTabs = modifyTab(state.tabs, event.index, decrementTab);
                return __assign(__assign({}, state), { tabs: newTabs });
            }
            case "Reset": {
                var newTabs = modifyTab(state.tabs, event.index, resetTab);
                return __assign(__assign({}, state), { tabs: newTabs });
            }
            case "AddTab": {
                var newTab = { screen: { count: 0, type: "Counter" } };
                var newTabs = __spreadArray(__spreadArray([], state.tabs), [newTab]);
                return __assign(__assign({}, state), { tabs: newTabs, activeTab: newTabs.length - 1 });
            }
            case "RemoveTab": {
                var newTabs = state.tabs.reduce(function (tabsSoFar, tab, currentIndex) {
                    return currentIndex === event.index ? tabsSoFar : __spreadArray(__spreadArray([], tabsSoFar), [tab]);
                }, []);
                return __assign(__assign({}, state), { tabs: newTabs, activeTab: state.activeTab - 1 });
            }
            case "SwitchActiveTab": {
                return __assign(__assign({}, state), { activeTab: event.index });
            }
            case "GoToAbout": {
                var newTabs = modifyTab(state.tabs, event.index, switchToAbout);
                return __assign(__assign({}, state), { tabs: newTabs });
            }
            case "GoToCounter": {
                var newTabs = modifyTab(state.tabs, event.index, switchToCounter);
                return __assign(__assign({}, state), { tabs: newTabs });
            }
            case "Double": {
                var newTabs = modifyTab(state.tabs, event.index, doubleTab);
                return __assign(__assign({}, state), { tabs: newTabs });
            }
            default:
                pos.assertUnreachable(event);
        }
    },
    render: function (_a) {
        var state = _a.state, dispatchClientEvent = _a.dispatchClientEvent;
        var tabs = renderTabs(state.tabs, state.activeTab, dispatchClientEvent);
        return (React.createElement("div", { className: "container" },
            React.createElement("div", { className: "tabs" }, tabs),
            React.createElement("div", { className: "counter-container" }, renderActiveTab(state.tabs, dispatchClientEvent, state.activeTab))));
    },
};
function renderTabs(tabs, activeTab, dispatchClientEvent) {
    var handleSwitchActiveTab = function (index) { return function (_e) {
        dispatchClientEvent({ type: "SwitchActiveTab", index: index });
    }; };
    var renderedTabs = tabs.map(function (tab, index) {
        var tabClass = index === activeTab ? "active" : "";
        var tabText = tab.screen.type === "Counter" ? tab.screen.count : tab.screen.type;
        return (React.createElement("li", { key: index, onClick: handleSwitchActiveTab(index), className: tabClass },
            index,
            ": ",
            tabText));
    });
    var handleAddTab = function (_e) {
        dispatchClientEvent({ type: "AddTab" });
    };
    var handleRemoveTab = function (_e) {
        dispatchClientEvent({ type: "RemoveTab", index: activeTab });
    };
    return (React.createElement("nav", { className: "nav-bar" },
        React.createElement("ul", { className: "rendered-tabs" }, renderedTabs),
        React.createElement("div", { className: "add-remove-tabs" },
            React.createElement("p", null, "Add/Remove tabs"),
            React.createElement("div", { className: "buttons-wrapper" },
                React.createElement("button", { onClick: handleAddTab }, "+"),
                React.createElement("button", { onClick: handleRemoveTab }, "-")))));
}
function renderActiveTab(tabs, dispatchClientEvent, index) {
    var tab = tabs[index];
    switch (tab.screen.type) {
        case "Counter": {
            var handleIncrement = function (_e) {
                dispatchClientEvent({ type: "Increment", index: index });
            };
            var handleDouble = function (_e) {
                dispatchClientEvent({ type: "Double", index: index });
            };
            var handleDecrement = function (_e) {
                dispatchClientEvent({ type: "Decrement", index: index });
            };
            var handleReset = function (_e) {
                dispatchClientEvent({ type: "Reset", index: index });
            };
            var handleAbout = function (_e) {
                dispatchClientEvent({ type: "GoToAbout", index: index });
            };
            return (React.createElement(React.Fragment, null,
                React.createElement("div", { className: "counter-buttons" },
                    React.createElement("p", null, "Manage Active Tab Count"),
                    React.createElement("button", { onClick: handleIncrement }, "+"),
                    React.createElement("button", { onClick: handleDecrement }, "-"),
                    React.createElement("button", { onClick: handleDouble }, "Double"),
                    React.createElement("button", { onClick: handleReset }, "Reset"),
                    React.createElement("p", null,
                        "Current Active Tab Count: ",
                        tab.screen.count)),
                React.createElement("footer", null,
                    React.createElement("nav", { className: "footer-nav" },
                        React.createElement("a", { className: "nav-item", onClick: handleAbout }, "About")))));
        }
        case "About": {
            var handleCounter = function (_e) {
                dispatchClientEvent({ type: "GoToCounter", index: index });
            };
            return (React.createElement(React.Fragment, null,
                React.createElement("div", { className: "counter-buttons" },
                    React.createElement("p", null, "Now you are on the About screen"),
                    React.createElement("p", null, "The content of the current active tab has changed")),
                React.createElement("footer", null,
                    React.createElement("nav", { className: "footer-nav" },
                        React.createElement("a", { className: "nav-item", onClick: handleCounter }, "Back to counter")))));
        }
        default:
            pos.assertUnreachable(tab.screen);
    }
}
function incrementTab(tab) {
    switch (tab.screen.type) {
        case "Counter": {
            var newTab = { screen: { type: "Counter", count: tab.screen.count + 1 } };
            return newTab;
        }
        case "About": {
            throw new Error("Tried to increment 'About' tab");
        }
        default:
            pos.assertUnreachable(tab.screen);
    }
}
function doubleTab(tab) {
    switch (tab.screen.type) {
        case "Counter": {
            var newTab = { screen: { type: "Counter", count: tab.screen.count * 2 } };
            return newTab;
        }
        case "About": {
            throw new Error("Tried to double 'About' tab");
        }
        default:
            pos.assertUnreachable(tab.screen);
    }
}
function decrementTab(tab) {
    switch (tab.screen.type) {
        case "Counter": {
            var newTab = { screen: { type: "Counter", count: tab.screen.count - 1 } };
            return newTab;
        }
        case "About": {
            throw new Error("Tried to decrement 'About' tab");
        }
        default:
            pos.assertUnreachable(tab.screen);
    }
}
function resetTab(tab) {
    switch (tab.screen.type) {
        case "Counter": {
            var newTab = { screen: { type: "Counter", count: 0 } };
            return newTab;
        }
        case "About": {
            return tab;
        }
        default:
            pos.assertUnreachable(tab.screen);
    }
}
function switchToAbout(tab) {
    return { screen: { type: "About", count: tab.screen.count } };
}
function switchToCounter(tab) {
    return { screen: { type: "Counter", count: tab.screen.count } };
}
function modifyTab(tabs, index, modification) {
    return tabs.reduce(function (tabsSoFar, tab, currentIndex) {
        return __spreadArray(__spreadArray([], tabsSoFar), [currentIndex === index ? modification(tab) : tab]);
    }, []);
}
var main = function () {
    pos.runApplication(application);
};
exports.main = main;
