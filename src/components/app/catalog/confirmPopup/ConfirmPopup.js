import {observer} from "mobx-react";
import React, {Component} from "react";
import "./_confirmPopup.scss";
import errorIcon from "./img/error_icon.png";

const ConfirmPopup = observer(class ConfirmPopup extends Component {

    constructor(props){
        super(props);
    }

    render() {
        return (
            <div className="confirmPopup">
                <img src={errorIcon} alt="error"/>
                <p>Veux-tu vraiment passer à côté de cette paire de patins à roulettes irrésistiblement vintage qui te rendra plus rapide que l'éclair ?</p>
                <a href="" target="_blank" rel="noopener noreferrer">En savoir plus</a>
                <button className="confirmPopup__buttonClose" onClick={() => this.onClose()}>Oui, vive le vintage</button>
                <button className="confirmPopup__buttonCatalog" onClick={() => this.onCatalog()}>Non, retourner au catalogue</button>
            </div>
        )
    }
});

export default ConfirmPopup;