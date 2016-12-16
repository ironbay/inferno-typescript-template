import * as createElement from 'inferno/dist/inferno-create-element'
import * as Inferno from 'inferno'
import Delta from './data/delta'
import { routes } from './routes'

Inferno.render(routes, document.getElementById('inferno'))
