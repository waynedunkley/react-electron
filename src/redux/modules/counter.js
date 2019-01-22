const INCREASE_COUNTER = "INCREASE_COUNTER";
const DECREASE_COUNTER = "DECREASE_COUNTER";

const initialState = {
  count: 0,
};

export default function counter(state = initialState, action) {
  switch (action.type) {
    case INCREASE_COUNTER:
      return {
        ...state,
        count: state.counter.count + 1,
      };
    case DECREASE_COUNTER:
      return {
        ...state,
        count: state.counter.count - 1,
      };
    default:
      return state;
  }
}
