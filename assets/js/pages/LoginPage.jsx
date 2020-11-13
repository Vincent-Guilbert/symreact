import React, { useContext, useState } from 'react';
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

            <form onSubmit={handleSubmit} className="w-50 m-auto">
                <div className="form-group">
                    <label htmlFor="username">Adresse email</label>
                    <input type="email"
                           name="username"
                           value={credentials.username}
                           onChange={handleChange}
                           className={"form-control" + (error && " is-invalid")}
                    />
                    {error && <p className="invalid-feedback">{error}</p>}
                </div>
                <div className="form-group">
                    <label htmlFor="password">Mot de passe</label>
                    <input type="password"
                           name="password"
                           value={credentials.password}
                           onChange={handleChange}
                           className="form-control"
                    />
                </div>
                <div className="form-group">
                    <button type="submit" className="btn btn-success">connexion</button>
                </div>
            </form>
        </>
    );
}

export default LoginPage;