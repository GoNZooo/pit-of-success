import * as pos from "pit-of-success";
import * as React from "react";

type State = {
  count: number;
};

type Increment = {type: "Increment"};

type Decrement = {type: "Decrement"};

type Reset = {type: "Reset"};

type ServerEvent = never;

type ClientEvent = Increment | Decrement | Reset;

const application: pos.Application<State, ServerEvent, ClientEvent> = {
  mount: (document) => {
    const element = document.getElementById("root");
    if (element === null) throw new Error("Unable to mount application");

    return element;
  },
  initialState: {count: 0},
  postInitialization: (state) => state,
  handleServerEvent: (_event, state) => {
    return state;
  },
  handleClientEvent: (event, state) => {
    switch (event.type) {
      case "Increment": {
        return {...state, count: state.count + 1};
      }

      case "Decrement": {
        return {...state, count: state.count - 1};
      }

      case "Reset": {
        return {...state, count: 0};
      }

      default:
        pos.assertUnreachable(event);
    }
  },
  render: ({state, dispatchClientEvent}) => {
    const handleIncrement = (_e: React.MouseEvent) => {
      dispatchClientEvent({type: "Increment"});
    };

    const handleDecrement = (_e: React.MouseEvent) => {
      dispatchClientEvent({type: "Decrement"});
    };

    const handleReset = (_e: React.MouseEvent) => {
      dispatchClientEvent({type: "Reset"});
    };

    return (
      <>
        <button onClick={handleDecrement}>-</button>
        <button onClick={handleReset}>0</button>
        <button onClick={handleIncrement}>+</button>
        <div>{state.count}</div>
      </>
    );
  },
};

export const main = () => {
  pos.runApplication(application);
};
