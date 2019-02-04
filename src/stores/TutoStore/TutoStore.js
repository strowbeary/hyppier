import {types} from "mobx-state-tree";
import MessageStore from "./MessageStore/MessageStore";

export default types.model("TutoStore",
    {
        messages: types.array(MessageStore),
        currentMessage: types.number,
        showTip: types.boolean
    })
    .actions(self =>
        ({
            reportAction(origin, type) {
                if(type === "appear") {
                    if(self.messages[self.currentMessage + 1].originTarget === origin) {
                        self.currentMessage++;
                        self.showTip = true;
                    }
                }
                else if (type === "actionned") {
                    if(self.messages[self.currentMessage].originTarget === origin) {
                        self.showTip = false;
                    }
                }
            }
        })
    )
    .views(self => ({
        getCurrentMessage() {
            return self.messages[self.currentMessage];
        },
        displayTip() {
            return (self.currentMessage >= 0) && self.showTip;
        }
    }))
    .create({
        messages: [
            {
                text: "En cliquant sur le bouton + tu peux ajouter des objets dans ta chambre",
                expiration: 10,
                action: "click",
                originTarget: "EmptySpace",
                read: false
            },
            {
                text: "Un nouveau modèle d'un objet est disponible, mais attention tu n'as que peu de temps pour en profiter",
                expiration: 10,
                action: "click",
                originTarget: "Notification",
                read: false
            }
        ],
        currentMessage: -1,
        showTip: false
    });
