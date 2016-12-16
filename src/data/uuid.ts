const ASC_CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz'
const DESCENDING_CHARS = ASC_CHARS.split('').reverse().join('')

export default class UUID {
	static now(): number {
		return new Date().getTime()
	}
	static ascending(): string {
		return UUID.generate(UUID.now(), ASC_CHARS)
	}

	static descending(): string {
		return UUID.generate(UUID.now(), DESCENDING_CHARS)
	}

	static generate(time, pool): string {
		const length = pool.length
		let now = time

		const result = new Array(20)

		// Time Part
		for (let i = 7; i >= 0; i--) {
			result[i] = pool.charAt(now % length)
			now = Math.floor(now / length)
		}

		// Random Part
		for (let i = 8; i < 20; i ++) {
			const random = Math.floor(Math.random() * length)
			result[i] = pool.charAt(random)
		}

		return result.join('')
	}
}
