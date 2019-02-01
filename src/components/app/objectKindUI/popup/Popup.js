import {observer} from "mobx-react";
import React, {Component} from "react";
import "./_popup.scss";
import CameraStore from "../../../../stores/CameraStore";
import CatalogStore from "../../../../stores/CatalogStore/CatalogStore";
import GameStore from "../../../../stores/GameStore/GameStore";

const Popup = observer(class Popup extends Component {

    static refs = [];

    startingPos = {};
    popup = React.createRef();
    buttonClose = React.createRef();
    buttonCatalog = React.createRef();
    state = {draggablePosition: {}};

    constructor(props) {
        super(props);

        this.objectKind = CatalogStore.objectKinds[props.index];
        this.firstPosition = this.props.position;
        this.adUrl = this.objectKind.objects[this.objectKind.replacementCounter + 1].adUrl;
    }

    componentDidMount() {
        let {height, width} = this.popup.current.getBoundingClientRect();
        Popup.refs = Popup.refs.filter(popup => popup !== null);
        this.setState({
            draggablePosition: {
                top: (this.firstPosition.y + 15 - height),
                left: (this.firstPosition.x + 15 - (width / 2))
            },
            focus: Popup.refs.length < 2,
            hovered: false
        });
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
        this.objectKind.updateReplacementCounter();
        GameStore.hype.setLevelByDiff(-0.1);
        CameraStore.setTarget();
        this.pipoStop();
        this.props.closePopup();
    }

    onCatalog() {
        if (this.state.focus) {
            Popup.refs = Popup.refs.filter(popup => popup !== null).filter((popup) => !popup.state.focus);
            if (Popup.refs.length > 0) {
                Popup.refs[0].changeFocus(true);
            }
            this.changeFocus(false);
        }
        this.objectKind.updateReplacementCounter();
        this.objectKind.setActiveObject(this.objectKind.replacementCounter);
        GameStore.hype.setLevelByDiff(0.1);
        //update object with "PROMO" effect
        this.objectKind.objects[this.objectKind.replacementCounter].getModel().addClone();
        GameStore.setPipo("happy");
        this.props.closePopup();
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

        return (
            <div className={`popup ${disabled}`} style={this.state.draggablePosition}
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
