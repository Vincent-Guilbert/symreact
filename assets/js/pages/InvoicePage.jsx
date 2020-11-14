import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Field from '../components/Field';
import Select from '../components/Select';
import customersApi from '../services/customersApi';
import invoicesApi from '../services/invoicesApi';

const InvoicePage = ({history, match}) => {

    const id = match.params.id;
    const editing= Number.isInteger(+id);

    const [invoice, setInvoice] = useState({
        amount: "",
        customer:"",
        status: "SENT"
    });

    const [errors, setErrors] = useState({
        amount: "",
        customer:"",
        status: ""
    });

    const [customers, setCustomers] = useState([]);

    const fetchCustomers = async () => {
        try {
            const data = await customersApi.findAll();
            setCustomers(data);
            setInvoice({...invoice, customer: data[0].id})
        } catch (error) {
            console.log(error.response)
        }
    }

    const fetchInvoice = async id => {
        try {
            const {amount, status, customer} = await invoicesApi.find(id);
            setInvoice({amount, status, customer: customer.id});
        } catch ({response}) {
            console.log(response)
        }
    }

    useEffect(() => {
        fetchCustomers();
    }, []);

    useEffect(() => {
        if(editing) {
            fetchInvoice(id) 
        }
    }, [id]);


    const handlechange = ({currentTarget}) => {
        const { name, value } = currentTarget;
        setInvoice({...invoice, [name]: value});
    }

    const handleSubmit = async event => {
        event.preventDefault();

        try {
            const normalizedInvoice = {
                    ...invoice,
                    amount: +invoice.amount,
                    customer: `/api/customers/${invoice.customer}`
                }
            if(editing) {
                await invoicesApi.update(id, normalizedInvoice)
            } else {
                await invoicesApi.create(normalizedInvoice);
            }
            history.replace('/invoices');
        } catch ({response}) {
            console.log(response)
            const {violations} = response.data;
            if(violations) {
                const apiErrors = {};
                violations.forEach(({propertyPath, message}) => {
                    apiErrors[propertyPath] = message;
                })
            console.log(apiErrors)
            setErrors(apiErrors);
            }
        }
    }

    return ( 
        <>
            {!editing ? <h1 className="mb-5">Créer une facture</h1> : <h1 className="mb-5">Modifier la facture</h1> }

            <form onSubmit={handleSubmit}>
                <Field
                    name="amount"
                    label="Montant"
                    type="number"
                    placeholder="Montant de la facture"
                    value={invoice.amount}
                    error={errors.amount}
                    onChange={handlechange}
                />
                <Select
                    name="customer"
                    label="Client"
                    value={invoice.customer}
                    error={errors.customer}
                    onChange={handlechange}
                >
                    {customers.map(customer =>
                        <option key={customer.id} value={customer.id}>
                            {customer.firstName} {customer.lastName}
                        </option>    
                    )}
                </Select>
                <Select
                    name="status"
                    label="Status"
                    value={invoice.status}
                    error={errors.status}
                    onChange={handlechange}
                >
                    <option value="SENT">Envoyée</option>
                    <option value="PAID">Payée</option>
                    <option value="CANCELLED">Annulée</option>
                </Select>
                <div className="from-group">
                    <button type="submit" className="btn btn-success mr-4">Envoyer</button>
                    <Link to="/invoices">Retour à la liste</Link>
                </div>
            </form>
        </>
     );
}
 
export default InvoicePage;