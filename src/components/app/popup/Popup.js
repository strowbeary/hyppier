import {observer} from "mobx-react";
import React, {Component} from "react";
import "./_popup.scss";

const Popup = observer(class Popup extends Component {

    static popupRef = [];

    static createPopup(question, closeButton, catalogButton) {
        const ref = React.createRef();
        const text = {question, closeButton, catalogButton};
        Popup.popupRef.push(ref);
        return <Popup ref={ref} text={text}/>;
    }

    startingPos = {};
    popup = React.createRef();

    constructor(props) {
        super(props);
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

    render() {
        let disabled = this.state.focus? '':'disabled';
        let buttonsDisabled = !this.state.focus && !this.state.hovered;

        return (
            <div className={`popup ${disabled}`} style={this.state.draggablePosition} onMouseDown={(e) => this.onDragStart(e)} ref={this.popup}
                 onMouseOver={() => this.setHovered(true)} onMouseLeave={() => this.setHovered(false)}>
                <p>{this.props.text.question}</p>
                <img className="popup__image" src="img/catalog/table/promo.png" alt="promotion"/>
                <div className="popup__footer">
                    <button className="popup__footer__buttonClose" disabled={buttonsDisabled}>{this.props.text.closeButton}</button>
                    <button className="popup__footer__buttonCatalog" disabled={buttonsDisabled}>{this.props.text.catalogButton}</button>
                </div>
            </div>
        )
    }
});

export default Popup;