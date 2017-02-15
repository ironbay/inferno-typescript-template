import './styles.css'
import createElement from 'inferno-create-element'
import Component from 'inferno-component'

import Node from '../../components/node'

interface IProps {
}

const SAMPLE_DATA = {
	hello: "world",
	welcome: {
		to: {
			typescript: "!",
			it: {
				is: "pretty",
				great: "!"
			}
		}
	}
}

export default class ExamplePage extends Component<IProps, any> {
	constructor() {
		super()
		this.state = SAMPLE_DATA
	}
	render() {
		const { state } = this
		return <Node label='state' path={[]} data={state} />
	}
}
