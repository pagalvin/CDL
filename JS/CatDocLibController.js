/**
 * Created by pgalvin on 10/12/2014.
 */

var CDLApp= angular.module('CDLApp', ['ngRoute']);

CDLApp.controller("CDLController",function($scope,$http) {

    /***********************************************************************************************************/
    // CDL end user functionality data model
    /***********************************************************************************************************/
    $scope.allCategories = []; // Name and count of records for that category.
    $scope.allSelectedCategories = []; // Just those categories that the user has selected.
    $scope.allDocuments = [];
    $scope.allSelectedDocuments = [];

    $scope.getLinksResponse = {};

    /***********************************************************************************************************/
    // CDL Admin functionality data model
    /***********************************************************************************************************/
    $scope.CDLSettings = {

        generalProperties: {
            appOwnerName: "",
            appOwnerEmailAddress: "",
            appDisplayLabel: "",
            appHelp: {
                categoriesHelp: "",
                quickSearchHelp: "",
                searchResultsHelp: ""
            },
            doShowZeroItemCategories: false,
            doUseTestData: false,
            doShowZeroItemCategoriesText: "No",
            doUseTestDataText:"No"

        },

        dataSources: [{

            //serverUrl += "/_api/web/lists/GetByTitle('MockBlog')/items" +
            //"?$select=Title,Categories/Title,Blog_x0020_Author/Title" +
            //"&$expand=Blog_x0020_Author,Categories";
            docLibWebUrl: "",
            docLibName: "",
            docLibCategoryColumnName: ""

            // whatever else we need
        }],

        searchProperties: {
            doExecuteSPSearchInParallel: true,
            sharePointSearchSource: ""
        },

        lookAndFeelProperties: {
            // various CSS properties
        },

        testData: []

        /*
        testData : [{
            docTitle: "",
            docName: '',
            docSummary: '',
            docModifiedDate: 01/01/01,
            docCategory: ''
        }]
        */
    } ;

    /***********************************************************************************************************/
    // CDL Test methods.
    /***********************************************************************************************************/
    $scope.addNewTestRow = function() {
        $scope.CDLSettings.testData.splice(0,0,
            {
                docTitle: $scope.newTestItemTitle,
                docName: $scope.newTestItemDocName,
                docSummary: $scope.newTestItemDocCategory,
                docModifiedDate: $scope.newTestItemDocModifiedDate,
                docCategory: $scope.newTestItemDocCategory,
                isNewTestItem: true,
                isMarkedForDeletion: false
            });

        $scope.resetNewTestItemFields();
    };

    // For adding a new test item via the admin screen
    $scope.resetNewTestItemFields = function() {
        $scope.newTestItemTitle = "";
        $scope.newTestItemDocName = "";
        $scope.newTestItemDocCategory = "";
        $scope.newTestItemDocModifiedDate = "";
        $scope.isMarkedForDeletion = false;
    };

    $scope.newTestItemIsValid = function() {

        return  $scope.newTestItemTitle.length > 0 &&
            $scope.newTestItemDocName.length > 0 &&
            $scope.newTestItemDocCategory.length > 0 &&
            $scope.newTestItemDocModifiedDate.length > 0;
    };

    $scope.markTestDataRowForDeletion = function(indexToMark) {
        $scope.CDLSettings.testData[indexToMark].isMarkedForDeletion = true;
    };

    $scope.unmarkTestDataRowForDeletion = function(indexToMark) {
        $scope.CDLSettings.testData[indexToMark].isMarkedForDeletion = false;
    };


    /***********************************************************************************************************/
    // Loading / processing of documents from a document library
    /***********************************************************************************************************/
    $scope.loadLinksFromSharePoint = function(theSiteUrl, theListName, theCategoryColumnName) {
        linksArr = [];

        var serverUrl =
            theSiteUrl +
            "/_api/web/lists/GetByTitle('" + theListName + "')/items?" +
            "$select=Title,Category/Title" +
            "&$expand=Category";

        $http.get(serverUrl).
            success(function(data, status, headers, config) {
                $scope.getLinksResponse = data;

                $scope.getLinksResponse.value.forEach(function(theResult) {
                    $scope.allDocuments.push ({
                        docCategory : theResult.Category.Title,
                        docTitle: theResult.Title
                    });
                    // Add this category to the category list if it's not already there
                    if (_.findIndex($scope.allCategories, {'catName' : theResult.Category.Title}) === -1) {
                        $scope.allCategories.push({catName: theResult.Category.Title, catCount: 0});
                    }

                });


                $scope.calculateAndStoreCategoryCounts();
            }).
            error(function(data, status, headers, config) {
                var x = data;
            });

    }

    /***********************************************************************************************************/
    // Configuration methods (save/retrieve configuration datea)
    /***********************************************************************************************************/
    $scope.saveConfigurationSettings = function() {

        $scope.preProcessSaveTestData();

        var configFileName = CDL.Util.getConfigFileName('CDLAdmin.aspx');
        $http.put(configFileName,angular.toJson($scope.CDLSettings));

    };

    // Iterates over the test data and cleans it up.  Also sets the doUse* flags (converts radio set values).
    $scope.preProcessSaveTestData = function() {

        var tempArr = [];

        $scope.CDLSettings.generalProperties.doUseTestData = false;
        $scope.CDLSettings.generalProperties.doShowZeroItemCategories = false;

        if ($scope.CDLSettings.generalProperties.doUseTestDataText === "Yes") {$scope.CDLSettings.generalProperties.doUseTestData = true;}
        if ($scope.CDLSettings.generalProperties.doShowZeroItemCategories === "Yes") {$scope.CDLSettings.generalProperties.doShowZeroItemCategories = true;}

        $scope.CDLSettings.testData.forEach(function (theTestItem) {
            theTestItem.isNewTestItem = false; // Once saved, it's not new any more
            if (theTestItem.isMarkedForDeletion) return; // Don't copy it to the temp array
            tempArr.push(theTestItem);
        }); // forEach

        $scope.CDLSettings.testData = tempArr;

        tempArr = [];
    } // preProcess...

    $scope.retrieveConfigurationSettings = function() {

        var configFileName = CDL.Util.getConfigFileName('CDLAdmin.aspx');

        $http.get(configFileName).
            success(function(data, status, headers, config) {
                $scope.CDLSettings = angular.fromJson(data);

                $scope.loadLinksFromSharePoint(
                    $scope.CDLSettings.dataSources[0].docLibWebUrl,
                    $scope.CDLSettings.dataSources[0].docLibName,
                    "Category");

                if ($scope.CDLSettings.generalProperties.doUseTestData) {
                    $scope.allDocuments = $scope.CDLSettings.testData;
                }

                $scope.calculateAndStoreCategoryCounts();

            });
    };

    /***********************************************************************************************************/
    // CatDocLib methods (non-admin)
    /***********************************************************************************************************/
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
        return _.findIndex($scope.allSelectedCategories, { catName: theCatNameToCheck }) >= 0;
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

    /***********************************************************************************************************/
    /***********************************************************************************************************/
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
        $scope.allCategories.push({catName: "Kelly", catCount: 0});

        var sortedObjs = _.sortBy( $scope.allCategories, 'catName' );
        $scope.allCategories = sortedObjs;
    };

    $scope.loadTestDocumentData = function() {

        var dd = new Date(2013, 08, 22);

        $scope.CDLSettings.testData.push({
            docTitle: "Document title AA",
            docName: 'xyzzy.doc',
            docSummary: 'This is the document summary (short)',
            docModifiedDate: '2014-09-01',
            isMarkedForDeletion: false,
            docCategory: 'Apple'});
        $scope.CDLSettings.testData.push({
            docTitle: "Document title BB",
            docName: 'xyzzy2.doc',
            docSummary: 'This is longer summary to see how the formatting works and all that goodness.  Now is the time for all good men to come to the aid of their country, and so forth and so on, etc.',
            isMarkedForDeletion: false,
            docModifiedDate: '2014-05-13',
            docCategory: 'Apple'});
        $scope.CDLSettings.testData.push({
            docTitle: "Document title CC",
            docName: 'xyzzy3.doc',
            docSummary: 'This is another apple doc short suummary of no great interest.',
            docModifiedDate: '2013-06-15',
            isMarkedForDeletion: false,
            docCategory: 'Apple'});

        $scope.allDocuments.push({
            docTitle: "Document title DDD",
            docName: 'abc123.xls',
            docSummary: 'First Religion document for testing purposes, not a very long summary.',
            docModifiedDate: 6/01/2014,
            isMarkedForDeletion: false,
            docCategory: 'Religion'});

        $scope.allDocuments.push({
            docTitle: "Document title EE",
            docName: 'abc456.pdf',
            docSummary: 'Another religion category document.',
            docModifiedDate: 04/15/2014,
            isMarkedForDeletion: false,
            docCategory: 'Religion'});

        $scope.allDocuments.push({
            docTitle: "Document title FF",
            docName: 'PM document 2',
            docSummary: 'Some random PM document. Loremy stuff here',
            docModifiedDate: 5/08/2014,
            isMarkedForDeletion: false,
            docCategory: 'Project Management'});

        $scope.allDocuments.push({
            docTitle: "Document title GG",
            docName: 'PM document 3',
            docSummary: 'Some random PM document." Some problems have no good answer, Paul"',
            docModifiedDate: 3/28/2014,
            isMarkedForDeletion: false,
            docCategory: 'Project Management'});

        $scope.allDocuments.push({
            docTitle: "Document title HH",
            docName: 'PM document 4',
            docSummary: 'Some random PM document.  What are you doing, Dave?',
            docModifiedDate: 9/18/2014,
            isMarkedForDeletion: false,
            docCategory: 'Project Management'});

        $scope.allDocuments.push({
            docTitle: "Document title II",
            docName: 'PM document 1',
            docSummary: 'Some random PM document. I\'m not good at being good"',
            docModifiedDate: 9/08/2014,
            isMarkedForDeletion: false,
            docCategory: 'Project Management'});

        $scope.allDocuments.push({
            docTitle: "Document title JJ",
            docName: 'PM document 5',
            docSummary: 'Some random PM document.  There once was a man from Nantucket...',
            docModifiedDate: 11/19/2014,
            isMarkedForDeletion: false,
            docCategory: 'Project Management'});

        $scope.allDocuments.push({
            docTitle: "You're so fine",
            docName: 'truthfulLyrics.doc',
            docSummary: 'Oh Kelly, you\'re so fine you\'re so fine you blow my mind, hey Kelly (huff huff), hey Kelly (huff huff)',
            docModifiedDate: 11/19/2014,
            isMarkedForDeletion: false,
            docCategory: 'Kelly'});

    };

    //$scope.$watch('CDLSettings.dataSources[0].docLibName',function(nv,ov) {
    //    //alert('got a new data source [' + nv /* $scope.CDLSettings.dataSources[0].docLibName */ + '].')
    //    alert('got a new data source, nv/ov [' + nv + '] / [' + ov + '].')
    //});



    /***********************************************************************************************************/
    // Initialization logic
    /***********************************************************************************************************/

    $scope.resetNewTestItemFields(); // Give them blank values to start things off rather than null.

    //$scope.loadTestDocumentData();

    $scope.retrieveConfigurationSettings();

    //$scope.loadTestCategories();

    //$scope.calculateAndStoreCategoryCounts();
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
