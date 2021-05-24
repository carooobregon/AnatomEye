//María Renée A01139495


import * as THREE from "/build/three.module.js";
import Stats from "/js/jsm/libs/stats.module.js";
import {OrbitControls} from "/js/jsm/controls/OrbitControls.js";
import {PLYLoader} from "/js/jsm/loaders/PLYLoader.js";
import {OBJLoader} from "/js/jsm/loaders/OBJLoader.js";
import * as dat from "/js/jsm/libs/dat.gui.module.js";

"use strict";

let renderer, scene, camera1, camera2, camera3, camera4, mesh, stats, cameraControls, gui, texture, material, ogTexture, ogMaterial;
let multiview = false, camAway = 200.0;

function loadTexture(name){
    texture = new THREE.TextureLoader().load(`/assets/textures/${name}`);
    material = new THREE.MeshBasicMaterial( { map: texture } );
    let loader = new OBJLoader();
    loader.load('./assets/obj/eye.obj', function(obj) {
        obj.traverse(function(child) {
            if (child.isMesh) {
                child.material = material;
                child.geometry.center();
                // SCENE HIERARCHY
                scene.add(child);
                mesh = child;
            }
        }); 
    });
}
function init(event) {
    // RENDERER ENGINE
    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setClearColor(new THREE.Color(1.0, 0.7, 0.6));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setScissorTest(true);
    renderer.autoclear = false;  
    document.body.appendChild(renderer.domElement);

    // SCENE
    scene = new THREE.Scene();

    // CAMERA 1 (PERSPECTIVE VIEW)
    let fovy = 90.0;    // Field ov view
    let aspectRatio = window.innerWidth / window.innerHeight;
    let nearPlane = 9;
    let farPlane = 0;
    camera1 = new THREE.PerspectiveCamera(fovy, aspectRatio, nearPlane, farPlane);
    camera1.position.set(1, 0, camAway);
    cameraControls = new OrbitControls(camera1, renderer.domElement);
 
     // CAMERA 2(TOP VIEW)
     aspectRatio = window.innerWidth / 2 / window.innerHeight / 2;
     camera2 = new THREE.PerspectiveCamera(fovy, aspectRatio, nearPlane, farPlane);
     camera2.position.set(0., camAway, 0.); 
     camera2.lookAt(scene.position);   
     camera2.up.set(0., 0., 1.);    

      // CAMERA 3 (FRONT VIEW)
      aspectRatio = window.innerWidth / 2 / window.innerHeight / 2;
      camera3 = new THREE.PerspectiveCamera(fovy, aspectRatio, nearPlane, farPlane);
      camera3.position.set(0., 0., camAway); 
      camera3.lookAt(scene.position);   
      camera3.up.set(0., 1., 0.);    

     // CAMERA 4 (SIDE VIEW)
     aspectRatio = window.innerWidth / 2 / window.innerHeight / 2;
     camera4 = new THREE.PerspectiveCamera(fovy, aspectRatio, nearPlane, farPlane);
     camera4.position.set(camAway, 0., 0.); 
     camera4.lookAt(scene.position);   
     camera4.up.set(0., 1., 0.);    
            
    // MODEL

    texture = new THREE.TextureLoader().load('/assets/textures/brown.jpg');
    material = new THREE.MeshBasicMaterial( { map: texture } );

    let loader = new OBJLoader();
    loader.load('./assets/obj/eye.obj', function(obj) {
        obj.traverse(function(child) {
            if (child.isMesh) {
                child.material = material;
                child.geometry.center();
                // SCENE HIERARCHY
                scene.add(child);
                mesh = child;
            }
        }); 
    });
   
    // GUI
    gui = new dat.GUI();
    gui.close();

    // var cambioColor = false;
    var params = {
        cambioColor: false,
        cambioEsclerotica: false,
        cambioCornea:  false,
        cambioPupila:  false,
        cambioRetina:  false,
        colorOjoCafe: function() {
            loadTexture("brown.jpg")
        },
        colorOjoVerde: function() {
            loadTexture("green.jpeg")
        },
        esclerotica: function() {
            loadTexture("loblanco.jpeg")
        },
        cornea: function() {
            loadTexture("cornea.jpeg")
        },
        pupila: function() {
            loadTexture("pupila.jpeg")
        },
        iris: function() {
            loadTexture("iris.jpeg")
        },
        venas: function() {
            loadTexture("venas.jpeg")
        },
    };

    let aparienciaDelOjo = gui.addFolder("Apariencia del Ojo");

    // toggle button for eye changing color
    aparienciaDelOjo.add(params, "colorOjoCafe").name("Ojo café").onChange(function(value) {
        // changing the texture here
        // params.cambioColor = !params.cambioColor

    });
    aparienciaDelOjo.add(params, "colorOjoVerde").name("Ojo verde").onChange(function(value) {
        // changing the texture here
        // params.cambioColor = !params.cambioColor

    });

    let partesDelOjo = gui.addFolder("Partes del Ojo");
    partesDelOjo.add(params, "esclerotica").name("Esclerotica").listen().onChange(function(value) {
        
    });
    partesDelOjo.add(params, "cornea").name("Cornea").listen().onChange(function(value) { 
    });
    partesDelOjo.add(params, "pupila").name("Pupila").listen().onChange(function(value) {
    });
    partesDelOjo.add(params, "venas").name("Venas").listen().onChange(function(value) { 
    });
    partesDelOjo.add(params, "iris").name("Iris").listen().onChange(function(value) { 
    });
    // gui.open();

    // SETUP STATS
    stats = new Stats();
    stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
    document.body.appendChild(stats.dom);

    // DRAW SCENE IN A RENDER LOOP (ANIMATION)
    renderLoop();
}

function renderLoop() {
    stats.begin();
    if(!multiview) {
         // CAMERA 1
         camera1.aspect =  window.innerWidth / window.innerHeight;
         camera1.updateProjectionMatrix();
         renderer.setViewport(1, 0, window.innerWidth, window.innerHeight);
         renderer.setScissor(0, 0, window.innerWidth, window.innerHeight);
         renderer.render(scene, camera1);
    } 
    else {
        // CAMERA 1
        camera1.aspect = window.innerWidth/2. /  (window.innerHeight/2);
        camera1.updateProjectionMatrix();
       
        renderer.setViewport(window.innerWidth/2., window.innerHeight/2, window.innerWidth/2., window.innerHeight/2);
        renderer.setScissor(window.innerWidth/2., window.innerHeight/2, window.innerWidth/2., window.innerHeight/2);
        renderer.render(scene, camera1);

        // CAMERA 2
        camera2.aspect = window.innerWidth/2. / (window.innerHeight/2);
        camera2.updateProjectionMatrix();
        renderer.setViewport(0, window.innerHeight/2, window.innerWidth/2., window.innerHeight/2);
        renderer.setScissor(0, window.innerHeight/2, window.innerWidth/2., window.innerHeight/2);
        renderer.render(scene, camera2);

        // CAMERA 3
        camera3.aspect = window.innerWidth/2. / (window.innerHeight/2);
        camera3.updateProjectionMatrix();
        renderer.setViewport(0, 0, window.innerWidth/2., window.innerHeight/2);
        renderer.setScissor(0, 0, window.innerWidth/2., window.innerHeight/2);
        renderer.render(scene, camera3);

        // CAMERA 4
        camera4.aspect = window.innerWidth/2. / (window.innerHeight/2);
        camera4.updateProjectionMatrix();
        renderer.setViewport(window.innerWidth/2, 0, window.innerWidth/2., window.innerHeight/2);
        renderer.setScissor(window.innerWidth/2, 0, window.innerWidth/2., window.innerHeight/2);
        renderer.render(scene, camera4);
    }
    updateScene();
    stats.end();
    stats.update();
    requestAnimationFrame(renderLoop);
}

function updateScene() {
    if(mesh) {
       // mesh.rotation.y = mesh.rotation.y + 0.01;
        
        
    }

}

// EVENT LISTENERS & HANDLERS

document.addEventListener("DOMContentLoaded", init);

window.addEventListener("resize", () => {
    if(!multiview) {
         // CAMERA 1
         camera1.aspect = window.innerWidth / window.innerHeight;
         camera1.updateProjectionMatrix();
         renderer.setSize(window.innerWidth, window.innerHeight);
    }
    else {
         // CAMERA 1
         camera1.aspect = window.innerWidth / 2. / (window.innerHeight / 2);
         camera1.updateProjectionMatrix();
        // CAMERA 2
         camera2.aspect = window.innerWidth / 2. / (window.innerHeight / 2);
         camera2.updateProjectionMatrix();
         // CAMERA 3
         camera3.aspect = window.innerWidth / 2. / (window.innerHeight / 2);
         camera3.updateProjectionMatrix();
         // CAMERA 4
         camera4.aspect = window.innerWidth / 2. / (window.innerHeight / 2);
         camera4.updateProjectionMatrix();

         renderer.setSize(window.innerWidth, window.innerHeight);
    }
}, false);

document.addEventListener("keydown", (ev) => {
    if(ev.key == " ")	// Space bar
	{
		multiview = !multiview;
	}
}, false);




