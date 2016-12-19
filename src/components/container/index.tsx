import './styles.css'
import * as createElement from 'inferno-create-element'
import * as Component from 'inferno-component'

interface IProps {
}

interface IState {

}

export default class Container extends Component<any, IState> {
	constructor() {
		super()
	}
	render() {
		const { direction, stretch, styles, ...rest } = this.props
		const style = {
			display: 'flex',
			direction: direction || 'row',
			flexGrow: stretch,
			...styles,
		}
		return (
			<div {...rest} style={style}>
			</div>
		)
	}
}
