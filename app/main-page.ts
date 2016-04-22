import {EventData} from "data/observable";
import {View} from "ui/core/view";
import {ViewModel} from "./main-view-model";

export function pageLoaded(args: EventData) {
    (<View>args.object).bindingContext = new ViewModel();
}