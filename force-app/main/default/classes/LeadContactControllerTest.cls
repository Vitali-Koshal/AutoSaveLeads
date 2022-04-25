@isTest
public with sharing class LeadContactControllerTest {
    @TestSetup
    static void makeDatas(){
        List<Lead> leads = new List<Lead>();
        for (Integer i = 0 ; i<3 ; i++){
            leads.add(new Lead(LastName = 'TestLeads'+i, 
                                Title = 'CEO', 
                                Company = 'Plant' + i, 
                                Phone = '+222-22-2222222'));
        }
        insert leads;
        List<Contact> contacts = new List<Contact>();
        for (Integer i = 0 ; i<3 ; i++){
            contacts.add(new Contact(FirstName = 'FirstName' + i, LastName = 'LastName' + i));
        }
    }

    @isTest
    static void getContacts_getAllContacts_allContactsLoaded(){ 
        List<Contact> allContacts = [SELECT Id FROM Contact];
        Test.startTest();
        Integer getContactsMethodItemQuontity = LeadContactController.getContacts().size();
        Test.stopTest();
        System.assertEquals(allContacts.size(), getContactsMethodItemQuontity, 'All contacts are not loaded');
    }

    @isTest
    static void getLeads_getAllLeads_allLeadsLoaded(){ 
        List<Lead> allLeads = [SELECT Id FROM Lead];
        Test.startTest();
        Integer getLeadsMethodItemQuontity = LeadContactController.getLeads().size();
        Test.stopTest();
        System.assertEquals(allLeads.size(), getLeadsMethodItemQuontity, 'All contacts are not loaded');
    }

    @isTest 
    static void updateLeadTitle_changingLeadTitle_leadTitleUpdated() {
        Lead lead = [SELECT Id, LastName, Title, Phone FROM Lead WHERE LastName = 'TestLeads1'];
        Test.startTest();
        LeadContactController.updateLead(lead.Id, 'VP', '');
        Lead updatedLead = [SELECT Id, LastName, Title, Phone FROM Lead WHERE LastName = 'TestLeads1'];
        Test.stopTest();
        System.assertEquals('VP', updatedLead.Title, 'Lead was not updated!');
    }

    @isTest 
    static void updateLeadPhone_changingLeadPhone_leadPhoneNotUpdated() {
        Lead lead = [SELECT Id, LastName, Title, Phone FROM Lead WHERE LastName = 'TestLeads1'];
        Test.startTest();
        LeadContactController.updateLead(lead.Id, '', '+333-33-3333333');
        Lead updatedLead = [SELECT Id, LastName, Title, Phone FROM Lead WHERE LastName = 'TestLeads1'];
        Test.stopTest();
        System.assertNotEquals('+222-22-2222222', updatedLead.Phone, 'Lead phone is the same (not changed)');
    }
}
