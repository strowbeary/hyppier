import {observer} from "mobx-react";
import React, {Component} from "react";
import icon_close from "./img/icon_close.svg";
import "./_catalog.scss";
import CatalogStore from "../../../stores/CatalogStore/CatalogStore";
import {CSSTransitionGroup} from "react-transition-group";
import CameraStore from "../../../stores/CameraStore";
import {CameraManager} from "../GameCanvas/CameraManager";

const Catalog = observer(class Catalog extends Component {

    state = {
        scrollProgressionWidth: '0%',
        selectedNew: 0,
        selectedBefore: -1,
        fromPopUp: false,
        errorShow: false
    };
    contentScrollHeight = 0;
    contentHeight = 0;
    contentElement = null;
    promo = null;
    timeOut = null;

    constructor(props) {
        super(props);
        let path = props.path;
        this.productType = CatalogStore.objectTypes[path[0]];
        this.objectKind = this.productType.objectKinds[path[1]];
        if(this.objectKind.activeObject !== null) {
            this.productNew = this.objectKind.objects[this.objectKind.activeObject + 1];

            this.objectKind.location.setPreviewObject(this.objectKind.activeObject + 1, 0);
            this.hasPreviousGeneration = this.objectKind.activeObject > 0;
            if (this.hasPreviousGeneration) {
                this.promo = this.productNew.adUrl;
                this.productBefore =this.objectKind.objects[this.objectKind.activeObject - 1];
             }
        } else {
            this.productNew = this.objectKind.objects[0];
            this.objectKind.location.setPreviewObject(0, 0);
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
        CameraStore.setTarget(
            this.productNew.getModel().mesh.name,
            CameraManager.CATALOG_OFFSET
        );
    }
    componentWillUnmount() {
    }

    componentDidUpdate() {
        this.setContentHeight();
        this.contentScrollHeight = this.contentElement.scrollHeight - this.contentHeight;
        if (this.state.errorShow && !this.timeOut) {
            this.timeOut = setTimeout(() => {this.setState({errorShow: false})}, 2000);
        } else {
            this.resetTimeOut();
        }
    }

    onResize() {
        this.setContentHeight();
        this.contentScrollHeight = this.contentElement.scrollHeight - this.contentHeight;
        this.updateScrollProgression();
    }

    resetTimeOut() {
        if (this.timeOut) {
            clearTimeout(this.timeOut);
            this.timeOut = null;
        }
    }

    onThumbnailClick(index) {
        if (!this.state.errorShow) {
            this.setState({
                selectedBefore: index,
                errorShow: true
            });
        }
    }

    onErrorClick() {
        this.setState({
            errorShow: false
        });
    }

    onTintClick(index) {
        if (!this.state.errorShow) {
            this.setState({
                selectedNew: index,
                selectedBefore: -1,
                errorShow: false
            })
        }
    }

    onMainClick() {
        if (this.state.selectedBefore !== -1 && !this.state.errorShow) {
            this.setState({
                selectedBefore: -1,
                errorShow: false
            });
        }
    }

    onClose() {
        let result = window.confirm("Déjà décidé à partir? Le catalogue a d'autre surprises à te montrer, veux-tu les découvrir ?");
        if (result) {
            this.setState({fromPopUp: true});
        } else {
            this.props.onClose();
            CameraStore.setTarget();
            this.objectKind.location.removePreviewObject();
        }
    }

    onValidate() {
        if (this.state.selectedBefore === -1) {
            if (this.objectKind.activeObject !== null) {
                this.objectKind.setActiveObject(this.objectKind.activeObject + 1, this.state.selectedNew);
            } else {
                this.objectKind.setActiveObject(0, this.state.selectedNew);
            }
        } else {
            //promo IS selected
        }
        this.props.onClose();
        CameraStore.setTarget();
        this.objectKind.location.removePreviewObject();
    }

    render() {
        let selectedTint = (index) => {
            return this.state.selectedNew === index? 'selected':''
        };
        let selectedThumbnail = (index) => {
            return this.state.selectedBefore === index? 'selected':''
        };
        let shiny = (index) => {
            return this.productNew.tints[index].special? 'shiny':''
        };
        let special = this.productNew.tints[this.state.selectedNew].special? 'special':'';
        let footerShadow = this.hasPreviousGeneration && this.state.fromPopUp? 'hasScroll':'';
        let hasSelectedBefore = this.state.selectedBefore === -1? 'selected':'';
        let tints = this.productNew.tints.map((tint, index) => <li className={`catalog__content__main__color ${selectedTint(index)} ${shiny(index)}`} style={{backgroundColor: tint.color}} key={tint.name+index} onClick={() => this.onTintClick(index)}></li>);
        let thumbnails = this.productBefore? this.productBefore.tints.map((variant, index) => <li className="catalog__content__promotion__product" key={variant.name}>
            <div className="catalog__content__promotion__productType">
                <p>{this.productType.name}</p>
            </div>
            <div className="catalog__content__promotion__productTitle">
                <span>{this.productBefore? this.productBefore.name:''}</span>
                <span> > {variant.name}</span>
            </div>
            <div className={`catalog__content__promotion__wrapper ${selectedThumbnail(index)}`} onClick={() => this.onThumbnailClick(index)}>
                <img src={variant.thumbnailUrl} alt="model" className="catalog__content__promotion__img"/>
            </div>
        </li>) : null;

        return (
            <div className={`catalog`}>
                <CSSTransitionGroup
                    transitionName="fadeIn"
                    transitionEnterTimeout={500}
                    transitionLeaveTimeout={300}>
                    {this.state.errorShow &&
                        <div className="error" onClick={() => this.onErrorClick()}>
                            <p>La prévisualisation pour les articles en promotion n'est pas disponible !</p>
                        </div>
                    }
                </CSSTransitionGroup>
                <div className="catalog__header">
                    <span>Catalogue</span>
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
                    <p className="catalog__content__title">{this.productNew.catalogSlogan}</p>

                    <div className="catalog__content__main">
                        <div className="catalog__content__main__productType">
                            <p>{this.productType.name}</p>
                        </div>
                        <div className="catalog__content__main__productTitle">
                            <span>{this.productNew.name}</span>
                            <span> > {this.productNew.tints[this.state.selectedNew].name}</span>
                        </div>
                        <div className={`catalog__content__main__body ${hasSelectedBefore} ${special}`} onClick={() => this.onMainClick()}>
                            <img src={this.productNew.tints[this.state.selectedNew].thumbnail} alt="model" className="catalog__content__main__img"/>
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
