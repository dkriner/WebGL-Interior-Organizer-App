/* 
 * File: CSS450Timer.js
 * A timer utility   
 */

/*jslint node: true, vars: true, bitwise: true */
/*global angular */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";

angular.module("CSS450Timer", [])
    .directive("cssTimer", function () {
        return {

            //  uncomment the following for debugging
            // template: "Timer: [{{mInterval}}] [{{mTimerIsOn}}]",

            scope: {
                mInterval: "=interval",
                mCallback: "=callback",
                mTimerIsOn: "=timeron"
            },

            controller: function ($scope, $interval) {
                $scope.mRun = undefined;

                // set defaults
                if (!angular.isDefined($scope.mInterval))
                    $scope.mInterval = 100;
                
                if (!angular.isDefined($scope.mTimerIsOn))
                    $scope.mTimerIsOn = false;
                
                // Default service function!
                $scope.timerService = function () {
                    // does not do anything!
                };
                
                if (!angular.isDefined($scope.mCallback)) 
                    $scope.mCallback = $scope.timerService;               
                
                $scope.start = function () {
                    if (angular.isDefined($scope.mRun))
                        return;
                    $scope.mRun = $interval(
                        $scope.mCallback, 
                        $scope.mInterval);
                };
                
                $scope.stop = function() {
                    if (angular.isDefined($scope.mRun)) {
                        $interval.cancel($scope.mRun);
                        $scope.mRun = undefined;
                    }
                };
                    
                if ($scope.mTimerIsOn)
                    $scope.start();
            }, 
            
            link: function (scope) {
               scope.$watch("mTimerIsOn", function(newVar, oldVar) {
                   if (newVar)
                       scope.start();
                   else
                       scope.stop();
               });
           }
        };
    });