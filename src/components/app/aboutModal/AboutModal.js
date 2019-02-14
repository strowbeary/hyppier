import {observer} from "mobx-react";
import React, {Component} from "react";
import "./_aboutModal.scss";
import {CSSTransitionGroup} from "react-transition-group";
import cciparis from "../../../assets/img/logo-cciparis.png";
import gobelins from "../../../assets/img/logo-gobelins.png";
import GameStore from "../../../stores/GameStore/GameStore";
import CatalogStore from "../../../stores/CatalogStore/CatalogStore";
import instagram from "../../../assets/img/instagram.svg";
import instagramHover from "../../../assets/img/instagram-hover.svg";
import video from "../../../assets/img/video.svg";
import videoHover from "../../../assets/img/video-hover.svg";
import close from "../../../assets/img/close.svg";
import closeHover from "../../../assets/img/close-hover.svg";
import Camille from "../../../assets/img/Pipo-Mean.png";
import Melanie from "../../../assets/img/Pipo-Jaded.png";
import Remi from "../../../assets/img/Pipo-Smiling.png";
import Xindi from "../../../assets/img/Pipo-Happy.png";

const AboutModal = observer(class AboutModal extends Component {

    state = {isOpen: false};

    constructor(props) {
        super(props);
        this.gameManager = props.gameManager;
    }

    openModal() {
        if (!GameStore.options.isPaused) {
            this.gameManager.pauseGame();
        }
        this.setState({
            isOpen: true
        })
    }

    closeModal() {
        if (!CatalogStore.isOpen && !GameStore.attic.atticVisible) {
            this.gameManager.playGame();
        }
        this.setState({
            isOpen: false
        })
    }

    render() {
        return (
            <React.Fragment>
                <button className={"aboutModal__openButton"} onClick={() => this.openModal()}>
                    About Hyppier!
                </button>
                <CSSTransitionGroup
                    transitionName="grow"
                    transitionEnterTimeout={500}
                    transitionLeaveTimeout={500}>
                    {this.state.isOpen &&
                    <div className={"aboutModal__modal"}>
                        <button className={"aboutModal__closeButton"} onClick={() => this.closeModal()}>
                            <img src={close} alt="close"/>
                            <img src={closeHover} alt="closeHover"/>
                        </button>
                        <div className={"aboutModal__wrapper"}>
                            <h2 className={"aboutModal__title"}>About Hyppier!</h2>
                            <ul className={"aboutModal__team"}>
                                <li>
                                    <a href="http://camillerostoucher.com" target="_blank"
                                       rel="noopener noreferrer">
                                        <img src={Camille} alt="mean Pipo"/>
                                    </a>
                                    <a href="http://camillerostoucher.com" target="_blank"
                                       rel="noopener noreferrer" className={"aboutModal__openButton"}>
                                        <p>Camille ROSTOUCHER</p>
                                    </a>
                                </li>
                                <li>
                                    <a href="https://www.linkedin.com/in/xindi-yang-55a316a1" target="_blank"
                                       rel="noopener noreferrer">
                                        <img src={Xindi} alt="happy Pipo"/>
                                    </a>
                                    <a href="https://www.linkedin.com/in/xindi-yang-55a316a1" target="_blank"
                                       rel="noopener noreferrer" className={"aboutModal__openButton"}>
                                        <p>Xindi YANG</p>
                                    </a>
                                </li>
                                <li>
                                    <a href="https://remicaillot.fr/" target="_blank"
                                       rel="noopener noreferrer">
                                        <img src={Remi} alt="smiling Pipo"/>
                                    </a>
                                    <a href="https://remicaillot.fr/" target="_blank" rel="noopener noreferrer"
                                       className={"aboutModal__openButton"}>
                                        <p>Rémi CAILLOT</p>
                                    </a>
                                </li>
                                <li>
                                    <a href="https://fr.linkedin.com/in/m%C3%A9lanie-ngo-661520118" target="_blank"
                                       rel="noopener noreferrer">
                                        <img src={Melanie} alt="jaded Pipo"/>
                                    </a>
                                    <a href="https://fr.linkedin.com/in/m%C3%A9lanie-ngo-661520118" target="_blank"
                                       rel="noopener noreferrer" className={"aboutModal__openButton"}>
                                        <p>Mélanie NGO</p>
                                    </a>
                                </li>
                            </ul>
                            <div className={"aboutModal__textWrapper"}>
                                <div className={"aboutModal__textBlock"}>
                                    <div>
                                        <p>
                                            Hyppier! (fusion de hype et happier), c'est la fabuleuse histoire du
                                            consumérisme à
                                            l’ère 2.0, où la fast-fashion fait déborder nos armoires, où l’obsolescence
                                            programmée dézingue nos appareils électroménagers et où les pop-ups par
                                            milliers nous poussent
                                            à une frénésie d’achat incontrôlée.
                                        </p>
                                        <p>
                                            Bref, l’histoire d’une époque caricaturée à l’extrême où l’épanouissement
                                            personnel
                                            est à portée de clics sur un panier.
                                        </p>
                                    </div>
                                </div>
                                <div className={"aboutModal__textBlock"}>
                                    <div>
                                        <p>
                                            Mais c'est aussi l'histoire mouvementée d'une équipe de quatre bras cassés :
                                            <br/>
                                            - deux designers aux caprices esthétiques capillotractés,
                                            <br/>
                                            - deux développeurs au réalisme technique affuté
                                        </p>
                                    </div>
                                </div>
                                <div className={"aboutModal__sounds"}>
                                    <span>Musique - </span>
                                    <a href="https://soundcloud.com/therewillbenosadness" rel="noopener noreferrer"
                                       target="_blank" className={"aboutModal__openButton"}>
                                        There will be no sadness
                                    </a>
                                    <br/>
                                    <span>Bruitage - </span>
                                    <a href="https://freesound.org/people/sandyrb/sounds/95078/"
                                       rel="noopener noreferrer" target="_blank"
                                       className={"aboutModal__openButton"}>
                                        sandyrb
                                    </a>
                                    <span> - </span>
                                    <a href="https://freesound.org/people/FunWithSound/sounds/456965/"
                                       rel="noopener noreferrer" target="_blank"
                                       className={"aboutModal__openButton"}>
                                        FunWithSound
                                    </a>
                                    <span> - </span>
                                    <a href="https://freesound.org/people/bennstir/sounds/81071/"
                                       rel="noopener noreferrer" target="_blank"
                                       className={"aboutModal__openButton"}>
                                        benstir
                                    </a>
                                    <span> - </span>
                                    <a href="https://freesound.org/people/gusgus26/sounds/415089/"
                                       rel="noopener noreferrer" target="_blank"
                                       className={"aboutModal__openButton"}>
                                        gusgus26
                                    </a>
                                    <span> - </span>
                                    <a href="https://freesound.org/people/zzwerty/sounds/315878/" rel="noopener noreferrer" target="_blank"
                                       className={"aboutModal__openButton"}>
                                        zzwerty
                                    </a>
                                    <span> - </span>
                                    <a href="https://freesound.org/people/newagesoup/sounds/339360/" rel="noopener noreferrer" target="_blank"
                                       className={"aboutModal__openButton"}>
                                        newagesoup
                                    </a>
                                    <span> - </span>
                                    <a href="https://freesound.org/people/plasterbrain/sounds/423166/" rel="noopener noreferrer" target="_blank"
                                       className={"aboutModal__openButton"}>
                                        plasterbrain
                                    </a>
                                    <span> - </span>
                                    <a href="https://freesound.org/people/kila_vat/sounds/434379/" rel="noopener noreferrer" target="_blank"
                                       className={"aboutModal__openButton"}>
                                        kila_vat
                                    </a>
                                    <span> - </span>
                                    <a href="https://freesound.org/people/Stereo%20Surgeon/sounds/261205/" rel="noopener noreferrer" target="_blank"
                                       className={"aboutModal__openButton"}>
                                        Stereo Surgeon
                                    </a>
                                </div>
                                <div className={"aboutModal__thanks"}>
                                    <p>Merci à l'équipe pédagogique de <a href="https://www.gobelins.fr/" className={"aboutModal__openButton"} rel="noopener noreferrer" target="_blank">Gobelins, l'école de l'image</a>, pour ses conseils
                                        éclairés tout au long du projet</p>
                                    <div className={"aboutModal__logos"}>
                                        <div>
                                            <img src={gobelins} alt={"gobelins"}/>
                                        </div>
                                        <div>
                                            <span>une école de la</span>
                                        </div>
                                        <div>
                                            <img src={cciparis} alt={"cciparis"}/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={"aboutModal__footer"}>
                            <a href="https://www.instagram.com/hyppier/" rel="noopener noreferrer" target="_blank">
                                <button>
                                    <img src={instagram} alt="instagram"/>
                                    <img src={instagramHover} alt="instagramHover"/>
                                </button>
                            </a>
                            <button>
                                <img src={video} alt="video"/>
                                <img src={videoHover} alt="videoHover"/>
                            </button>
                        </div>
                    </div>
                    }
                </CSSTransitionGroup>
            </React.Fragment>
        )
    }
});

export default AboutModal;