import React, {Component} from "react"
import Map from "../../library/map"
import Block from "../Block/Block"
import style from "./Field.scss"

const defaultState = {
	hovered: undefined,
	transparent: [],
	trodden: []
}

export default class Field extends Component {

	componentWillMount() {
		this.setState(defaultState)
	}

	mouseOver = (obj) => {
		if (this.props.game.turn === "PLAYER") {
			var transparent = [],
			    trodden     = [],
			    hovered     = undefined;

			// Get the elements on the player path
			if (obj.reachable && this.props.game.mode == "WALK") {
				trodden = obj.path;
			}

			if (obj.reachable && this.props.game.mode == "WALK" || obj.allowed) {
				hovered = obj.id;
			}

			// Find the elements, that should be transparent:
			this.props.game.blocks.forEach((el) => {
				if (el.type == "BLOCK") {
					if ((el.z > obj.z) && (
							((obj.x + 1 == el.x) && (obj.y + 1 == el.y)) ||
							((obj.x == el.x) && (obj.y + 1 == el.y)) ||
							((obj.x + 1 == el.x) && (obj.y == el.y)) ||
							((obj.x == el.x) && (obj.y == el.y))
						)) {
						transparent.push(el.id)
					}
				}
			})

			// Update the state

			this.setState({
				hovered: hovered,
				transparent: transparent,
				trodden: trodden
			})


		}
	};

	mouseOut = (obj) => {
		this.setState(defaultState)
	};

	click = (block) => {
		this.props.clickBlock(block)
		this.setState(defaultState)
	};

	render() {
		var stat = {};
		if (this.props.game.blocks) {
			var self    = this;
			var map     = this.props.game.blocks.map(
				function (block, i) {
					const hovered     = (typeof self.state.hovered !== "undefined") && self.state.hovered == block.id,
					      transparent = self.state.transparent.find(id => id === block.id),
					      trodden     = self.state.trodden.find(el => el.id == block.id),
					      style       = Map.style(block);

					if (Map.isBlock(block) && !block.hidden) {
						if ((typeof stat.maxLeft === "undefined") || style.left > stat.maxLeft) {
							stat.maxLeft = style.left;
						}
						if ((typeof stat.minLeft === "undefined") || style.left < stat.minLeft) {
							stat.minLeft = style.left
						}
						if ((typeof stat.maxTop === "undefined") || style.top > stat.maxTop) {
							stat.maxTop = style.top
						}
						if ((typeof stat.minTop === "undefined") || style.top < stat.minTop) {
							stat.minTop = style.top
						}
					}
					return <Block key={i}
					              trodden={trodden}
					              transparent={transparent}
					              hovered={hovered}
					              onClick={self.click}
					              onMouseEnter={self.mouseOver}
					              onMouseLeave={self.mouseOut}
					              block={block}/>
				}
			)
			var mapSize = {
				width: (Math.abs(stat.minLeft) + Math.abs(stat.maxLeft) + 92) + "px",
				height: (Math.abs(stat.minTop) + Math.abs(stat.maxTop) + 92) + "px"
			}
		}
		return (
			<div className="field" style={mapSize}>
				<div className="field__content" style={{top: -stat.minTop + "px", left: -stat.minLeft + "px"}}>
					{map}
				</div>
			</div>
		)
	}

}