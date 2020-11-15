import React, { useState } from 'react';
import Field from '../components/Field';
import authApi from '../services/authApi';

const RegisterPage = ({history}) => {

    const [user, setUser] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password:"",
        confirmPassword: ""
    })

    const [errors, setErrors] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password:"",
        confirmPassword: ""
    })

    const handleChange = ({currentTarget}) => {
        const {name, value} = currentTarget;
        setUser({... user, [name]: value});
    }

    const handleSubmit = async event => {
        event.preventDefault();

        const apiErrors = {};

        if(user.confirmPassword !== user.password) {
            apiErrors.confirmPassword = "Le mot de passe ne corresponds pas.";
            setErrors(apiErrors);
            return;
        }

        try {
            await authApi.register(user);
            history.replace('/login')
        } catch ({response}) {
            const {violations} = response.data;
            if(violations) {
                violations.forEach(({propertyPath, message}) => {
                    apiErrors[propertyPath] = message;
                });
                setErrors(apiErrors);
            }
        }
    }

    return ( 
        <>
            <h1 className="mb-5">Inscription</h1>
            
            <form onSubmit={handleSubmit}>
                <Field 
                    name="lastName"
                    label="Nom de famille"
                    type="text"
                    value={user.lastName}
                    onChange={handleChange}
                    error={errors.lastName}
                />
                <Field
                    name="firstName"
                    label="Prénom"
                    type="text"
                    value={user.firstName}
                    onChange={handleChange}
                    error={errors.firstName}
                />
                <Field
                    name="email"
                    label="Adresse email"
                    type="email"
                    value={user.email}
                    onChange={handleChange}
                    error={errors.email}
                />
                <Field
                    name="password"
                    label="Mot de passe"
                    type="password"
                    value={user.password}
                    onChange={handleChange}
                    error={errors.password}
                />
                <Field
                    name="confirmPassword"
                    label="Confirmez votre mot de passe"
                    type="password"
                    value={user.confirmPassword}
                    onChange={handleChange}
                    error={errors.confirmPassword}
                />
                <button type="submit" className="btn btn-success">
                    S'inscrire
                </button>
            </form>
        </>
     );
}
 
export default RegisterPage;