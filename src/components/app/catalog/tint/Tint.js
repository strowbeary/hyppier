import React, {Component} from "react";
import "./_tint.scss";

const Tint = class Tint extends Component {

    render() {
        let selected = this.props.selectedTint === this.props.index? 'selected': '';
        let shiny = this.props.tint.special ? 'shiny': '';

        return (<li className={`tint ${selected} ${shiny}`}
                    style={{backgroundColor: this.props.tint.color}} onClick={() => this.props.onTintClick(this.props.index)}/>)
    }
};

export default Tint;