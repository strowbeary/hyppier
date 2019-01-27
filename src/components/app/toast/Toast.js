import {observer} from "mobx-react";
import React, {Component} from "react";
import "./_toast.scss";
import * as faker from "faker";
import CatalogStore from "../../../stores/CatalogStore/CatalogStore";

const Toast = observer(class Toast extends Component {

    constructor(props){
        super(props);
        this.message = props.message;
        faker.locale = "fr";
        this.username = faker.internet.userName();
        this.city = faker.address.city();
        let random = Math.round(Math.random() * (CatalogStore.objectTypes.length - 1));
        let catalogRandom = Math.round(Math.random() * (CatalogStore.objectTypes[random].objectKinds.length - 1));
        let objectKind = CatalogStore.objectTypes[random].objectKinds[catalogRandom];
        let nextObject;
        if (objectKind.activeObject < objectKind.objects.length - 1) {
            nextObject = CatalogStore.objectTypes[random].objectKinds[catalogRandom].objects[objectKind.activeObject + 1];
        } else {
            nextObject = CatalogStore.objectTypes[random].objectKinds[catalogRandom].objects[objectKind.activeObject];
        }
        this.objectName = nextObject.name;
    }

    render() {

        return (
            <div className="toast">
                <p>{this.username} vient d'acheter un(e) {this.objectName} à {this.city}</p>
            </div>
        )
    }
});

export default Toast;