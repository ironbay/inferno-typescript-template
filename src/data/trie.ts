export default class Trie<T> {
	public values = new Array<T>()
	public children = new Map<string, Trie<T>>()
	public label = ''

	constructor(label = '') {
		this.label = label
	}

	add(path: Array<string>, value: T) {
		const [head, ...tail] = path
		if (head === undefined) {
			this.values.push(value)
			return
		}
		const child = this.children.get(head) || new Trie<T>(head)
		this.children.set(head, child)
		child.add(tail, value)
	}

	find(path: Array<string>): Array<T> {
		const [head, ...tail] = path
		if (head === undefined) {
			return this.values
		}

		return [head, '+'].reduce((collect, item) => {
			const match = this.children.get(item)
			if (match)
				return collect.concat(match.find(tail))
			return collect
		}, new Array<T>())

	}
}
