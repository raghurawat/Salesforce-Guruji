/*
Name           : ALLContactListController
Date           : 28 February 2017
Auther         : 
Description    : This webservice class for ShowAllContact List Account Detial Pa
*/
global class ALLContactListController{

    public PageReference refreshOnly() {
        return null;
    }

    webservice static List<Contact> getContactList(String accountId) {
         if(String.ISNOTBLANK(accountId)){
             List<Contact> contactList = [SELECT Id, Name, Phone, Email,AccountId From Contact];
             return contactList;
         }
         else {
             return null;
         }
    }
    webservice static List<Contact> getRelatedContactList(String accountId) {
         if(String.ISNOTBLANK(accountId)){
             List<Contact> contactList = [SELECT Id, Name, Phone, Email,AccountId From Contact Where AccountId =:accountId];
             return contactList;
         }
         else {
             return null;
         }
    }
    webservice static List<TestObjectChildOfContact__c> getCustomObjectRecordChildOfContactList(String contactId) {
         if(String.ISNOTBLANK(contactId)){
             List<TestObjectChildOfContact__c> CustonObjectRecordsList = [SELECT Id, Name  From TestObjectChildOfContact__c  Where Contact__c =:contactId];
             return CustonObjectRecordsList;
         }
         else {
             return null;
         }
    }
    webservice static String setAccountForselectedContact(List<String> contactIdsList,String accountId) {
        System.debug('contactIds'+contactIdsList);
        String status = 'Unsuccessfull';
        Set<String> contactIds = new Set<String>();
        for(String conId : contactIdsList){
            contactIds.add(conId);
        }
         if(contactIds.size() > 0 && contactIds != null){
             Account accObj = [SELECT Id FROM Account WHERE Id =: accountId];
             if(accObj != null){
                 List<Contact> contactForUpdate = new List<Contact>();
                 for(contact conRecord : [SELECT Id, AccountId From Contact WHERE Id in : contactIds]){
                     conRecord.AccountId = accObj.Id;
                     contactForUpdate.add(conRecord);
                 }
                 if(contactForUpdate.size() > 0){
                     update contactForUpdate;
                 }
                 status = 'Contact Updated Successfully';
             }
             return status;
         }
         else {
             return status;
         }
    }
    public List<AccountInnerClass> AccountInnerClassList {
        get {
            if (AccountInnerClassList == null) {
                AccountInnerClassList  = new List<AccountInnerClass>();
                for(Account accObj : [SELECT Id, Name, Website, Phone FROM Account limit 10000]){
                    AccountInnerClassList.add(new AccountInnerClass(accObj));
                }
            }
            return AccountInnerClassList;
        }
        set;
    }
    Public class AccountInnerClass{
        Public Boolean Selected{get;set;}
        public Account accRecord{get;set;}
        Public AccountInnerClass(Account accObj){
            accRecord = accObj;
        }
    }
}