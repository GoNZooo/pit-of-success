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
        return (React.createElement("div", { style: {
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                flexGrow: 1,
                width: "100%",
                height: "60vh",
            } },
            React.createElement("div", null, tabs),
            React.createElement("div", { style: { display: "flex", flexDirection: "column", justifyContent: "center" } }, renderActiveTab(state.tabs, dispatchClientEvent, state.activeTab))));
    },
};
function renderTabs(tabs, activeTab, dispatchClientEvent) {
    var handleSwitchActiveTab = function (index) { return function (_e) {
        dispatchClientEvent({ type: "SwitchActiveTab", index: index });
    }; };
    var renderedTabs = tabs.map(function (tab, index) {
        var tabStyle = index === activeTab ? { textDecoration: "underline" } : {};
        var tabText = tab.screen.type === "Counter" ? tab.screen.count : tab.screen.type;
        return (React.createElement("button", { key: index, onClick: handleSwitchActiveTab(index), style: tabStyle },
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
    return (React.createElement("nav", { style: { display: "flex", justifyContent: "space-between" } },
        React.createElement("div", null, renderedTabs),
        React.createElement("div", null,
            React.createElement("button", { onClick: handleRemoveTab }, "-"),
            React.createElement("button", { onClick: handleAddTab }, "+"))));
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
                React.createElement("button", { onClick: handleDecrement }, "-"),
                React.createElement("button", { onClick: handleReset }, "0"),
                React.createElement("button", { onClick: handleIncrement }, "+"),
                React.createElement("button", { onClick: handleDouble }, "Double"),
                React.createElement("div", null, tab.screen.count),
                React.createElement("div", { onClick: handleAbout }, "About")));
        }
        case "About": {
            var handleCounter = function (_e) {
                dispatchClientEvent({ type: "GoToCounter", index: index });
            };
            return (React.createElement(React.Fragment, null,
                React.createElement("div", null, "This is an example app with tabs"),
                React.createElement("button", { onClick: handleCounter }, "Switch back to counter")));
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
