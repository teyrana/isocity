'use strict'

// ====== ====== ====== ====== Rendering Functions ====== ====== ====== ======
// ==================================================================
/* global Tile */
/* global history */
const click = (interfaceLayer, map, event) => {
  const { i, j } = getTileIndex(interfaceLayer, event.offsetX, event.offsetY)

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

  history.replaceState(undefined, undefined, `#${hash}`)
}

const onKeyDown = (interfaceLayer, bank, event) => {
  const keyName = event.key

  if (keyName === '1' || keyName === 'l' || keyName === 'LeftArrow') {
    // rotate tool left
    const oldTexture = bank.tiles[interfaceLayer.activeToolId]
    const newTexture = bank.tiles[oldTexture.left]

    interfaceLayer.activeToolId = newTexture.id
    drawActiveTool(interfaceLayer, bank, newTexture.id)
  } else if (keyName === '2' || keyName === 'r' || keyName === 'RightArrow') {
    // rotate tool left
    const oldTexture = bank.tiles[interfaceLayer.activeToolId]
    const newTexture = bank.tiles[oldTexture.right]

    interfaceLayer.activeToolId = newTexture.id
    drawActiveTool(interfaceLayer, bank, newTexture.id)
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
  y = y - Tile.fullHeight + Tile.baseHeight * 1.5

  // scale differently, to match the skewed isometric perspective
  x = x / Tile.width
  y = y / Tile.baseHeight

  // the i-axis  goes from northeast to southwest
  const i = Math.floor(y - x)

  // the j-axis  goes from northwest to southeast
  const j = Math.floor(x + y)

  return { i, j }
}

const drawTile = (context, i, j, bank, textureStack) => {
  const tile = {
    u: (j - i) * Tile.width / 2 - Tile.width / 2,
    v: (i + j) * Tile.baseHeight / 2
  }

  textureStack.forEach(textureEntry => {
    const { image, height, u, v, width } = bank.textures[textureEntry.id]

    const dest = {
      u: tile.u + textureEntry.u,
      v: tile.v + textureEntry.v
    }

    // calculate draw coordinates for tile: i,j
    // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage
    // void ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
    context.drawImage(
      image, u, v, width, height,
      dest.u, dest.v, width, height
    )
  })
}

const drawMap = (map, bank, canvas) => {
  const context = canvas.getContext('2d')

  context.resetTransform()

  context.clearRect(0, 0, canvas.width, canvas.height)

  context.translate(canvas.width / 2, 0)

  // console.log('>> Drawing map: ')
  for (let i = 0; i < map.dimension; i++) {
    // console.log(`[${i}]  `, map.tiles[i].reduce((a, n) => a + ', ' + n.toString()))
    for (let j = 0; j < map.dimension; j++) {
      const tileId = map.tiles[i][j]
      const tile = bank.tiles[tileId]
      if (typeof tile === 'undefined') {
        map.tiles[i][j] = 0
      }
      drawTile(context, i, j, bank, tile.textures)
    }
  }
}

/* global CanvasRenderingContext2D */
const drawActiveTool = (context, bank, toolId) => {
  if (!(context instanceof CanvasRenderingContext2D)) {
    const canvas = context
    context = canvas.getContext('2d')

    context.resetTransform()
    context.clearRect(0, 0, context.width, context.height)
  }

  const tile = bank.tiles[toolId]

  if (typeof tile === 'undefined' || tile === null) {
    // this is a common case, and happens on startup
    // don't worry... but don't try to draw anything :)
    return
  }

  context.clearRect(0, 0, Tile.width, Tile.fullHeight)
  drawTile(context, -0.5, 0.5, bank, tile.textures)
}

const drawCursor = function (context, i, j) {
  // move to origin
  context.translate(context.canvas.width / 2, Tile.fullHeight - Tile.baseHeight)

  const height = Tile.baseHeight
  const width = Tile.width
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

const onMove = (cityLayer, interfaceLayer, bank, map, event) => {
  if (interfaceLayer.isPlacing) {
    const newEvent = {
      button: interfaceLayer.lastMouseButton,
      offsetX: event.offsetX,
      offsetY: event.offsetY
    }
    click(interfaceLayer, map, newEvent)
    drawMap(map, bank, cityLayer)
  }

  const { i, j } = getTileIndex(cityLayer, event.offsetX, event.offsetY)
  // console.log(`....Hover @ ${i}, ${j}`)
  if (i >= 0 && i < cityLayer.dimension && j >= 0 && j < cityLayer.dimension) {
    interfaceLayer.cursorAt = { i, j }

    const context = interfaceLayer.getContext('2d')

    context.resetTransform()
    context.clearRect(0, 0, interfaceLayer.width, interfaceLayer.height)

    drawActiveTool(context, bank, interfaceLayer.activeToolId)

    context.resetTransform()
    drawCursor(context, i, j)
  }
}

// ====== ====== ====== Map Definition Code ====== ====== ====== ======
// ==================================================================

/* global atob */
/* global btoa */
class Map {
  constructor (n) {
    this.textures = null
    this.tiles = null
    this.dimension = n
    this.size = n * n
    this.tiles = Array(n).fill(Array(n).fill(0))
      .map(i => i.map(j => 0))
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

  // console.log(tex)
  if (!tex) {
    return div
  }

  div.style.backgroundImage = `url(${tex.image.src})`
  div.style.backgroundRepeat = 'no-repeat'
  div.style.backgroundSize = 'auto'

  const { height, u, v, width } = tex
  div.style.backgroundPosition = `-${u}px -${v}px`
  div.style.height = `${height}px`
  div.style.width = `${width}px`

  return div
}

const populateToolbar = (bank, interfaceLayer) => {
  bank.tools.forEach(toolId => {
    // console.log(`... processing tool # '${toolId}'`)

    const tile = bank.tiles[toolId]
    if (!tile) {
      return
    }

    // console.log(`Creating Tool #${tool.id} for:'${tool.description}'  in: '${tool.section}'`)
    // const source = tool.source
    // console.log(`    @ [ ${source.u}, ${source.v}]  =>  [ ${source.width}, ${source.height}]`)

    const container = getToolContainer(tile.section)
    const div = createToolDiv(bank.textures[tile.textures[0].id])

    div.addEventListener('click', _ => {
      interfaceLayer.activeToolId = tile.id
      drawActiveTool(interfaceLayer, bank, tile.id)
    })

    container.appendChild(div)
  })
}

// ====== ====== ====== ====== Main ====== ====== ====== ======
// ============================================================

// not sure where this comes from...
/* global loadTextures */
/* global loadTiles */
(function init () {
  const map = new Map(8)
  const bank = {}

  const cityLayer = document.querySelector('#bg')
  cityLayer.dimension = map.dimension
  // these dimensions are not _exact_ ... but should be a good heuristic :)
  cityLayer.height = map.dimension * Tile.baseHeight + (Tile.fullHeight - Tile.baseHeight)
  cityLayer.width = map.dimension * Tile.width
  console.log(`>> Building canvas: ${cityLayer.width} x ${cityLayer.height}`)

  const interfaceLayer = document.querySelector('#fg')
  interfaceLayer.dimension = map.dimension
  interfaceLayer.width = cityLayer.width
  interfaceLayer.height = cityLayer.height
  interfaceLayer.activeToolId = 0
  interfaceLayer.isPlacing = false

  interfaceLayer.addEventListener('contextmenu', e => e.preventDefault())
  interfaceLayer.addEventListener('mousemove', e => onMove(cityLayer, interfaceLayer, bank, map, e))

  interfaceLayer.addEventListener('mouseup', e => unclick(e, interfaceLayer))
  interfaceLayer.addEventListener('mousedown', e => { click(interfaceLayer, map, e); drawMap(map, bank, cityLayer) })

  // document.addEventListener('keyup', null )
  document.addEventListener('keydown', e => onKeyDown(interfaceLayer, bank, e))

  loadTextures(bank).then(_ => {
    console.log('<< Finished Loading Textures:')
    console.log('>> Loading Tiles:')
    return loadTiles(bank)
  }).then(_ => {
    console.log('<< Finished Loading Tiles.')

    console.log('==== Bank: ====')
    console.log(bank)

    map.load(document.location.hash.substring(1))

    drawMap(map, bank, cityLayer)
    drawActiveTool(interfaceLayer, bank, interfaceLayer.activeToolId)
    populateToolbar(bank, interfaceLayer)

    /* global registerToolHeadings */
    registerToolHeadings()
  }).then(_ => {
    console.log('Collapsing Toolbars...')

    document.querySelector('#terrain-section').querySelector('.section-content').style.display = 'none'
    document.querySelector('#ornament-section').querySelector('.section-content').style.display = 'none'
    document.querySelector('#transport-section').querySelector('.section-content').style.display = 'none'
    // document.querySelector('#building-section').querySelector('.section-content').style.display = 'none'
    document.querySelector('#water-section').querySelector('.section-content').style.display = 'none'
    // document.querySelector('#???????-section').querySelector('.section-content').style.display = 'none'
  })
})()
