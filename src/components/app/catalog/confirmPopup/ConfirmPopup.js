import {observer} from "mobx-react";
import React, {Component} from "react";
import "./_confirmPopup.scss";
import errorSvg from "../../../../assets/img/error.svg";

const ConfirmPopup = observer(class ConfirmPopup extends Component {

    onClose() {
       this.props.onClose();
    }

    onCatalog() {
       this.props.closeConfirmPopup();
    }

    onCloseOver() {
        this.props.pipoNo();
    }

    onCatalogOver() {
        this.props.pipoYes();
    }

    onMouseLeave() {
        this.props.pipoStop();
    }

    render() {

        return (
            <div className="confirmPopup">
                <div className="confirmPopup__content">
                    <img src={errorSvg} alt="error"/>
                    <p>Veux-tu vraiment passer à côté de {this.props.productName} ?</p>
                </div>
                <button className="confirmPopup__buttonClose" onClick={() => this.onClose()} onMouseOver={() => this.onCloseOver()} onMouseLeave={() => this.onMouseLeave()}>Oui, tant pis</button>
                <button className="confirmPopup__buttonCatalog" onClick={() => this.onCatalog()} onMouseOver={() => this.onCatalogOver()} onMouseLeave={() => this.onMouseLeave()}>Non, retourner au catalogue</button>
            </div>
        )
    }
});

export default ConfirmPopup;