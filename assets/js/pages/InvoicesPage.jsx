import invoicesApi from '../services/invoicesApi';
import React, { useEffect, useState } from 'react';
import Pagination from '../components/Pagination';
import moment from 'moment';

const InvoicesPage = (props) => {

    const [invoices, setInvoices] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    
    const statusClasses = {
        PAID: "success",
        SENT: "primary",
        CANCELLED: "danger"
    }
    const statusLabels = {
        PAID: "payée",
        SENT: "envoyée",
        CANCELLED: "annulée"
    }
    const filteredInvoices = invoices.filter(
        i => 
            i.customer.firstName.toLowerCase().includes(search.toLowerCase()) ||
            i.customer.lastName.toLowerCase().includes(search.toLowerCase()) ||
            i.amount.toString().startsWith(search) ||
            statusLabels[i.status].toLowerCase().includes(search.toLowerCase())
    );
    const itemsPerPage = 20;
    const paginatedInvoices = Pagination.getPaginatedItems(filteredInvoices, currentPage, itemsPerPage);
    const formatDate = (string) => moment(string).format('DD/MM/YYYY');

    useEffect(() => {
        invoicesApi.findAll()
            .then(data => setInvoices(data))
            .catch(error => console.log(error.response))
    }, []);

    const handlePageChange = page => setCurrentPage(page);

    const handleSearch = event => {
        setSearch(event.currentTarget.value);
        setCurrentPage(1);
    }

    const handleDelete = async id => {
        const originalInvoices = [...invoices];
        setInvoices(invoices.filter(i => i.id !== id))

        try {
            await invoicesApi.delete(id);
        } catch (error) {
            setInvoices(originalInvoices);
            console.log(error)
        }
    }

    return ( 
        <>
            <h1 className="mb-5">Liste des factures</h1>

            <div className="form-group ">
                <input onChange={handleSearch} value={search} type="text" className="form-control w-75 m-auto" placeholder="Rechercher..."/>
            </div>

            <table className="table table-hover w-75 m-auto">
                <thead>
                    <tr>
                        <th className="text-center">Numéro</th>
                        <th>Client</th>
                        <th>Date d'envoi</th>
                        <th>Statut</th>
                        <th className="text-center">Montant</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedInvoices.map(invoice => (
                        <tr key={invoice.id}>
                            <td className="text-center">{invoice.chrono}</td>
                            <td>{invoice.customer.firstName} {invoice.customer.lastName}</td>
                            <td>{formatDate(invoice.sentAt)}</td>
                            <td><span className={"badge badge-" + statusClasses[invoice.status]}>{statusLabels[invoice.status]}</span></td>
                            <td className="text-center">{invoice.amount}</td>
                            <td>
                                <button 
                                    className="btn btn-sm btn-danger"
                                    onClick={() => handleDelete(invoice.id)}
                                >
                                    supprimer
                                </button>
                            </td>
                        </tr>    
                    ))}
                  
                </tbody>
            </table>

            <Pagination currentPage={currentPage} itemsPerPage={itemsPerPage} itemsLength={filteredInvoices.length} handlePageChange={handlePageChange}/>
        </>
     );
}
 
export default InvoicesPage;