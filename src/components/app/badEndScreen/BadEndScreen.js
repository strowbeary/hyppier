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
                            Dommage hein !
                        </p>
                        <div className="badEndScreen__buttons">
                            <button className="badEndScreen__button__light">Revenir au début</button>
                            <button className="badEndScreen__button__main">Rejouer</button>
                        </div>
                    </div>
                </section>
            </div>
        )
    }
});

export default BadEndScreen;
