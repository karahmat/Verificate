export const reducer = (state, action) => {
    const { type } = action;
    switch (type) {
      case "update":
        return {
          ...state,
          [action.payload.field]: action.payload.value
        }
      default:
        return state;
    }
  }