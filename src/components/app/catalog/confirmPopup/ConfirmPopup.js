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
        let {infos, closeButtonLabel, returnCatalogButtonLabel} = this.props.product;

        return (
            <div className="confirmPopup">
                <div className="confirmPopup__content">
                    <img src={errorSvg} alt="error"/>
                    <p>{infos[0].slogan}</p>
                </div>
                <button className="confirmPopup__buttonClose" onClick={() => this.onClose()} onMouseOver={() => this.onCloseOver()} onMouseLeave={() => this.onMouseLeave()}>{closeButtonLabel}</button>
                <button className="confirmPopup__buttonCatalog" onClick={() => this.onCatalog()} onMouseOver={() => this.onCatalogOver()} onMouseLeave={() => this.onMouseLeave()}>{returnCatalogButtonLabel}</button>
            </div>
        )
    }
});

export default ConfirmPopup;