import {Observable} from "data/observable";
import {ObservableArray} from "data/observable-array";

var deferred        = require("./pwrapper.js").deferred;
var progress        = require("./progress.jsdo").progress;
var Auth            = progress.data.AuthenticationProvider;
var Session         = progress.data.JSDOSession;
var JSDO            = progress.data.JSDO;
var sessionStorage  = require("nativescript-localstorage");

export class ViewModel extends Observable {
    
    private _customers: ObservableArray<Customer>;
    get customers(): ObservableArray<Customer> {
        if (!this._customers) {
            this._customers = new ObservableArray<Customer>();
            
            var auth, 
                session,
                jsdo;   

            let createAuthProvider = new Promise((resolve,reject) => {
                    auth = new Auth({
                    authenticationModel: progress.data.Session.AUTH_TYPE_ANON,
                    uri: "http://oemobiledemo.progress.com/OEMobileDemoServices"
                });
                resolve(auth);
            }); 
            createAuthProvider.then((authProvider) => {
                //auth = authProvider;
                let doLogin = new Promise((resolve,reject) => {
                    resolve(auth.login("",""));
                });
                doLogin.then((loginResult) => {
                    var authP = loginResult[0];
                    let createJSDOSession = new Promise((resolve,reject) => {
                        session = new Session({
                            authenticationModel: progress.data.Session.AUTH_TYPE_ANON, 
                            serviceURI: "http://oemobiledemo.progress.com/OEMobileDemoServices",
                            authProvider: authP
                        });
                        resolve(session); 
                    });
                    createJSDOSession.then((sessionResult) => {
                        //session = sessionResult;
                        let addCatalog = new Promise((resolve,reject) => {
                            resolve(session.addCatalog("http://oemobiledemo.progress.com/OEMobileDemoServices/static/MobilityDemoService.json"));
                        })
                        addCatalog.then((session) => {
                            let createJSDO = new Promise((resolve,reject) => {

                                jsdo = new JSDO({ name: 'dsCustomer' });
                                resolve(jsdo);
                            })
                            createJSDO.then((jsdoResult) => {
                                jsdo.subscribe('AfterFill', onAfterFillCustomers, this);    
                                jsdo.fill();    
             
                                function onAfterFillCustomers(jsdo, success, request) {
                                    jsdo.eCustomer.foreach(customer => {
                                        this._customers.push({ ID: customer.data.CustNum, Name: customer.data.Name });
                                    });
                                }
                            })
                            createJSDO.catch((error) => {
                                console.log("create JSDO: ", error);
                            })
                        })
                        addCatalog.catch((error) => {
                            console.log("addCatalog: ", error);    
                        });
                    })    
                    createJSDOSession.catch((error) => {
                        console.log("createJSDOSession: ", error);
                    });
                })
                doLogin.catch((error) => {
                    console.log("doLogin: ", error);
                })
            })
            createAuthProvider.catch((error) => {
                console.log("createAuthProvider: ", error);    
            })    
        }
        return this._customers;
    }
}

interface Customer {
    ID: string;
    Name: string;
}