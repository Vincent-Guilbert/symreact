import React, { useContext, useState } from 'react';
import Field from '../components/Field';
import AuthContext from '../contexts/AuthContext';
import authApi from '../services/authApi';

const LoginPage = ({history}) => {

    const [error, setError] = useState("");
    const {isAuth, setIsAuth} = useContext(AuthContext);
    const [credentials, setCredentials] = useState({
        username: "",
        password: ""
    })

    const handleChange = ({currentTarget}) => {
        const value = currentTarget.value;
        const inputName = currentTarget.name;

        setCredentials({ ...credentials, [inputName]: value });
    }

    const handleSubmit = (event) => {
        event.preventDefault();

        authApi.authenticate(credentials)
            .then((response) => {
                setError("");
                setIsAuth(true);
                localStorage.setItem('isAuth', true)
                history.replace("/customers");
            })
            .catch(error => setError("Une erreur est survenue"))
    }

    return (
        <>
            <h1 className="mb-5">Connexion</h1>

            <form onSubmit={handleSubmit}>
                <Field
                    name="username"
                    label="Adresse email"
                    type="email"
                    value={credentials.username}
                    onChange={handleChange}
                    error={error}
                />
                <Field
                    name="password"
                    label="Mot de Passe"
                    type="password"
                    value={credentials.password}
                    onChange={handleChange}
                />
                <div className="form-group">
                    <button type="submit" className="btn btn-success">connexion</button>
                </div>
            </form>
        </>
    );
}

export default LoginPage;