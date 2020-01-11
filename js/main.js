'use strict'

const $ = _ => document.querySelector(_)

const $c = _ => document.createElement(_)

let activeToolDiv = null
let activeTexId = 0
let isPlacing = false

// not sure where this comes from...
/* global history */

const click = (canvas, map, event) => {
  const { i, j } = getTileIndex(canvas, event.offsetX, event.offsetY)

  if (activeTexId < 0) {
    return
  }

  if ((i >= 0 && i < map.dimension) && (j >= 0 && j < map.dimension)) {
    if (event.which === 3) {
      map.tiles[i][j].textureId = 0
    } else {
      map.tiles[i][j].textureId = activeTexId
    }

    isPlacing = true
    drawMap(canvas, map)
  }

  const hash = map.save()
  // map.load(document.location.hash.substring(1));
  history.replaceState(undefined, undefined, `#${hash}`)
}

const unclick = e => {
  if (isPlacing) {
    isPlacing = false
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

const drawImageTile = (context, i, j, texture) => {
  const u = (j - i) * TileBase.width / 2
  const v = (i + j) * TileBase.height / 2

  // calculate draw coordinates for tile: i,j
  // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage
  // void ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
  context.drawImage(
    texture.source.image,
    texture.source.u, texture.source.v,
    TileTexture.width, TileTexture.height,
    u, v,
    TileTexture.width, TileTexture.height
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
      drawImageTile(context, i, j, texture)
    }
  }
}

const drawCursor = (canvas, i, j) => {
  const context = canvas.getContext('2d')
  context.resetTransform()

  const topBorder = 130

  context.save()
  context.clearRect(0, 0, canvas.width, canvas.height)
  context.translate(canvas.width / 2, topBorder)
  context.translate((j - i) * TileBase.width / 2, (i + j) * TileBase.height / 2)
  context.beginPath()
  context.moveTo(0, 0)
  context.lineTo(TileBase.width / 2, TileBase.height / 2)
  context.lineTo(0, TileBase.height)
  context.lineTo(-TileBase.width / 2, TileBase.height / 2)
  context.closePath()
  context.fillStyle = 'rgba(0,0,0,0.2)'
  context.fill()
  context.restore()
}

const highlight = (cityLayer, interfaceLayer, map, event) => {
  if (isPlacing) {
    click(cityLayer, map, event)
  }

  const { i, j } = getTileIndex(cityLayer, event.offsetX, event.offsetY)

  if ((i >= 0 && i < map.dimension) && (j >= 0 && j < map.dimension)) {
    drawCursor(interfaceLayer, i, j)
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

    console.log('::Loading Hash: %s ', state)

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
  constructor (texid, image, u, v) {
    this.id = texid
    this.source = { image, u, v }
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
    const files = [{ path: 'textures/01_130x66_130x230.png' }]

    const loads = files.map(f => {
      /* global Image */

      return new Promise((resolve, reject) => {
        const texture = new Image()
        texture.src = f.path
        texture.onload = resolve
      })
    })

    const textures = await Promise.all(loads)
    textures.forEach(event => {
      // console.log("onLoadTexture...");
      this.sources.push(event)
      const image = event.srcElement
      const columnCount = image.width / TileTexture.width
      const rowCount = image.height / TileTexture.height

      // load image row-by-row
      let nextTextureId = this.tiles.length
      for (let j = 0; j < rowCount; ++j) {
        for (let i = 0; i < columnCount; ++i) {
          const u = i * TileTexture.width
          const v = j * TileTexture.height
          const tex = new TileTexture(nextTextureId++, image, u, v)
          this.tiles.push(tex)
        }
      }
    })
  }
}

// ====== ====== ====== ====== Main ====== ====== ====== ======
// ==================================================================
const populateToolbar = (bank) => {
  const tools = $('#tools')

  bank.tiles.forEach(tex => {
    const div = $c('div')
    div.id = `tool_${tex.id}`
    div.style.display = 'block'

    // width of 132 instead of 130  = 130 image + 2 border = 132
    // div.style.backgroundPosition = `-${j*130+2}px -${i*230}px`
    div.style.backgroundPosition = `-${tex.source.u}px -${tex.source.v}px`
    div.addEventListener('click', e => {
      if (activeToolDiv) {
        $(`#${activeToolDiv}`).classList.remove('selected')
      }
      activeToolDiv = e.target.id
      activeTexId = tex.id
      $(`#${activeToolDiv}`).classList.add('selected')
    })
    tools.appendChild(div)
  })
}

// "main" / entry point:
(function init () {
  // let area = $('#area')
  const map = new Map(8)

  const cityLayer = $('#bg')
  // these dimensions are not _exact_ ... but should be a good heuristic :)
  cityLayer.width = map.dimension * TileBase.width
  cityLayer.height = map.dimension * TileBase.height + TileTexture.height
  console.log('>> Building canvas: %d x %d', cityLayer.width, cityLayer.height)

  const bank = new TextureBank()

  bank.loadTextures().then(_ => {
    map.bank = bank
    map.load(document.location.hash.substring(1))
    drawMap(cityLayer, map)

    populateToolbar(bank)
  })

  const interfaceLayer = $('#fg')
  interfaceLayer.width = cityLayer.width
  interfaceLayer.height = cityLayer.height

  interfaceLayer.addEventListener('contextmenu', e => e.preventDefault())
  interfaceLayer.addEventListener('mousemove', e => highlight(cityLayer, interfaceLayer, map, e))

  interfaceLayer.addEventListener('mouseup', e => unclick(e))
  interfaceLayer.addEventListener('mousedown', e => click(cityLayer, map, e))
})()
