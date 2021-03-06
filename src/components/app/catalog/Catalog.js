import {observer} from "mobx-react";
import React, {Component} from "react";
import iconClose from "../../../assets/img/icon-close.svg";
import "./_catalog.scss";
import CatalogStore from "../../../stores/CatalogStore/CatalogStore";
import GameStore from "../../../stores/GameStore/GameStore";
import ConfirmPopup from "./confirmPopup/ConfirmPopup";
import ObjectKindUI from "../objectKindUI/ObjectKindUI";
import iconCloseHover from "../../../assets/img/icon-close-hover.svg";
import {SoundManagerInstance} from "../GameCanvas/SoundManager";

const Catalog = observer(class Catalog extends Component {

    state = {
        confirmVisibility: false
    };

    constructor(props) {
        super(props);
        this.path = [props.index];
        this.objectKind = CatalogStore.objectKinds[this.path[0]];
        this.productType = this.objectKind.catalogName;
        this.productNew = this.objectKind.objects[this.objectKind.replacementCounter + 1];
        this.path.push(this.objectKind.replacementCounter + 1);
        this.isClosing = false;
    }

    onClose() {
        this.pipoStop();
        this.closeCatalog(false);
        this.updateConfirmVisibilty(false);
        if (this.objectKind.activeObject !== null) {
            this.objectKind.updateReplacementCounter();
            GameStore.setPipo("angry");
            GameStore.hype.setLevelByDiff(-0.07);
        }
    }

    closeCatalog(fromValidate) {
        let objectKindUI = ObjectKindUI.refs.filter(objectKindUI => objectKindUI !== null).find(objectKindUI => objectKindUI.objectKind === this.objectKind);
        if (objectKindUI.notification) {
            objectKindUI.notification.changeDelayTimer(fromValidate);
            objectKindUI.notification.restartTimer();
        }
        this.isClosing = true;

        CatalogStore.closeCatalog();
        this.objectKind.location.removePreviewObject();
    }

    updateConfirmVisibilty(value) {
        this.setState({
            confirmVisibility: value
        });
        if (value) {
            SoundManagerInstance.catalogError.play();
        }
    }

    pipoYes() {
        if (GameStore.pipo !== "happy" && GameStore.pipo !== "angry") {
            GameStore.setPipo("yes");
        }
    }

    pipoNo() {
        if (GameStore.pipo !== "happy" && GameStore.pipo !== "angry") {
            GameStore.setPipo("no");
        }
    }

    pipoStop() {
        if (!this.isClosing && GameStore.pipo !== "happy" && GameStore.pipo !== "angry") {
            GameStore.setPipo("");
        }
    }

    onValidate() {
        this.objectKind.updateReplacementCounter();
        this.objectKind.setActiveObject(this.objectKind.replacementCounter);
        GameStore.hype.setLevelByDiff(0.02);
        GameStore.setPipo("happy");
        this.closeCatalog(true);
    }

    render() {
        return (
            <div className={`catalog`}>
                {this.state.confirmVisibility &&
                <ConfirmPopup productName={this.productNew.name} onClose={() => this.onClose()}
                              closeConfirmPopup={() => this.updateConfirmVisibilty(false)}
                              pipoYes={() => this.pipoYes()} pipoNo={() => this.pipoNo()} pipoStop={() => this.pipoStop()}/>
                }
                <div className="catalog__header">
                    <span>Catalogue</span>
                    <button className="catalog__header__close" onClick={() => this.updateConfirmVisibilty(true)} onMouseOver={() => this.pipoNo()} onMouseLeave={() => this.pipoStop()}>
                        <img src={iconClose} alt="close_icon"/>
                        <img src={iconCloseHover} alt="closeHover"/>
                    </button>
                </div>
                <div className="catalog__content">
                    <div className="catalog__content__main__header">
                        <p className="catalog__content__title">{this.productNew.catalogSlogan}</p>
                        <a className="catalog__content__info" href={this.productNew.url} target="_blank" rel="noopener noreferrer">En savoir +</a>
                    </div>
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
