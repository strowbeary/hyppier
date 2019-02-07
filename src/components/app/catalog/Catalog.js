import {observer} from "mobx-react";
import React, {Component} from "react";
import icon_close from "../../../assets/img/icon_close.svg";
import "./_catalog.scss";
import CatalogStore from "../../../stores/CatalogStore/CatalogStore";
import GameStore from "../../../stores/GameStore/GameStore";
import ConfirmPopup from "./confirmPopup/ConfirmPopup";
import ObjectKindUI from "../objectKindUI/ObjectKindUI";
import TutoStore from "../../../stores/TutoStore/TutoStore";

const Catalog = observer(class Catalog extends Component {

    state = {
        confirmVisibility: false
    };

    constructor(props) {
        super(props);
        this.path = [props.index];
        this.objectKind = CatalogStore.objectKinds[this.path[0]];
        this.productType = this.objectKind.type;
        this.productNew = this.objectKind.objects[this.objectKind.replacementCounter + 1];
        this.path.push(this.objectKind.replacementCounter + 1);
        this.isClosing = false;
    }

    onClose() {
        this.pipoStop();
        this.closeCatalog(false);
        this.updateConfirmVisibilty(false);
        if (this.objectKind.replacementCounter < this.objectKind.objects.length - 1 && this.objectKind.activeObject !== null) {
            this.objectKind.updateReplacementCounter();
        }
    }

    closeCatalog() {
        let objectKindUI = ObjectKindUI.refs.filter(objectKindUI => objectKindUI !== null).find(objectKindUI => objectKindUI.objectKind === this.objectKind);
        if (objectKindUI.notification) {
            objectKindUI.notification.changeDelayTimer(true);
            objectKindUI.notification.restartTimer();
        }
        this.isClosing = true;
        CatalogStore.closeCatalog();
        this.objectKind.location.removePreviewObject();
    }

    updateConfirmVisibilty(value) {
        this.setState({
            confirmVisibility: value
        })
    }

    pipoYes() {
        GameStore.setPipo("yes");
    }

    pipoNo() {
        GameStore.setPipo("no");
    }

    pipoStop() {
        if (!this.isClosing) {
            GameStore.setPipo("");
        }
    }

    onValidate() {
        this.objectKind.updateReplacementCounter();
        this.objectKind.setActiveObject(this.objectKind.replacementCounter);
        GameStore.hype.setLevelByDiff(0.1);
        GameStore.setPipo("happy");
        if (TutoStore.currentMessage === 2) {
            TutoStore.reportAction("Notification", "appear");
        }
        this.closeCatalog(true);
    }

    render() {
        return (
            <div className={`catalog`}>
                {this.state.confirmVisibility &&
                <ConfirmPopup product={this.productNew} onClose={() => this.onClose()}
                              closeConfirmPopup={() => this.updateConfirmVisibilty(false)}
                              pipoYes={() => this.pipoYes()} pipoNo={() => this.pipoNo()} pipoStop={() => this.pipoStop()}/>
                }
                <div className="catalog__header">
                    <span>Catalogue</span>
                    <button className="catalog__header__close" onClick={() => this.updateConfirmVisibilty(true)} onMouseOver={() => this.pipoNo()} onMouseLeave={() => this.pipoStop()}>
                        <img src={icon_close} alt="close_icon"/>
                    </button>
                </div>
                <div className="catalog__content">
                    <p className="catalog__content__title">{this.productNew.catalogSlogan}</p>

                    <div className="catalog__content__main">
                        <div className="catalog__content__main__productType">
                            <p>{this.productType}</p>
                        </div>
                        <div className="catalog__content__main__productTitle">
                            <span>{this.productNew.name}</span>
                        </div>
                        <div className={`catalog__content__main__body`}>
                            <img src={this.productNew.thumbnailUrl} alt="model"
                                 className="catalog__content__main__img"/>
                        </div>
                    </div>
                </div>
                <div className={`catalog__footer`} onClick={() => this.onValidate()} onMouseOver={() => this.pipoYes()} onMouseLeave={() => this.pipoStop()}>
                    <button className="catalog__footer__validation">
                        Oui, je craque !
                    </button>
                </div>
            </div>
        )
    }
});

export default Catalog;
