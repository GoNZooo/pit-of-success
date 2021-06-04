import * as React from "react";
import * as ReactDOM from "react-dom";

export type RenderingInterface<State, ServerEvent, ClientEvent> = {
  state: State;
  dispatchClientEvent: (e: ClientEvent) => void;
  dispatchServerEvent: (e: ServerEvent) => void;
  ClientEvent: (e: ClientEvent) => Event<ServerEvent, ClientEvent>;
  ServerEvent: (e: ServerEvent) => Event<ServerEvent, ClientEvent>;
};

export type Application<State, ServerEvent, ClientEvent> = {
  mount: (document: Document) => HTMLElement;
  handleServerEvent: (event: ServerEvent, state: State) => State;
  handleClientEvent: (event: ClientEvent, state: State) => State;
  initialState: State;
  postInitialization: (state: State) => State;
  render: (renderingInterface: RenderingInterface<State, ServerEvent, ClientEvent>) => JSX.Element;
};

export function runApplication<State, ServerEvent, ClientEvent>(
  application: Application<State, ServerEvent, ClientEvent>
) {
  const rootElement = application.mount(window.document);

  ReactDOM.render(<MainElement application={application} />, rootElement);
}

interface Props<State, ServerEvent, ClientEvent> {
  application: Application<State, ServerEvent, ClientEvent>;
}

type Event<S, C> = FromServer<S> | FromClient<C>;

type FromServer<S> = {
  type: "FromServer";
  event: S;
};

type FromClient<C> = {
  type: "FromClient";
  event: C;
};

const MainElement = <State, ServerEvent, ClientEvent>({
  application: {initialState, postInitialization, handleClientEvent, handleServerEvent, render},
}: Props<State, ServerEvent, ClientEvent>) => {
  const reducer = (previousState: State, event: Event<ServerEvent, ClientEvent>): State => {
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

  const [state, dispatch] = React.useReducer(reducer, initialState, postInitialization);

  const ClientEvent = (event: ClientEvent): Event<ServerEvent, ClientEvent> => {
    return {type: "FromClient", event};
  };
  const ServerEvent = (event: ServerEvent): Event<ServerEvent, ClientEvent> => {
    return {type: "FromServer", event};
  };

  const dispatchClientEvent = (event: ClientEvent): void => {
    dispatch(ClientEvent(event));
  };
  const dispatchServerEvent = (event: ServerEvent): void => {
    dispatch(ServerEvent(event));
  };

  return <>{render({state, dispatchClientEvent, dispatchServerEvent, ClientEvent, ServerEvent})}</>;
};

export function assertUnreachable(v: never): never {
  throw new Error(`Reached unreachable case: ${v}`);
}

export type NoEvents = {type: "NoEvents"};
