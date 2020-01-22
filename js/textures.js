
// ====== ====== ====== Textures Module ====== ====== ====== ======
// ================================================================
const textureFileData = [
  {
    offset: 0,
    path: 'textures/spritesheets/cityTiles_sheet.png',
    tools: [0, 1, 2, 6, 8, 10, 12, 14, 16, 17],
    textures: {
      // example: { // section-name
      //   { i: -1, // identifies this tile-texture // note: id numbers are _file-relative_
      //     d: 'description', // quick description of this tile
      //     l: 2, // clockwise-rotate-index
      //     r: 3, // counter-clockwise-rotate-index
      //     u: 260, // horizontal texture coordinate
      //     v: 460 // vertical texture coordinate
      //   }],
      basic: [
	    { i: 0, d: 'Concrete', h: 100, u: 662, v: 202, w: 128 }
      ],
	  park: [
	    { i: 1, d: 'Single-Tree-Contained', h: 115, l: 2, r: 2, u: 399, v: 1800},
	    { i: 2, d: 'NW-Grass-Strip', h: 100, l: 5, r: 3, u: 792, v: 1471},
	    { i: 3, d: 'NE-Grass-Strip', h: 100, l: 2, r: 4, u: 661, v: 1496},
	    { i: 4, d: 'SE-Grass-Strip', h: 100, l: 3, r: 5, u: 795, v: 0},
	    { i: 5, d: 'SW-Grass-Strip', h: 100, l: 4, r: 2, u: 399, v: 454},
		{ i: 6, d: 'NW-SE-Grass-Strip', h: 101, l: 7, r: 7, u: 134, v: 1308},
	    { i: 7, d: 'SW-NE-Grass-Strip', h: 100, l: 6, r: 6, u: 397, v: 1218},
        { i: 8, d: 'NW-SE-Grass-Tree-Strip', h: 112, l: 9, r: 9, u: 398, v: 1003},
	    { i: 9, d: 'SW-NE-Grass-Tree-Strip', h: 112, l: 8, r: 8, u: 661, v: 1383},
	  ],

      transport: [ // in no particular order:
		// i:  0,   1,   2,   3,   4,   5,   6 
		// u:  0, 132, 266, 397, 528, 662, 795
        { i: 10, d: 'NW-SE-Wide-Road', h: 100, l: 11, r: 11, u: 662, v: 101, w: 128 },
        { i: 11, d: 'SW-NE-Wide-Road', h: 100, r: 10, l: 10, u: 528, v: 1923 },
        { i: 12, d: 'NW-SE Road-Crosswalk', h: 100, l: 13, r: 13, u: 795, v: 838 },
        { i: 13, d: 'SW-NE Road-Crosswalk', h: 100, l: 12, r: 12, u: 133, v: 1007 },
        { i: 14, d: 'NW-SE-Tree-Road', h: 122, l: 15, r: 15, u: 530, v: 1032 },
        { i: 15, d: 'SW-NE-Tree-Road', h: 122, l: 14, r: 14, u: 529, v: 202 },
        { i: 16, d: '4-Way-Roundabout', h: 100, u: 399, v: 1116 },
        { i: 17, d: '4-Way-Road', h: 100, u: 266, v: 1511 },
 
		//{ i: 9, d: 'SW-NE Divided Road', h: 130, l: 10, r: 10, u: 1300, v: 0 },
        //{ i: 10, d: 'NW-SE Divided Road', l: 130, r: 9, u: 1430, v: 0 },
		
        // { i: 11, d: 'Large Lit Road: NW-SE', h: 130, l: 12, r: 12, u: 0, v: 142 },
        // { i: 12, d: 'Large Lit Road: SW-NE', h: 130, l: 11, r: 11, u: 260, v: 142 },
        // { i: 13, d: 'Wide Road End: NE', h: 130, l: 14, r: 15, u: 520, v: 142 },
        // { i: 14, d: 'Wide Road End: SE', h: 130, l: 16, r: 13, u: 650, v: 142 },
        // { i: 15, d: 'Wide Road End: NW', h: 130, l: 13, r: 16, u: 780, v: 142 },
        // { i: 16, d: 'Wide Road End: SW', h: 130, l: 15, r: 14, u: 910, v: 142 },
        // { i: 17, d: 'Wide Road-T-Small Road: SE', h: 130, l: 20, r: 19, u: 1040, v: 142 },
        // { i: 18, d: 'Wide Road-T-Small Road: NW', h: 130, l: 19, r: 20, u: 1170, v: 142 },
        // { i: 19, d: 'Wide Road-T-Small Road: NE', h: 130, l: 17, r: 18, u: 1300, v: 142 },
        // { i: 20, d: 'Wide Road-T-Small Road: SW', h: 130, l: 18, r: 17, u: 1430, v: 142 },
        // { i: 21, d: 'Small Road: SW-NE', h: 112, l: 22, r: 22, u: 0, v: 272 },
        // { i: 22, d: 'Small Road: NW-SE', h: 112, l: 21, r: 21, u: 130, v: 272 },
        // { i: 23, d: 'Small Road Corner: NE-SE', h: 112, l: 25, r: 26, u: 260, v: 272 },
        // { i: 24, d: 'Small Road Corner: NW-SW', h: 112, l: 26, r: 25, u: 390, v: 272 },
        // { i: 25, d: 'Small Road Corner: SW-SE', h: 112, l: 24, r: 23, u: 520, v: 272 },
        // { i: 26, d: 'Small Road Corner: NW-NE', h: 112, l: 23, r: 24, u: 650, v: 272 },
        // { i: 27, d: 'Small Road End: NE-SE', h: 112, l: 28, r: 29, u: 780, v: 272 },
        // { i: 28, d: 'Small Road End: NW-SW', h: 112, l: 29, r: 28, u: 910, v: 272 },
        // { i: 29, d: 'Small Road End: SW-SE', h: 112, l: 27, r: 26, u: 1040, v: 272 },
        // { i: 30, d: 'Small Road End: NW-NE', h: 112, l: 26, r: 27, u: 1170, v: 272 },
        // { i: 31, d: 'Level Tunnel Mouth: SW', h: 112, l: 34, r: 33, u: 1300, v: 272 },
        // { i: 32, d: 'Level Tunnel Mouth: NE', h: 112, l: 33, r: 34, u: 1430, v: 272 },
        // { i: 33, d: 'Level Tunnel Mouth: SE', h: 103, l: 31, r: 32, u: 0, v: 382 },
        // { i: 34, d: 'Level Tunnel Mouth: NW', h: 103, l: 32, r: 31, u: 130, v: 382 },
        // { i: 35, d: 'Wide Road: NE-SE', h: 103, l: 38, r: 37, u: 260, v: 382 },
        // { i: 36, d: 'Wide Road: NW-SW', h: 103, l: 37, r: 38, u: 390, v: 382 },
        // { i: 37, d: 'Wide Road: NW-NE', h: 103, l: 35, r: 36, u: 520, v: 382 },
        // { i: 38, d: 'Wide Road: SW-SE', h: 103, l: 36, r: 35, u: 650, v: 382 }
      ]
    }
  }, {
    offset: 40,
    path: 'textures/spritesheets/waters.png',
    tools: [1, 2, 7, 8, 9],
    textures: {
      water: [
        { i: 1, d: 'Basin: NE', h: 115, l: 4, r: 6, u: 130, v: 0 },
        { i: 2, d: 'Basin: SW/NE', h: 115, l: 5, r: 5, u: 260, v: 0 },
        { i: 3, d: 'Basin: SW', h: 115, l: 6, r: 4, u: 390, v: 0 },
        { i: 4, d: 'Basin: SE', h: 115, l: 3, r: 1, u: 520, v: 0 },
        { i: 5, d: 'Basin: NW/SE', h: 115, l: 2, r: 2, u: 650, v: 0 },
        { i: 6, d: 'Basin: NW', h: 115, l: 4, r: 3, u: 780, v: 0 },

        { i: 7, d: 'Solo Fountain', h: 120, l: 7, r: 7, u: 0, v: 114 },

        { i: 8, d: 'Fountain: NE', h: 120, l: 12, r: 14, u: 130, v: 114 },
        { i: 9, d: 'Fountain: SW/NE', h: 120, l: 13, r: 13, u: 260, v: 114 },
        { i: 11, d: 'Fountain: SW', h: 120, l: 14, r: 12, u: 390, v: 114 },
        { i: 12, d: 'Fountain: SE', h: 120, l: 11, r: 8, u: 520, v: 114 },
        { i: 13, d: 'Fountain: NW/SE', h: 120, l: 9, r: 9, u: 650, v: 114 },
        { i: 14, d: 'Fountain: NW', h: 120, l: 8, r: 11, u: 780, v: 114 }
      ]
    }
  }, {
    offset: 55,
    path: 'textures/spritesheets/buildings.png',
    tools: [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29, 31, 33, 35, 37, 39],
    textures: {
      building: [
        { i: 1, d: '3F Brick Building: SW', h: 241, l: 2, r: 2, u: 0, v: 463 },
        { i: 2, d: '3F Brick Building: SE', h: 231, l: 1, r: 1, u: 0, v: 705 },
        { i: 3, d: '4F Brick Building: SE', h: 241, l: 4, r: 4, u: 130, v: 463 },
        { i: 4, d: '4F Brick Building: SW', h: 231, l: 3, r: 3, u: 130, v: 705 },
        { i: 5, d: '3F Plain Gray Building: SE', h: 241, l: 6, r: 6, u: 260, v: 463 },
        { i: 6, d: '3F Plain Gray Building: SW', h: 231, l: 5, r: 5, u: 260, v: 705 },
        { i: 7, d: '4F Plain Gray Building: SE', h: 241, l: 8, r: 8, u: 390, v: 463 },
        { i: 8, d: '4F Plain Gray Building: SW', h: 231, l: 7, r: 7, u: 390, v: 705 },
        { i: 9, d: '3F Peaked Brick Building: SE', h: 241, l: 10, r: 10, u: 520, v: 463 },
        { i: 10, d: '3F Peaked Brick Building: SW', h: 231, l: 9, r: 9, u: 520, v: 705 },
        { i: 11, d: '4F Brick: Blue Awning: SE', h: 241, l: 12, r: 12, u: 650, v: 463, w: 128 },
        { i: 12, d: '4F Brick: Blue Awning: SW', h: 231, l: 11, r: 11, u: 650, v: 705, w: 128 },
        { i: 13, d: '1F Small Box: Green Awning: SE', h: 241, l: 14, r: 14, u: 780, v: 463 },
        { i: 14, d: '1F Small Box: Green Awning: SW', h: 231, l: 13, r: 13, u: 780, v: 705 },
        { i: 15, d: '1F-Brick-Peak-Plain-SE', h: 241, l: 16, r: 16, u: 910, v: 463 },
        { i: 16, d: '1F-Brick-Peak-Plain-SW', h: 231, l: 15, r: 15, u: 910, v: 705 },
        { i: 17, d: '2F-Brick-Peaked-BlueAwning-SE', h: 241, l: 18, r: 18, u: 1040, v: 463 },
        { i: 18, d: '2F-Brick-Peaked-BlueAwning-SW', h: 231, l: 17, r: 17, u: 1040, v: 705 },
        { i: 19, d: '1F-SmallBox-RedAwning-SE', h: 241, l: 20, r: 20, u: 1170, v: 463, w: 128 },
        { i: 20, d: '1F-SmallBox-RedAwning-SW', h: 231, l: 19, r: 19, u: 1170, v: 705, w: 128 },
        { i: 21, d: '3F-Peaked-Brick-OrangeAwning-SE', h: 241, l: 21, r: 21, u: 1300, v: 463 },
        { i: 22, d: '3F-Peaked-Brick-OrangeAwning-SW', h: 231, l: 22, r: 22, u: 1300, v: 705 },
        { i: 23, d: '1F-Peaked-Bricked-WhiteRoof-SE', h: 241, l: 24, r: 24, u: 1430, v: 463 },
        { i: 24, d: '1F-Peaked-Bricked-WhiteRoof-SW', h: 231, l: 23, r: 23, u: 1430, v: 705 },
        { i: 25, d: '2F-Peaked-Brick-SE', h: 241, l: 26, r: 26, u: 1560, v: 463 },
        { i: 26, d: '2F-Peaked-Brick-SW', h: 231, l: 25, r: 25, u: 1560, v: 705 },
        { i: 27, d: '3F-Repeat-Brick-Cement-SE', h: 241, l: 28, r: 28, u: 1690, v: 463 },
        { i: 28, d: '3F-Repeat-Brick-Cement-SW', h: 231, l: 27, r: 27, u: 1690, v: 705 },
        { i: 29, d: '2F-Plain-GreenAwning-SE', h: 241, l: 30, r: 30, u: 1820, v: 463 },
        { i: 30, d: '2F-Plain-GreenAwning-SW', h: 231, l: 29, r: 29, u: 1820, v: 705 },
        { i: 31, d: '3F-Sleek-Glass-SE', h: 241, l: 32, r: 32, u: 1950, v: 463 },
        { i: 32, d: '3F-Sleek-Glass-SW', h: 231, l: 31, r: 31, u: 1950, v: 705 },
        { i: 33, d: '4F-Sleek-Glass-SE', h: 241, l: 34, r: 34, u: 2080, v: 463 },
        { i: 34, d: '4F-Sleek-Glass-SW', h: 231, l: 33, r: 33, u: 2080, v: 705 },
        { i: 35, d: '3F-BrownBrick-SE', h: 241, l: 36, r: 36, u: 2210, v: 463 },
        { i: 36, d: '3F-BrownBrick-SW', h: 231, l: 35, r: 35, u: 2210, v: 705 },
        { i: 37, d: '3F-Sleek-Glass-SE', h: 241, l: 38, r: 38, u: 2340, v: 463 },
        { i: 38, d: '3F-Sleek-Glass-SW', h: 231, l: 37, r: 37, u: 2340, v: 705 },
        { i: 39, d: '1F-Plain-Brick-SE', h: 241, l: 40, r: 40, u: 2470, v: 463 },
        { i: 40, d: '1F-Plain-Brick-SW', h: 231, l: 39, r: 39, u: 2470, v: 705 }
      ]
    }
  }
]