#define PI 3.1415926535897932384626433832795
varying vec2 vUv;

uniform vec2 sizes;
uniform float strength;

void main() {
    // vec4 newPosition = viewMatrix * modelMatrix * vec4(position, 1.);

    // newPosition.z = sin(newPosition.y / sizes.y * PI + PI / 2. ) * -strength;
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.);

    // gl_Position = projectionMatrix * newPosition;

    vUv = uv;
}
