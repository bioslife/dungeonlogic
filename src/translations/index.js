import locales from "./locales.js"
import {store} from '../store.js'

export default function tr(input) {
	let language = store.getState().general.language,
	    locale   = locales[language] || locales["en"];

	return locale[input] || input

}