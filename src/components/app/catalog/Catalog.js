import {observer} from "mobx-react";
import React, {Component} from "react";
import icon_close from "./img/icon_close.svg";
import "./_catalog.scss";
import CatalogStore from "../../../stores/CatalogStore/CatalogStore";

const Catalog = observer(class Catalog extends Component {

    state = {scrollProgressionWidth: '0%', selectedNew: 0, selectedBefore: -1, fromPopUp: false};
    contentScrollHeight = 0;
    contentHeight = 0;
    contentElement = null;
    productBeforeVariants = [];
    promo = null;

    constructor(props) {
        super(props);
        let path = props.path;
        this.productType = CatalogStore.objectTypes[path[0]];
        this.productNew = this.productType.objectKinds[path[1]].objects[path[2]];
        this.productNewVariants = this.productNew.tints.map(tint => {return {name: tint.name, thumbnail: tint.thumbnailUrl, color: tint.color, special: tint.special}});
        this.hasPreviousGeneration = path[2] !== 0;
        if (this.hasPreviousGeneration) {
            this.promo = this.productNew.infos[0].url;
            this.productBefore = this.productType.objectKinds[path[1]].objects[path[2] - 1];
            this.productBeforeVariants = this.productBefore.tints.map(tint => {return {name: tint.name, thumbnail: tint.thumbnailUrl}});
        }
    }

    updateScrollProgression() {
        this.contentScrollHeight = this.contentScrollHeight === 0? this.contentElement.scrollHeight - this.contentHeight: this.contentScrollHeight;
        let scrolled = (this.contentElement.scrollTop / this.contentScrollHeight) * 100;
        this.setState({
            scrollProgressionWidth: `${scrolled}%`
        });
    }

    setContentHeight() {
        let {height, paddingTop, paddingBottom} = window.getComputedStyle(this.contentElement);
        this.contentHeight = parseFloat(height) + parseFloat(paddingTop) + parseFloat(paddingBottom);
    }

    componentDidMount() {
        this.contentElement = document.getElementsByClassName("catalog__content")[0];
        this.setContentHeight();
        window.addEventListener('resize', () => {
            this.onResize()
        });
    }

    componentDidUpdate() {
        this.setContentHeight();
        this.contentScrollHeight = this.contentElement.scrollHeight - this.contentHeight;
    }

    onResize() {
        this.setContentHeight();
        this.contentScrollHeight = this.contentElement.scrollHeight - this.contentHeight;
        this.updateScrollProgression();
    }

    onThumbnailClick(index) {
        this.setState({
            selectedBefore: index
        })
    }

    onTintClick(index) {
        this.setState({
            selectedNew: index,
            selectedBefore: -1
        })
    }

    onMainClick() {
        if (this.state.selectedBefore !== -1) {
            this.setState({selectedBefore: -1});
        }
    }

    onClose() {
        let result = window.confirm("Déjà décidé à partir? Le catalogue a d'autre surprises à te montrer, veux-tu les découvrir ?");
        if (result) {
            this.setState({fromPopUp: true});
        } else {

        }
    }

    onValidate() {

    }

    render() {
        let selectedTint = (index) => {
            return this.state.selectedNew === index? 'selected':''
        };
        let selectedThumbnail = (index) => {
            return this.state.selectedBefore === index? 'selected':''
        };
        let shiny = (index) => {
            return this.productNewVariants[index].special? 'shiny':''
        };
        let footerShadow = this.hasPreviousGeneration && this.state.fromPopUp? 'hasScroll':'';
        let hasSelectedBefore = this.state.selectedBefore === -1? 'selected':'';

        let tints = this.productNewVariants.map((tint, index) => <li className={`catalog__content__main__color ${selectedTint(index)} ${shiny(index)}`} style={{backgroundColor: tint.color}} key={tint.name+index} onClick={() => this.onTintClick(index)}></li>);
        let thumbnails = this.productBeforeVariants.map((variant, index) => <li className="catalog__content__promotion__product" key={variant.name}>
            <div className="catalog__content__promotion__productType">
                <p>{this.productType.name}</p>
            </div>
            <div className="catalog__content__promotion__productTitle">
                <span>{this.productBefore? this.productBefore.name:''}</span>
                <span> > {variant.name}</span>
            </div>
            <div className={`catalog__content__promotion__wrapper ${selectedThumbnail(index)}`} onClick={() => this.onThumbnailClick(index)}>
                <img src={variant.thumbnail} alt="model" className="catalog__content__promotion__img"/>
            </div>
        </li>);

        return (
            <div className={`catalog`}>
                <div className="catalog__header">
                    <span>Catalog</span>
                    <button className="catalog__header__close" onClick={() => this.onClose()}>
                        <img src={icon_close} alt="close_icon"/>
                    </button>
                </div>
                {this.hasPreviousGeneration && this.state.fromPopUp &&
                    <div className="catalog__header__scrollIndicator">
                        <div className="catalog__header__scrollIndicator__progression"
                             style={{width: this.state.scrollProgressionWidth}}></div>
                    </div>
                }
                <div className="catalog__content" onScroll={(e) => this.updateScrollProgression(e)}>
                    <p className="catalog__content__title">Et si tu remplaçais ce Macintosh 128K défraîchi et vieillissant par un nouveau modèle ?</p>

                    <div className="catalog__content__main">
                        <div className="catalog__content__main__productType">
                            <p>{this.productType.name}</p>
                        </div>
                        <div className="catalog__content__main__productTitle">
                            <span>{this.productNew.name}</span>
                            <span> > {this.productNewVariants[this.state.selectedNew].name}</span>
                        </div>
                        <div className={`catalog__content__main__body ${hasSelectedBefore}`} onClick={() => this.onMainClick()}>
                            <img src={this.productNewVariants[this.state.selectedNew].thumbnail} alt="model" className="catalog__content__main__img"/>
                        </div>
                        <ul className="catalog__content__main__palette">
                            {tints}
                        </ul>
                    </div>
                    {this.hasPreviousGeneration && this.state.fromPopUp &&
                        <div className="catalog__content__promotion">
                            <h6>Promotions en folie !</h6>
                            <img className="catalog__content__promotion__pub" src={this.promo} alt="promotion"/>
                            <ul className="catalog__content__promotion__products">
                                {thumbnails}
                            </ul>
                        </div>
                    }
                </div>
                <div className={`catalog__footer ${footerShadow}`} onClick={() => this.onValidate()}>
                    <button className="catalog__footer__validation">
                        VALIDER
                    </button>
                </div>
            </div>
        )
    }
});

export default Catalog;