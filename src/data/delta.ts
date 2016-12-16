import UUID from './uuid'
import Store from './store'
import Mutation from './mutation'
import Dynamic from './dynamic'
import * as Component from 'inferno-component';

export default class Delta {
	private _attempt = 0
	private _host = ''
	private _socket: WebSocket = null
	private _ready = false
	private _pending = new Map<string, Pending>()
	private _pingInterval: any = undefined
	private _bootstrap = new Array<() => void>()

	public store: Store = undefined

	constructor(host) {
		this._host = host
		this.store = new Store()
		this.store.put(["connection", "status"], "unknown")
		this.store.put(["user", "key"], null)
		this._connect()
	}

	private async _connect() {
		this._attempt++
		console.log(`Attempt number ${this._attempt}`)
		await Delta.sleep(Math.min(this._attempt * 1000, 5*1000))
		try {
			this._socket = new WebSocket(this._host)
			this._setup(this._socket)
		} catch(err) {
			this._connect()
		}
	}

	private _setup(ws: WebSocket) {
		ws.onopen = () => {
			this._attempt = 0
			this._socket = ws
			this._pingInterval = setInterval(() => this._ping(), 1000 * 30)
			this._ready = true
			this._bootstrap.forEach(async cb => {
				await cb
			})
			this.store.put(["connection", "status"], "ready")
		}
		ws.onclose = () => {
			this._cleanup()
			this._connect()
		}
		ws.onerror = () => {
			// this._cleanup()
			// this._connect()
		}
		ws.onmessage = event => {
			const cmd: Command = JSON.parse(event.data)
			const match = this._pending.get(cmd.key)
			switch (cmd.action) {
				case 'drs.response':
					match.resolve(cmd.body)
				case 'drs.error':
					match.reject(cmd.body)
				case 'delta.mutation':
					this.store.apply(cmd.body)
			}
		}
	}

	private _cleanup() {
		this.store.put(["connection", "status"], "disconnected")
		this._ready = false
		clearInterval(this._pingInterval)
		this._socket = undefined
	}

	private _ping() {
		this.send('drs.ping')
	}

	public async send(action: string, body: any = {}, version: number = 0) {
		if (!this._ready) {
			await Delta.sleep(1000)
			return this.send(action, body)
		}
		const cmd: Command = {
			key: UUID.ascending(),
			action,
			body,
			version,
		}
		const result = new Promise<any>((resolve, reject) => {
			this._pending.set(cmd.key, {resolve, reject})
		})
		this._socket.send(JSON.stringify(cmd))
		return result
	}

	public static sleep(time: number) {
		return new Promise<number>((resolve) => {
			setTimeout(() => resolve(time), time)
		})
	}

	public mutation(mutation: Mutation) {
		this.store.apply(mutation)
		return this.send(
			'delta.mutation',
			mutation,
			1,
		)
	}

	public async query(query: Object) {
		const result = await this.send(
			'delta.query',
			query,
			1,
		)
		this.store.apply(result)
		return result
	}

	public async query_path(path: Array<string>, opts = {}) {
		return this.query(Dynamic.put({}, path, opts))
	}

	public async upgrade(token: string): Promise<string> {
		const user = await this.send('auth.upgrade', token)
		this.store.put(['user', 'key'], user)
		return user
	}

	public subscribe(): Promise<string> {
		return this.send('delta.subscribe', null, 1)
	}

	public async boostrap(cb: () => void) {
		this._bootstrap.push(cb)
		await cb()
	}


}

interface Pending {
	resolve: any
	reject: any
}

interface Command {
	key: string
	action: string
	body: any
	version: number
}
