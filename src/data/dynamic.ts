export default class Dynamic {
	static put(input: Object, path: Array<string>, value) {
		const [head, ...tail] = path
		if (tail.length === 0) {
			input[path[0]] = value
			return input
		}
		const child = input[head] || {}
		input[head] = Dynamic.put(child, tail, value)
		return input
	}

	static delete(input: Object, path: Array<string>) {
		const [head, ...tail] = path
		if (tail.length === 0) {
			delete(input[head])
			return input
		}
		const child = input[head]
		if (child === undefined)
			return input
		return Dynamic.delete(child, tail)
	}


	static get(input: Object, path: Array<string>) {
		const [head, ...tail] = path
		if (head === undefined) {
			return input
		}
		const child = input[head]
		if (child === undefined)
			return null
		return Dynamic.get(child, tail)
	}

	static atoms(input: Object, path = new Array<string>()): Array<Atom> {
		switch (input instanceof Object) {
			case false:
				return []
			case true:
				return Object
					.keys(input)
					.reduce((collect, key) => {
						const value = input[key]
						return collect.concat(Dynamic.atoms(value, [...path, key]))
					}, [
						{
							path,
							value: input,
						}
					])
		}
	}

}

interface Atom {
	path: Array<string>
	value: Object
}
