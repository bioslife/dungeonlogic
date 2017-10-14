import React, {Component} from 'react';
import {Link} from 'react-router-dom'
import tr from "../../translations/index"
import {connect} from 'react-redux';

import style from "./Titles.scss"

import throne from "./Throne.png"

import vk from "./Vk.svg"
import facebook from "./Facebook.svg"
import twitter from "./Twitter.svg"

import github from "./Github.svg"


import russianText from "./Thanks-for-playing-ru.svg"
import englishText from "./Thanks-for-playing.svg"

import settings from '../../library/settings'

import {
	ShareButtons,
	ShareCounts
} from 'react-share';

const {
	      FacebookShareButton,
	      TwitterShareButton,
	      VKShareButton,
      } = ShareButtons;

const {
	      FacebookShareCount,
	      VKShareCount,
	      OKShareCount,
	      RedditShareCount,
      } = ShareCounts;

class Titles extends Component {


	render() {

		if (this.props.language == 'ru') {
			var text = russianText
		}
		else {
			var text = englishText
		}

		return (
			<div className="titles">

				<div><img src={throne} alt=""/></div>

				<div className="page-title">
					<div className="page-title__content">
						<img src={text} alt=""/>
					</div>
					<div className="page-title__caption">
						{tr("End game caption")}
					</div>
				</div>

				<div className="titles__buttons">
					<TwitterShareButton url={settings.url} title={tr("Share text")} hashtags={['game', 'dungeonlogic', 'react', 'redux']} className={"repost-button  hexagon-button"}>
						<img src={twitter} className="repost-button__icon"/>
					</TwitterShareButton>

					<FacebookShareButton url={settings.url} title="Dungeon Logic" description={tr("Share text")} image={settings.url + '/Share.jpg'} picture={settings.url + '/Share.jpg'} sharer="true" className={"repost-button repost-button--with-count hexagon-button"}>
						<img src={facebook} className="repost-button__icon"/>
						<FacebookShareCount className="repost-button__count" url={settings.url}/>
					</FacebookShareButton>

					<VKShareButton url={settings.url} image={settings.url + '/Share.jpg'} title="Dungeon Logic" description={tr("Share text")} className={"repost-button repost-button--with-count hexagon-button"}>
						<img src={vk} className="repost-button__icon"/>
						<VKShareCount className="repost-button__count" url={settings.url}/>
					</VKShareButton>
				</div>

				<Link to="/" className="titles__main-menu">
					{tr("Return to the main menu")}
				</Link>

				<div className="titles__author">
					<div className="titles__small-text">
						{tr("Game is created by Bioslife")}
					</div>
					<a className="titles__email" href="mailto:bioslife@yandex.ru">
						bioslife@yandex.ru
					</a>
				</div>
				<img className="titles__github" src={github} alt=""/>

			</div>
		)
	}
}


// Converts the state to object of props:
const mapStateToProps = (state) => state.general;

export default connect(mapStateToProps)(Titles)