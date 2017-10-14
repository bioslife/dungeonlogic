const language = (navigator.languages && navigator.languages[0]) || navigator.language || navigator.userLanguage

var generalInit = {
	lastLevel: +localStorage.getItem("lastLevel") || 1,
	language: language.toLowerCase().split(/[_-]+/)[0]
};

export default function general(state = generalInit, action) {
	switch (action.type) {
		case 'WIN':
			if (action.level == state.lastLevel) {
				localStorage.setItem("lastLevel", +action.level + 1)
				return {
					...state,
					lastLevel: +state.lastLevel + 1
				}
			}
			else {
				return state;
			}
		default:
			return state;
	}
}