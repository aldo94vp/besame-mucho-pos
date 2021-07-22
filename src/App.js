import { Route, Switch } from 'wouter';
import firebase from 'firebase';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import reducers from './reducers';
import firebaseConfig from 'config';

import CreateSale from 'components/sales/create.component';
import Print from 'components/print/print.component';
import Home from 'components/home/home.component';
import Login from 'components/login/login.component';
import CreateProduct from 'components/products/create.component';
import ListProducts from 'components/products/list.component';
import EditProduct from 'components/products/edit.component';
import SalesList from 'components/sales/list.component';
import ReportSales from 'components/sales/report.component';
import CreatePromoCode from 'components/promocodes/create.component';

import './app.scss';

// Initialize Firebase and Redux
firebase.initializeApp(firebaseConfig);
const store = createStore(reducers, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)

const App = () => {

  return (
    <Provider store={store}>
      <div className="App">
        <Switch>
          <Route path="/login" component={Login} />
          <Route path="/products" component={ListProducts} />
          <Route path="/products/new" component={CreateProduct} />
          <Route path="/products/:id" component={EditProduct} />
          <Route path="/sales" component={SalesList} />
          <Route path="/sales/new" component={CreateSale} />
          <Route path="/sales/report" component={ReportSales} />
          <Route path="/print/:id" component={Print} />
          <Route path="/codes/new" component={CreatePromoCode} />
          <Route>
            <Home></Home>
          </Route>
        </Switch>
      </div>
    </Provider>
  );
}

export default App;
