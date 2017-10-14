import style from "./Block.scss"
import settings from "../../library/settings"
import React, {Component} from "react"
import Map from "../../library/map"

const classNames = {
	'BLOCK': ['block--first-block', 'block--second-block', 'block--third-block'],
	'COIN': 'block--coin',
	'BOTTLE': 'block--bottle',
	'PLAYER': 'block--player',
	'MONSTER': 'block--monster',
	'EXIT': 'block--exit',
	'EXIT_LOCKED': 'block--exit-locked',
	'NONE': 'block--none',
	'PORTAL': 'block--portal',
	'BOSS': 'block--boss',
	'ARTIFACT': 'block--artifact',
	'GALA_BLOCK': 'block--gala-block',
};

export default class Block extends Component {

	classes() {
		var type      = this.props.block.type,
		    className = "block ";

		if (type === "BLOCK") {
			className += classNames[type][this.props.block.id % 3];
		}
		else {
			className += classNames[type];
		}
		if (this.props.block.hidden) {
			className += " block--hidden";
		}
		if (this.props.block.allowed) {
			className += " block--allowed";
		}
		if (this.props.block.reachable) {
			className += " block--reachable";
		}
		if (this.props.trodden) {
			className += " block--trodden";
		}
		if (this.props.hovered) {
			className += " block--hovered";
		}
		if (this.props.transparent) {
			className += " block--transparent";
		}

		return className
	}

	style() {
		const {x, y, z} = this.props.block,
		      style     = Map.style(this.props.block);

		const commonStyle = {
			'left': style.left + "px",
			'top': style.top + "px",
			'zIndex': style.zIndex
		};

		if (Map.isBlock(this.props.block)) {
			const brightness = Math.max(100 - Math.sqrt(z * 60), 60);
			return {
				'filter': `brightness(${brightness}%)`,
				'WebkitFilter': `brightness(${brightness}%)`,
				...commonStyle
			}
		}
		else {
			return commonStyle
		}

	}

	render() {
		var self = this;
		if (this.props.block.allowed || this.props.block.reachable) {
			var shadow = (
				<div className="block__shadow"
				     onClick={() => self.props.onClick(self.props.block)}
				     onMouseEnter={() => self.props.onMouseEnter(self.props.block)}
				     onMouseLeave={() => self.props.onMouseLeave(self.props.block)}>
				</div>
			)
		}

		return (
			<div style={this.style()} className={this.classes()}>
				{shadow}
			</div>
		)
	}
}