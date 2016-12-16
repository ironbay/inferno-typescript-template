import * as createElement from 'inferno-create-element'
import { Router, Route, Link } from 'inferno-router';
import * as History from 'history';
const browserHistory = History.createBrowserHistory()

export const history = browserHistory

import Root from './pages/root'
import ExamplePage from './pages/example-page'

export const routes = (
	<Router history={browserHistory}>
		<Route path='/' component={Root}>
			<Route path='/' component={ExamplePage} />
			<Route path='/:test' component={ExamplePage} />
		</Route>
	</Router>
)
