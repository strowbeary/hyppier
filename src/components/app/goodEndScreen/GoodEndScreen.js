import {observer} from "mobx-react";
import React, {Component} from "react";
import "./_goodEndScreen.scss";
import FullScreenButton from "../options/fullscreenButton/FullScreenButton";
import AboutModal from "../GameCanvas/GameCanvas";
import SoundButton from "../options/soundButton/SoundButton";
import infos from "./infos";

function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

const GoodEndScreen = observer(class GoodEndScreen extends Component {

    isScrolling = false;
    lockSlide = false;
    lockTimeout = null;
    scrollRatio = 0;
    objectTile = [];

    state = {
        pageIndex: 0,
        tooltipText: "Survole l'un des objets de la grille pour tout savoir sur eux"
    };

    shuffledInfos = shuffle(infos);

    wheelHandler(e) {
        let movement = e.deltaY;
        if (!this.lockSlide && Math.abs(movement) > 5 && !this.isScrolling) {
            //on peut declancher le scroll
            if (Math.sign(movement) > 0 && this.state.pageIndex < 2 && (this.state.pageIndex === 1 ? (this.scrollRatio === 1) : true)) {
                //NEXT
                this.setState({
                    pageIndex: this.state.pageIndex + 1
                });
                this.isScrolling = true;
            }
            else if (Math.sign(movement) < 0 && this.state.pageIndex > 0 && (this.state.pageIndex === 1 ? (this.scrollRatio === 0) : true)) {
                //PREVIOUS
                this.setState({
                    pageIndex: this.state.pageIndex - 1
                });
                this.isScrolling = true;
            }
        }

    }

    scrollHandler(e) {
        this.scrollRatio = e.target.scrollTop / (e.target.scrollHeight - e.target.clientHeight);
        if(this.state.pageIndex === 1) {
            this.lockSlide = true;
            console.log("locked", this.scrollRatio);
            this.lockTimeout && clearTimeout(this.lockTimeout);
            this.lockTimeout = setTimeout(() => {
                if(this.scrollRatio === 0 || this.scrollRatio === 1) {
                    this.lockSlide = false;
                    console.log("unlocked", this.scrollRatio);
                }
            }, 500);
        }

    }

    scrollTransitionHandler(e) {
        if (e.propertyName === "top") {
            this.isScrolling = false;
        }
    }

    render() {
        if (this.state.pageIndex === 1) {
            this.lockScroll = true;
        }
        console.log(this.state);
        return (
            <article className="goodEndScreen"
                     onTransitionEnd={(e) => this.scrollTransitionHandler(e)}
                     onWheel={e => this.wheelHandler(e)}
                     style={{
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
                            Bien joué, tu as su contrôler ta fièvre acheteuse et n’as pas cédé à toutes les tentations
                            marketing ! Scroll pour (re)découvrir toutes les informations disséminées au cours de
                            l’expérience.
                        </p>
                    </div>
                    <div className="arrowScroll"/>
                </header>
                <section
                    onScroll={e => this.scrollHandler(e)}>

                    <div className={"grid"}>
                        <div className={"tooltip"}>
                            <p>{this.state.tooltipText}</p>
                        </div>
                        {(() => {
                            return this.shuffledInfos.map((info, i) => (
                                <div
                                    ref={ref => this.objectTile[i] = ref}
                                    key={i}
                                    className={"gridItem"}
                                    onMouseEnter={(e) => {
                                        this.setState({
                                            tooltipText: info.infoText
                                        })
                                    }}
                                >
                                    <a href={info.link} target="_blank" rel="noopener noreferrer">
                                        <img alt="photo de l'objet" src={info.imgUrl}/>
                                    </a>
                                </div>
                            ));
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
