import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import style from './Header.scss'
import logo from './logo.png'
export default class Header extends Component {
	render() {
		return (
			<div className="header">
				<div className="header__logo">
					<img src={logo} alt=""/>
				</div>
				<div className="header__title">
					Welcome to Reactik
				</div>
				<div className="header__pages">
					<Link className="header__page" to={'/first-page/'}>First page</Link>
					<Link className="header__page" to={'/second-page/'}>Second Page</Link>
				</div>
			</div>
		)
	}
}

