/*global $:true, Promise */
/*jslint nomen: true*/
//
// Simple wrapper object for native JavaScript Promises.
// This object provides jQuery-style Promises to use with the JSDO.
// Author(s): egarcia
//
$ = function () {
    "use strict";
};
$.Deferred = function () {
    "use strict";
    var deferred = {},
        promise;
            
    return {
        promise: function () {
            promise = new Promise(function (resolve, reject) {
                deferred.resolve = resolve;
                deferred.reject = reject;
            });
            promise._then = promise.then;
            promise.done = function (callback) {
                promise._then(function () {
                    callback.apply(this, arguments[0]);
                });
                return promise;
            };
            promise.fail = function (callback) {
                promise._then(undefined, function () {
                    callback.apply(this, arguments[0]);
                });
                return promise;
            };
            /*
            promise.then = function (callback) {
                promise._then(function () {
                    callback.apply(this, arguments[0]);
                }, function () {
                    callback.apply(this, arguments[0]);
                });
                return promise;
            };
            */
            return promise;
        },
        resolve: function () {
            deferred.resolve(arguments);
        },
        reject: function () {
            deferred.reject(arguments);
        }
    };
};