(function () {
    'use strict';

    var serviceId = 'datacontext';
    angular.module('formApp').factory(serviceId, ['common','breeze','entityManagerFactory', datacontext]);

    function datacontext(common,breeze,entityManagerFactory) {
        var $q = common.$q;
        var manager = entityManagerFactory.getEntityManager();

        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(serviceId);
        var logError = getLogFn(serviceId, 'error');
        var logSuccess = getLogFn(serviceId, 'success');

        var service = {
            addBookToOrder: addBookToOrder,
            changesCount: changesCount,
            createOrder: createOrder,
            getBooks: getBooks,
            getOrdersAndDetails: getOrdersAndDetails,
            getMessageCount: getMessageCount,
            getPeople: getPeople,
            ready: getReady(),
            isSaving:false,
            saveOrder:saveOrder
        };

        return service;
        
        function addBookToOrder(book, order) {
            var detail = manager.createEntity("OrderDetail", {
                book: book,
                order: order,
                quantity: 1
            });
            return detail;
        }

        function changesCount() {
            return manager.getChanges().length;
        }

        function createOrder() {
            var order=manager.createEntity("Order", {
                orderDate: new Date().toUTCString()
            });
            return order;
        }

        function getMessageCount() { return $q.when(72); }

        function getOrdersAndDetails() {
            return breeze.EntityQuery.from("Orders")
                    .expand("OrderDetails")
                    .using(manager)
                    .execute()
                    .then(success)
                    .catch(fail)
        }
        
        function success(data) {
            var results = data.results;
            logSuccess("Got " + results.length +" orders", null, true);
            return results;
        }


        function getPeople() {
            var people = [
                { firstName: 'John', lastName: 'Papa', age: 25, location: 'Florida' },
                { firstName: 'Ward', lastName: 'Bell', age: 31, location: 'California' },
                { firstName: 'Colleen', lastName: 'Jones', age: 21, location: 'New York' },
                { firstName: 'Madelyn', lastName: 'Green', age: 18, location: 'North Dakota' },
                { firstName: 'Ella', lastName: 'Jobs', age: 18, location: 'South Dakota' },
                { firstName: 'Landon', lastName: 'Gates', age: 11, location: 'South Carolina' },
                { firstName: 'Haley', lastName: 'Guthrie', age: 35, location: 'Wyoming' }
            ];
            return $q.when(people);
        }
        
        function getReady() {
            return manager.metadataStore.fetchMetadata(manager.dataService)
                    .then(function() {
                        logSuccess("Metadata fetched");
                        return true;
                    })
            .catch(function(error) {
                logError("Metadata fetch failed! We got " + error.message, error, true);
                return $q.reject(error);
            })
        }
        
        function getBooks() {
            return breeze.EntityQuery.from('Books')
                .using(manager)
                .execute()
                .then(success)
                .catch(fail);

            function success(response) {
                var books = response.results;
                logSuccess("Yay! We got books" + books.length, null, true);
                return books;
            }
        }
        
        function fail(error) {
            logError('oops we got ' + error.message, error, true);
        }
        
        function saveOrder() {
            service.isSaving = true;
           return manager.saveChanges()
                .catch(saveFailed)
                .finally(saveFinally)
                .then(saveOrderSuccess)
            
            function saveFinally() {
                service.isSaving = false;
            }

            function saveFailed(error) {
                var msg = "Save failed " + breeze.saveErrorMessageService.getErrorMessage(error);
                error.message = msg;
                logError(msg, error, true);
                throw error;
            }
            
            function saveOrderSuccess(saveResult) {
                var order = saveResult.entities.filter(function(order) {
                    return order.entityType.shortName == 'Order';
                })[0];
                var message = "Saved order " + order.customer;
                logSuccess(message, null, true);

                breeze.EntityQuery.from("Orders").where("id", "eq", order.id).expand("OrderDetails")
                    .using(manager).execute().then(function(data) {
                        var order = data.results[0];
                        var message = "Retrieved saved order " + order.customer + " and his " + order.orderDetails.length + " books.";
                        logSuccess(message, order, true);
                    });

            }
        }
    }
})();