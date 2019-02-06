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
            hideTip() {
                self.showTip = false;
            },
            reportAction(origin, type) {
                if (type === "appear") {
                    if (typeof self.messages[self.currentMessage + 1] !== "undefined") {
                        if (self.messages[self.currentMessage + 1].originTarget === origin) {
                            self.currentMessage++;
                            self.showTip = true;
                        }
                    }
                } else if (type === "actioned") {
                    if (typeof self.messages[self.currentMessage] !== "undefined") {
                        if (self.messages[self.currentMessage].originTarget === origin) {
                            self.showTip = false;
                        }
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
                text: "Bienvenue dans ta chambre! Bon...c'est vrai qu'elle est un peu vide avec que le strict minimum",
                expiration: 0,
                action: "keypress",
                originTarget: "Intro",
                read: false
            },
            {
                text: "Mais ne t'en fais pas, tu vas pouvoir l'égayer un peu, tiens essayes d'abord pour voir!",
                expiration: 0,
                action: "keypress",
                originTarget: "Intro",
                read: false
            },
            {
                text: "En cliquant sur le bouton + tu peux ajouter des objets dans ta chambre",
                expiration: 0,
                action: "click",
                originTarget: "EmptySpace",
                read: false
            },
            {
                text: "Un nouveau modèle d'un objet est disponible, mais attention tu n'as que peu de temps pour en profiter",
                expiration: 0,
                action: "click",
                originTarget: "Notification",
                read: false
            }, {
                text: "Tu peut maintenant acceder au grenier",
                expiration: 10000,
                action: "timer",
                originTarget: "Attic",
                read: false
            }
        ],
        currentMessage: -1,
        showTip: false
    });
