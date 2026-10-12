import { createBrowserHistory } from 'history';
import { parse } from 'qs';
import { addQueryArgs, getQueryArgs } from '@wordpress/url';

export const objectWithoutPropertiesLoose = (source, excluded) => {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0;i < sourceKeys.length;i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
};

let _history;

function getHistory() {
	if (!_history) {
		const path = document.location.pathname;
		const basename = path.substring(0, path.lastIndexOf('/'));
		const browserHistory = createBrowserHistory({
			basename: basename,
		});

		_history = {
			get length() {
				return browserHistory.length;
			},
			get action() {
				return browserHistory.action;
			},
			get location() {
				const { location } = browserHistory;
				const query = parse(location.search.substring(1));
				let pathname = query.page || '/';

				if (!pathname.startsWith('/')) {
					pathname = '/' + pathname;
				}

				return {
					...location,
					actualPathname: path,
					pathname,
				};
			},
			get pathname() {
				return this.location.pathname.substring(1);
			},
			createHref: (...args) =>
				browserHistory.createHref.apply(browserHistory, args),
			push: (...args) => browserHistory.push.apply(browserHistory, args),
			replace: (...args) =>
				browserHistory.replace.apply(browserHistory, args),
			go: (...args) => browserHistory.go.apply(browserHistory, args),
			goBack: (...args) =>
				browserHistory.goBack.apply(browserHistory, args),
			goForward: (...args) =>
				browserHistory.goForward.apply(browserHistory, args),
			block: (...args) =>
				browserHistory.block.apply(browserHistory, args),
			listen(listener) {
				return browserHistory.listen(() => {
					listener(this.location, this.action);
				});
			},
		};
	}
	return _history;
}

const history = getHistory();

export function getQuery() {
	const search = getHistory().location.search;
	if (search.length) {
		return parse(search.substring(1)) || {};
	}
	return {};
}

export const getPath = () => getHistory().location.pathname;

export const makeRouteURL = (page, query = null, ignoreKeys = [], merge_existing_query_params=true) => {
	let queryArgs = getQueryArgs(page);
	const currentQuery = getQuery();

	let args = merge_existing_query_params ? { ...currentQuery, ...queryArgs } : {...queryArgs};

	if (query != null) {
		args = { ...args, ...query };
	}

	if (page !== '/' && !Array.isArray(page)) {
		args.page = page;
	} else if (Array.isArray(page)) {
		args.page = page.join('/');
	}

	if (args.page.startsWith('../')) {
		args.page = args.page.substring('3');
	}

	if (
		currentQuery?.action === 'elementor' ||
		currentQuery?.action === 'edit'
	) {
		ignoreKeys?.push('page');
	}

	if (Boolean(query?.isGutenbergEditor) === true) {
		ignoreKeys?.push('page');
		ignoreKeys?.push('isGutenbergEditor');
	}

	if (args?.platform && args.page?.startsWith(args.platform)) {
		ignoreKeys?.push('platform');
	}

	if (Boolean(query?.closing) === true) {
		ignoreKeys?.push('closing');
	}

	if (page === '') {
		ignoreKeys?.push('path');
	}

	if (ignoreKeys?.length > 0) {
		args = objectWithoutPropertiesLoose(args, ignoreKeys);
	}

	// Keep `page` as the first query param (e.g. ?page=betterdocs-faq&faq_action=create).
	if (args.page !== undefined) {
		args = { page: args.page, ...args };
	}

	return addQueryArgs(getHistory().location.actualPathname, args);
};

export { getHistory, history };
