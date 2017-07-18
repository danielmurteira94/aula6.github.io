var gl;
var program;

var mModelLoc;
var mModelList = [];
var mModel = mat4();

var tx = 0;
var ty = 0;
var tz = 0;
var rx = 0;
var ry = 0;
var rz = 0;
var sx = 1;
var sy = 1;
var sz = 1;

var at = [0, 0, 0];
var eye = [1, 1, 1];
var up = [0, 1, 0];

var mViewLoc;
var mView = lookAt(eye, at, up);

var mProjectionLoc;
var mProjection = ortho(-2,2,-2,2,10,-10);

window.onload = function init() {
    var canvas = document.getElementById("gl-canvas");
    gl = WebGLUtils.setupWebGL(canvas);
    if(!gl) { alert("WebGL isn't available"); }
    
    cubeInit(gl);
    sphereInit(gl);
    
    // Configure WebGL
    gl.viewport(0,0,canvas.width, canvas.height);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    
    // Load shaders and initialize attribute buffers
    program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    // Associate our shader variables with our color buffer
    mModelLoc = gl.getUniformLocation(program, "mModel");
    mViewLoc = gl.getUniformLocation(program, "mView");
    mProjectionLoc = gl.getUniformLocation(program, "mProjection");
    
    gl.uniformMatrix4fv(mViewLoc, false, flatten(mView));
    gl.uniformMatrix4fv(mProjectionLoc, false, flatten(mProjection));
    
    document.getElementById("tx").oninput = function() {
        tx = this.value;
        build_ctm();
    }
    
    document.getElementById("ty").oninput = function() {
        ty = this.value;
        build_ctm();
    }
    
    document.getElementById("tz").oninput = function() {
        tz = this.value;
        build_ctm();
    }
    
    document.getElementById("rx").oninput = function() {
        rx = this.value;
        build_ctm();
    }
    
    document.getElementById("ry").oninput = function() {
        ry = this.value;
        build_ctm();
    }
    
    document.getElementById("rz").oninput = function() {
        rz = this.value;
        build_ctm();
    }
    
    document.getElementById("sx").oninput = function() {
        sx = this.value;
        build_ctm();
    }
    
    document.getElementById("sy").oninput = function() {
        sy = this.value;
        build_ctm();
    }
    
    document.getElementById("sz").oninput = function() {
        sz = this.value;
        build_ctm();
    }
    
    document.getElementById("nc").onclick = function() {
        mModelList.push(mModel);
        mModel = mat4();
        tx = 0;
        ty = 0;
        tz = 0;
        rx = 0;
        ry = 0;
        rz = 0;
        sx = 1;
        sy = 1;
        sz = 1;
        document.getElementById("tx").value = 0.0;
        document.getElementById("ty").value = 0.0;
        document.getElementById("tz").value = 0.0;
        document.getElementById("rx").value = 0.0;
        document.getElementById("ry").value = 0.0;
        document.getElementById("rz").value = 0.0;
        document.getElementById("sx").value = 1.0;
        document.getElementById("sy").value = 1.0;
        document.getElementById("sz").value = 1.0;
    }
    
    render();
}

function build_ctm() {
    mModel = mult(translate(tx,ty,tz), mult(rotateZ(rz), mult(rotateY(ry), mult(rotateX(rx), scalem(sx,sy,sz)))));
}

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);
    
    var i;
    var ctmAux;
    
    for (i = 0; i < mModelList.length; i++) {
        ctmAux = mModelList[i];
        gl.uniformMatrix4fv(mModelLoc, false, flatten(ctmAux));
        cubeDrawWireFrame(gl, program);
    }
    
    gl.uniformMatrix4fv(mModelLoc, false, flatten(mModel));
    cubeDrawWireFrame(gl, program);
    window.requestAnimFrame(render);
}
