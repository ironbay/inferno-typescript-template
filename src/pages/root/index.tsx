import './styles.css'
import { DELTA_URL } from '../../constants'
import * as createElement from 'inferno-create-element'
import * as Component from 'inferno-component'
import * as Inferno from 'inferno'
import * as Interceptor from '../../data/interceptors'
import { history } from '../../routes'
import Delta from '../../data/delta'

interface IRootProps {
	children: any
	params: any
}

export default class Root extends Component<IRootProps, any> {
	private _delta: Delta
	constructor() {
		super()
		this.state = {}
	}
	async componentWillMount() {
		const delta = new Delta(DELTA_URL)
		this._delta = delta
		Interceptor.bind(delta)
	}
	componentDidMount() {
		this._delta.store.changed(() => this.forceUpdate())
		this.componentWillReceiveProps(this.props)
	}
	componentWillReceiveProps(next: IRootProps) {
		this._delta.store.put(['url', 'params'], next.params)
	}
	render() {
		const { children, params } = this.props
		if (this._delta.store.get(['connection']) === 'unknown')
			return false
		return (
			<div className='root'>
			{
				Inferno.createVNode(5, children.props.component, {
					history,
					delta: this._delta,
				}, null)
			}
			</div>
		)
	}
}
