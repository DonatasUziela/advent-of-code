import { Scene, BoxGeometry, MeshBasicMaterial, Mesh, WebGLRenderer, PerspectiveCamera } from 'three';

const scene = new Scene();
const camera = new PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 200);
const renderer = new WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const testData: number[][] = require('./input.json')
const water: number[][] = require('./water.json')

testData.forEach(([x, y, z], i) => {
    const geometry = new BoxGeometry(1, 1, 1);
    const material = new MeshBasicMaterial({ color: 0x00ff00, opacity: 0.7, transparent: true });
    const cube = new Mesh(geometry, material);
    cube.position.set(x, y, z)
    scene.add(cube);
})

water.forEach(([x, y, z], i) => {
    const geometry = new BoxGeometry(1, 1, 1);
    const material = new MeshBasicMaterial({ color: 0x0000ff, opacity: 0.2, transparent: true });
    const cube = new Mesh(geometry, material);
    cube.position.set(x, y, z)
    scene.add(cube);
})

camera.position.y = 10;
camera.position.z = 40;
camera.position.x = 10;

renderer.render(scene, camera);
// npx esbuild .\2022\18\render.ts --bundle --outfile="2022/18/render.js"