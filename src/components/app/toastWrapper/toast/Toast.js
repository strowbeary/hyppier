import {observer} from "mobx-react";
import React, {Component} from "react";
import "./_toast.scss";
import * as faker from "faker";
import CatalogStore from "../../../../stores/CatalogStore/CatalogStore";

const Toast = observer(class Toast extends Component {

    types = ["watch", "get"];

    constructor(props){
        super(props);
        faker.locale = "fr";
        this.type = this.types[Math.round(Math.random())];

        if (this.type === "watch") {
            if (CatalogStore.objectKindIndex !== null) {
                this.objectName = "cet article";
            } else {
                this.randomObjectName();
            }
            this.number = Math.round(2 + Math.random()*98);
        }

        if (this.type === "get") {
            this.randomObjectName();
            this.username = faker.internet.userName();
            this.city = faker.address.city();
        }
    }

    randomObjectName() {
        let random = Math.round(Math.random() * (CatalogStore.objectKinds.length - 1));
        this.getNextObjectName(random);
    }

    getNextObjectName(index) {
        let objectKind = CatalogStore.objectKinds[index];
        let nextObject;
        if (objectKind.replacementCounter < objectKind.objects.length - 1) {
            nextObject = CatalogStore.objectKinds[index].objects[objectKind.replacementCounter + 1];
        } else {
            nextObject = CatalogStore.objectKinds[index].objects[objectKind.replacementCounter];
        }
        this.objectName = "un(e) "+nextObject.name;
    }

    render() {

        return (
            <div className={`toast ${this.type}`}>
                {
                    this.type === "get" &&
                    <p><span>{this.username}</span> vient d'acheter <span>{this.objectName}</span> à <span>{this.city}</span></p>
                }
                {
                    this.type === "watch" &&
                    <p>{this.number} personnes sont en train de baver sur <span>{this.objectName}</span></p>
                }
            </div>
        )
    }
});

export default Toast;