import {observer} from "mobx-react";
import React, {Component} from "react";
import "./_goodEndScreen.scss";
import FullScreenButton from "../options/fullscreenButton/FullScreenButton";
import AboutModal from "../GameCanvas/GameCanvas";
import SoundButton from "../options/soundButton/SoundButton";

const GoodEndScreen = observer(class GoodEndScreen extends Component {

    isScrolling = false;
    lockScroll = false;
    scrollRatio = 0;
    objectTile = [];
    state = {
        pageIndex: 0,
        reticuleX: 0,
        reticuleY: 0
    };

    wheelHandler(e) {
        if(!this.lockScroll) {
            let movement = -e.movementY;
            if (Math.abs(movement) > 5 && !this.isScrolling && (!this.lockScroll || this.scrollRatio === 1)) {
                //on peut declancher le scroll
                if (Math.sign(movement) > 0 && this.state.pageIndex < 2) {
                    //NEXT
                    this.setState({
                        pageIndex: this.state.pageIndex + 1
                    });
                    this.isScrolling = true;
                } else if (Math.sign(movement) < 0 && this.state.pageIndex > 0 && (!this.lockScroll || this.scrollRatio === 0)) {
                    //PREVIOUS
                    this.setState({
                        pageIndex: this.state.pageIndex - 1
                    });
                    this.isScrolling = true;
                }
            }
        }

    }

    prevX = null;
    prevY = null;

    touchHandler(e) {
        if(!this.lockScroll) {
            switch (e.type) {
                case "touchstart":
                    this.prevX = e.touches[0].clientX;
                    this.prevY = e.touches[0].clientY;
                    break;
                case "touchmove":
                    if (!this.prevY || !this.prevX) {
                        return;
                    }
                    const diffX = this.prevX - e.touches[0].clientX;
                    const diffY = this.prevY - e.touches[0].clientY;
                    if (Math.abs(diffX) < Math.abs(diffY)) {
                        if (diffY > 0) {
                            /* up swipe */
                            if (this.state.pageIndex < 2) {
                                this.setState({
                                    pageIndex: this.state.pageIndex + 1
                                });
                                this.isScrolling = true;
                            }
                        } else {
                            /* down swipe */
                            if (this.state.pageIndex > 0) {
                                this.setState({
                                    pageIndex: this.state.pageIndex - 1
                                });
                                this.isScrolling = true;
                            }
                        }
                    }
                    /* reset values */
                    this.prevX = null;
                    this.prevY = null;

                    break;
                case "touchend":

                    break;
                default:
                    break;
            }
        }
    }

    scrollTransitionHandler(e) {
        if (e.propertyName === "top") {
            this.isScrolling = false;
        }
    }

    render() {
        if(this.state.pageIndex === 1) {
            this.lockScroll = true;
        }
        return (
            <article className="goodEndScreen"
                     onTransitionEnd={(e) => this.scrollTransitionHandler(e)}
                     onTouchStart={e => this.touchHandler(e)}
                     onTouchMove={e => this.touchHandler(e)}
                     onWheel={e => this.wheelHandler(e)} style={{
                top: `${-100 * this.state.pageIndex}vh`
            }}>
                <nav className={this.state.pageIndex === 1 ? 'green' : ''}>
                    <div onClick={() => this.setState({pageIndex: 0})}
                         className={"navCircle " + (this.state.pageIndex === 0 ? 'active' : '')}/>
                    <div onClick={() => this.setState({pageIndex: 1})}
                         className={"navCircle " + (this.state.pageIndex === 1 ? 'active' : '')}/>
                    <div onClick={() => this.setState({pageIndex: 2})}
                         className={"navCircle " + (this.state.pageIndex === 2 ? 'active' : '')}/>
                </nav>
                <header>
                    <div className="bubble">
                        <h3>Bravo, tu as gagné !</h3>
                        <p>
                            Bien joué, tu as su contrôlé ta fièvre acheteuse et n'as pas cédé à toutes les tentations
                            marketing !
                            Scroll pour (re)découvrir toutes les informations disséminées au cours de l'expérience.
                        </p>
                    </div>
                    <div className="arrowScroll"/>
                </header>
                <section onScroll={e => {
                    this.scrollRatio = e.target.scrollTop / (e.target.scrollHeight - e.target.clientHeight);
                    if (this.scrollRatio === 1 || this.scrollRatio === 0) {
                        this.lockScroll = false;
                    }
                }}>

                    <div className={"grid"}>
                        <div className={"tooltip"}>
                            <p>En 2017, 600 milliards de casques se sont vendus dans le monde entier.</p>
                        </div>
                        {(() => {
                            let el = [];
                            for (let i = 32; i > 0; i--) {
                                el.push(
                                    <div
                                        ref={ref => this.objectTile[i] = ref}
                                        key={i}
                                        className={"gridItem"}>
                                        <img src="img/catalog/01-Gaming.png"/>
                                    </div>
                                )
                            }
                            return el;
                        })()}
                    </div>
                </section>
                <footer>
                    <div className="bubble">
                        <h3>Minimalisme <span>vs</span> Consumérisme</h3>
                        <p>
                            Qui peut se targuer de résister à tout achat compulsif ? Le coeur a ses raisons que la
                            raison ignore... Mais le risque quand on écoute davantage ses pulsions que sa conscience
                            écologique, c'est de tomber dans une véritable escalade de la démesure.
                            Des prêtresses du rangement telles que Marie Kondo, bâtissent leur empire autour de la joie
                            que peut apporter un tri couplé à une consommation raisonnée, et tendent ainsi à faire
                            pencher la balance du bon côté.
                            Alors pour vivre heureux, vivons léger ?
                        </p>
                        <button>Rejouer</button>
                    </div>
                </footer>
            </article>
        )
    }
});

export default GoodEndScreen;
