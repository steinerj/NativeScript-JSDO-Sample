import { Observable } from "data/observable";
import { ObservableArray } from "data/observable-array";
import "./pwrapper.js";
var progress = require("./progress.jsdo").progress;

var sessionStorage = require("nativescript-localstorage");

export class ViewModel extends Observable {

    private _customers: ObservableArray<Customer>;
    get customers(): ObservableArray<Customer> {
        if (!this._customers) {
            this._customers = new ObservableArray<Customer>();
            progress.data.getSession({
                    "serviceURI": 'http://oemobiledemo.progress.com/OEMobileDemoServicesForm',
                    "catalogURI": 'http://oemobiledemo.progress.com/OEMobileDemoServicesForm/static/CustomerService.json',
                    "authenticationModel": progress.data.Session.AUTH_TYPE_FORM,
                    "authProviderAuthenticationModel": progress.data.Session.AUTH_TYPE_FORM,
                    "authenticationURI": 'http://oemobiledemo.progress.com/OEMobileDemoServicesForm',
                    "username": 'formuser',
                    "password": 'formpassword',
                    "name": 'Customer',
                    //"serviceURI": 'http://oemobiledemo.progress.com/OEMobileDemoServices',
                    //"catalogURI": 'http://oemobiledemo.progress.com/OEMobileDemoServices/static/MobilityDemoService.json',
                    //"authenticationModel": progress.data.Session.AUTH_TYPE_ANON,
                    //"authProviderAuthenticationModel": progress.data.Session.AUTH_TYPE_ANON,
                    //"authenticationURI": 'http://oemobiledemo.progress.com/OEMobileDemoServices',
                    //"username": '',
                    //"password": '',
                    //"name": 'Customer',
                })
                .then((s, r, i) => {
                    //let jsdo = new progress.data.JSDO({ name: 'dsCustomer' });
                    let jsdo = new progress.data.JSDO({ name: 'Customer' });
                    jsdo.fill();

                    jsdo.subscribe('afterFill', (jsdoResult, success, request) => {                    
                        //jsdoResult.eCustomer.foreach(customer => {
                        jsdoResult.ttCustomer.foreach(customer => {
                            this._customers.push({ ID: customer.data.CustNum, Name: customer.data.Name })
                        })}
                        , this); 
                    });
                }
        return this._customers;
    }
}

interface Customer {
    ID: string;
    Name: string;
}