import React, {Component} from 'react';
import {Link} from 'react-router-dom'
import {connect} from 'react-redux';

import Logo from './Logo.png'
import style from './Menu.scss'
import Text from './Text.svg'
import tr from '../../translations'

function MenuButton(props) {
	return (
		<Link to={"/level/" + props.level} className={"hexagon-button" + (!props.active ? " hexagon-button--disabled" : "")}>
			{props.level}
		</Link>
	);
}

class Menu extends Component {
	render() {

		return (
			<div className="menu">
				<div>
					<img src={Logo} alt=""/>
				</div>
				<div className="page-title">
					<div className="page-title__content">
						<img src={Text} alt=""/>
					</div>
					<div className="page-title__caption">
						{tr("Collect all coins and move to another level")}
					</div>
				</div>

				<div className="level-selector">
					<div className="level-selector__row">
						<MenuButton level={1} active={this.props.lastLevel >= 1}/>
						<MenuButton level={2} active={this.props.lastLevel >= 2}/>
						<MenuButton level={3} active={this.props.lastLevel >= 3}/>
						<MenuButton level={4} active={this.props.lastLevel >= 4}/>
					</div>
					<div className="level-selector__row">
						<MenuButton level={5} active={this.props.lastLevel >= 5}/>
						<MenuButton level={6} active={this.props.lastLevel >= 6}/>
						<MenuButton level={7} active={this.props.lastLevel >= 7}/>
					</div>
					<div className="level-selector__row">
						<MenuButton level={8} active={this.props.lastLevel >= 8}/>
						<MenuButton level={9} active={this.props.lastLevel >= 9}/>
					</div>
					<div className="level-selector__row">
						<MenuButton level={10} active={this.props.lastLevel >= 10}/>
					</div>
				</div>
			</div>
		)
	}
}


// Converts the state to object of props:
const mapStateToProps = (state) => state.general;


export default connect(mapStateToProps)(Menu)