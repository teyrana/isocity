'use strict'

// not sure where this comes from...
/* global history */

// ====== ====== ====== ====== Rendering Functions ====== ====== ====== ======
// ==================================================================

const click = (interfaceLayer, map, event) => {
  const { i, j } = getTileIndex(interfaceLayer, event.offsetX, event.offsetY)
  console.log(event)
  console.log(`onClick:  e: ${event.button}   id: ${interfaceLayer.activeToolId}   if: ${interfaceLayer.isPlacing}`)

  if ((i >= 0 && i < map.dimension) && (j >= 0 && j < map.dimension)) {
    if (event.button === 0) {
      if (interfaceLayer.activeToolId >= 0) { // left-click
        map.tiles[i][j] = interfaceLayer.activeToolId
      }
    } else if (event.button === 2) { // right-click
      map.tiles[i][j] = 0
    }
    interfaceLayer.isPlacing = true
    interfaceLayer.lastMouseButton = event.button
  }

  const hash = map.save()
  // map.load(document.location.hash.substring(1));
  history.replaceState(undefined, undefined, `#${hash}`)
}

const onKeyDown = (interfaceLayer, bank, event) => {
  const keyName = event.key

  if (keyName === '1' || keyName === 'l' || keyName === 'LeftArrow') {
    // rotate tool left
    const oldTexture = bank.tiles[interfaceLayer.activeToolId]
    const newTexture = bank.tiles[oldTexture.left]

    interfaceLayer.activeToolId = newTexture.id
    drawActiveTool(interfaceLayer, newTexture)
  } else if (keyName === '2' || keyName === 'r' || keyName === 'RightArrow') {
    // rotate tool left
    const oldTexture = bank.tiles[interfaceLayer.activeToolId]
    const newTexture = bank.tiles[oldTexture.right]

    interfaceLayer.activeToolId = newTexture.id
    drawActiveTool(interfaceLayer, newTexture)
  }
}

const unclick = (_, interfaceLayer) => {
  if (interfaceLayer.isPlacing) {
    interfaceLayer.isPlacing = false
    interfaceLayer.lastMousButton = -1
  }
}

// converts canvas coordinates => tile coordinates
const getTileIndex = (canvas, x, y) => {
  // translate to map origin 0,0
  x = x - canvas.width / 2
  // yes, it's a magic number.  I dislike it, but I couldn't figure out another way...
  y = y - TileTexture.MaxHeight + TileTexture.Base.height * 1.5

  // scale differently, to match the skewed isometric perspective
  x = x / TileTexture.Base.width
  y = y / TileTexture.Base.height

  // the i-axis  goes from northeast to southwest
  const i = Math.floor(y - x)

  // the j-axis  goes from northwest to southeast
  const j = Math.floor(x + y)

  return { i, j }
}

const drawTile = (context, i, j, texture) => {
  const { source } = texture // destructuring assignment
  const { height, width } = source
  const dest = {
    u: (j - i) * TileTexture.Base.width / 2 - TileTexture.DefaultWidth / 2,
    v: (i + j) * (TileTexture.Base.height) / 2 + (TileTexture.MaxHeight - height)
  }

  // calculate draw coordinates for tile: i,j
  // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage
  // void ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
  context.drawImage(
    source.image, source.u, source.v, height, width,
    dest.u, dest.v, height, width
  )
}

const drawMap = (canvas, map) => {
  const context = canvas.getContext('2d')

  context.resetTransform()

  context.clearRect(0, 0, canvas.width, canvas.height)

  context.translate(canvas.width / 2, 0)

  for (let i = 0; i < map.dimension; i++) {
    for (let j = 0; j < map.dimension; j++) {
      const textureId = map.tiles[i][j]
      const texture = map.bank.tiles[textureId]
      drawTile(context, i, j, texture)
    }
  }
}

/* global CanvasRenderingContext2D */
const drawActiveTool = (context, texture) => {
  if (!(context instanceof CanvasRenderingContext2D)) {
    const canvas = context
    context = canvas.getContext('2d')

    context.resetTransform()
    context.clearRect(0, 0, canvas.width, canvas.height)
  }

  if (typeof texture === 'undefined' || texture === null) {
    // this is a common case, and happens on startup
    // don't worry... but don't try to draw anything :)
    return
  }

  const { source: { image, height, u, v, width } } = texture
  const maxHeight = TileTexture.MaxHeight

  context.clearRect(0, 0, height, width)
  context.translate(0, maxHeight - height)
  context.drawImage(image, u, v, width, height, 0, 0, width, height)
}

const drawCursor = function (context, i, j) {
  const { height, width } = TileTexture.Base

  // move to origin
  context.translate(context.canvas.width / 2,
    height - 5)

  context.translate((j - i) * width / 2, (i + j) * height / 2)

  context.beginPath()
  context.moveTo(0, -height / 2)
  context.lineTo(width / 2, 0)
  context.lineTo(0, height / 2)
  context.lineTo(-width / 2, 0)
  context.closePath()
  context.fillStyle = 'rgba(0,0,0,0.2)'
  context.fill()
}

const onMove = (cityLayer, interfaceLayer, map, event) => {
  console.log('>> onMove:  mouse: ', event.button, '....', interfaceLayer.activeToolId)
  // console.log(event)

  if (interfaceLayer.isPlacing) {
    const newEvent = {
      button: interfaceLayer.lastMouseButton,
      offsetX: event.offsetX,
      offsetY: event.offsetY
    }
    click(interfaceLayer, map, newEvent)
    drawMap(cityLayer, map)
  }

  const { i, j } = getTileIndex(cityLayer, event.offsetX, event.offsetY)
  // console.log(`....Hover @ ${i}, ${j}`)
  if (i >= 0 && i < cityLayer.dimension && j >= 0 && j < cityLayer.dimension) {
    interfaceLayer.cursorAt = { i, j }

    const context = interfaceLayer.getContext('2d')

    context.resetTransform()
    context.clearRect(0, 0, interfaceLayer.width, interfaceLayer.height)

    const texture = map.bank.tiles[interfaceLayer.activeToolId]
    drawActiveTool(context, texture)

    drawCursor(context, i, j)
  }
}

// ====== ====== ====== ====== Map Module ====== ====== ====== ======
// ==================================================================

/* global atob */
/* global btoa */
class Map {
  constructor (n) {
    this.dimension = n
    this.size = n * n
    this.tiles = Array(n).fill(Array(n).fill(0))
      .map(i => i.map(j => 0))
    this.bank = null
  }

  // From https://stackoverflow.com/a/36046727
  static _ToBase64 (u8) {
    return btoa(String.fromCharCode.apply(null, u8))
  }

  static _FromBase64 (str) {
    return atob(str).split('').map(c => c.charCodeAt(0))
  }

  save () {
    let c = 0
    const u8 = new Uint8Array(this.size)
    for (let i = 0; i < this.dimension; i++) {
      for (let j = 0; j < this.dimension; j++) {
        u8[c++] = this.tiles[i][j]
      }
    }

    return Map._ToBase64(u8)
  }

  load (state) {
    if (!this.bank) {
      return
    }

    const u8 = Map._FromBase64(state)
    let c = 0
    for (let i = 0; i < this.dimension; i++) {
      for (let j = 0; j < this.dimension; j++) {
        const id = u8[c++] || 0
        this.tiles[i][j] = id
      }
    }
  }
}

// ====== ====== ====== Textures Module ====== ====== ====== ======
// ================================================================
const textureFileData = [
  {
    offset: 0,
    path: 'textures/roads.png',
    tools: [0, 1, 3, 5, 7, 8, 9, 26, 30],
    textures: {
      // example: { // section-name
      //   { i: -1, // identifies this tile-texture // note: id numbers are _file-relative_
      //     d: 'description', // quick description of this tile
      //     l: 2, // left-rotate-index
      //     r: 3, // right-rotate-index
      //     u: 260, // horizontal texture coordinate
      //     v: 460 // vertical texture coordinate
      //   }],
      basic: [
        { i: 0, d: 'Concrete', h: 130, u: 0, v: 0, w: 128 }
      ],
      transport: [
        { i: 1, d: 'NW-SE Road', h: 130, l: 2, r: 2, u: 260, v: 0, w: 128 },
        { i: 2, d: 'SW-NE Road', h: 130, r: 1, l: 1, u: 390, v: 0 },
        { i: 3, d: 'NW-SE Road Crossing', h: 130, l: 4, r: 4, u: 520, v: 0 },
        { i: 4, d: 'SW-NE Road Crossing', h: 130, l: 3, r: 3, u: 650, v: 0 },
        { i: 5, d: 'NW-SE Tree Road', h: 130, l: 6, r: 6, u: 780, v: 0 },
        { i: 6, d: 'SW-NE Tree Road', h: 130, l: 5, r: 5, u: 910, v: 0 },

        { i: 7, d: '4-Way Roundabout', u: 1040, v: 0 },
        { i: 8, d: '4-Way Road', u: 1170, v: 0 },

        { i: 9, d: 'SW-NE Divided Road', l: 10, r: 10, u: 1300, v: 0 },
        { i: 10, d: 'NW-SE Divided Road', l: 9, r: 9, u: 1430, v: 0 },

        // { u: 0, v: 230 },
        // { u: 130, v: 230 },        // { u: 260, v: 230 },        // { u: 390, v: 230 },
        // { u: 520, v: 230 },        // { u: 650, v: 230 },
        // { u: 780, v: 230 },        // { u: 910, v: 230 },
        // { u: 1040, v: 230 },        // { u: 1170, v: 230 },        // { u: 1300, v: 230 },
        // { u: 1430, v: 230 },        // { u: 0, v: 460 },
        // { u: 130, v: 460 },
        { i: 26, d: 'Small Road: NE-SE', l: 28, r: 29, u: 260, v: 280 },
        { i: 27, d: 'Small Road: NW-SW', l: 29, r: 28, u: 390, v: 280 },
        { i: 28, d: 'Small Road: SW-SE', l: 27, r: 26, u: 520, v: 280 },
        { i: 29, d: 'Small Road: NW-NE', l: 26, r: 27, u: 650, v: 280 },

        // { u: 780, v: 460 },        // { u: 910, v: 460 },        // { u: 1040, v: 460 },
        // { u: 1170, v: 460 },        // { u: 1300, v: 460 },        // { u: 1430, v: 460 },
        // { u: 0, v: 690 },        // { u: 130, v: 690 },

        // big road corners
        { i: 30, d: 'Wide Road: NE-SE', l: 33, r: 32, u: 260, v: 280 },
        { i: 31, d: 'Wide Road: NW-SW', l: 32, r: 33, u: 390, v: 280 },
        { i: 32, d: 'Wide Road: NW-NE', l: 30, r: 31, u: 520, v: 280 },
        { i: 33, d: 'Wide Road: SW-SE', l: 31, r: 30, u: 650, v: 280 }
      ]
    }
  }, {
    offset: 40,
    path: 'textures/dividers.png',
    tools: [1],
    textures: {
      divider: [
        { i: 1, d: 'Low Wall: NE', h: 140, l: 4, r: 2, u: 130, v: 0 },
        { i: 2, d: 'Low Wall: NW', h: 140, l: 1, r: 3, u: 260, v: 0 },
        { i: 3, d: 'Low Wall: SW', h: 140, l: 2, r: 4, u: 390, v: 0 },
        { i: 4, d: 'Low Wall: SE', h: 140, l: 3, r: 1, u: 520, v: 0 }
      ]
    }
  }, {
    offset: 50,
    path: 'textures/water_features.png',
    tools: [1, 2, 7, 8, 9],
    textures: {
      water: [
        { i: 1, d: 'Basin: NE', l: 4, r: 6, u: 130, v: 0 },
        { i: 2, d: 'Basin: SW/NE', l: 5, r: 5, u: 260, v: 0 },
        { i: 3, d: 'Basin: SW', l: 6, r: 4, u: 390, v: 0 },
        { i: 4, d: 'Basin: SE', l: 3, r: 1, u: 520, v: 0 },
        { i: 5, d: 'Basin: NW/SE', l: 2, r: 2, u: 650, v: 0 },
        { i: 6, d: 'Basin: NW', l: 4, r: 3, u: 780, v: 0 },

        { i: 7, d: 'Solo Fountain', l: 7, r: 7, u: 0, v: 130 },

        { i: 8, d: 'Calm Fountain: NE', l: 12, r: 14, u: 130, v: 130 },
        { i: 9, d: 'Calm Fountain: SW/NE', l: 13, r: 13, u: 260, v: 130 },
        { i: 11, d: 'Calm Fountain: SW', l: 14, r: 12, u: 390, v: 130 },
        { i: 12, d: 'Calm Fountain: SE', l: 11, r: 8, u: 520, v: 130 },
        { i: 13, d: 'Calm Fountain: NW/SE', l: 9, r: 9, u: 650, v: 130 },
        { i: 14, d: 'Calm Fountain: NW', l: 8, r: 11, u: 780, v: 130 }
      ]
    }
  }
]

class TileTexture {
  constructor (image, meta) {
    this.id = meta.i
    this.description = meta.d
    this.source = {
      image,
      height: meta.h || TileTexture.DefaultWidth,
      u: meta.u || 0,
      v: meta.v || 0,
      width: meta.w || TileTexture.DefaultWidth
    }
    this.alt = meta.d
    this.left = meta.l || meta.i
    this.right = meta.r || meta.i
    this.section = meta.section || 'Misc'
  }
}
TileTexture.DefaultHeight = 230
TileTexture.DefaultWidth = 130
TileTexture.MaxHeight = 230

TileTexture.Base = (function () {
  const height = 66
  const width = TileTexture.DefaultWidth
  const edge = Math.sqrt(Math.pow(height / 2, 2) + Math.pow(width / 2, 2))
  return { height, width, edge }
}())

/* global Image */
class TextureBank {
  constructor () {
    this.sources = []
    this.tiles = []
    this.tools = []
  }

  async loadTextures () {
    console.log(`Loading ${textureFileData.length} texture files...`)

    const filesToLoad = textureFileData.filter(f => {
      if (f.path === null || typeof f.path === 'undefined') {
        return false
      }
      return f
    })

    return Promise.all(filesToLoad.map(chunkToLoad => {
      return new Promise((resolve, reject) => {
        chunkToLoad.image = new Image()
        chunkToLoad.image.onload = _ => resolve(chunkToLoad)
        chunkToLoad.image.src = chunkToLoad.path
      }).then(chunkToLoad => {
        // if (event.target === null ||
        //   typeof event.target.tools === 'undefined' ||
        //   typeof event.target.textures === 'undefined') {
        //   return
        // }

        chunkToLoad.offset = chunkToLoad.offset || 0

        // console.log(`....Loading ${chunkToLoad.tools.length} tools from source: ${chunkToLoad.path}`)

        // add this image to the list of possible
        this.sources.push(chunkToLoad.image)

        Object.entries(chunkToLoad.textures).forEach(sectionEntry => {
          sectionEntry[1].forEach(metadata => {
            metadata.section = sectionEntry[0]
            const tex = new TileTexture(chunkToLoad.image, metadata)
            tex.id += chunkToLoad.offset
            tex.left += chunkToLoad.offset
            tex.right += chunkToLoad.offset
            // console.log(`........ loading id: ${metadata.i} => as: ${tex.id}`)
            this.tiles[tex.id] = tex
          })
        })

        chunkToLoad.tools.forEach(i => { this.tools.push(i + chunkToLoad.offset) })
      }).catch(e => {
        console.log('?? Unexpected error while loading textures')
        console.log(e)
      })
    }))
  }
}

// ====== ====== ====== ====== ToolBar ====== ====== ====== ======
// ==================================================================
const getToolContainer = name => {
  const lowerName = name.toLowerCase()

  const toolbar = document.querySelector('#tools')

  let section = toolbar.querySelector(`#${lowerName}-section`)

  if (section) {
    return section.querySelector('.section-content')
  } else {
    section = document.createElement('div')
    section.id = `${lowerName}-section`
    section.classList.add('tool-section')
    toolbar.append(section)

    const header = document.createElement('h4')
    header.classList.add('section-header')
    header.appendChild(document.createTextNode(`${name} Tools`))
    section.appendChild(header)

    const content = document.createElement('div')
    content.classList.add('section-content')
    section.appendChild(content)

    return content
  }
}

const createToolDiv = (tex) => {
  const div = document.createElement('div')
  div.classList.add('tile-tool')

  div.id = tex.description.toLowerCase().replace(/ /g, '-').replace(/[/:]/g, '')

  div.style.backgroundImage = `url(${tex.source.image.src})`
  div.style.backgroundRepeat = 'no-repeat'
  div.style.backgroundSize = 'auto'

  const u = tex.source.u
  const v = tex.source.v
  div.style.backgroundPosition = `-${u}px -${v}px`
  div.style.height = `${tex.source.height}px`
  div.style.width = `${tex.source.width}px`

  return div
}

const populateToolbar = (bank, interfaceLayer) => {
  bank.tools.forEach(toolId => {
    // console.log(`... processing tool # '${toolId}'`)

    const tool = bank.tiles[toolId]

    // console.log(`Creating Tool #${tool.id} for:'${tool.description}'  in: '${tool.section}'`)
    // const source = tool.source
    // console.log(`    @ [ ${source.u}, ${source.v}]  =>  [ ${source.width}, ${source.height}]`)

    const container = getToolContainer(tool.section)
    const div = createToolDiv(tool)

    div.addEventListener('click', e => {
      interfaceLayer.activeToolId = tool.id
      drawActiveTool(interfaceLayer, tool)
    })

    container.appendChild(div)
  })
}

// ====== ====== ====== ====== Main ====== ====== ====== ======
// ============================================================
(function init () {
  const map = new Map(8)

  const cityLayer = document.querySelector('#bg')
  cityLayer.dimension = map.dimension
  // these dimensions are not _exact_ ... but should be a good heuristic :)
  cityLayer.height = map.dimension * TileTexture.Base.height + TileTexture.MaxHeight
  cityLayer.width = map.dimension * TileTexture.Base.width
  console.log(`>> Building canvas: ${cityLayer.width} x ${cityLayer.height}`)

  const bank = new TextureBank()

  const interfaceLayer = document.querySelector('#fg')
  interfaceLayer.dimension = map.dimension
  interfaceLayer.width = cityLayer.width
  interfaceLayer.height = cityLayer.height
  interfaceLayer.activeToolId = 0
  interfaceLayer.isPlacing = false

  interfaceLayer.addEventListener('contextmenu', e => e.preventDefault())
  interfaceLayer.addEventListener('mousemove', e => onMove(cityLayer, interfaceLayer, map, e))

  interfaceLayer.addEventListener('mouseup', e => unclick(e, interfaceLayer))
  interfaceLayer.addEventListener('mousedown', e => { click(interfaceLayer, map, e); drawMap(cityLayer, map) })

  // document.addEventListener('keyup', null )
  document.addEventListener('keydown', e => onKeyDown(interfaceLayer, bank, e))

  bank.loadTextures().then(_ => {
    console.log('Finished Loading Textures:')
    console.log(bank)
    map.bank = bank
    map.load(document.location.hash.substring(1))

    drawMap(cityLayer, map)

    populateToolbar(bank, interfaceLayer)

    /* global registerToolHeadings */
    registerToolHeadings()
  })
})()
