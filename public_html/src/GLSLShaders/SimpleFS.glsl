// this is the fragment (or pixel) shader that 
// outputs constant red color for every pixel rendered.

precision mediump float; 
    // sets the precision for floating point computation

// Texture coordinate
varying highp vec2 vTextureCoord;
 
// Texture sampler
uniform sampler2D uSampler;

// Color of pixel
uniform vec4 uPixelColor;  

void main(void) {
	vec4 tex = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));
    
    // for every pixel called sets to the texture blended with the color
    gl_FragColor = vec4((tex.rgb * (1.0-uPixelColor.a) + uPixelColor.rgb * uPixelColor.a), tex.a);;
    // gl_FragColor = uPixelColor;
}