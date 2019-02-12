import {types} from "mobx-state-tree";
import MessageStore from "./MessageStore/MessageStore";

export default types.model("TutoStore",
    {
        messages: types.array(MessageStore),
        currentMessage: types.number,
        showTip: types.boolean,
        end: false
    })
    .actions(self =>
        ({
            hideTip() {
                if (self.showTip) {
                    self.showTip = false;
                }
            },
            reportAction(origin, type) {
                switch (type) {
                    case "appear":
                        if (typeof self.messages[self.currentMessage + 1] !== "undefined") {
                            if (self.messages[self.currentMessage + 1].originTarget === origin) {
                                self.currentMessage++;
                                self.showTip = true;
                            }
                        }
                        break;
                    case "actioned":
                        if (typeof self.messages[self.currentMessage] !== "undefined") {
                            if (self.messages[self.currentMessage].originTarget === origin) {
                                if (origin === "Attic") {
                                    self.end = true;
                                }
                                self.showTip = false;
                            }
                        }
                        break;
                    default:
                        break;
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
                text: "Te voici dans ta chambre d'étudiant équipée du strict minimum. Sans éclat, sans saveur.",
                expiration: 0,
                action: "keypress",
                originTarget: "Intro",
                read: false
            },
            {
                text: "Mais tu vaux mieux que ça, mmh ? Ne t'en fais pas, tu vas pouvoir l’égayer un peu.",
                expiration: 0,
                action: "keypress",
                originTarget: "Intro",
                read: false
            },
            {
                text: "Pour personnaliser ta pièce, sélectionne un emplacement vide en cliquant sur + ; et laisse la magie opérer.",
                expiration: 0,
                action: "click",
                originTarget: "EmptySpace",
                read: false
            },
            {
                text: "Tu vois, c’est extrêmement simple. Dès qu’une nouvelle version de ton objet est sortie, tu peux te la procurer. Mais attention, l’offre est limitée dans le temps, et ce que tu ne choisis pas est perdu à jamais !",
                expiration: 0,
                action: "click",
                originTarget: "Notification",
                read: false
            },
            {
                text: "Tes anciens objets sont stockés dans ton grenier! Tu peux cliquer sur l'échelle pour y accéder",
                expiration: 5000,
                action: "timer",
                originTarget: "Attic",
                read: false
            }
        ],
        currentMessage: -1,
        showTip: false
    });
