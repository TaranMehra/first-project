import * as three from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
// import { GLBLoader } 
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
// import { update } from 'three/examples/jsm/libs/tween.module.js';
// import gsap from 'gsap';

const rend = new three.WebGLRenderer({
  canvas: document.querySelector('#model-div-canvas')
})
const scene = new three.Scene();



const page1 = document.querySelector('.page-container-one');
const model_div = document.querySelector('.model-div');
const canvas_div = document.querySelector('#model-div-canvas');


rend.setPixelRatio(window.devicePixelRatio)
rend.setSize(canvas_div.clientWidth, canvas_div.clientHeight);
// rend.setClearColor(0x00ffff, 1.0)

const camera = new three.PerspectiveCamera(
  75,
  canvas_div.clientWidth / canvas_div.clientHeight,
  0.1,
  2000
)
scene.add(camera);
camera.position.set(110,110, 100);
// camera.lookAt( new three.Vector3(0, 0, 0))

const oc = new OrbitControls(camera, rend.domElement);
oc.update();



//Structure

const grid = new three.GridHelper(20, 20);
// scene.add(grid);

const sphere = new three.Mesh(
  new three.SphereGeometry(.4, 52, 52),
  new three.MeshBasicMaterial({
    color: 0xFFEA00,
    wireframe: true,
  })
)
// scene.add(sphere);


// console.log("gsap", gsap);


//LIGHTS 

const ambient = new three.AmbientLight(0xffffff, 3);
// scene.add(ambient);

const dlist = new three.DirectionalLight(0xffffff, 1);
dlist.position.set(65, 30, 30);
// scene.add(dlist);

const dhelper = new three.DirectionalLightHelper(dlist, 5);
// scene.add(dhelper);


const plight = new three.SpotLight(0xffffff, 105,40,Math.PI/8);
plight.position.set(5, 5, 5);
scene.add(plight)

const slightlehper = new three.SpotLightHelper(plight);
scene.add(slightlehper)
//MODEL
const loader = new GLTFLoader()//.setPath('/scu23/');
const dloader = new DRACOLoader();
dloader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.7/');
loader.setDRACOLoader(dloader);


loader.load('./scu23/forcar.glb', (glb) => {
  const mesh = glb.scene;
  mesh.position.set(-150, -70, -150);
  mesh.scale.set(100, 100, 100);
  scene.add(mesh);
})




//HDR
// const hdrtexture = new URL('./public/scu23/meadow_2_2k.hdr', import.meta.url)
rend.toneMapping = three.ACESFilmicToneMapping;
rend.toneMappingExposure = .8;
// rend.outputEncoding = three.sRGBEncoding;



const loading = new RGBELoader();
loading.load('./scu23/meadow_2_2k.hdr', function(texture){
  texture.mapping = three.EquirectangularReflectionMapping; //how to apply the hdr image
  scene.background = texture; //set texture to background
  scene.environment = texture;  //set texture to envirement map for all maerials in scene

})

//Rending ans Resizing
function animate() {
  requestAnimationFrame(animate);
  rend.render(scene, camera);
}



window.addEventListener('resize', function (e) {
  animate();
  const canvas_div = document.querySelector('#model-div-canvas');
  rend.setSize(page1.clientWidth, page1.clientHeight);
  camera.aspect = page1.clientWidth / page1.clientHeight;
  camera.updateProjectionMatrix();
})

animate();
