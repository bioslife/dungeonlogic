import React, {Component} from 'react';
import {Link} from 'react-router-dom'
import {connect} from 'react-redux';
import settings from "../../library/settings"
import tr from "../../translations"
import Map from "../../library/map"
import Field from "../../components/Field/Field"

import {loadLevel, clickBlock, setMode, restart} from '../../actions/game';

import style from "./Game.scss"

// Images:
import flask from "./Interface/flask.png"

class Game extends Component {
	keyboard = (e) => {
		if (e.key) {
			var key = e.key;
		} else {
			var code = e.which || e.keyCode;
			var key  = String.fromCharCode(code);
		}
		if (key == "1" || key == "q") {
			this.props.setMode("LIFT")
		}
		else if (key == "2" || key == "w") {
			this.props.setMode("WALK")

		}
		else if (key == "3" || key == "e") {
			this.props.setMode("LOWER")

		}
	}

	render() {
		return (
			<div className="game" tabIndex="-1" onKeyDown={this.keyboard}>
				<div className="game__header">
					<div className="game__status">
						<div className="game__flask">
							<img src={flask} alt=""/>
							<div className="game__flask-count">
								{this.props.game.bottles == "INFINITY" ? "∞" : this.props.game.bottles}
							</div>
						</div>
						<div className="game__level">
							<div className="game__level-number">
								{tr('Level')} {this.props.game.level}
							</div>
							<div className="game__level-name">
								{tr(`Level ${this.props.game.level}`)}
							</div>
							<Link to="/" className="game__main-menu">
								{tr("Return to the main menu")}
							</Link>
						</div>
						<div className="game__restart" onClick={() => this.props.restart()}>
							<svg x="0px" y="0px" width="45px" height="45px" viewBox="0 0 45 45">
								<g>
									<path d="M22.5,0c-0.5,0-0.9,0.4-0.9,0.9c0,0.5,0.4,0.9,0.9,0.9c11.4,0,20.7,9.3,20.7,20.7 c0,11.4-9.3,20.7-20.7,20.7c-11.4,0-20.7-9.3-20.7-20.7C1.8,14.7,6.1,7.7,13,4.1c0.4-0.2,0.6-0.8,0.4-1.2c-0.2-0.4-0.8-0.6-1.2-0.4 C4.7,6.4,0,14.1,0,22.5C0,34.9,10.1,45,22.5,45C34.9,45,45,34.9,45,22.5S34.9,0,22.5,0L22.5,0z M22.5,0"></path>
									<path d="M31.3,10.9c-2.6-1.9-5.6-3-8.8-3c-8,0-14.6,6.5-14.6,14.6s6.5,14.6,14.6,14.6c3.9,0,7.5-1.5,10.3-4.3 c0.4-0.4,0.4-0.9,0-1.3c-0.4-0.4-0.9-0.4-1.3,0c-2.4,2.4-5.6,3.7-9,3.7c-7,0-12.7-5.7-12.7-12.7S15.5,9.8,22.5,9.8 c5.6,0,10.7,3.8,12.2,9.2c0.1,0.5,0.6,0.8,1.1,0.6c0.5-0.1,0.8-0.6,0.6-1.1C35.6,15.5,33.8,12.8,31.3,10.9L31.3,10.9z M31.3,10.9"></path>
									<path d="M33.2,19.7c-0.4-0.4-0.9-0.4-1.3,0c-0.4,0.4-0.4,0.9,0,1.3l3.4,3.4c0.2,0.2,0.4,0.3,0.6,0.3 c0.2,0,0.5-0.1,0.6-0.3l3.4-3.4c0.4-0.4,0.4-0.9,0-1.3c-0.4-0.4-0.9-0.4-1.3,0L36,22.5L33.2,19.7z M33.2,19.7"></path>
								</g>
							</svg>
						</div>
					</div>
				</div>

				<Field clickBlock={this.props.clickBlock} game={this.props.game}/>

				<div className="game__buttons">
					<div title={tr("Lift block hint")} onClick={() => this.props.setMode("LIFT")} className={"game__button game__button--lift " + (this.props.game.mode == 'LIFT' ? 'game__button--active' : '')}>
					</div>
					<div title={tr("Move hint")} onClick={() => this.props.setMode("WALK")} className={"game__button game__button--walk " + (this.props.game.mode == 'WALK' ? 'game__button--active' : '')}>
					</div>
					<div title={tr("Lower block hint")} onClick={() => this.props.setMode("LOWER")} className={"game__button game__button--lower " + (this.props.game.mode == 'LOWER' ? 'game__button--active' : '')}>
					</div>
				</div>
			</div>
		)
	}
}

const mapDispatchToProps = dispatch => {
	return {
		load: (level) => {
			dispatch(loadLevel(level))
		},
		clickBlock: (block) => {
			dispatch(clickBlock(block))
		},
		setMode: (mode) => {
			dispatch(setMode(mode))
		},
		restart: () => {
			dispatch(restart())
		}
	}
}

// Converts the state to object of props:
const mapStateToProps = (state) => ({
	game: state.game
})

export default connect(mapStateToProps, mapDispatchToProps)(Game)