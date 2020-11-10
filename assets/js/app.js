// any CSS you import will output into a single css file (app.css in this case)
import '../css/app.scss';
import React from 'react';
import ReactDOM from 'react-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import { HashRouter, Switch, Route } from 'react-router-dom';
import CustomersPage from './pages/CustomersPage';
import CustomersPageApiPagination from './pages/CustomerPageApiPagination';
import InvoicesPage from './pages/InvoicesPage';



const App = () => {
    return (
        <HashRouter>
            <Navbar/>
            <main className="pt-5">
                <Switch>
                    <Route path="/customers" component={CustomersPage}/>
                    <Route path="/invoices" component={InvoicesPage}/>
                    <Route path="/" component={HomePage}/>
                </Switch>
            </main>
        </HashRouter>
    );
}

const $rootElement = document.querySelector('#app');
ReactDOM.render(<App />, $rootElement);