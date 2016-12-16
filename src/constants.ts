export const IS_SECURE = location.protocol === 'https:'
export const WS_PREFIX = IS_SECURE ? 'wss' : 'ws'

export const DELTA_HOST = 'delta.inboxtheapp.com'
export const DELTA_URL = `${WS_PREFIX}://${DELTA_HOST}/socket`
