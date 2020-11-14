import axios from 'axios';

function findAll() {
    return axios
            .get('http://localhost:8000/api/invoices')
            .then(response => response.data["hydra:member"]);
}

function find(id) {
    return axios
            .get('http://localhost:8000/api/invoices/' + id)
            .then(response => response.data);
}

function createInvoice(invoice) {
    return axios.post("http://localhost:8000/api/invoices", invoice);
}

function updateInvoice(id, invoice) {
    return axios.put("http://localhost:8000/api/invoices/" + id, invoice);
}

function deleteInvoice(id) {
    return axios.delete("http://localhost:8000/api/invoices/" +id);
}

export default {
    findAll,
    find,
    create: createInvoice,
    update: updateInvoice,
    delete: deleteInvoice
}