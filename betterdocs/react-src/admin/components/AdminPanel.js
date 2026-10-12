import React, { useState, useLayoutEffect, useEffect } from 'react'
import { Router } from 'react-router-dom';

import { history } from '~betterdocs/utils/history';
import Routes from './Routes';

const AdminPanel = () => {
	const [state, setState] = useState({
		action: history.action,
		location: history.location,
	});

	useLayoutEffect(() => history.listen((location, action) => {
		setState({ action, location });
	}), [history]);

    useEffect(() => {
        let instantAnswer = document.getElementsByClassName('betterdocs-ia');

        if (instantAnswer.length === 0) {
            return;
        }

        //related I/A settings preview
        if( ! ( state?.location?.pathname == '/betterdocs-settings' && betterdocsAdminSettings?.values?.enable_disable ) ) { //inverse or negate the condition
            instantAnswer[0].style.display = 'none';
            return;
        }

        //related I/A settings preview
        if( ! ( state?.location?.pathname == '/betterdocs-settings' && betterdocsAdminSettings?.values?.ia_enable_preview ) ) { //inverse or negate the condition
            instantAnswer[0].style.display = 'none';
            return;
        }

        //related I/A settings preview
        instantAnswer[0].style.display = 'block';

    }, [state]);

	return (
        <Router
            location={state.location}
            basename="/"
            navigator={history}
            navigationType={state.action}>
            <Routes />
        </Router>
	)
}

export default AdminPanel
