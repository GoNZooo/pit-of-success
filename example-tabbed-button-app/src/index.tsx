import * as pos from "pit-of-success";
import * as React from "react";

type State = {
  activeTab: number;
  tabs: TabState[];
};

type Increment = {type: "Increment"; index: number};

type Double = {type: "Double"; index: number};

type Decrement = {type: "Decrement"; index: number};

type Reset = {type: "Reset"; index: number};

type AddTab = {type: "AddTab"};

type RemoveTab = {type: "RemoveTab"; index: number};

type SwitchActiveTab = {type: "SwitchActiveTab"; index: number};

type GoToAbout = {type: "GoToAbout"; index: number};

type GoToCounter = {type: "GoToCounter"; index: number};

type ClientEvent =
  | AddTab
  | RemoveTab
  | SwitchActiveTab
  | GoToAbout
  | GoToCounter
  | Increment
  | Double
  | Decrement
  | Reset;

type ServerEvent = never;

type Screen = About | Counter;

type About = {type: "About"; count: number};

type Counter = {type: "Counter"; count: number};

type TabState = {screen: Screen};

const application: pos.Application<State, ServerEvent, ClientEvent> = {
  mount: (document: Document) => {
    const element = document.getElementById("root");
    if (element === null) throw new Error("Unable to mount application");

    return element;
  },
  initialState: {activeTab: 0, tabs: [{screen: {type: "Counter", count: 0}}]},
  postInitialization: (state: State) => state,
  handleServerEvent: (_event: ServerEvent, state: State): State => {
    return state;
  },
  handleClientEvent: (event: ClientEvent, state: State): State => {
    switch (event.type) {
      case "Increment": {
        const newTabs = modifyTab(state.tabs, event.index, incrementTab);

        return {...state, tabs: newTabs};
      }

      case "Decrement": {
        const newTabs = modifyTab(state.tabs, event.index, decrementTab);

        return {...state, tabs: newTabs};
      }

      case "Reset": {
        const newTabs = modifyTab(state.tabs, event.index, resetTab);

        return {...state, tabs: newTabs};
      }

      case "AddTab": {
        const newTab: TabState = {screen: {count: 0, type: "Counter"}};
        const newTabs = [...state.tabs, newTab];

        return {...state, tabs: newTabs, activeTab: newTabs.length - 1};
      }

      case "RemoveTab": {
        const newTabs = state.tabs.reduce<TabState[]>((tabsSoFar, tab, currentIndex) => {
          return currentIndex === event.index ? tabsSoFar : [...tabsSoFar, tab];
        }, []);

        return {...state, tabs: newTabs, activeTab: state.activeTab - 1};
      }

      case "SwitchActiveTab": {
        return {...state, activeTab: event.index};
      }

      case "GoToAbout": {
        const newTabs = modifyTab(state.tabs, event.index, switchToAbout);

        return {...state, tabs: newTabs};
      }

      case "GoToCounter": {
        const newTabs = modifyTab(state.tabs, event.index, switchToCounter);

        return {...state, tabs: newTabs};
      }

      case "Double": {
        const newTabs = modifyTab(state.tabs, event.index, doubleTab);

        return {...state, tabs: newTabs};
      }

      default:
        pos.assertUnreachable(event);
    }
  },
  render: ({
    state,
    dispatchClientEvent,
  }: pos.RenderingInterface<State, ServerEvent, ClientEvent>) => {
    const tabs = renderTabs(state.tabs, state.activeTab, dispatchClientEvent);

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          flexGrow: 1,
          width: "100%",
          height: "60vh",
        }}
      >
        <div>{tabs}</div>
        <div style={{display: "flex", flexDirection: "column", justifyContent: "center"}}>
          {renderActiveTab(state.tabs, dispatchClientEvent, state.activeTab)}
        </div>
      </div>
    );
  },
};

function renderTabs(
  tabs: TabState[],
  activeTab: number,
  dispatchClientEvent: (e: ClientEvent) => void
): JSX.Element {
  const handleSwitchActiveTab = (index: number) => (_e: React.MouseEvent) => {
    dispatchClientEvent({type: "SwitchActiveTab", index});
  };

  const renderedTabs = tabs.map((tab, index) => {
    const tabStyle: React.CSSProperties = index === activeTab ? {textDecoration: "underline"} : {};
    const tabText = tab.screen.type === "Counter" ? tab.screen.count : tab.screen.type;

    return (
      <button key={index} onClick={handleSwitchActiveTab(index)} style={tabStyle}>
        {index}: {tabText}
      </button>
    );
  });

  const handleAddTab = (_e: React.MouseEvent) => {
    dispatchClientEvent({type: "AddTab"});
  };

  const handleRemoveTab = (_e: React.MouseEvent) => {
    dispatchClientEvent({type: "RemoveTab", index: activeTab});
  };

  return (
    <nav style={{display: "flex", justifyContent: "space-between"}}>
      <div>{...renderedTabs}</div>
      <div>
        <button onClick={handleRemoveTab}>-</button>
        <button onClick={handleAddTab}>+</button>
      </div>
    </nav>
  );
}

function renderActiveTab(
  tabs: TabState[],
  dispatchClientEvent: (ClientEvent: ClientEvent) => void,
  index: number
): JSX.Element {
  const tab = tabs[index];

  switch (tab.screen.type) {
    case "Counter": {
      const handleIncrement = (_e: React.MouseEvent) => {
        dispatchClientEvent({type: "Increment", index});
      };

      const handleDouble = (_e: React.MouseEvent) => {
        dispatchClientEvent({type: "Double", index});
      };

      const handleDecrement = (_e: React.MouseEvent) => {
        dispatchClientEvent({type: "Decrement", index});
      };

      const handleReset = (_e: React.MouseEvent) => {
        dispatchClientEvent({type: "Reset", index});
      };

      const handleAbout = (_e: React.MouseEvent) => {
        dispatchClientEvent({type: "GoToAbout", index});
      };

      return (
        <>
          <button onClick={handleDecrement}>-</button>
          <button onClick={handleReset}>0</button>
          <button onClick={handleIncrement}>+</button>
          <button onClick={handleDouble}>Double</button>
          <div>{tab.screen.count}</div>
          <div onClick={handleAbout}>About</div>
        </>
      );
    }

    case "About": {
      const handleCounter = (_e: React.MouseEvent) => {
        dispatchClientEvent({type: "GoToCounter", index});
      };

      return (
        <>
          <div>This is an example app with tabs</div>
          <button onClick={handleCounter}>Switch back to counter</button>
        </>
      );
    }

    default:
      pos.assertUnreachable(tab.screen);
  }
}

function incrementTab(tab: TabState): TabState {
  switch (tab.screen.type) {
    case "Counter": {
      const newTab: TabState = {screen: {type: "Counter", count: tab.screen.count + 1}};

      return newTab;
    }

    case "About": {
      throw new Error("Tried to increment 'About' tab");
    }

    default:
      pos.assertUnreachable(tab.screen);
  }
}

function doubleTab(tab: TabState): TabState {
  switch (tab.screen.type) {
    case "Counter": {
      const newTab: TabState = {screen: {type: "Counter", count: tab.screen.count * 2}};

      return newTab;
    }

    case "About": {
      throw new Error("Tried to double 'About' tab");
    }

    default:
      pos.assertUnreachable(tab.screen);
  }
}

function decrementTab(tab: TabState): TabState {
  switch (tab.screen.type) {
    case "Counter": {
      const newTab: TabState = {screen: {type: "Counter", count: tab.screen.count - 1}};

      return newTab;
    }

    case "About": {
      throw new Error("Tried to decrement 'About' tab");
    }

    default:
      pos.assertUnreachable(tab.screen);
  }
}

function resetTab(tab: TabState): TabState {
  switch (tab.screen.type) {
    case "Counter": {
      const newTab: TabState = {screen: {type: "Counter", count: 0}};

      return newTab;
    }

    case "About": {
      return tab;
    }

    default:
      pos.assertUnreachable(tab.screen);
  }
}

function switchToAbout(tab: TabState): TabState {
  return {screen: {type: "About", count: tab.screen.count}};
}

function switchToCounter(tab: TabState): TabState {
  return {screen: {type: "Counter", count: tab.screen.count}};
}

function modifyTab(
  tabs: TabState[],
  index: number,
  modification: (tabState: TabState) => TabState
): TabState[] {
  return tabs.reduce<TabState[]>((tabsSoFar, tab, currentIndex) => {
    return [...tabsSoFar, currentIndex === index ? modification(tab) : tab];
  }, []);
}

export const main = () => {
  pos.runApplication(application);
};
