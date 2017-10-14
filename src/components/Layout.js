import React from 'react';
import Header from './Header/Header.js'
import style from './Layout.scss'
import DocumentMeta from 'react-document-meta';

import settings from '../library/settings'
import tr from '../translations/index'

const meta = {
	title: 'Dungeon Logic',
	description: tr('Share text'),
	canonical: settings.url,
};

export default function Layout({children}) {
	return (
		<div className="content-wrapper">
			<DocumentMeta {...meta} />
			{children}
		</div>
	);
}
