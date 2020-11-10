import React, { useEffect, useState } from 'react';
import Pagination from '../components/Pagination';
import customersApi from '../services/customersApi';

const CustomersPage = () => {

    const [customers, setCustomers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");

    const itemsPerPage = 10;
    const filteredCustomers = customers.filter(
        c => 
            c.firstName.toLowerCase().includes(search.toLowerCase()) ||
            c.lastName.toLowerCase().includes(search.toLowerCase()) ||
            c.email.toLowerCase().includes(search.toLowerCase()) ||
            c.company.toLowerCase().includes(search.toLowerCase())
    );
    const paginatedCustomers = Pagination.getPaginatedItems(filteredCustomers, currentPage, itemsPerPage);

    // Fetch customers on first loading
    useEffect(() => {
        customersApi.findAll()
            .then(data => setCustomers(data))
            .catch(error => console.log(error.response))
    }, []);

    const handleDelete = async id => {
        const originalCustomers = [...customers];
        setCustomers(customers.filter(customer => customer.id !== id));

        try {
            await customersApi.delete(id);
        } catch (error) {
            setCustomers(originalCustomers);
            console.log(error.response)
        }
    }
    
    const handleSearch = event => {
        setSearch(event.currentTarget.value);
        setCurrentPage(1);
    }
    
    const handlePageChange = page => setCurrentPage(page);

    return (
        <>
            <h1 className="mb-5">Liste des clients</h1>

            <div className="form-group ">
                <input onChange={handleSearch} value={search} type="text" className="form-control w-75 m-auto" placeholder="Rechercher..."/>
            </div>

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
                    {paginatedCustomers.map(customer => (
                        <tr key={customer.id}>
                            <td>{customer.id}</td>
                            <td><a href="#">{customer.firstName} {customer.lastName}</a></td>
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

            {itemsPerPage < filteredCustomers.length && (
                <Pagination currentPage={currentPage} itemsPerPage={itemsPerPage} itemsLength={filteredCustomers.length} handlePageChange={handlePageChange}/>
            )}
        </>
    );
}
 
export default CustomersPage;