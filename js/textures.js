// ====== ====== ====== Textures Module ====== ====== ====== ======

// This file supplies texture data to main.js
const textureDefinitions = [ // eslint-disable-line no-unused-vars
  {
    offset: 0,
    path: 'textures/spritesheets/cityTiles_sheet.png',
    textures: [
      // example: { // section-name
      //   { i: -1, // identifies this tile-texture // note: id numbers are _file-relative_
      //     d: 'description', // quick description of this tile
      //     l: 2, // clockwise-rotate-index
      //     r: 3, // counter-clockwise-rotate-index
      //     u: 260, // horizontal texture coordinate
      //     v: 460 // vertical texture coordinate
      //   }],
      { i: 0, h: 100, u: 662, v: 202 }, // Concrete
      { i: 1, h: 113, u: 399, v: 1802 }, // Single-Tree-Contained
      { i: 2, h: 100, u: 793, v: 1471 }, // NW-Grass-Strip
      { i: 3, h: 100, u: 661, v: 1496 }, // NE-Grass-Strip
      { i: 4, h: 100, u: 795, v: 0 }, // SE-Grass-Strip
      { i: 5, h: 100, u: 399, v: 454 }, // SW-Grass-Strip
      { i: 6, h: 101, u: 134, v: 1308 }, // NW-SE-Grass-Strip
      { i: 7, h: 100, u: 397, v: 1218 }, // SW-NE-Grass-Strip
      { i: 8, h: 112, u: 398, v: 1003 }, // NW-SE-Grass-Tree-Strip
      { i: 9, h: 112, u: 661, v: 1383 }, // SW-NE-Grass-Tree-Strip
      { i: 10, h: 100, u: 662, v: 101 }, // NW-SE-Wide-Road
      { i: 11, h: 100, u: 529, v: 1924 }, // SW-NE-Wide-Road
      { i: 12, h: 100, u: 794, v: 838 }, // NW-SE Road-Crosswalk
      { i: 13, h: 100, u: 133, v: 1006 }, // SW-NE Road-Crosswalk
      { i: 14, h: 122, u: 530, v: 1032 }, // NW-SE-Tree-Road
      { i: 15, h: 122, u: 530, v: 202 }, // SW-NE-Tree-Road
      { i: 16, h: 100, u: 398, v: 1116 }, // 4-Way-Roundabout
      { i: 17, h: 101, u: 265, v: 1510 }, // 4-Way-Road
      { i: 18, h: 101, u: 662, v: 866 }, // 'Wide-Road-Corner-E
      { i: 19, h: 99, u: 266, v: 1069 }, // 'Wide-Road-Corner-S
      { i: 20, h: 101, u: 266, v: 1269 }, // Wide-Road-Corner-W
      { i: 21, h: 101, u: 397, v: 1601 }, // Wide-Road-Corner-N
      { i: 22, h: 100, u: 397, v: 1702 }, // Wide-Road-T-Section-NW
      { i: 23, h: 100, u: 266, v: 202 }, // Wide-Road-T-Section-NE
      { i: 24, h: 100, u: 265, v: 1612 }, // Wide-Road-T-Section-SE
      { i: 25, h: 100, u: 133, v: 1612 }, // Wide-Road-T-Section-SW
      { i: 26, h: 100, u: 529, v: 1722 }, // NW-SE-Blocked-Road
      { i: 27, h: 100, u: 529, v: 426 }, // SW-NE-Blocked-Road
      { i: 28, h: 101, u: 133, v: 300 }, // NW-SE-Divided-Road
      { i: 29, h: 100, u: 0, v: 1641 } // SW-NE-Divided-Road
    ]
  }, {
    offset: 50,
    path: 'textures/spritesheets/landscapeTiles_sheet.png',
    textures: [
      // column: i:  0,   1,   2,   3,   4,   5,   6
      // pixels: u:  0, 132, 266, 398, 529, 662, 795
      { i: 1, h: 99, u: 398, v: 264 }, // Lawn
      { i: 2, h: 84, u: 397, v: 1745 }, // Dirt-Thin-Slice
      { i: 3, h: 100, u: 266, v: 723 }, // Dirt-Thick-Slice
      { i: 4, h: 99, u: 397, v: 1548 }, // Green-Slice
      { i: 5, h: 99, u: 529, v: 1010 }, // Sand
      { i: 6, h: 83, u: 398, v: 363 }, // Water
      { i: 10, h: 98, u: 0, v: 1552 }, // NW-Beach
      { i: 11, h: 99, u: 1, v: 1948 }, // NE-Beach
      { i: 12, h: 83, u: 662, v: 1270 }, // SE-Beach
      { i: 13, h: 84, u: 134, v: 198 }, // SW-Beach
      { i: 14, h: 100, u: 134, v: 0 }, // N-Elbow-Beach
      { i: 15, h: 100, u: 1, v: 578 }, // E-Elbow-Beach
      { i: 16, h: 83, u: 1, v: 678 }, // S-Elbow-Beach
      { i: 17, h: 100, u: 0, v: 479 }, // W-Elbow-Beach
      { i: 18, h: 100, u: 398, v: 166 }, // N-Corner-Beach
      { i: 19, h: 83, u: 398, v: 927 }, // E-Corner-Beach
      { i: 20, h: 83, u: 529, v: 1586 }, // S-Corner-Beach
      { i: 21, h: 84, u: 398, v: 843 }, // W-Corner-Beach
      { i: 22, h: 100, u: 529, v: 1834 }, // NW-Shore
      { i: 23, h: 99, u: 530, v: 462 }, // NE-Shore
      { i: 24, h: 83, u: 529, v: 1752 }, // SE-Shore
      { i: 25, h: 85, u: 529, v: 1107 }, // SW-Shore
      { i: 26, h: 98, u: 530, v: 1391 }, // N-Elbow-Shore
      { i: 27, h: 100, u: 1, v: 958 }, // E-Elbow-Shore
      { i: 28, h: 83, u: 399, v: 1 }, // S-Elbow-Shore
      { i: 29, h: 98, u: 398, v: 746 }, // W-Elbow-Shore
      { i: 30, h: 99, u: 662, v: 1452 }, // N-Corner-Shore
      { i: 31, h: 83, u: 398, v: 1465 }, // E-Corner-Shore
      { i: 32, h: 83, u: 399, v: 84 }, // S-Corner-Shore
      { i: 33, h: 84, u: 794, v: 1402 }, // W-Corner-Shore
      { i: 34, h: 96, u: 0, v: 1257 }, // NW-SE-Stream
      { i: 35, h: 97, u: 0, v: 1058 }, // SW-NE-Stream
      { i: 36, h: 99, u: 0, v: 1155 }, // S-Stream-Curve
      { i: 37, h: 99, u: 0, v: 181 }, // W-Stream-Curve
      { i: 38, h: 99, u: 0, v: 1650 }, // N-Stream-Curve
      { i: 39, h: 98, u: 133, v: 760 }, // E-Stream-Curve
      { i: 50, h: 98, u: 397, v: 1646 }, // NW-SE-Grass-Road
      { i: 51, h: 99, u: 662, v: 98 }, // SW-NE-Grass-Road
      { i: 52, h: 99, u: 134, v: 858 }, // NW-SE-Grass-Median-Road
      { i: 53, h: 99, u: 134, v: 561 }, // SW-NE-Grass-Median-Road
      { i: 54, h: 98, u: 265, v: 1139 }, // N-Grass-Road-Curve
      { i: 55, h: 99, u: 397, v: 1265 }, // E-Grass-Road-Curve
      { i: 56, h: 98, u: 266, v: 197 }, // S-Grass-Road-Curve
      { i: 57, h: 98, u: 397, v: 1365 }, // W-Grass-Road-Curve
      { i: 58, h: 99, u: 529, v: 559, w: 133 }, // NW-Grass-Road-T-Section
      { i: 59, h: 99, u: 266, v: 623 }, // NE-Grass-Road-T-Section
      { i: 60, h: 99, u: 399, v: 545 }, // SE-Grass-Road-T-Section
      { i: 61, h: 98, u: 398, v: 645 }, // SW-Grass-Road-T-Section
      { i: 62, h: 98, u: 661, v: 1649 }, // NW-SE-Grass-Stream-Bridge
      { i: 63, h: 97, u: 663, v: 396 } // SW-NE-Grass-Stream-Bridge
    ]
  }, {
    offset: 200,
    path: 'textures/spritesheets/buildingTiles_sheet.png',
    textures: [
      // column:    0,   1,   2,   3,   4,   5,   6
      // pixels(u): 0, 132, 266, 398, 529, 600, 795
      // row:       0,   1,   2,   3,   4,   5,   6,   7,    8,    9,   10,   11,   12,   13,   14,   15,
      // pixels(v)  0, 128,    , 382, 512, 639,                 1145,             1523, 1650, 1787, 1900
      //                    256                 768, 896, 1024,       1260, 1390,
      { i: 1, h: 128, u: 0, v: 1650 }, // GF-Red-Stripe-SE
      { i: 2, h: 128, u: 0, v: 1523 }, // GF-Red-Stripe-SW
      { i: 3, h: 126, u: 0, v: 1143 }, // GF-Red-Stripe-NW
      { i: 4, h: 126, u: 0, v: 0 }, // GF-Red-Stripe-NE
      { i: 5, h: 128, u: 1, v: 126 }, // GF-Plain-Gray-Box
      { i: 6, h: 126, u: 133, v: 128 }, // GF-Brick-Round-Green-Awning-SE
      { i: 7, h: 126, u: 265, v: 639 }, // GF-Brick-Round-Green-Awning-SW
      { i: 8, h: 126, u: 132, v: 0 }, // GF-Brick-Round-Green-Awning-NW
      { i: 9, h: 127, u: 265, v: 1020 }, // GF-Brick-Round-Green-Awning-NE
      { i: 10, h: 126, u: 265, v: 0 }, // GF-Plain-Glass-Surround-SE
      { i: 11, h: 126, u: 132, v: 512 }, // GF-Plain-Glass-Surround-SW
      { i: 12, h: 85, u: 595, v: 1640 }, // NF-Plain-Glass-Surround

      // { i: 13, h: 126, u: 0, v: 1056 }, // GF-Plain-Glass-Surround-NE

      { i: 14, h: 125, u: 396, v: 1787 }, // GF-Plain-Gray-Round-Red-Awning-SE
      { i: 15, h: 124, u: 266, v: 128 }, // GF-Plain-Gray-Round-Red-Awning-SW
      { i: 16, h: 126, u: 132, v: 1148 }, // GF-Plain-Gray-Round-Red-Awning-NW
      { i: 17, h: 126, u: 266, v: 382 }, // GF-Plain-Gray-Round-Red-Awning-NE

      { i: 20, h: 87, u: 596, v: 362 } // NF-Tan-Frame-Glass-Surround
    ]
  }
]

// ====== ====== ====== Load-Texture Code ====== ====== ====== ======
// ================================================================

class TileTexture {
  constructor (fileEntry, textureEntry) {
    this.id = textureEntry.i
    this.image = fileEntry.image
    this.height = textureEntry.h || TileTexture.defaultHeight
    this.u = textureEntry.u || 0
    this.v = textureEntry.v || 0
    this.width = textureEntry.w || TileTexture.defaultWidth
  }
}
TileTexture.defaultHeight = 230
TileTexture.defaultWidth = 130

function loadTextures (bank) { // eslint-disable-line no-unused-vars
  console.log(`....Loading ${textureDefinitions.length} texture files...`)

  bank.sources = []
  bank.textures = []

  const filesToLoad = textureDefinitions.filter(f => {
    if (f.path === null || typeof f.path === 'undefined') {
      return false
    }
    return f
  })

  return Promise.all(filesToLoad.map(fileEntry => {
    return new Promise((resolve, reject) => {
      /* global Image */
      fileEntry.image = new Image()
      fileEntry.image.onload = _ => resolve(fileEntry)
      fileEntry.image.src = fileEntry.path
    }).then(fileEntry => {
      fileEntry.offset = fileEntry.offset || 0

      // console.log(`........Loading ${fileEntry.textures.length} textures from source: ${fileEntry.path}`)

      // add this image to the list of possible
      bank.sources.push(fileEntry.image)

      fileEntry.textures.forEach(textureEntry => {
        const tex = new TileTexture(fileEntry, textureEntry)
        tex.id += fileEntry.offset
        // console.log(`............ loading id: ${textureEntry.i} => as: ${tex.id}`)
        bank.textures[tex.id] = tex
      })
    }).catch(e => {
      console.log('?? Unexpected error while loading textures')
      console.log(e)
    })
  }))
}
