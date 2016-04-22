import {Observable} from "data/observable";
import {ObservableArray} from "data/observable-array";

var progress = require("./progress.jsdo").progress;
var Session = progress.data.Session;
var JSDO = progress.data.JSDO;

export class ViewModel extends Observable {

    private _customers: ObservableArray<Customer>;
    get customers(): ObservableArray<Customer> {
        if (!this._customers) {
            this._customers = new ObservableArray<Customer>();

            var session = new Session();
            
            session.subscribe("afterLogin", () => {
                session.addCatalog({
                    catalogURI: "http://oemobiledemo.progress.com/MobilityDemoService/static/mobile/MobilityDemoService.json",
                    async: true
                });
            }, this);

            session.subscribe("afterAddCatalog", (session, result, errObj) => {

                var jsdo = new JSDO({ name: "dsCustomer" });

                jsdo.subscribe("afterFill", (jsdo, success, request) => {
                    jsdo.eCustomer.foreach(customer => {
                        this._customers.push({ ID: customer.data.CustNum, Name: customer.data.Name })
                    });
                    
                }, this);

                jsdo.fill();

            }, this);

            session.login({
                serviceURI: "http://oemobiledemo.progress.com/MobilityDemoService",
                userName: "",
                password: "",
                async: true
            });
        }

        return this._customers;
    }
}

interface Customer {
    ID: string;
    Name: string;
}