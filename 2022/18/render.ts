import { Scene, BoxGeometry, MeshBasicMaterial, Mesh, WebGLRenderer, PerspectiveCamera } from 'three';

const testData: number[][] = require('./testData.json');

const scene = new Scene();

const camera = new PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const renderer = new WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

console.log(window.innerHeight, window.innerWidth)

testData.forEach(([x, y, z]) => {
    const geometry = new BoxGeometry( 1, 1, 1 );
    const material = new MeshBasicMaterial( { color: 0x00ff00, opacity: 0.5, transparent: true } );
    const cube = new Mesh( geometry, material );
    cube.position.set(x, y, z)
    scene.add( cube );
})


camera.position.y = 2;
camera.position.z = 10;
const controls = new OrbitControls( camera, renderer.domElement );


renderer.render( scene, camera );

//  npx esbuild .\2022\18\render.ts --bundle --outfile="2022/18/render.js"