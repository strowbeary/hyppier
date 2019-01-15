import React, {Component} from "react";
import "./_thumbnail.scss";

const Thumbnail = class Thumbnail extends Component {

    render() {
        let selected = this.props.selectedThumbnail === this.props.index? 'selected': '';

        return (<li className="thumbnail__product">
            <div className="thumbnail__productType">
                <p>{this.props.productType}</p>
            </div>
            <div className="thumbnail__productTitle">
                <span>{this.props.productBefore}</span>
                <span> > {this.props.tint.name}</span>
            </div>
            <div className={`thumbnail__wrapper ${selected}`} onClick={() => this.props.onThumbnailClick(this.props.index)}>
                <img src={this.props.tint.name} alt="model" className="thumbnail__promotion__img"/>
            </div>
        </li>)
    }
};

export default Thumbnail;