import './reset.css'
import './styles.css'
import createElement from 'inferno-create-element'
import Component from 'inferno-component'
import Inferno from 'inferno'
import Container from '../../components/container'

interface IProps {
	children: any
	params: any
}

export default class Root extends Component<IProps, any> {
	constructor() {
		super()
		this.state = {}
	}
	componentWillMount() {
	}
	componentDidMount() {
	}
	componentWillReceiveProps(next: IProps) {
	}
	render() {
		const { children} = this.props
		return (
			<Container className='root'>
				{children}
			</Container>
		)
	}
}
