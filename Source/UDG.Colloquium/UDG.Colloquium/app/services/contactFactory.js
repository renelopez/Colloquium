(function () {
    'use strict';

    // Factory name is handy for logging
    var serviceId = 'contactFactory';

    // Define the factory on the module.
    // Inject the dependencies. 
    // Point to the factory definition function.
    // TODO: replace app with your module name
    angular.module('registerModule').factory(serviceId, [contactFactory]);

    function contactFactory() {
        // Define the functions and properties to reveal.
        var contacts = [];


        var service = {
            getContacts: getContacts,
            postContact: postContact,
            removeLastContact:removeLastContact,
            removeSelectedContact:removeSelectedContact
        };

        return service;

        function getContacts() {
            return contacts;
        }

        function postContact(contact) {
            contacts.push(contact);
        }

        function removeLastContact() {
            contacts.pop();
        }

        function removeSelectedContact(contact) {
            contacts.splice(contacts.indexOf(contact), 1);
            contact = null;
        }
    }
})();