// ====== ====== ====== Textures Module ====== ====== ====== ======
// This file supplies texture data to main.js
const tileDefinitions = [ // eslint-disable-line no-unused-vars
  {
    offset: 0,
    tools: [0, 1, 2, 3, 4, 5],
    section: 'terrain',
    tiles: [
      { i: 0, t: 0, v: 180 }, // Concrete
      { i: 1, t: 51, v: 181 }, // Lawn
      { i: 2, t: 52, v: 181 }, // Dirt-Thin-Slice
      { i: 3, t: 53, v: 183 }, // Dirt-Thick-Slice
      { i: 4, t: 54, v: 183 }, // Green-Slice
      { i: 5, t: 55, v: 181 } // Sand
    ]
  }, {
    offset: 10,
    tools: [0, 1, 5, 7],
    section: 'ornament',
    tiles: [
      { i: 0, t: 1, u: 1, v: 167 }, // d: 'Single-Tree-Contained
      { i: 1, l: 2, r: 4, t: 2, v: 180 }, // d: 'NW-Grass-Strip
      { i: 2, l: 3, r: 1, t: 3, v: 180 }, // d: 'NE-Grass-Strip
      { i: 3, l: 4, r: 2, t: 4, v: 180 }, // d: 'SE-Grass-Strip
      { i: 4, l: 1, r: 3, t: 5, v: 180 }, // d: 'SW-Grass-Strip
      { i: 5, l: 6, r: 6, t: 6, v: 179 }, // d: 'NW-SE-Grass-Strip
      { i: 6, l: 5, r: 5, t: 7, v: 179 }, // d: 'SW-NE-Grass-Strip
      { i: 7, l: 8, r: 8, t: 8, v: 168 }, // d: 'NW-SE-Grass-Tree-Strip
      { i: 8, l: 7, r: 7, t: 9, v: 168 } // d: 'SW-NE-Grass-Tree-Strip
    ]
  }, {
    offset: 20,
    tools: [0, 1, 5, 9, 13, 17, 21, 25, 27],
    section: 'water',
    tiles: [
      { i: 0, t: 56, v: 197 }, // Water
      { i: 1, l: 2, r: 4, t: 60, v: 181 }, // NW-Beach
      { i: 2, l: 3, r: 1, t: 61, v: 181 }, // NE-Beach
      { i: 3, l: 4, r: 2, t: 62, v: 199 }, // SE-Beach
      { i: 4, l: 1, r: 3, t: 63, v: 197 }, // SW-Beach
      { i: 5, l: 6, r: 8, t: 64, v: 182 }, // N-Elbow-Beach
      { i: 6, l: 7, r: 5, t: 65, v: 182 }, // E-Elbow-Beach
      { i: 7, l: 8, r: 6, t: 66, v: 198 }, // S-Elbow-Beach
      { i: 8, l: 5, r: 7, t: 67, v: 182 }, // W-Elbow-Beach
      { i: 9, l: 10, r: 12, t: 68, v: 182 }, // N-Corner-Beach
      { i: 10, l: 11, r: 9, t: 69, v: 199 }, // E-Corner-Beach
      { i: 11, l: 12, r: 10, t: 70, v: 199 }, // S-Corner-Beach
      { i: 12, l: 9, r: 11, t: 71, v: 198 }, // W-Corner-Beach
      { i: 13, l: 14, r: 16, t: 72, v: 182 }, // NW-Shore
      { i: 14, l: 15, r: 13, t: 73, v: 183 }, // NE-Shore
      { i: 15, l: 16, r: 14, t: 74, v: 199 }, // SE-Shore
      { i: 16, l: 13, r: 15, t: 75, v: 197 }, // SW-Shore
      { i: 17, l: 18, r: 20, t: 76, v: 184 }, // N-Elbow-Shore
      { i: 18, l: 19, r: 17, t: 77, v: 182 }, // E-Elbow-Shore
      { i: 19, l: 20, r: 18, t: 78, v: 199 }, // S-Elbow-Shore
      { i: 20, l: 17, r: 19, t: 79, v: 184 }, // W-Elbow-Shore
      { i: 21, l: 22, r: 24, t: 80, v: 183 }, // N-Corner-Shore
      { i: 22, l: 23, r: 21, t: 81, v: 199 }, // E-Corner-Shore
      { i: 23, l: 24, r: 22, t: 82, v: 199 }, // S-Corner-Shore
      { i: 24, l: 21, r: 23, t: 83, v: 198 }, // W-Corner-Shore
      { i: 25, l: 26, r: 26, t: 84, v: 184 }, // NW-SE-Stream
      { i: 26, l: 25, r: 25, t: 85, v: 183 }, // SW-NE-Stream
      { i: 27, l: 28, r: 30, t: 86, v: 181 }, // S-Stream-Curve
      { i: 28, l: 29, r: 27, t: 87, v: 181 }, // W-Stream-Curve
      { i: 29, l: 30, r: 28, t: 88, v: 181 }, // N-Stream-Curve
      { i: 30, l: 27, r: 29, t: 89, v: 182 } // E-Stream-Curve
    ]
  }, {
    offset: 60,
    tools: [0, 2, 4, 6, 7, 8, 12, 16, 18, 20, 22, 24, 28, 32],
    section: 'transport',
    tiles: [
      { i: 0, l: 1, r: 1, t: 10, v: 180 }, // NW-SE-Wide-Road
      { i: 1, l: 0, r: 0, t: 11, v: 180 }, // SW-NE-Wide-Road
      { i: 2, l: 3, r: 3, t: 12, v: 180 }, // NW-SE Road-Crosswalk
      { i: 3, l: 2, r: 2, t: 13, v: 180 }, // SW-NE Road-Crosswalk
      { i: 4, l: 5, r: 5, t: 14, v: 158 }, // NW-SE-Tree-Road
      { i: 5, l: 4, r: 4, t: 15, v: 158 }, // SW-NE-Tree-Road
      { i: 6, t: 16, v: 180 }, // 4-Way-Roundabout
      { i: 7, t: 17, v: 179 }, // 4-Way-Road
      { i: 8, l: 9, r: 11, t: 18, v: 179 }, // Wide-Road-Corner-E
      { i: 9, l: 10, r: 8, t: 19, v: 181 }, // Wide-Road-Corner-S
      { i: 10, l: 11, r: 9, t: 20, v: 179 }, // Wide-Road-Corner-W
      { i: 11, l: 8, r: 10, t: 21, v: 180 }, // Wide-Road-Corner-N
      { i: 12, l: 15, r: 13, t: 22, v: 180 }, // Wide-Road-T-Section-NW
      { i: 13, l: 12, r: 14, t: 23, v: 180 }, // Wide-Road-T-Section-NE
      { i: 14, l: 13, r: 15, t: 24, v: 180 }, // Wide-Road-T-Section-SE
      { i: 15, l: 14, r: 12, t: 25, v: 180 }, // Wide-Road-T-Section-SW
      { i: 16, l: 17, r: 17, t: 26, v: 180 }, // NW-SE-Blocked-Road
      { i: 17, l: 16, r: 16, t: 27, v: 180 }, // SW-NE-Blocked-Road
      { i: 18, l: 19, r: 19, t: 28, v: 179 }, // NW-SE-Divided-Road
      { i: 19, l: 18, r: 18, t: 29, v: 180 }, // SW-NE-Divided-Road
      { i: 20, l: 21, r: 21, t: 100, v: 182 }, // NW-SE-Grass-Road
      { i: 21, l: 20, r: 20, t: 101, v: 181 }, // SW-NE-Grass-Road
      { i: 22, l: 23, r: 23, t: 102, v: 181 }, // NW-SE-Grass-Median-Road
      { i: 23, l: 22, r: 22, t: 103, v: 181 }, // SW-NE-Grass-Median-Road
      { i: 24, l: 25, r: 27, t: 104, v: 182 }, // N-Grass-Road-Curve
      { i: 25, l: 26, r: 24, t: 105, v: 181 }, // E-Grass-Road-Curve
      { i: 26, l: 27, r: 25, t: 106, v: 181 }, // S-Grass-Road-Curve
      { i: 27, l: 24, r: 26, t: 107, v: 182 }, // W-Grass-Road-Curve
      { i: 28, l: 31, r: 29, t: 108, v: 181 }, // NW-Grass-Road-T-Section
      { i: 29, l: 28, r: 30, t: 109, v: 181 }, // NE-Grass-Road-T-Section
      { i: 30, l: 29, r: 31, t: 110, v: 181 }, // SE-Grass-Road-T-Section
      { i: 31, l: 30, r: 28, t: 111, v: 181 }, // SW-Grass-Road-T-Section
      { i: 32, l: 33, r: 33, t: 112, v: 182 }, // NW-SE-Grass-Stream-Bridge
      { i: 33, l: 32, r: 32, t: 113, v: 183 } // SW-NE-Grass-Stream-Bridge
    ]
  }, {
    offset: 200,
    tools: [1, 5, 6, 10, 13],
    section: 'buildings',
    tiles: [
      { i: 1, l: 2, r: 4, t: 201, v: 153 }, // GF-Red-Stripe-SE
      { i: 2, l: 3, r: 1, t: 202, v: 153 }, // GF-Red-Stripe-SW
      { i: 3, l: 4, r: 2, t: 203, v: 154 }, // GF-Red-Stripe-NW
      { i: 4, l: 1, r: 3, t: 204, v: 154 }, // GF-Red-Stripe-NE
      { i: 5, t: 205, v: 153 }, // GF-Plain-Gray-Box
      { i: 6, l: 7, r: 9, t: 206, v: 154 }, // GF-Brick-Round-Green-Awning-SE
      { i: 7, l: 8, r: 6, t: 207, v: 154 }, // GF-Brick-Round-Green-Awning-SW
      { i: 8, l: 9, r: 7, t: 208, v: 153 }, // GF-Brick-Round-Green-Awning-NW
      { i: 9, l: 6, r: 8, t: 209, v: 153 }, // GF-Brick-Round-Green-Awning-NE

      { i: 10, l: 11, r: 11, t: 210, v: 154 }, // GF-Plain-Glass-Surround-SE
      { i: 11, l: 10, r: 10, t: 211, v: 154 }, // GF-Plain-Glass-Surround-SW
      // { i: 12, l: 10, r: 12 }, // GF-Plain-Glass-Surround-NE

      { i: 13, l: 14, r: 16, t: 214, v: 155 }, // GF-Plain-Gray-Round-RedAwning-SE
      { i: 14, l: 15, r: 13, t: 215, v: 155 }, // GF-Plain-Gray-Round-RedAwning-SW
      { i: 15, l: 16, r: 14, t: 216, v: 154 }, // GF-Plain-Gray-Round-RedAwning-NW
      { i: 16, l: 13, r: 15, t: 217, v: 154 } // GF-Plain-Gray-Round-RedAwning-NE
    ]
  }
]

// ====== ====== ====== Load-Texture Code ====== ====== ====== ======
// ==================================================================

class Tile {
  constructor (entry, section = 'Misc', offset = 0) {
    this.id = entry.i + offset
    this.textures = null
    this.left = entry.l + offset || entry.i
    this.right = entry.r + offset || entry.i
    this.section = section

    if (Array.isArray(entry.t)) {
      this.textures = entry.t
    } else {
      // default values
      this.textures = [{ id: this.id, u: 0, v: Tile.defaultv }]

      if (typeof entry.t === 'number') {
        this.textures[0].id = entry.t
      }
      if (typeof entry.u === 'number') {
        this.textures[0].u = entry.u
      }
      if (typeof entry.v === 'number') {
        this.textures[0].v = entry.v
      }
    }
  }
}
Tile.baseHeight = 66
Tile.defaultv = 150
Tile.fullHeight = 280
Tile.width = 130

function loadTiles (bank) { // eslint-disable-line no-unused-vars
  console.log(`....Loading ${tileDefinitions.length} tile chunks...`)

  bank.tools = []
  bank.tiles = []

  return Promise.all(tileDefinitions.map(sectionChunk => {
    return new Promise((resolve, reject) => {
      let { offset, tools, section, tiles } = sectionChunk
      offset = offset || 0

      console.log(`....>> Loading ${tiles.length} tiles and ${tools.length} tools into ${section}`)

      sectionChunk.tiles.forEach(tileEntry => {
        const tile = new Tile(tileEntry, section, offset)
        // console.log(`........ loading id: ${tileEntry.i} => as: ${tile.id}`,
        //             `    (l: ${tile.left}, r: ${tile.right})`,
        //             `    @ id: ${tile.textures[0].id}, u: ${tile.textures[0].u} v: ${tile.textures[0].v}`)
        bank.tiles[tile.id] = tile
      })

      sectionChunk.tools.forEach(i => { bank.tools.push(i + offset) })
      resolve(sectionChunk)
    }).catch(e => {
      console.log('?? Unexpected error while loading textures')
      console.log(e)
    })
  })).then(_ => {
    return bank
  })
}
