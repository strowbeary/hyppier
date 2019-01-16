import {observer} from "mobx-react";
import React, {Component} from "react";
import icon_close from "./img/icon_close.svg";
import "./_catalog.scss";
import CatalogStore from "../../../stores/CatalogStore/CatalogStore";
import { CSSTransitionGroup } from "react-transition-group";
import CameraStore from "../../../stores/CameraStore";
import GameStore from "../../../stores/GameStore/GameStore";
import {CameraManager} from "../GameCanvas/CameraManager";
import Thumbnail from "./thumbnail/Thumbnail";
import Tint from "./tint/Tint";
import PopupStore from "../../../stores/PopupStore/PopupStore";

const Catalog = observer(class Catalog extends Component {

    state = {scrollProgressionWidth: '0%', selectedNew: 0, selectedBefore: -1, errorShow: false};
    contentScrollHeight = 0;
    contentHeight = 0;
    contentElement = null;
    promo = null;
    errorToastTimeOut = null;

    constructor(props) {
        super(props);
        this.path = props.path.toJSON();
        this.productType = CatalogStore.objectTypes[this.path[0]];
        this.objectKind = this.productType.objectKinds[this.path[1]];
        this.hasPreviousGeneration = this.objectKind.activeObject !== null;
        if(this.hasPreviousGeneration) {
            this.productNew = this.objectKind.objects[this.objectKind.activeObject[0] + 1];
            this.objectKind.location.setPreviewObject(this.objectKind.activeObject[0] + 1, 0);
            this.productBefore = this.objectKind.objects[this.objectKind.activeObject[0]];
            this.path.push(this.objectKind.activeObject[0]+1);
        } else {
            this.productNew = this.objectKind.objects[0];
            this.objectKind.location.setPreviewObject(0, 0);
            this.path.push(0);
        }
        this.promo = this.productNew.adUrl;
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
        this.objectKind.location.removePreviewObject();
    }

    componentDidUpdate() {
        this.setContentHeight();
        this.contentScrollHeight = this.contentElement.scrollHeight - this.contentHeight;
        this.updateErrorToastTimeOut();
    }

    onResize() {
        this.setContentHeight();
        this.contentScrollHeight = this.contentElement.scrollHeight - this.contentHeight;
        this.updateScrollProgression();
    }

    updateErrorToastTimeOut() {
        if (this.state.errorShow && !this.errorToastTimeOut) {
            this.errorToastTimeOut = setTimeout(() => {this.setState({errorShow: false})}, 2000);
        } else {
            this.resetErrorToastTimeOut();
        }
    }

    resetErrorToastTimeOut() {
        if (this.errorToastTimeOut) {
            clearTimeout(this.errorToastTimeOut);
            this.errorToastTimeOut = null;
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

    onErrorToastClick() {
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
        PopupStore.addCatalogPopup(this.path);
    }

    onValidate() {
        if (this.state.selectedBefore === -1) {
            if (this.objectKind.activeObject !== null) {
                this.objectKind.setActiveObject(this.objectKind.activeObject[0] + 1, this.state.selectedNew);
            } else {
                this.objectKind.setActiveObject(0, this.state.selectedNew);
            }
            GameStore.hype.setLevelByDiff(0.1);
            //skip generation
        } else {
            //promo IS selected
            //this.objectKind.setActiveObject(this.objectKind.activeObject[0], this.state.selectedBefore);
        }
        this.props.onClose();
    }

    render() {
        let special = this.productNew.tints[this.state.selectedNew].special? 'special':'';
        let footerShadow = (this.hasPreviousGeneration && CatalogStore.visiblePromo) && this.objectKind.achievementPromotions? 'hasScroll':'';
        let hasSelectedBefore = this.state.selectedBefore === -1? 'selected':'';
        let tints = this.objectKind.achievementSpecialTint? this.productNew.tints.map((tint, index) =>
            <Tint selectedTint={this.state.selectedNew} index={index} tint={tint} onTintClick={(index) => this.onTintClick(index)} key={tint.name}/>):
            this.productNew.tints.filter((tint) => !tint.special).map((tint, index) =>
                    <Tint selectedTint={this.state.selectedNew} index={index} tint={tint} onTintClick={(index) => this.onTintClick(index)} key={tint.name}/>);
        let thumbnails = this.hasPreviousGeneration?
            this.productBefore.tints.map((tint, index) =>
                <Thumbnail productType={this.productType.name} productTitle={this.productBefore.name} selectedThumbnail={this.state.selectedBefore}
                           tint={tint} index={index} key={tint.name} onThumbnailClick={(index) => this.onThumbnailClick(index)}/>
            ) : null;

        return (
            <div className={`catalog`}>
                <CSSTransitionGroup
                    transitionName="fadeIn"
                    transitionEnterTimeout={500}
                    transitionLeaveTimeout={300}>
                    {this.state.errorShow &&
                        <div className="error" onClick={() => this.onErrorToastClick()}>
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
                {this.hasPreviousGeneration && CatalogStore.visiblePromo &&
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
                    {this.hasPreviousGeneration && CatalogStore.visiblePromo &&
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
