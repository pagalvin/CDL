/**
 * Created by pgalvin on 10/12/2014.
 */

var CDLAdminApp= angular.module('CDLAdminApp', ['ngRoute']);

CDLAdminApp.controller("CDLAdminController",function($scope,$http,$location) {

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
            doShowZeroItemCategories: true,
            doUseTestData: true
        },

        dataSources: [{
            listName: ""
            // whatever else we need
        }],

        searchProperties: {
            doExecuteSPSearchInParallel: true,
            sharePointSearchSource: ""
        },

        lookAndFeelProperties: {
            // various CSS properties
        }
    } ;

    $scope.saveConfigurationChanges = function() {

        var configFileName = CDL.Util.getConfigFileName('CDLAmin.aspx');

        $http.put(configFileName,angular.toJson($scope.CDLSettings));
    };

    $scope.retrieveConfiguration = function() {

        var configFileName = CDL.Util.getConfigFileName('CDLAmin.aspx');

        $http.get(configFileName).
            success(function(data, status, headers, config) {
               $scope.CDLSettings = angular.fromJson(data);
            });
    }

    $scope.retrieveConfiguration();
});
