import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Field from '../components/Field';
import customersApi from '../services/customersApi';

const customerPage = ({history, match}) => {
    
    const id = match.params.id
    const [editing] = useState(Number.isInteger(+id));

    const [customer, setCustomer] = useState({
        firstName: "",
        lastName: "",
        email: "",
        company: ""
    })

    const [errors, setErrors] = useState({
        firstName: "",
        lastName: "",
        email: "",
        company: ""
    })

    const fetchCustomer = async id => {
        try {
            const {firstName, lastName, email, company} = await customersApi.find(id);
            setCustomer({firstName, lastName, email, company});
        } catch (error) {
            console.log(error.response)
        }
    }

    useEffect(() => {
        if(editing) {
            fetchCustomer(id);
        }
    }, [id])

    const handleChange = ({currentTarget}) => {
        const inputName = currentTarget.name;
        const value = currentTarget.value;
        setCustomer({... customer, [inputName]: value});
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            if(editing) {
                await customersApi.update(id, customer)
            } else {
                await customersApi.create(customer)
            }
            setErrors({})
            history.replace('/customers');
        } catch ({response}) {
            const {violations} = response.data;
            if(violations) {
                const apiErrors = {};
                violations.forEach(({propertyPath, message}) => {
                    apiErrors[propertyPath] = message;
                })
                setErrors(apiErrors);
            }
        }
    }

    return ( 
        <>
            <h1 className="mb-5">
                {editing ? "Modification d'un client" : "Création d'un client"}
            </h1>

            <form onSubmit={handleSubmit}>
                <Field
                    name="lastName"
                    label="Nom de famille"
                    placeholder="Nom de famille du client"
                    value={customer.lastName}
                    onChange={handleChange}
                    error={errors.lastName}    
                />
                <Field
                    name="firstName"
                    label="Prénom"
                    placeholder="prénom du client"
                    value={customer.firstName}
                    onChange={handleChange}
                    error={errors.firstName}    
                />
                <Field
                    name="email"
                    label="Adresse email" type="email"
                    placeholder="Email du client"
                    value={customer.email}
                    onChange={handleChange}
                    error={errors.email}    
                />
                <Field
                    name="company"
                    label="Entreprise"
                    placeholder="Entreprise du client"
                    value={customer.company}
                    onChange={handleChange}
                    error={errors.company}    
                />
                <div className="formg-group">
                    <button type="submit" className="btn btn-success mr-4">Enregistrer</button>
                    <Link to="/customers">Retour à la liste</Link>
                </div>
            </form>
        </>
     );
}
 
export default customerPage;