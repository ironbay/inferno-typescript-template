import './styles.css'
import createElement from 'inferno-create-element'
import Component from 'inferno-component'

interface IProps {
	data: Object
	label: string
	path: Array<string>
	onEdit: (path: Array<string>, value: any) => void
}

interface IState {
	hidden: boolean
}

export default class Node extends Component<IProps, IState> {

	constructor() {
		super()
		this.state = {
			hidden: false
		}
	}
	render() {
		const { data, label, path, onEdit } = this.props
		const { hidden } = this.state
		const count = Object.keys(data).length
		return (
			<div className='node'>
				<span onClick={() => this.toggle(hidden)} className='node-label'>"{label}": {'{'}</span>
				{
					!hidden && count > 0 && (
						<div className='node-children'>
							{
								Object.keys(data).map(key => {
									const value = data[key]
									if (value === Object(value))
										return (
											<Node onEdit={onEdit} path={[...path, key]} label={key} data={value} />
										)
									return (
										<div className='node-field'>
											<span className='node-key'>{JSON.stringify(key)}: </span>
											<span
												onClick={() => this.edit([...path, key], value)}
												className={`node-value ${typeof(value)}`}>
												{JSON.stringify(value)}
											</span>
										</div>
									)
								})
							}
						</div>
					)
				}
				{
					hidden && count > 0 && <span>...</span>
				}
				<span>{'}'}</span>
			</div>
		)
	}
	toggle(val: boolean) {
		this.setState({
			hidden: !val,
		})
	}
	edit(path: Array<string>, value: any) {
		const { onEdit } = this.props
		if (!onEdit)
			return
		const next = prompt(`Edit ${path.join('.')}`, value)
		if (!next)
			return
		let parsed = next
		try {
			parsed = JSON.parse(next)
		} catch (e) {
		}
		onEdit(path, parsed)
	}
}
