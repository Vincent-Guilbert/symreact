import React from 'react';
import ReactDOM from 'react-dom';
// any CSS you import will output into a single css file (app.css in this case)
import './styles/app.scss';


const App = () => {
    return <h1>hello world</h1>;
}

const $rootElement = document.querySelector('#app');
ReactDOM.render(<App />, $rootElement);