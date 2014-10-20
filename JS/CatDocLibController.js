/**
 * Created by pgalvin on 10/12/2014.
 */

var CDLApp= angular.module('CDLApp', ['ngRoute']);

CDLApp.controller("CDLController",function($scope,$http) {

    // Data Model
    $scope.allCategories = []; // Name and count of records for that category.
    $scope.allSelectedCategories = []; // Just those categories that the user has selected.
    $scope.allDocuments = [];
    $scope.allSelectedDocuments = [];

    $scope.deselectAllCategories = function() {
        $scope.allSelectedCategories = [];
        $scope.allSelectedDocuments = [];
    };

    $scope.selectAllCategories = function() {
        var tempArr = _.union($scope.allCategories,$scope.allSelectedCategories);
        $scope.allSelectedDocuments = $scope.allDocuments;
        $scope.allSelectedCategories = tempArr;
        tempArr = [];
    };

    $scope.isCategorySelected = function(theCatNameToCheck) {
        //console.log("isCategorySelected; Searching for cat name: [" + theCatNameToCheck + "]");
        return _.findIndex($scope.allSelectedCategories, { catName: theCatNameToCheck }) >= 0;

        //return _.indexOf($scope.allSelectedCategories,theCatName) >= 0;
    };

    $scope.toggleCategoryIsSelected = function(catNameToToggle) {

        var currentTargetCatNameIndex = _.findIndex($scope.allSelectedCategories, {catName: catNameToToggle});

        // It was already selected, so we need to remove it.
        if (currentTargetCatNameIndex >= 0) {
            $scope.allSelectedCategories.splice(currentTargetCatNameIndex,1);

            // Rebuild the list of selected documents.
            $scope.allSelectedDocuments = [];
            // Iterate through all the selected categories.
            _.forEach($scope.allSelectedCategories,function(aCategory) {
                // Get all the documents that match this category.
                tempArr = _.filter($scope.allDocuments, function(aDocument) {return aDocument.docCategory === aCategory.catName;});
                $scope.allSelectedDocuments = _.union($scope.allSelectedDocuments,tempArr);
                tempArr = [];
            });
        }
        // It was not already selected, so we need to add it.
        else {
            var currentTargetCatNameIndex = _.findIndex($scope.allSelectedCategories, {catName: catNameToToggle});
            $scope.allSelectedCategories.push({
                catName: catNameToToggle,
                catCount: $scope.allCategories[_.findIndex($scope.allCategories, {catName: catNameToToggle})].catCount}
            );

            // need to sort like we do for all the categories (sortBy)
            //$scope.allSelectedCategories.sort();
            tempArr = _.filter($scope.allDocuments, function(aDocument) {return aDocument.docCategory === catNameToToggle;});

            $scope.allSelectedDocuments = _.union($scope.allSelectedDocuments,tempArr);

            tempArr = [];
        };
    };

    $scope.loadTestCategories = function() {
        $scope.allCategories.push({catName: "Apple", catCount: 2});
        $scope.allCategories.push({catName: "IBM", catCount: 1});
        $scope.allCategories.push({catName: "Politics", catCount: 5});
        $scope.allCategories.push({catName: "Religion", catCount: 0});
        $scope.allCategories.push({catName: "Telecom", catCount: 0});
        $scope.allCategories.push({catName: "Training", catCount: 0});
        $scope.allCategories.push({catName: "Microsoft", catCount: 0});
        $scope.allCategories.push({catName: "Project Management", catCount: 0});
        $scope.allCategories.push({catName: "Recreation", catCount: 0});
        $scope.allCategories.push({catName: "Literature", catCount: 0});

        var sortedObjs = _.sortBy( $scope.allCategories, 'catName' );
        $scope.allCategories = sortedObjs;
    };

    $scope.calculateAndStoreCategoryCounts = function() {

        var countResults = _.countBy($scope.allDocuments,'docCategory');
        var aCat = "Apple";
        var appleCount = countResults[aCat];
        var x = 2;

        for (var i = 0; i < $scope.allCategories.length; i++)
        {
            var thisCatCount = countResults[$scope.allCategories[i].catName];
            if (thisCatCount === undefined) thisCatCount = 0;

            $scope.allCategories[i].catCount = thisCatCount;
        }
    };

    $scope.loadTestDocumentData = function() {
        $scope.allDocuments.push({
            docTitle: "Document title AA",
            docName: 'xyzzy.doc',
            docSummary: 'This is the document summary (short)',
            docModifiedDate: 1/12/2014,
            docCategory: 'Apple'});
        $scope.allDocuments.push({
            docTitle: "Document title BB",
            docName: 'xyzzy2.doc',
            docSummary: 'This is longer summary to see how the formatting works and all that goodness.  Now is the time for all good men to come to the aid of their country, and so forth and so on, etc.',
            docModifiedDate: 2/05/2014,
            docCategory: 'Apple'});
        $scope.allDocuments.push({
            docTitle: "Document title CC",
            docName: 'xyzzy3.doc',
            docSummary: 'This is another apple doc short suummary of no great interest.',
            docModifiedDate: 6/30/2014,
            docCategory: 'Apple'});

        $scope.allDocuments.push({
            docTitle: "Document title DDD",
            docName: 'abc123.xls',
            docSummary: 'First Religion document for testing purposes, not a very long summary.',
            docModifiedDate: 6/01/2014,
            docCategory: 'Religion'});

        $scope.allDocuments.push({
            docTitle: "Document title EE",
            docName: 'abc456.pdf',
            docSummary: 'Another religion category document.',
            docModifiedDate: 04/15/2014,
            docCategory: 'Religion'});

        $scope.allDocuments.push({
            docTitle: "Document title FF",
            docName: 'PM document 2',
            docSummary: 'Some random PM document. Loremy stuff here',
            docModifiedDate: 5/08/2014,
            docCategory: 'Project Management'});

        $scope.allDocuments.push({
            docTitle: "Document title GG",
            docName: 'PM document 3',
            docSummary: 'Some random PM document." Some problems have no good answer, Paul"',
            docModifiedDate: 3/28/2014,
            docCategory: 'Project Management'});

        $scope.allDocuments.push({
            docTitle: "Document title HH",
            docName: 'PM document 4',
            docSummary: 'Some random PM document.  What are you doing, Dave?',
            docModifiedDate: 9/18/2014,
            docCategory: 'Project Management'});

        $scope.allDocuments.push({
            docTitle: "Document title II",
            docName: 'PM document 1',
            docSummary: 'Some random PM document. I\'m not good at being good"',
            docModifiedDate: 9/08/2014,
            docCategory: 'Project Management'});

        $scope.allDocuments.push({
            docTitle: "Document title JJ",
            docName: 'PM document 5',
            docSummary: 'Some random PM document.  There once was a man from Nantucket...',
            docModifiedDate: 11/19/2014,
            docCategory: 'Project Management'});

    };

    $scope.loadTestCategories();
    $scope.loadTestDocumentData();
    $scope.calculateAndStoreCategoryCounts();
})
    .filter('highlight', function($sce) {
        return function(text, phrase) {
            if (phrase) text = text.replace(new RegExp('('+phrase+')', 'gi'),
                '<span class="cdlSearchlHighlight">$1</span>');

            return $sce.trustAsHtml(text)
        }
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
