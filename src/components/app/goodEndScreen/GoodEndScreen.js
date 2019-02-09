import {observer} from "mobx-react";
import React, {Component} from "react";
import "./_goodEndScreen.scss";

const GoodEndScreen = observer(class GoodEndScreen extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        console.log("hello");
    }

    render() {
        return (
            <div className="goodEndScreen">
                <section>
                    <div className="goodEndScreen__bubble">
                        <h3 className="goodEndScreen__bubble__title">Bravo, tu as résisté</h3>
                        <p>
                            Bien joué, tu as su contrôlé ta fièvre acheteuse et n'as pas cédé à toutes les tentations
                            marketing !
                            Scroll pour (re)découvrir toutes les informations disséminées au cours de l'expérience.
                        </p>
                    </div>
                </section>
                <section>

                </section>
                <section>
                    <div className="goodEndScreen__bubble">
                        <h3 className="goodEndScreen__bubble__title">Minimalisme vs Consumérisme</h3>
                        <p className="goodEndScreen__bubble__text">
                            Qui peut se targuer de résister à tout achat compulsif ? Le coeur a ses raisons que la
                            raison ignore... Mais le risque quand on écoute davantage ses pulsions que sa conscience
                            écologique, c'est de tomber dans une véritable escalade de la démesure.
                            Des prêtresses du rangement telles que Marie Kondo, bâtissent leur empire autour de la joie
                            que peut apporter un tri couplé à une consommation raisonnée, et tendent ainsi à faire
                            pencher la balance du bon côté.
                            Alors pour vivre heureux, vivons léger ?
                        </p>
                    </div>
                </section>
            </div>
        )
    }
});

export default GoodEndScreen;
