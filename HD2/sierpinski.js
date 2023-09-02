"use strict";

var canvas;
var gl;

var points = [];

var NumTimesToSubdivide = 2;

window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

 
    var square = [
        [-1, -1],
        [-1,  1],
        [1, 1],
        [1, -1 ]
    ];

    divide( square, NumTimesToSubdivide);

    //
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 0.0, 0.0, 1.0 );

    //  Load shaders and initialize attribute buffers

    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // Load the data into the GPU

    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    // Associate out shader variables with our data buffer

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    render();
};

// Two triangles make a square in the middle to be drawn later
function squareMid( f )
{
    var triangle1 = [
        vec2(f[0][0]/3, f[0][1]/3),
        vec2(f[1][0]/3, f[1][1]/3),
        vec2(f[2][0]/3, f[2][1]/3)
    ]
    var triangle2 = [
        vec2(f[0][0]/3, f[0][1]/3),
        vec2(f[2][0]/3, f[2][1]/3),
        vec2(f[3][0]/3, f[3][1]/3)
    ]
    points.push(triangle1[0], triangle1[1], triangle1[2], triangle2[0], triangle2[1], triangle2[2]);
}

function divide( square, count )
{

    if ( count > 0 ) {
        squareMid(square);
        count--;
        
        var subSquares = [
            // topleft
            [
                [square[1][0], square[1][1]/3],
                [square[1][0], square[1][1]],
                [square[1][0]/3, square[1][1]],
                [square[1][0]/3, square[1][1]/3]
            ],
            // topmid
            [
                [square[1][0]/3, square[1][1]/3],
                [square[1][0]/3, square[1][1]],
                [square[2][0]/3, square[2][1]],
                [square[2][0]/3, square[2][1]/3]
            ],
            // topright
            [
                [square[2][0]/3, square[2][1]/3],
                [square[2][0]/3, square[2][1]],
                [square[2][0], square[2][1]],
                [square[2][0], square[2][1]/3]
            ],
            // left
            [
                [square[0][0], square[0][1]/3],
                [square[1][0], square[1][1]/3],
                [square[1][0]/3, square[1][1]/3],
                [square[0][0]/3, square[0][1]/3]
            ],
            // right
            [
                [square[3][0], square[3][1]/3],
                [square[2][0]/3, square[2][1]/3],
                [square[2][0], square[2][1]/3],
                [square[3][0], square[3][1]/3]
            ],
            // bottomleft
            [
                [square[0][0], square[0][1]],
                [square[0][0], square[0][1]/3],
                [square[0][0]/3, square[0][1]/3],
                [square[0][0]/3, square[0][1]]
            ],
            // bottommid
            [
                [square[0][0]/3, square[0][1]],
                [square[0][0]/3, square[0][1]/3],
                [square[3][0]/3, square[3][1]/3],
                [square[3][0]/3, square[3][1]]
            ],
            // bottomright
            [
                [square[3][0]/3, square[3][1]],
                [square[3][0]/3, square[3][1]/3],
                [square[3][0], square[3][1]/3],
                [square[3][0], square[3][1]]
            ]
        ]

        subSquares.forEach(f => {
            var currentCount = count;
            divide(f, currentCount);
        });
    }
    
}

function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.TRIANGLES, 0, points.length );
}
