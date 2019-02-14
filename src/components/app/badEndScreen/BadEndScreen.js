import {observer} from "mobx-react";
import React, {Component} from "react";
import "./_badEndScreen.scss";

const BadEndScreen = observer(class BadEndScreen extends Component {

    render() {
        return (
            <div className="badEndScreen">
                <section className="badEndScreen__section">
                    <div className="badEndScreen__bubble">
                        <h3 className="badEndScreen__bubble__title">Ouuuh, tu as perdu</h3>
                        <p className="badEndScreen__bubble__text">
                            Ton grenier t’est tombé sur la tête.
                            Peut-être n’as-tu pas fait les bons choix ?
                            Pas de panique, tu peux maintenant :
                        </p>
                        <div className="badEndScreen__buttons">
                            <button
                                className="light"
                                onClick={() => window.location.reload()}
                            >Revenir au début</button>
                            <button
                                className="main"
                                onClick={() => window.location.reload()}
                            >Rejouer</button>
                        </div>
                    </div>
                </section>
            </div>
        )
    }
});

export default BadEndScreen;
