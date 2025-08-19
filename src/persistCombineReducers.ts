import {
  combineReducers,
  Reducer,
  ReducersMapObject,
  UnknownAction,
  StateFromReducersMapObject,
} from "redux";
import persistReducer from "./persistReducer";
import autoMergeLevel2 from "./stateReconciler/autoMergeLevel2";
import { PersistConfig } from "./types";

// combineReducers + persistReducer with stateReconciler defaulted to autoMergeLevel2
export default function persistCombineReducers<
  RM extends ReducersMapObject<any, any>,
  A extends UnknownAction = UnknownAction,
>(
  config: PersistConfig<any>,
  reducers: RM
): Reducer<StateFromReducersMapObject<RM>, A> {
  const cfg: PersistConfig<any> = {
    stateReconciler: config.stateReconciler ?? autoMergeLevel2,
    ...config,
  };

  // Redux 5's combineReducers returns Reducer<S, A, PreloadedState>,
  // but persistReducer expects Reducer<S, A>. Cast away the 3rd generic here.
  const root = combineReducers(reducers) as unknown as Reducer<
    StateFromReducersMapObject<RM>,
    A
  >;

  return persistReducer(cfg, root);
}
