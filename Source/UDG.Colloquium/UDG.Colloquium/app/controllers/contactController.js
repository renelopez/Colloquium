(function () {
    'use strict';

    // Controller name is handy for logging
    var controllerId = 'contactController';

    // Define the controller on the module.
    // Inject the dependencies. 
    // Point to the controller definition function.
    angular.module('registerModule').controller(controllerId,
        ['$scope','contactFactory', contactController]);

    function contactController($scope,contactFactory) {
        // Using 'Controller As' syntax, so we assign this to the vm variable (for viewmodel).
        var vm = this;

        // Bindable properties and functions are placed on vm.
        vm.contacts = contactFactory.getContacts();
        vm.addContact = addContact;
        vm.removeLastContact = removeLastContact;
        vm.removeSelectedContact = removeSelectedContact;

        function addContact() {
            contactFactory.postContact({
                contactPhoneNumber: vm.contactPhoneNumber,
                contactAddress: vm.contactAddress,
                contactEmail: vm.contactEmail,
                contactType:vm.contactType
            });
        }

        function removeLastContact() {
            contactFactory.removeLastContact();
        }

        function removeSelectedContact(index) {
            var selectedContactToDelete = vm.contacts[index];
            contactFactory.removeSelectedContact(selectedContactToDelete);
        }

        vm.addContact();


        //#region Internal Methods        

        //#endregion
    }
})();
