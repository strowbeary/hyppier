import {observer} from "mobx-react";
import React, {Component} from "react";
import "./_popup.scss";
import CameraStore from "../../../stores/CameraStore";
import CatalogStore from "../../../stores/CatalogStore/CatalogStore";
import PopupStore from "../../../stores/PopupStore/PopupStore";
import GameStore from "../../../stores/GameStore/GameStore";
import placehoder from "./img/popup_placeholder.png";
import {SceneManager} from "../GameCanvas/SceneManager";

const Popup = observer(class Popup extends Component {

    static refs = [];

    startingPos = {};
    popup = React.createRef();
    buttonClose = React.createRef();
    buttonCatalog = React.createRef();
    state = {draggablePosition: {visibility: "hidden"}, isClosing: false};

    constructor(props) {
        super(props);

        this.objectKind = CatalogStore.objectKinds[props.index];

        this.adUrl = placehoder;
        //this.adUrl = object.adUrl;
    }

    componentDidMount() {
        let {height, width} = this.popup.current.getBoundingClientRect();
        Popup.refs = Popup.refs.filter(popup => popup !== null);
        this.setState({
            draggablePosition: {
                top: (PopupStore.firstPosition.y - height) / SceneManager.DEVICE_PIXEL_RATIO,
                left: (PopupStore.firstPosition.x - width / 2) / SceneManager.DEVICE_PIXEL_RATIO,
                transform: "scale(0)",
                visibility: "hidden"
            },
            focus: Popup.refs.length < 2,
            hovered: false
        });
    }

    componentDidUpdate() {
        if (this.state.draggablePosition.transform && this.state.draggablePosition.transform === "scale(0)" && !this.state.isClosing) {
            if (this.state.visibility === "hidden") {
                setTimeout(() => {
                    this.setState({
                        draggablePosition: {
                            top: this.state.draggablePosition.top,
                            left: this.state.draggablePosition.left,
                            transform: "scale(0)",
                            visibility: "visible"
                        },
                    })
                }, 500);
            }
            else {
                setTimeout(() => {
                    this.setState({
                        draggablePosition: {
                            top: this.state.draggablePosition.top,
                            left: this.state.draggablePosition.left,
                            transform: "scale(1)"
                        },
                    })
                }, 500);
            }
        } else if (this.state.draggablePosition.transform && this.state.draggablePosition.transform === "scale(0)" && this.state.isClosing) {
            setTimeout(() => {
                PopupStore.removePopup(this.props.index);
                CameraStore.setTarget();
            }, 500);
        }
    }

    changeFocus(value) {
        this.setState({focus: value});
    }

    setHovered(value) {
        this.setState({hovered: value});
    }

    onDragStart(e) {
        if (e.target !== this.buttonClose.current && e.target !== this.buttonCatalog.current) {
            e.preventDefault();
            Popup.refs = Popup.refs.filter(popup => popup !== null);
            if (!this.focus) {
                Popup.refs.forEach((popup) => {
                    popup.changeFocus(false);
                });
                this.changeFocus(true);
            }
            this.startingPos = {x: e.clientX, y: e.clientY};
            document.onmousemove = (e) => {
                this.dragElement(e)
            };
            document.onmouseup = () => {
                this.drapStop()
            };
        }
    }

    dragElement(e) {
        e.preventDefault();
        // calculate the new cursor position:
        let pos1 = this.startingPos.x - e.clientX;
        let pos2 = this.startingPos.y - e.clientY;
        this.startingPos = {x: e.clientX, y: e.clientY};
        // set the element's new position:
        this.setState({
            draggablePosition: {top: this.popup.current.offsetTop - pos2, left: this.popup.current.offsetLeft - pos1}
        });
    }

    drapStop() {
        document.onmousemove = null;
    }

    onClose() {
        if (this.state.focus) {
            Popup.refs = Popup.refs.filter(popup => popup !== null).filter((popup) => !popup.state.focus);
            if (Popup.refs.length > 0) {
                Popup.refs[0].changeFocus(true);
            }
        }
        this.setState({
            isClosing: true,
            draggablePosition: {
                top: this.state.draggablePosition.top,
                left: this.state.draggablePosition.left,
                transform: "scale(0)"
            },
            focus: false
        });
        this.objectKind.updateReplacementCounter();
    }

    onCatalog() {
        if (this.state.focus) {
            Popup.refs = Popup.refs.filter(popup => popup !== null).filter((popup) => !popup.state.focus);
            if (Popup.refs.length > 0) {
                Popup.refs[0].changeFocus(true);
            }
        }
        this.objectKind.updateReplacementCounter();
        this.objectKind.setActiveObject(this.objectKind.replacementCounter);
        GameStore.hype.setLevelByDiff(0.1);
        PopupStore.removePopup(this.props.index);
        //update object with "PROMO" effect
        this.objectKind.objects[this.objectKind.replacementCounter].getModel().addClone();
    }

    pipoYes() {
        GameStore.setPipo("yes");
    }

    pipoNo() {
        GameStore.setPipo("no");
    }

    pipoStop() {
        GameStore.setPipo("");
    }

    render() {
        let disabled = this.state.focus ? '' : 'disabled';
        let buttonsDisabled = !this.state.focus && !this.state.hovered;
        let hide = PopupStore.isActivePopup(this.path) && CatalogStore.isOpen ? 'hide' : '';

        return (
            <div className={`popup ${disabled} ${hide}`} style={this.state.draggablePosition}
                 onMouseDown={(e) => this.onDragStart(e)} ref={this.popup}
                 onMouseOver={() => this.setHovered(true)} onMouseLeave={() => this.setHovered(false)}>
                <img className="popup__image" src={this.adUrl} alt="promotion" draggable={false}/>
                <button className="popup__footer__buttonClose" disabled={buttonsDisabled} onClick={() => this.onClose()}
                        ref={this.buttonClose} onMouseOver={() => this.pipoNo()} onMouseLeave={() => this.pipoStop()}>Bof, pas intéressé(e)</button>
                <button className="popup__footer__buttonCatalog" disabled={buttonsDisabled}
                        onClick={() => this.onCatalog()} ref={this.buttonCatalog} onMouseOver={() => this.pipoYes()} onMouseLeave={() => this.pipoStop()}>Oh oui, je veux !</button>
            </div>
        )
    }
});

export default Popup;
