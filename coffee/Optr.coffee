#? this is zero pointer - fastest
u32 = new Uint32Array new SharedArrayBuffer 256

export class Optr extends Number

    constructor : ->
        unless arguments.length - 1
            return super arguments[0]

        throw [ "OFFSET_POINTER_REQUIRES_BYTEOFFSET" ]

export class Color4 extends Optr



POINTER_LENGTH = 4
BYTES_PER_HEADER = Uint32Array.BYTES_PER_ELEMENT
MALLOC_BYTELENGTH = POINTER_LENGTH * BYTES_PER_HEADER

HINDEX_MALLOCLENGTH = -4
HINDEX_BUFFERLENGTH = -3
HINDEX_PROTOTYPE_ID = -2
HINDEX_PARENT_PTRID = -1

export class Ptri extends Number

### 
          . . . . . . . . > [ -4 ] : @allocated bytes used by inset     
          .
          .   . . . . . . > [ -3 ] : @ui8Length writed on construct
          .   .
          .   .   . . . . > [ -2 ] : @prototype id for re-construct
          .   .   . 
          .   .   .   . . > [ -1 ] : @ptrParent pointer byte offset    
          .   .   .   .
          .   .   .   .    for you
          .   .   .   . 3 empty slot 
        +---+---+---+---+---+---+---+         +---+---+---+---+---+---+---+---+
?       |   |   |   |   |   |   |   |    o    | 0   1   2     . . . . .     N | 
        +---+---+---+---+---+---+---+    .    +---+---+---+---+---+---+---+---+
          H   E   A   D   E   R   S      .    |                               |
                                         .    |                               |
                                         .    '--------- @byteLength ---------'                        
                                         .
                                         . . . . . . . .     
                                                       .
                                    .--- @byteOffset <-'
                                    |    |                
                    .--: negative <--'    '-------------> positive index <------.  
                    |                                                           |
                    |                 REAL BUFFER ALLOCATION MARK               |
                    |                                                           |
                    '-----------------------------------------------------------' 

###

    @byteLength : 0

    constructor : ->
        unless arguments.length

            super headOffset = Atomics.add u32, 0, MALLOC_BYTELENGTH

            # calculate for save green
            ptr = headOffset / BYTES_PER_HEADER

            # if pointer has content
            if  byteLength = @constructor.byteLength

                # allocate data bytes for content
                Atomics.add u32, 0, byteLength

                # pointer has size --> set for re-construction
                Atomics.store u32, HINDEX_BUFFERLENGTH + ptr, byteLength

                # set prototype_id for re-construction
                Atomics.store u32, HINDEX_PROTOTYPE_ID + ptr, @constructor.prototypeId

            # pointer just is a header
            else



console.log test0ptr = new Color4( 4 ) 

