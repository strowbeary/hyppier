import {observer} from "mobx-react";
import React, {Component} from "react";
import icon_close from "./img/icon_close.svg";
import "./_catalog.scss";
import CatalogStore from "../../../stores/CatalogStore/CatalogStore";
import GameStore from "../../../stores/GameStore/GameStore";
import ConfirmPopup from "./confirmPopup/ConfirmPopup";
import {CSSTransitionGroup} from "react-transition-group";

const Catalog = observer(class Catalog extends Component {

    state = {
        confirmVisibility: false
    };

    constructor(props) {
        super(props);
        this.path = props.path.toJSON();
        this.productType = CatalogStore.objectTypes[this.path[0]];
        this.objectKind = this.productType.objectKinds[this.path[1]];
        this.hasPreviousGeneration = this.objectKind.activeObject !== null;
        if (this.hasPreviousGeneration) {
            this.productNew = this.objectKind.objects[this.objectKind.activeObject + 1];
            this.objectKind.location.setPreviewObject(this.objectKind.activeObject + 1);
            this.path.push(this.objectKind.activeObject + 1);
        } else {
            this.productNew = this.objectKind.objects[0];
            this.objectKind.location.setPreviewObject(0);
            this.path.push(0);
        }
    }

    componentDidMount() {
    }

    onClose() {
        CatalogStore.closeCatalog();
        this.objectKind.location.removePreviewObject();
        this.updateConfirmVisibilty(false);
    }

    updateConfirmVisibilty(value) {
        this.setState({
            confirmVisibility: value
        })
    }

    onValidate() {
        if (this.objectKind.activeObject !== null) {
            this.objectKind.setActiveObject(this.objectKind.activeObject + 1);
        } else {
            this.objectKind.setActiveObject(0);
        }
        GameStore.hype.setLevelByDiff(0.1);
        //skip generation
        this.props.onClose();
        this.objectKind.location.removePreviewObject();
    }

    render() {
        return (
            <div className={`catalog`}>
                <CSSTransitionGroup
                    transitionName="grow"
                    transitionEnterTimeout={500}
                    transitionLeaveTimeout={500}
                >
                    {this.state.confirmVisibility &&
                    <ConfirmPopup product={this.productNew} onClose={() => this.onClose()}
                                  closeConfirmPopup={() => this.updateConfirmVisibilty(false)}/>
                    }
                </CSSTransitionGroup>
                <div className="catalog__header">
                    <span>Catalogue</span>
                    <button className="catalog__header__close" onClick={() => this.updateConfirmVisibilty(true)}>
                        <img src={icon_close} alt="close_icon"/>
                    </button>
                </div>
                <div className="catalog__content">
                    <p className="catalog__content__title">{this.productNew.catalogSlogan}</p>

                    <div className="catalog__content__main">
                        <div className="catalog__content__main__productType">
                            <p>{this.productType.name}</p>
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
                <div className={`catalog__footer`} onClick={() => this.onValidate()}>
                    <button className="catalog__footer__validation">
                        Oui, je craque !
                    </button>
                </div>
            </div>
        )
    }
});

export default Catalog;
