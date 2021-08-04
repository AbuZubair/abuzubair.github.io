import { FETCH_ALL_DATA } from '../actions/index';

const reducer = (state = {}, action) => {
  switch (action.type) {
    case FETCH_ALL_DATA:
      const data = action.payload;      
      return { ...state, data };
    default:
      return state;
  }
}
export default reducer;