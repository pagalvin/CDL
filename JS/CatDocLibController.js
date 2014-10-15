/**
 * Created by pgalvin on 10/12/2014.
 */

var CDLApp= angular.module('CDLApp', ['ngRoute']);

CDLApp.controller("CDLController",function($scope,$http) {

    // Data Model
    $scope.allCategories = [];
    $scope.allSelectedCategories = [];
    $scope.allDocuments = [];
    $scope.allSelectedDocuments = [];

    $scope.deselectAllCategories = function() {
        $scope.allSelectedCategories = [];
        $scope.allSelectedDocuments = [];
    };

    $scope.selectAllCategories = function() {
        tempArr = _.union($scope.allCategories,$scope.allSelectedCategories);
        $scope.allSelectedDocuments = $scope.allDocuments;
        $scope.allSelectedCategories = tempArr;
        tempArr = [];
    };

    $scope.isCategorySelected = function(theCatName) {
        // alert("catname: [" + theCatName + "]")
        return _.indexOf($scope.allSelectedCategories,theCatName) >= 0;
    };

    $scope.toggleCategoryIsSelected = function(catName) {

        var currentTargetCatNameIndex = _.indexOf($scope.allSelectedCategories,catName);

        // It was already selected, so we need to remove it.
        if (currentTargetCatNameIndex >= 0) {
            $scope.allSelectedCategories.splice(currentTargetCatNameIndex,1);

            $scope.allSelectedDocuments = [];
            // Iterate through all the selected categories.
            _.forEach($scope.allSelectedCategories,function(aCategory) {
                // Get all the documents that match this category.
                console.log("a category: [" + aCategory + "]");
                tempArr = _.filter($scope.allDocuments, function(aDocument) {return aDocument.docCategory === aCategory;});
                $scope.allSelectedDocuments = _.union($scope.allSelectedDocuments,tempArr);
                tempArr = [];
            });
        }
        // It was not already selected, so we need to add it.
        else {
            $scope.allSelectedCategories.push(catName);
            $scope.allSelectedCategories.sort();
            tempArr = _.filter($scope.allDocuments, function(aDocument) {return aDocument.docCategory === catName;});

            $scope.allSelectedDocuments = _.union($scope.allSelectedDocuments,tempArr);

            tempArr = [];
        };
    };

    $scope.loadTestCategories = function() {
        $scope.allCategories.push("Apple");
        $scope.allCategories.push("IBM");
        $scope.allCategories.push("Politics");
        $scope.allCategories.push("Religion");
        $scope.allCategories.push("Telecom");
        $scope.allCategories.push("Training");
        $scope.allCategories.push("Microsoft");
        $scope.allCategories.push("Project Management");
        $scope.allCategories.push("Recreation");
        $scope.allCategories.push("Literature");

        $scope.allCategories.sort();
    };

    $scope.loadTestDocumentData = function() {
        $scope.allDocuments.push({
            docName: 'xyzzy.doc',
            docSummary: 'This is the document summary (short)',
            docModifiedDate: 1/12/2014,
            docCategory: 'Apple'});
        $scope.allDocuments.push({
            docName: 'xyzzy2.doc',
            docSummary: 'This is longer summary to see how the formatting works and all that goodness.  Now is the time for all good men to come to the aid of their country, and so forth and so on, etc.',
            docModifiedDate: 2/05/2014,
            docCategory: 'Apple'});
        $scope.allDocuments.push({
            docName: 'xyzzy3.doc',
            docSummary: 'This is another apple doc short suummary of no great interest.',
            docModifiedDate: 6/30/2014,
            docCategory: 'Apple'});

        $scope.allDocuments.push({
            docName: 'abc123.xls',
            docSummary: 'First Religion document for testing purposes, not a very long summary.',
            docModifiedDate: 6/01/2014,
            docCategory: 'Religion'});

        $scope.allDocuments.push({
            docName: 'abc456.pdf',
            docSummary: 'Another religion category document.',
            docModifiedDate: 04/15/2014,
            docCategory: 'Religion'});

        $scope.allDocuments.push({
            docName: 'PM document 2',
            docSummary: 'Some random PM document. Loremy stuff here',
            docModifiedDate: 5/08/2014,
            docCategory: 'Project Management'});

        $scope.allDocuments.push({
            docName: 'PM document 3',
            docSummary: 'Some random PM document." Some problems have no good answer, Paul"',
            docModifiedDate: 3/28/2014,
            docCategory: 'Project Management'});

        $scope.allDocuments.push({
            docName: 'PM document 4',
            docSummary: 'Some random PM document.  What are you doing, Dave?',
            docModifiedDate: 9/18/2014,
            docCategory: 'Project Management'});

        $scope.allDocuments.push({
            docName: 'PM document 1',
            docSummary: 'Some random PM document. I\'m not good at being good"',
            docModifiedDate: 9/08/2014,
            docCategory: 'Project Management'});

        $scope.allDocuments.push({
            docName: 'PM document 5',
            docSummary: 'Some random PM document.  There once was a man from Nantucket...',
            docModifiedDate: 11/19/2014,
            docCategory: 'Project Management'});

    };

    $scope.loadTestCategories();
    $scope.loadTestDocumentData();
});


CDLApp.config(function($routeProvider) {
    $routeProvider.
        when('/', {
            templateUrl: "Partials/CatDocLibMain.html",
            controller: "CDLController"
        }).
        when('/x', {
            template: "this is the X space",
            controller: "CDLController"
        }).

        otherwise({redirectTo: '/'});

});
