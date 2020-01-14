'use strict'

// not sure where this comes from...
/* global history */

const click = (interfaceLayer, map, event) => {
  const { i, j } = getTileIndex(interfaceLayer, event.offsetX, event.offsetY)

  if ((i >= 0 && i < map.dimension) && (j >= 0 && j < map.dimension)) {
    if (event.which === 3) {
      map.tiles[i][j].textureId = 0
    } else if (interfaceLayer.activeToolId >= 0) {
      map.tiles[i][j].textureId = interfaceLayer.activeToolId
    } else {
      return
    }

    interfaceLayer.isPlacing = true
  }

  const hash = map.save()
  // map.load(document.location.hash.substring(1));
  history.replaceState(undefined, undefined, `#${hash}`)
}

const unclick = (_, interfaceLayer) => {
  if (interfaceLayer.isPlacing) {
    interfaceLayer.isPlacing = false
  }
}

// converts canvas coordinates => tile coordinates
const getTileIndex = (canvas, x, y) => {
  // translate to map origin 0,0
  x = x - canvas.width / 2
  // yes, it's a magic number.  I dislike it, but I couldn't figure out another way...
  y = y - 130

  // scale differently, to match the skewed isometric perspective
  x = x / TileBase.width
  y = y / TileBase.height

  // the i-axis  goes from northeast to southwest
  const i = Math.floor(y - x)

  // the j-axis  goes from northwest to southeast
  const j = Math.floor(x + y)

  return { i, j }
}

const drawTile = (context, i, j, texture) => {
  const u = (j - i) * TileBase.width / 2
  const v = (i + j) * TileBase.height / 2
  const du = TileTexture.width
  const dv = TileTexture.height

  // calculate draw coordinates for tile: i,j
  // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage
  // void ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
  context.drawImage(
    texture.source.image,
    texture.source.u, texture.source.v,
    TileTexture.width, TileTexture.height,
    u, v, du, dv
  )
}

const drawMap = (canvas, map) => {
  const context = canvas.getContext('2d')

  context.resetTransform()

  context.clearRect(0, 0, canvas.width, canvas.height)

  context.translate(canvas.width / 2 - TileBase.width / 2, 0)

  for (let i = 0; i < map.dimension; i++) {
    for (let j = 0; j < map.dimension; j++) {
      const tile = map.tiles[i][j]
      const texture = map.bank.tiles[tile.textureId]
      drawTile(context, i, j, texture)
    }
  }
}

const drawActiveTool = (context, texture) => {
  if (typeof texture === 'undefined' || texture === null) {
    // this is a common case, and happens on startup
    // don't worry... but don't try to draw anything :)
    return
  }

  const h = texture.source.h
  const w = texture.source.w
  context.clearRect(0, 0, h, w)
  drawTile(context, 0, 0, texture)
}

const drawCursor = function (context, x0, y0, i, j) {
  y0 = 130 // correction; magic number; bug patch. :/
  context.translate(x0, y0)

  context.translate((j - i) * TileBase.width / 2, (i + j) * TileBase.height / 2)
  context.beginPath()
  context.moveTo(0, 0)
  context.lineTo(TileBase.width / 2, TileBase.height / 2)
  context.lineTo(0, TileBase.height)
  context.lineTo(-TileBase.width / 2, TileBase.height / 2)
  context.closePath()
  context.fillStyle = 'rgba(0,0,0,0.2)'
  context.fill()
}

const onMove = (cityLayer, interfaceLayer, map, event) => {
  if (interfaceLayer.isPlacing) {
    click(interfaceLayer, map, event)
    drawMap(cityLayer, map)
  }

  const { i, j } = getTileIndex(cityLayer, event.offsetX, event.offsetY)
  if (i >= 0 && i < cityLayer.dimension && j >= 0 && j < cityLayer.dimension) {
    interfaceLayer.cursorAt = { i, j }

    const context = interfaceLayer.getContext('2d')

    context.resetTransform()
    context.clearRect(0, 0, interfaceLayer.width, interfaceLayer.height)

    const texture = map.bank.tiles[interfaceLayer.activeToolId]
    drawActiveTool(context, texture)

    drawCursor(context, interfaceLayer.width / 2, 0, i, j)
  }
}

// ====== ====== ====== ====== Tile Texture ====== ====== ====== ======
// ==================================================================

// represents an instance of a placed tile
class TileBase {
  // constructor(){}
}
TileBase.height = 66
TileBase.width = 130
TileBase.edge = Math.sqrt(Math.pow(TileBase.height / 2, 2) + Math.pow(TileBase.width / 2, 2))

// ====== ====== ====== ====== Map Module ====== ====== ====== ======
// ==================================================================

// data storage to define the city
class Tile {
  constructor (textureId) {
    this.textureId = textureId
  }
}

class Map {
  constructor (n) {
    this.dimension = n
    this.size = n * n
    this.tiles = Array(n).fill(Array(n).fill(0))
      .map(i => i.map(j => new Tile(i, j, null)))
    this.bank = null
  }

  // From https://stackoverflow.com/a/36046727
  static _ToBase64 (u8) {
    /* global btoa */
    return btoa(String.fromCharCode.apply(null, u8))
  }

  static _FromBase64 (str) {
    /* global atob */
    return atob(str).split('').map(c => c.charCodeAt(0))
  }

  save () {
    let c = 0
    const u8 = new Uint8Array(this.size)
    for (let i = 0; i < this.dimension; i++) {
      for (let j = 0; j < this.dimension; j++) {
        u8[c++] = this.tiles[i][j].textureId
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
        const tile = new Tile(id)
        this.tiles[i][j] = tile
      }
    }
  }
}

// ====== ====== ====== Textures Module ====== ====== ====== ======
// ================================================================

class TileTexture {
  constructor (image, meta) {
    this.id = meta.i
    this.source = { image, u: meta.u, v: meta.v }
    this.alt = meta.d
    this.left = meta.l
    this.right = meta.r
    this.section = meta.section || 'Misc'
  }
}
TileTexture.height = 230
TileTexture.width = 130

class TextureBank {
  constructor () {
    this.sources = []
    this.tiles = []
  }

  async loadTextures () {
    /* texture from https://opengameart.org/content/isometric-landscape */
    const files = [{
      path: 'textures/01_130x66_130x230.png',
      textures: {
        example: [ // section-name
          {
            i: 1, // identifies this tile-texture // note: id numbers are _file-relative_
            d: 'description', // quick description of this tile
            l: 2, // left-rotate-index
            r: 3, // right-rotate-index
            u: 260, // horizontal texture coordinate
            v: 460 // vertical texture coordinate
          }
        ],
        Plain: [
          { i: 0, d: 'concrete', u: 0, v: 0 }
        ],
        Road: [
          { i: 1, d: 'Northwest Road', l: 2, r: 2, u: 260, v: 0 },
          { i: 2, d: 'Southwest Road', r: 1, l: 1, u: 390, v: 0 },

          // { u: 520, v: 0 },        // { u: 650, v: 0 },
          // { u: 780, v: 0 },        // { u: 910, v: 0 },
          // { u: 1040, v: 0 },        // { u: 1170, v: 0 },
          // { u: 1300, v: 0 },        // { u: 1430, v: 0 },
          // { u: 0, v: 230 },
          // { u: 130, v: 230 },        // { u: 260, v: 230 },        // { u: 390, v: 230 },
          // { u: 520, v: 230 },        // { u: 650, v: 230 },
          // { u: 780, v: 230 },        // { u: 910, v: 230 },
          // { u: 1040, v: 230 },        // { u: 1170, v: 230 },        // { u: 1300, v: 230 },
          // { u: 1430, v: 230 },        // { u: 0, v: 460 },
          // { u: 130, v: 460 },
          { i: 26, d: 'Small Road: NE-SE', l: 28, r: 29, u: 260, v: 460 },
          { i: 27, d: 'Small Road: NW-SW', l: 29, r: 28, u: 390, v: 460 },
          { i: 28, d: 'Small Road: SW-SE', l: 27, r: 26, u: 520, v: 460 },
          { i: 29, d: 'Small Road: NW-NE', l: 26, r: 27, u: 650, v: 460 },
          // { u: 780, v: 460 },        // { u: 910, v: 460 },        // { u: 1040, v: 460 },
          // { u: 1170, v: 460 },        // { u: 1300, v: 460 },        // { u: 1430, v: 460 },
          // { u: 0, v: 690 },        // { u: 130, v: 690 },

          // big road corners
          { i: 30, d: 'Wide Road: XX-XX', l: 30, r: 30, u: 260, v: 690 },
          { i: 31, d: 'Wide Road: XX-XX', l: 30, r: 30, u: 390, v: 690 },
          { i: 32, d: 'Wide Road: XX-XX', l: 30, r: 30, u: 520, v: 690 },
          { i: 33, d: 'Wide Road: XX-XX', l: 30, r: 30, u: 650, v: 690 }
        ],
        Water: [
          // { u: 130, v: 0, alt='fountain'}
        ],
        Wall: [
          { i: 42, d: 'Low Wall: NE', l: 45, r: 43, u: 780, v: 690 },
          { i: 43, d: 'Low Wall: NW', l: 42, r: 44, u: 910, v: 690 },
          { i: 44, d: 'Low Wall: SW', l: 43, r: 45, u: 1040, v: 690 },
          { i: 45, d: 'Low Wall: SE', l: 44, r: 42, u: 1170, v: 690 }
        ]
        // { u: 1300, v: 690 },        // { u: 1430, v: 690 },        // { u: 0, v: 920 },
        // { u: 130, v: 920 },        // { u: 260, v: 920 },        // { u: 390, v: 920 },
        // { u: 520, v: 920 },        // { u: 650, v: 920 },        // { u: 780, v: 920 },
        // { u: 910, v: 920 },        // { u: 1040, v: 920 },        // { u: 1170, v: 920 },
        // { u: 1300, v: 920 },        // { u: 1430, v: 920 },
        // { u: 0, v: 1150 },        // { u: 130, v: 1150 },        // { u: 260, v: 1150 },
        // { u: 390, v: 1150 },
        // { u: 520, v: 1150 },        // { u: 650, v: 1150 },        // { u: 780, v: 1150 },
        // { u: 910, v: 1150 },        // { u: 1040, v: 1150 },        // { u: 1170, v: 1150 },
        // { u: 1300, v: 1150 },        // { u: 1430, v: 1150}
      }
    }]

    const loads = files.map(f => {
      /* global Image */

      return new Promise((resolve, reject) => {
        const image = new Image()
        image.src = f.path
        image.textures = f.textures
        image.onload = resolve
      })
    })

    const textures = await Promise.all(loads)
    textures.forEach(event => {
      this.sources.push(event)
      const image = event.target
      const textures = event.target.textures

      console.log('Loading textures...')

      // load image row-by-row
      let lastTextureId = 0
      Object.entries(textures).forEach(sectionEntry => {
        sectionEntry[1].forEach(metadata => {
          metadata.section = sectionEntry[0]
          const tex = new TileTexture(image, metadata)
          this.tiles[tex.id] = tex
        })
      })
    })
  }
}

// ====== ====== ====== ====== ToolBar ====== ====== ====== ======
// ==================================================================
const getToolContainer = name => {
  const lowerName = name.toLowerCase()
  const sectionId = `${lowerName}-section`
  const contentClass = 'section-content'
  const toolbar = document.querySelector('#tools')

  let section = toolbar.querySelector('#' + sectionId)
  if (section) {
    return section.querySelector('.' + contentClass)
  } else {
    // <div id="lorem-section" class="tool-section">
    section = document.createElement('div')
    section.id = sectionId
    section.classList.add('tool-section')
    toolbar.append(section)

    // <h4> Lorem ipsum dolor sit amet. </h4>
    const header = document.createElement('h4')
    header.classList.add('section-header')
    header.appendChild(document.createTextNode(`${name} Tools`))
    section.appendChild(header)

    // <div class="section-content">
    const content = document.createElement('div')
    content.classList.add(contentClass)
    section.appendChild(content)

    return content
  }
}

const createToolDiv = (tex) => {
  const div = document.createElement('div')
  div.classList.add('tile-tool')

  div.id = `tool_${tex.id}`
  div.style.display = 'block'

  // width of 132 instead of 130  = 130 image + 2 border = 132
  div.style.backgroundPosition = `-${tex.source.u}px -${tex.source.v}px`

  return div
}

const populateToolbar = (bank, interfaceLayer) => {
  bank.tiles.forEach(tex => {
    const container = getToolContainer(tex.section)
    const div = createToolDiv(tex)

    div.addEventListener('click', e => {
      interfaceLayer.activeToolId = tex.id

      const context = interfaceLayer.getContext('2d')
      context.resetTransform()
      context.clearRect(0, 0, interfaceLayer.width, interfaceLayer.height)

      drawActiveTool(context, tex)
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
  cityLayer.height = map.dimension * TileBase.height + TileTexture.height
  cityLayer.width = map.dimension * TileBase.width
  cityLayer.isPlacing = false
  console.log(`>> Building canvas: ${cityLayer.width} x ${cityLayer.height}`)

  const bank = new TextureBank()

  const interfaceLayer = document.querySelector('#fg')
  interfaceLayer.dimension = map.dimension
  interfaceLayer.width = cityLayer.width
  interfaceLayer.height = cityLayer.height
  interfaceLayer.activeToolId = 0

  interfaceLayer.addEventListener('contextmenu', e => e.preventDefault())
  interfaceLayer.addEventListener('mousemove', e => onMove(cityLayer, interfaceLayer, map, e))

  interfaceLayer.addEventListener('mouseup', e => unclick(e, interfaceLayer))
  interfaceLayer.addEventListener('mousedown', e => { click(interfaceLayer, map, e); drawMap(cityLayer, map) })

  bank.loadTextures().then(_ => {
    map.bank = bank
    map.load(document.location.hash.substring(1))
    drawMap(cityLayer, map)

    populateToolbar(bank, interfaceLayer)

    /* global registerToolHeadings */
    registerToolHeadings()
  })
})()
