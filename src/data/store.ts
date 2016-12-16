import * as Component from 'inferno-component'
import Dynamic from './dynamic'
import Mutation from './mutation'
import Trie from './trie'

export default class Store {
	private _data = {}
	private _interceptors = new Trie<Interceptor>()
	private _changed: () => void

	constructor() {
	}

	public get(path: Array<string>) {
		return Dynamic.get(this._data, path)
	}

	public put(path: Array<string>, value) {
		return this.apply(Dynamic.put({}, ["$merge", ...path], value))
	}

	public apply(mut: Mutation) {
		this.delete(this._data, mut.$delete || {})
		this.merge(this._data, mut.$merge || {})
		if (this._changed)
			this._changed()
		console.log(this._data)
	}

	private merge(left: Object, right: Object, ...path: Array<string>) {
		this._interceptors.find(path).forEach(cb => cb(right, path))
		for (let key in right) {
			const value = right[key]
			if (value && value.constructor && value.constructor === Object) {
				left[key] = left[key] || {}
				this.merge(left[key], value, ...path, key)
				continue
			}
			left[key] = value
		}
	}

	private delete(left: Object, right: Object, ...path: Array<string>) {
		for (let key in right) {
			const value = right[key]
			if (value !== 1) {
				left[key] = left[key] || {}
				this.delete(left[key], value, ...path, key)
				continue
			}
			delete(left[key])
		}
	}

	public intercept(path: Array<string>, callback: Interceptor) {
		this._interceptors.add(path, callback)
	}

	public changed(callback: () => void) {
		this._changed = callback
	}

}

type Interceptor = (data:any, path:Array<string>) => void
