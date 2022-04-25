import { LightningElement, wire } from 'lwc';
import { updateRecord } from 'lightning/uiRecordApi';
import { refreshApex } from '@salesforce/apex';
import getLeads from '@salesforce/apex/LeadContactController.getLeads';
import updateLead from '@salesforce/apex/LeadContactController.updateLead';
const COLUMNS = [
    { label: 'Name', fieldName: 'LeadURL', type: 'url', typeAttributes: {label: {fieldName: 'Name'}}, displayReadOnlyIcon: true},
    { label: 'Title', fieldName: 'Title', type: 'text', editable: true},
    { label: 'Phone', fieldName: 'Phone', type: 'phone', editable: true}
];
export default class LeadTable extends LightningElement {
    columns = COLUMNS;
    records;
    refreshTable;
    error;
    saveDraftValues;
    id = '';
    title = '';
    phone = '';
    @wire (getLeads)
    wiredLeads (response) {
        const {data, error} = response;
        this.refreshTable = response;
        if (data) {
            this.records = data;
            this.records = this.records.map( row => {
                return { LeadURL: '/lightning/r/Contact/' + row.Id + '/view',
                        Name: row.Name,
                        Title: row.Title, 
                        Phone: row.Phone, 
                        Id: row.Id
                }
            })
        }
        if (error) {
            this.error = 'Error ' + JSON.stringify(error);
        }
    }

    handleSaveAction1(event) {
        this.saveDraftValues = event.detail.draftValues;
        this.id = this.saveDraftValues[0].Id;
        this.title = this.saveDraftValues[0].Title;
        this.phone = this.saveDraftValues[0].Phone;
        updateLead({id: this.id, title: this.title, phone: this.phone});
        //updateRecord(event.detail.draftValues);
        this.template.querySelector("lightning-datatable").draftValues = [];
        clearTimeout(this.timeoutId);
        this.timeoutId = setTimeout(this.refreshData.bind(this),1000);
    }
    
    handleCellChangeAction(event){
        this.saveDraftValues = event.detail.draftValues;
        this.id = this.saveDraftValues[0].Id;
        this.title = this.saveDraftValues[0].Title;
        this.phone = this.saveDraftValues[0].Phone;
        updateLead({id: this.id, title: this.title, phone: this.phone});
        this.template.querySelector("lightning-datatable").draftValues = [];
        clearTimeout(this.timeoutId);
        this.timeoutId = setTimeout(this.refreshData.bind(this),1000);
    }

    refreshData() {
        refreshApex(this.refreshTable);
    }
}