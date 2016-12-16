import * as createElement from 'inferno/dist/inferno-create-element'
import * as Inferno from 'inferno'
import { routes } from './routes'

Inferno.render(routes, document.getElementById('inferno'))
