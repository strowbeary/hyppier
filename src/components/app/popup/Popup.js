import {observer} from "mobx-react";
import React, {Component} from "react";
import "./_popup.scss";
import CameraStore from "../../../stores/CameraStore";
import CatalogStore from "../../../stores/CatalogStore/CatalogStore";
import PopupStore from "../../../stores/PopupStore/PopupStore";
import GameStore from "../../../stores/GameStore/GameStore";
import placehoder from "./img/popup_placeholder.png";

const Popup = observer(class Popup extends Component {

    static popupRef = [];

    static createPopup(path) {
        const ref = React.createRef();
        Popup.popupRef.push(ref);
        return <Popup ref={ref} path={path} key={path.toJSON()}/>;
    }

    startingPos = {};
    popup = React.createRef();
    buttonClose = React.createRef();
    buttonCatalog = React.createRef();
    state = {draggablePosition: {visibility: "hidden"}, isClosing: false};

    constructor(props) {
        super(props);

        this.path = props.path;
        this.objectKind = CatalogStore.objectTypes[this.path[0]].objectKinds[this.path[1]];
        const object = this.objectKind.objects[this.path[2]];

        this.adUrl = placehoder;
        //this.adUrl = object.adUrl;
    }

    componentDidMount() {
        let {height, width} = this.popup.current.getBoundingClientRect();
        Popup.popupRef = Popup.popupRef.filter(popup => popup.current !== null);
        this.setState({
            draggablePosition: {
                top: PopupStore.firstPosition.y - height,
                left: PopupStore.firstPosition.x - width / 2,
                transform: "scale(0)",
                visibility: "hidden"
            },
            focus: Popup.popupRef.length < 2,
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
                PopupStore.removePopup(this.props.path.toJSON());
                if (this.objectKind.activeObject !== null) {
                    GameStore.hype.setLevelByDiff(-0.1);
                    //skip generation
                }
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
            Popup.popupRef = Popup.popupRef.filter(popup => popup.current !== null);
            if (!this.focus) {
                Popup.popupRef.forEach((popup) => {
                    popup.current.changeFocus(false);
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
            Popup.popupRef = Popup.popupRef.filter(popup => popup.current !== null).filter((popup) => !popup.current.state.focus);
            if (Popup.popupRef.length > 0) {
                Popup.popupRef[0].current.changeFocus(true);
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
    }

    onCatalog() {
        if (this.state.focus) {
            Popup.popupRef = Popup.popupRef.filter(popup => popup.current !== null).filter((popup) => !popup.current.state.focus);
            if (Popup.popupRef.length > 0) {
                Popup.popupRef[0].current.changeFocus(true);
            }
        }
        if (this.objectKind.activeObject !== null) {
            this.objectKind.setActiveObject(this.objectKind.activeObject + 1);
        } else {
            this.objectKind.setActiveObject(0);
        }
        GameStore.hype.setLevelByDiff(0.1);
        PopupStore.removePopup(this.props.path);
        //update object with "PROMO" effect
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
                        ref={this.buttonClose}>Bof, pas intéressé(e)</button>
                <button className="popup__footer__buttonCatalog" disabled={buttonsDisabled}
                        onClick={() => this.onCatalog()} ref={this.buttonCatalog}>Oh oui, je veux !</button>
            </div>
        )
    }
});

export default Popup;
