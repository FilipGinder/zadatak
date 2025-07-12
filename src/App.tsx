import React from 'react';
import { Provider } from 'react-redux';
import Navigacija from './navigation/Navigation';
import store from './redux/store';

const App: React.FC = () => {
  return (
  <Provider store={store}>
    <Navigacija />
  </Provider>
  )
};

export default App;
