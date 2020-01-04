"use strict"

const $ = _ => document.querySelector(_)

const $c = _ => document.createElement(_)

let activeToolDiv, activeTexId=0, isPlacing=false;

function click( canvas, map, event ){

    const {i,j} = getTileIndex( canvas, event.offsetX, event.offsetY);
    
    if( 0 > activeTexId ){
        return;
    }

    if( (0 <= i && i < map.size()) && ( 0 <= j && j < map.size()) ){
        if( 3 === event.which ){
            map.tiles[i][j].texture_id = 0;
        }else{
            map.tiles[i][j].texture_id = activeTexId;
        }
        
        isPlacing = true
        drawMap(canvas, map);
    }
    
    const hash = map.save();
    // map.load(document.location.hash.substring(1));
    history.replaceState(undefined, undefined, `#${hash}`); 
    
}

function unclick(e){
    if (isPlacing)
        isPlacing = false    
}

// converts canvas coordinates => tile coordinates
function getTileIndex(canvas, x, y){
    // translate to map origin 0,0
    x = x - canvas.width/2;
    y = y - 130; // yes, it's a magic number.
                 // I dislike it, but I don't understand the logic for it....

    x =  x / TileBase.width;
    y =  y / TileBase.height;

    // the i-axis  goes from northeast to southwest
    const i = Math.floor( y - x );
    
    // the j-axis  goes from northwest to southeast
    const j = Math.floor( x + y );

    return {i,j};
}

const drawImageTile = function( context, i, j, texture){
    let u= (j-i)*TileBase.width/2;
    let v= (i+j)*TileBase.height/2;

    // calculate draw corodinates for tile: i,j
    // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage
    // void ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
    context.drawImage( texture.source.image,
                        texture.source.u, texture.source.v,
                        TileTexture.width, TileTexture.height,
                        u,v,
                        TileTexture.width, TileTexture.height);
}

function drawMap( canvas, map ){
    const context = canvas.getContext("2d");

    context.resetTransform();

    context.clearRect( 0, 0, canvas.width, canvas.height );

    context.translate( canvas.width/2 - TileBase.width/2, 0);

    for(let i = 0; i < map.size(); i++){    
        for(let j = 0; j < map.size(); j++){
            const tile = map.tiles[i][j];
            const texture = map.bank.tiles[tile.texture_id];
            drawImageTile( context, i, j, texture);
        }
    }
}

const drawCursor = function(canvas, i, j, color){
    const context = canvas.getContext("2d");
    context.resetTransform();

    const topBorder = 130;

    context.save()
    context.clearRect( 0, 0, canvas.width, canvas.height);
    context.translate( canvas.width/2, topBorder );
    context.translate(  (j-i)*TileBase.width/2,
                        (i+j)*TileBase.height/2 );
    context.beginPath()
    context.moveTo( 0, 0);
    context.lineTo( TileBase.width/2, TileBase.height/2);
    context.lineTo( 0, TileBase.height);
    context.lineTo(-TileBase.width/2, TileBase.height/2);
    context.closePath()
    context.fillStyle = 'rgba(0,0,0,0.2)';
    context.fill()
    context.restore()
}

const highlight = function(city_layer, ui_layer, map, event){
    if (isPlacing){
        click(city_layer, map, event);
    }

    let {i,j} = getTileIndex(city_layer, event.offsetX, event.offsetY);

    if( (0 <= i && i < map.size()) && ( 0 <= j && j < map.size()) ){
        drawCursor(ui_layer, i, j);
    }
}

// ====== ====== ====== ====== Tile Texture ====== ====== ====== ======
// ==================================================================

// represents an instance of a placed tile
class TileBase {
    constructor(){}
}
TileBase.height = 66;
TileBase.width = 130;
TileBase.edge = Math.sqrt( Math.pow(TileBase.height/2,2) + Math.pow(TileBase.width/2, 2) )

// ====== ====== ====== ====== Map Module ====== ====== ====== ======
// ==================================================================

// data storage to define the city
class Tile {
    constructor( texture_id ) {
        this.texture_id = texture_id;
    }
}

class Map {
    constructor( n ){
        this.tiles = Array(n).fill( Array(n).fill( 0 ))
                    .map( i => i.map( j => new Tile(i,j, null) ));
        this.bank = null;
    }

    size() { 
        return this.tiles.length; 
    }
    
    // From https://stackoverflow.com/a/36046727
    static _ToBase64(u8){
        return btoa(String.fromCharCode.apply(null, u8))
    }

    static _FromBase64(str){
        return atob(str).split('').map( c => c.charCodeAt(0) )
    }

    save() {
        let c = 0
        const u8 = new Uint8Array(this.size()*this.size());
        for(let i = 0; i < this.size(); i++){
            for(let j = 0; j < this.size(); j++){
                u8[c++] = this.tiles[i][j].texture_id;
            }
        }

        return Map._ToBase64(u8);
    }

    load(state) {
        if( ! this.bank ){
            return;
        }

        console.log("::Loading Hash: %s", state);

        const u8 = Map._FromBase64(state);
        let c = 0
        for(let i = 0; i < this.size(); i++) {
            for(let j = 0; j < this.size(); j++) {
                const id = u8[c++] || 0;
                const tile = new Tile( id );
                this.tiles[i][j] = tile;
            }
        }
    }
}

// ====== ====== ====== Textures Module ====== ====== ====== ======
// ================================================================

class TileTexture {
    constructor(texid, image, u, v) {
        this.id = texid;
        this.source = { image, u, v}
    }
}
TileTexture.height = 230;
TileTexture.width = 130;

class TextureBank {
    constructor(){
        this.sources = [];
        this.tiles = [];
    }
    
    async loadTextures(){
        /* texture from https://opengameart.org/content/isometric-landscape */
        const files = [{path: "textures/01_130x66_130x230.png"}];

        const loads = files.map( f => {
            return new Promise(function(resolve, reject) {
                const texture = new Image();
                texture.src = f.path;
                texture.onload = resolve
            })          
        });

        const textures = await Promise.all(loads);
        textures.forEach(event => {
            // console.log("onLoadTexture...");
            this.sources.push(event);
            const image = event.srcElement;
            const columnCount = image.width / TileTexture.width;
            const rowCount = image.height / TileTexture.height;
            
            let next_texture_id = this.tiles.length;
            // load image row-by-row
            for (let j = 0; j < rowCount; ++j) {
                for (let i = 0; i < columnCount; ++i) {
                    let u = i * TileTexture.width;
                    let v = j * TileTexture.height;
                    const tex = new TileTexture(next_texture_id++, image, u, v);
                    this.tiles.push(tex);
                }
            }           
        });
    }
}

// ====== ====== ====== ====== Main ====== ====== ====== ======
// ==================================================================
function populate_toolbar(bank){
    const tools = $('#tools');

    bank.tiles.forEach( tex => {         
        const div = $c('div');
        div.id = `tool_${tex.id}`;
        div.style.display = "block";
            
        /* width of 132 instead of 130  = 130 image + 2 border = 132 */
        // div.style.backgroundPosition = `-${j*130+2}px -${i*230}px`
        div.style.backgroundPosition = `-${tex.source.u}px -${tex.source.v}px`
        div.addEventListener('click', e => {
            if (activeToolDiv){
                $(`#${activeToolDiv}`).classList.remove('selected')
            }
            activeToolDiv = e.target.id;
            activeTexId = tex.id;
            $(`#${activeToolDiv}`).classList.add('selected');
        });
        tools.appendChild( div );
    });

}
    
// "main" / entry point:
const init = function(){

    // let area = $("#area");
    let map = new Map(8);
    
    let city_layer = $("#bg");
    // these dimensions are not _exact_ ... but should be a good heuristic :)
    city_layer.width = map.size() * TileBase.width;
    city_layer.height = map.size() * TileBase.height + TileTexture.height;
    console.log(">> Building canvas: %d x %d ", city_layer.width, city_layer.height );
    
    let bank = new TextureBank();
    
    bank.loadTextures().then( result => {
        map.bank = bank;
        map.load(document.location.hash.substring(1));
        drawMap(city_layer, map);
        
        populate_toolbar(bank);
    });

    let ui_layer = $('#fg')
    ui_layer.width = city_layer.width;
    ui_layer.height = city_layer.height;
        
    ui_layer.addEventListener('contextmenu', e => { e.preventDefault();} )
    ui_layer.addEventListener('mousemove', e => highlight(city_layer, ui_layer, map, e) );
    
    fg.addEventListener('mouseup', e => unclick(e) );
    fg.addEventListener('mousedown', e => {click(city_layer, map, e);} );   

}();
