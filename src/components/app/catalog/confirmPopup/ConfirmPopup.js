import {observer} from "mobx-react";
import React, {Component} from "react";
import "./_confirmPopup.scss";
import errorIcon from "./img/error_icon.png";

const ConfirmPopup = observer(class ConfirmPopup extends Component {

    onClose() {
       this.props.onClose();
    }

    onCatalog() {
       this.props.closeConfirmPopup();
    }

    onCloseOver() {
        this.props.pipoYes();
    }

    onCatalogOver() {
        this.props.pipoNo();
    }

    onMouseOut() {
        this.props.pipoStop();
    }

    render() {
        let {infos, closeButtonLabel, returnCatalogButtonLabel} = this.props.product;

        return (
            <div className="confirmPopup">
                <div className="confirmPopup__content">
                    <img src={errorIcon} alt="error"/>
                    <p>{infos[0].slogan}</p>
                    <a href={infos[0].url} target="_blank" rel="noopener noreferrer">En savoir +</a>
                </div>
                <button className="confirmPopup__buttonClose" onClick={() => this.onClose()} onMouseOver={() => this.onCloseOver()} onMouseOut={() => this.onMouseOut()}>{closeButtonLabel}</button>
                <button className="confirmPopup__buttonCatalog" onClick={() => this.onCatalog()} onMouseOver={() => this.onCatalogOver()} onMouseOut={() => this.onMouseOut()}>{returnCatalogButtonLabel}</button>
            </div>
        )
    }
});

export default ConfirmPopup;