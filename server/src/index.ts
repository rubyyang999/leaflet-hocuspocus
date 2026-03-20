import { Hocuspocus } from '@hocuspocus/server'

const server = new Hocuspocus({
  port: 1234,
  name: 'leaflet-webgis',
})

server.listen()
