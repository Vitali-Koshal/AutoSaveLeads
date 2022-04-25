import { LightningElement, wire, track } from 'lwc';
import getContacts from '@salesforce/apex/LeadContactController.getContacts';
const COLUMNS = [
    { label: 'IdName', fieldName: 'Id', type: 'text', displayReadOnlyIcon: true},
    { label: 'Name', fieldName: 'ContactURL', type: 'url', typeAttributes: {label: {fieldName: 'Name'}}}
];
export default class ContactTable extends LightningElement {
    columns = COLUMNS;
    records;
    error;
    
    @wire (getContacts)
    wiredContacts (response) {
        const {data, error} = response;
        if (data) {
            this.records = data;
            this.records = this.records.map( row => {
                return { Id: row.Id+row.Name.replace(/\s/g, ''), 
                        Name: row.Name, ContactURL: '/lightning/r/Contact/' + row.Id + '/view' 
                }
            })
        }
        if (error) {
            this.error = 'Error ' + JSON.stringify(error);
        }
    }
}