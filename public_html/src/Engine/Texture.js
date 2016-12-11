
// create webgl texture from url
function Texture (url) {
    var gl = gEngine.Core.getGL();
    this.glTexture = gl.createTexture();
    this.image = new Image();
    this.image.onload = onLoad.bind(this);
    // if (image.complete) onLoad();
    this.image.src = url;

    function onLoad() {
        gl.bindTexture(gl.TEXTURE_2D, this.glTexture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.image);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.bindTexture(gl.TEXTURE_2D, null);
    }
}

Texture.prototype.activate = function() {
    var gl = gEngine.Core.getGL();

    // Binds our texture reference to the current webGL texture functionality
    gl.activeTexture(gl.TEXTURE0); // <-- this is hard coded to webgl-unit0
    gl.bindTexture(gl.TEXTURE_2D, this.glTexture);

    // texture wrappings
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);

    // Handles how magnification and minimization filters will work.
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
}

Texture.prototype.deactivate = function() {
    var gl = gEngine.Core.getGL();
    gl.activeTexture(null);
    gl.bindTexture(gl.TEXTURE_2D, null);
}

Texture.prototype.getGLTextureRef = function () { return this.glTexture; };