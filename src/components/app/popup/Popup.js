import {observer} from "mobx-react";
import React, {Component} from "react";
import "./_popup.scss";
import CameraStore from "../../../stores/CameraStore";

const Popup = observer(class Popup extends Component {

    static popupRef = [];

    static createPopup(data) {
        /*const path = data.path;
        const object = CatalogStore.objectTypes[path[0]].objectKinds[path[1]].objects[path[2]];
        let {infos, closeButtonLabel, returnCatalogButtonLabel, adUrl} = object;

        const ref = React.createRef();
        Popup.popupRef.push(ref);*/
        //return <Popup ref={ref} data={{infos, closeButtonLabel, returnCatalogButtonLabel, adUrl}}/>;
        return <div/>;
    }

    startingPos = {};
    popup = React.createRef();

    constructor(props) {
        super(props);
        this.text = {question: props.data.infos[0].slogan, returnCatalogButtonLabel: props.data.returnCatalogButtonLabel, closeButtonLabel: props.data.closeButtonLabel };
        this.adUrl = props.data.adUrl;
        this.infosUrl = props.data.infos[0].url;
        this.state = {
            draggablePosition: {top: 0, left: 0},
            focus: Popup.popupRef.length < 2,
            hovered: false
        };
    }

    changeFocus(value) {
        this.setState({focus: value});
    }

    setHovered(value) {
        this.setState({hovered: value});
    }

    onDragStart(e) {
        e.preventDefault();
        Popup.popupRef = Popup.popupRef.filter(popup => popup.current !== null);
        if (!this.focus) {
            Popup.popupRef.forEach((popup) => {
                popup.current.changeFocus(false);
            });
            this.changeFocus(true);
        }
        this.startingPos = {x: e.clientX, y: e.clientY};
        document.onmousemove = (e) => {this.dragElement(e)};
        document.onmouseup = () => {this.drapStop()};
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
        CameraStore.setTarget();
    }

    onCatalog() {

    }

    render() {
        let disabled = this.state.focus? '':'disabled';
        let buttonsDisabled = !this.state.focus && !this.state.hovered;

        return (
            <div className={`popup ${disabled}`} style={this.state.draggablePosition} onMouseDown={(e) => this.onDragStart(e)} ref={this.popup}
                 onMouseOver={() => this.setHovered(true)} onMouseLeave={() => this.setHovered(false)}>
                <div className="popup__header">
                    <p>{this.text.question}</p>
                    <a href={this.infosUrl} target="_blank" rel="noopener noreferrer">En savoir plus</a>
                </div>
                <img className="popup__image" src={this.adUrl} alt="promotion"/>
                <button className="popup__footer__buttonClose" disabled={buttonsDisabled} onClick={() => this.onClose()}>{this.text.closeButtonLabel}</button>
                <button className="popup__footer__buttonCatalog" disabled={buttonsDisabled} onClick={() => this.onCatalog()}>{this.text.returnCatalogButtonLabel}</button>
            </div>
        )
    }
});

export default Popup;
