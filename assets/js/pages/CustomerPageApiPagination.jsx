import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Pagination from '../components/Pagination';

const CustomersPageApiPagination = () => {

    const [customers, setCustomers] = useState([]);
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const itemsPerPage = 10;

    useEffect(() => {
        axios
            .get(`http://localhost:8000/api/customers?pagination=true&itemsPerPage=${itemsPerPage}&page=${currentPage}`)
            .then(response => {
                setCustomers(response.data["hydra:member"]);
                setTotalItems(response.data["hydra:totalItems"]);
                setLoading(false);
            })
            .catch(error => console.log(error.response))
    }, [currentPage]);

    const handleDelete = id => {
        const originalCustomers = [...customers];

        setCustomers(customers.filter(customer => customer.id !== id));

        axios
            .delete('http://localhost:8000/api/customers/' + id)
            .then(response => console.log("ok"))
            .catch(error => {
                console.log(error.response)
                setCustomers(originalCustomers);
            })
    }

    const handlePageChange = page => {
        setLoading(true);
        setCurrentPage(page);
    }

    return (
        <>
            <h1 className="mb-3">Liste des clients (ApiPagination)</h1>

            <table className="table table-hover w-75 m-auto">
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>client</th>
                        <th>Email</th>
                        <th>Entreprise</th>
                        <th className="text-center">Factures</th>
                        <th className="text-center">Montant total</th>
                    </tr>
                </thead>
                <tbody>
                    {loading && (
                        <tr>
                            <td>Chargement...</td>
                        </tr>
                    )}
                    {!loading && customers.map(customer => (
                        <tr key={customer.id}>
                            <td>{customer.id}</td>
                            <td>{customer.firstName} {customer.lastName}</td>
                            <td>{customer.email}</td>
                            <td>{customer.company}</td>
                            <td className="text-center">
                                <span className="badge badge-success">{customer.invoices.length}</span>
                            </td>
                            <td className="text-center">{customer.totalAmount.toLocaleString()} €</td>
                            <td>
                                <button 
                                    className="btn btn-sm btn-danger"
                                    disabled={customer.invoices.length > 0}
                                    onClick={() => handleDelete(customer.id)}
                                >
                                    supprimer
                                </button>
                            </td>
                        </tr>   
                    ))}
                </tbody>
            </table>

            <Pagination currentPage={currentPage} itemsPerPage={itemsPerPage} itemsLength={totalItems} handlePageChange={handlePageChange}/>
        </>
    );
}
 
export default CustomersPageApiPagination;