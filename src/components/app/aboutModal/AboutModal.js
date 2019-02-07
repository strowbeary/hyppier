import {observer} from "mobx-react";
import React, {Component} from "react";
import "./_aboutModal.scss";
import {CSSTransitionGroup} from "react-transition-group";
import cciparis from "../../../assets/img/logo-cciparis.png";
import gobelins from "../../../assets/img/logo-gobelins.png";
import SvgButton from "../svgButton/SvgButton";
import GameStore from "../../../stores/GameStore/GameStore";
import CatalogStore from "../../../stores/CatalogStore/CatalogStore";

const AboutModal = observer(class AboutModal extends Component {

    state = {isOpen: false};

    constructor(props) {
        super(props);
        this.gameManager = props.gameManager;
    }

    openModal() {
        if(!GameStore.options.isPaused) {
            this.gameManager.pauseGame();
        }
        this.setState({
            isOpen: true
        })
    }

    closeModal() {
        if(!CatalogStore.isOpen && !GameStore.attic.visibility) {
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
                            <SvgButton type={"close"}/>
                        </button>
                        <div className={"aboutModal__wrapper"}>
                            <h2 className={"aboutModal__title"}>About Hyppier!</h2>
                            <div className={"aboutModal__textWrapper"}>
                                <div className={"aboutModal__textBlock"}>
                                    <div>
                                        <p>
                                            Hyppier! (fusion de hype et happier), c'est la fabuleuse histoire du consumérisme à
                                            l’ère 2.0, où la fast-fashion fait déborder nos armoires, où l’obsolescence
                                            programmée dézingue nos appareils électroménagers et où les pop-ups par milliers nous poussent
                                            à une frénésie d’achat incontrôlée.
                                        </p>
                                        <p>
                                            Bref, l’histoire d’une époque caricaturée à l’extrême où l’épanouissement personnel
                                            est à portée de clics sur un panier.
                                        </p>
                                    </div>
                                </div>
                                <div className={"aboutModal__textBlock"}>
                                    <div>
                                        <p>
                                            Mais c'est aussi l'histoire mouvementée d'une équipe de quatre bras cassés :
                                        </p>
                                        <p>
                                            - deux designers aux caprices esthétiques capillotractés,
                                        </p>
                                        <p>
                                            - deux développeurs au réalisme technique affuté
                                        </p>
                                    </div>
                                </div>
                                <ul className={"aboutModal__team"}>
                                    <li>
                                        <a href={""} target={"_blank"}>
                                            PIPO
                                        </a>
                                        <a href={""} target={"_blank"}>
                                            <p>Xindi</p>
                                            <p>YANG</p>
                                        </a>
                                    </li>
                                    <li>
                                        <a href={""} target={"_blank"}>
                                            PIPO
                                        </a>
                                        <a href={""} target={"_blank"}>
                                            <p>Camille</p>
                                            <p>ROSTOUCHER</p>
                                        </a>
                                    </li>
                                    <li>
                                        <a href={""} target={"_blank"}>
                                            PIPO
                                        </a>
                                        <a href={""} target={"_blank"}>
                                            <p>Mélanie</p>
                                            <p>NGO</p>
                                        </a>
                                    </li>
                                    <li>
                                        <a href={""} target={"_blank"}>
                                            PIPO
                                        </a>
                                        <a href={""} target={"_blank"}>
                                            <p>Rémi</p>
                                            <p>CAILLOT</p>
                                        </a>
                                    </li>
                                </ul>
                                <div className={"aboutModal__thanks"}>
                                    <p>Merci à l'équipe pédagogique de Gobelins, l'école de l'image, pour ses conseils éclairés tout au long du projet</p>
                                    <div className={"aboutModal__logos"}>
                                        <div>
                                            <img src={gobelins} alt={"gobelins"}></img>
                                        </div>
                                        <div>
                                            <span>une école de la</span>
                                        </div>
                                        <div>
                                            <img src={cciparis} alt={"cciparis"}></img>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={"aboutModal__footer"}>
                            <button>
                                <SvgButton type={"instagram"}/>
                            </button>
                            <button>
                                <SvgButton type={"video"}/>
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