// any CSS you import will output into a single css file (app.css in this case)
import '../css/app.scss';
import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Route, Switch, withRouter } from 'react-router-dom';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import AuthContext from './contexts/AuthContext';
import CustomersPage from './pages/CustomersPage';
import HomePage from './pages/HomePage';
import InvoicesPage from './pages/InvoicesPage';
import LoginPage from './pages/LoginPage';


const App = () => {

    const NavbarWithRouter = withRouter(Navbar);

    const [isAuth, setIsAuth] = useState(localStorage.getItem('isAuth') || false);
        
    const authContext = {
        isAuth,
        setIsAuth
    }

    return (
        <AuthContext.Provider value={authContext}>
            <HashRouter>
                <NavbarWithRouter/>
                <main className="pt-5">
                    <Switch>
                        <PrivateRoute path="/customers" component={CustomersPage}/>
                        <PrivateRoute path="/invoices" component={InvoicesPage}/>
                        <Route path="/login" component={LoginPage}/>
                        <Route path="/" component={HomePage}/>
                    </Switch>
                </main>
            </HashRouter>    
        </AuthContext.Provider>
        
    );
}

const $rootElement = document.querySelector('#app');
ReactDOM.render(<App />, $rootElement);