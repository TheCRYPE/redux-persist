/* eslint-disable @typescript-eslint/no-explicit-any */
import test from "ava";
import { legacy_createStore as createStore } from "redux";

import getStoredState from "../src/getStoredState";
import persistReducer from "../src/persistReducer";
import persistStore from "../src/persistStore";
import createMemoryStorage from "./utils/createMemoryStorage";

const INCREMENT = "INCREMENT";

interface StateObject {
  [key: string]: any;
}
const initialState: StateObject = { a: 0, b: 10, c: 100 };

const reducer = (state = initialState, { type }: { type: any }) => {
  if (type === INCREMENT) {
    const result: StateObject = {};
    for (const k of Object.keys(state)) result[k] = state[k] + 1;
    return result;
  }
  return state;
};

const memoryStorage = createMemoryStorage();

const config = {
  key: "persist-reducer-test",
  version: 1,
  storage: memoryStorage,
  debug: true,
  throttle: 1000,
};

test("state before flush is not updated, after flush is", async (t) => {
  const rootReducer = persistReducer(config, reducer);
  const store = createStore(rootReducer);

  await new Promise<void>((resolve) => {
    persistStore(store, {}, resolve); // wait for rehydration
  });

  store.dispatch({ type: INCREMENT });

  const state = store.getState();
  const storedPreFlush = await getStoredState(config);
  t.not(storedPreFlush && storedPreFlush.c, state.c);

  const persistor = persistStore(store); // get persistor to flush
  await persistor.flush();

  const storedPostFlush = await getStoredState(config);
  t.is(storedPostFlush && storedPostFlush.c, state.c);
});
