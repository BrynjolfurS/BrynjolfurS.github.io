/////////////////////////////////////////////////////////////////
//    Heimadæmi 2
//    Dæmi 4
/////////////////////////////////////////////////////////////////
var gl;
var points;

var colorLoc;

window.onload = function init()
{
    var canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    points = [];
    for (var i = 0; i < 100 ; i++) {
        x1 = (Math.random()*1.8)-1;
        y1 = (Math.random()*1.8)-1;

        var vertice1 = vec2(x1, y1);
        var vertice2 = vec2(x1+0.1, y1+0.2);
        var vertice3 = vec2(x1+0.2, y1);
        points.push(vertice1);
        points.push(vertice2);
        points.push(vertice3);
    }
   
    //  Configure WebGL

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    
    //  Load shaders and initialize attribute buffers
    
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
    // Load the data into the GPU
    
    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    // Associate shader variables with our data buffer
    
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    // Find the location of the variable fColor in the shader program
    colorLoc = gl.getUniformLocation( program, "fColor" );
    
    render();
};


function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );

    for (var i = 0; i < points.length; i++) {
        gl.uniform4fv( colorLoc, vec4(Math.random(), Math.random(), Math.random(), 1.0) );
        gl.drawArrays( gl.TRIANGLES, i * 3, 3 );
    }
}
