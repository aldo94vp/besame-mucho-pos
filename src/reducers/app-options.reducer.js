const defaultOptions = {
  user: null
}

const appOptions = (state = defaultOptions, action) => {
  switch (action.type) {
    case 'SET_USER':
      state = { ...state,
        user: {
          ...action.payload
        }
      }
      return state;
    default:
      return state;
  }
}

export default appOptions;
