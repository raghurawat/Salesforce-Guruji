import { LightningElement, api, wire } from 'lwc';
import { CloseActionScreenEvent } from "lightning/actions";
import { updateRecord, getRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
const FIELDS = ['Account.Employee_Conatcts__c'];
export default class EmployeeContactsEdit extends LightningElement {
    @api recordId;
    contactSearchKey = '';
    firstName = '';
    lastName = '';
    email = '';
    leadSource = '';
    contactsData = [];
    columns = [
        { label: 'Name', fieldName: 'Name' },
        { label: 'Email', fieldName: 'Email', type: 'email' }
    ];
    @wire(getRecord, { recordId: '$recordId', fields: FIELDS })
    wiredRecord({ error, data }) {
        if (error) {
            
        } else if (data) {
            console.log(data);
            
            var employeeConatcts = data.fields.Employee_Conatcts__c.value;
            if(employeeConatcts != ''){
                var employeeConatctsList = employeeConatcts.split('\n');
                console.log(employeeConatctsList);
                if(employeeConatctsList.length > 1){
                    var fieldValues = employeeConatctsList[1].split(',');
                    console.log(fieldValues);
                    console.log(fieldValues.length);
                    if(fieldValues.length > 3){
                        this.firstName = fieldValues[0].trim();
                        this.lastName = fieldValues[1].trim();
                        this.email = fieldValues[2].trim();
                        this.leadSource = fieldValues[3].trim();
                    }
                }
            }
        }
    }
    closeAction() {
        this.dispatchEvent(new CloseActionScreenEvent());
    }
    firstNameChange(event){
        this.firstName = event.target.value;
    }
    lastNameChange(event){
        this.lastName = event.target.value;
    }
    emailChange(event){
        this.email = event.target.value;
    }
    leadSourceChange(event){
        this.leadSource = event.target.value;
    }
    saveAccount(){
        if(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.email)){
                var employeeConatcts = 'FirstName, LastName, Email, LeadSource';
            employeeConatcts += '\n '+this.firstName+', '+this.lastName+', '+this.email+', '+this.leadSource;
            const fields = {};
            fields['Id'] = this.recordId;
            fields['Employee_Conatcts__c'] = employeeConatcts;

            const recordInput = { fields };

            updateRecord(recordInput)
                .then(() => {
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Success',
                            message: 'Account updated',
                            variant: 'success'
                        })
                    );
                    // Display fresh data in the form
                    this.dispatchEvent(new CloseActionScreenEvent());
                })
                .catch(error => {
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Error creating record',
                            message: error.body.message,
                            variant: 'error'
                        })
                    );
                });
        }else{
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error',
                    message: 'The Email address is not valid.',
                    variant: 'error'
                })
            );
        }
    }
}