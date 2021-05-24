//María Renée A01139495


import * as THREE from "/build/three.module.js";
import Stats from "/js/jsm/libs/stats.module.js";
import {OrbitControls} from "/js/jsm/controls/OrbitControls.js";
import {PLYLoader} from "/js/jsm/loaders/PLYLoader.js";
import {OBJLoader} from "/js/jsm/loaders/OBJLoader.js";
import * as dat from "/js/jsm/libs/dat.gui.module.js";

"use strict";

let renderer, scene, pointLight, camera1, camera2, camera3, camera4, mesh, stats, cameraControls, gui, texture, material, params, degrees;
let multiview = false, camAway = 200.0;
const annotation = document.querySelector(".annotation");
const titulo = document.getElementById("title");
const description = document.getElementById("desc");
degrees = 1


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
function annotations(){
    const vector = new THREE.Vector3(250, 250, 250);
    const canvas = renderer.domElement; // `renderer` is a THREE.WebGLRenderer

    vector.project(camera); // `camera` is a THREE.PerspectiveCamera

    vector.x = Math.round((0.5 + vector.x / 2) * (canvas.width / window.devicePixelRatio));
    vector.y = Math.round((0.5 - vector.y / 2) * (canvas.height / window.devicePixelRatio));

    const annotation = document.querySelector('.annotation');
    annotation.style.top = `${vector.y}px`;
    annotation.style.left = `${vector.x}px`;
}

function init(event) {
    // RENDERER ENGINE
    
    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setClearColor(new THREE.Color(1.0, 0.7, 0.6));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setScissorTest(true);
    renderer.autoclear = false;  
    document.body.appendChild(renderer.domElement);
    // annotations()
    // updateAnnotationOpacity();
    // updateScreenPosition();

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
    params = {
        cambioColor: false,
        cambioEsclerotica: false,
        cambioCornea:  false,
        cambioPupila:  false,
        cambioRetina:  false,
        cambioBackground: false,

        colorOjoCafe: function() {
            titulo.textContent = "Ojo"
            description.textContent = "El ojo es un órgano que detecta la luz y es la base del sentido de la vista. Su función consiste básicamente en transformar la energía lumínica en señales eléctricas que son enviadas al cerebro a través del nervio óptico."
            loadTexture("loblanco.jpeg")
            loadTexture("brown.jpg")
        },
        colorOjoVerde: function() {
            titulo.textContent = "Ojo"
            description.textContent = "El ojo es un órgano que detecta la luz y es la base del sentido de la vista. Su función consiste básicamente en transformar la energía lumínica en señales eléctricas que son enviadas al cerebro a través del nervio óptico."
            loadTexture("green.jpeg")
        },
        esclerotica: function() {
            titulo.textContent = "Esclerotica"
            description.textContent = "Capa exterior blanca del ojo, opaca y fibrosa que se extiende desde la córnea hasta el nervio óptico en la parte posterior de ojo."
            loadTexture("loblanco.jpeg")
        },
        cornea: function() {
            titulo.textContent = "Cornea"
            description.textContent = "Estructura del ojo que permite el paso de la luz desde el exterior al interior del ojo y protege el iris y el cristalino, además de otras estructuras oculares."
            loadTexture("cornea.jpeg")
        },
        pupila: function() {
            titulo.textContent = "Pupila"
            description.textContent = "Estructura del ojo que consiste en un orificio situado en la parte central del iris por el cual penetra la luz al interior del globo ocular."
            loadTexture("pupila.jpeg")
        },
        pupilaDilatada: function() {
            titulo.textContent = "Pupila Dilatada"
            description.textContent = "Las venas oftálmicas (venas del vórtice) y la vena central de la retina drenan la sangre del ojo. Estos vasos sanguíneos entran y salen por la parte posterior del ojo."
            loadTexture("dilatada.jpeg")
            const width = 10;
            const height = 10;
            const intensity = 1;
            const rectLight = new THREE.RectAreaLight( 0xffffff, intensity,  width, height );
            rectLight.position.set( 5, 5, 0 );
            rectLight.lookAt( 0, 0, 0 );
            scene.add( rectLight )
            
            const rectLightHelper = new THREE.RectAreaLightHelper( rectLight );
            rectLight.add( rectLightHelper );
                            
        },
        iris: function() {
            titulo.textContent = "Iris"
            description.textContent = "Elementos que componen el sistema óptico de nuestros ojos. Su morfología es la de una membrana circular y coloreada en cuyo centro se encuentra la pupila, que es una abertura central que permite el paso de la luz al interior del globo ocular."
            loadTexture("iris.jpeg")
        },
        venas: function() {
            titulo.textContent = "Vasos sanguíneos"
            description.textContent = "Las venas oftálmicas (venas del vórtice) y la vena central de la retina drenan la sangre del ojo. Estos vasos sanguíneos entran y salen por la parte posterior del ojo."
            loadTexture("venas.jpeg")
        },

        orbitar: false,
        play: function() {
            // console.log("play");
            params.orbitar = true;
        },
        stop: function() {
            // console.log("stop");
            params.orbitar = false;
        },


        cine: function() {
            params.cambioBackground = true;
            var texture = new THREE.TextureLoader().load( "assets/textures/cine1.jpeg" );
            scene.background = texture;        
        },

        parque: function() {
            params.cambioBackground = true;
            var texture = new THREE.TextureLoader().load( "assets/textures/Parque.jpeg" );
            scene.background = texture;        
        },

        tec: function() {
            params.cambioBackground = true;
            var texture = new THREE.TextureLoader().load( "assets/textures/Tec.jpeg" );
            scene.background = texture;        
        },
        
        fiesta: function() {
            params.cambioBackground = true;
            var texture = new THREE.TextureLoader().load( "assets/textures/Party.jpeg" );
            scene.background = texture;        
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
    partesDelOjo.add(params, "pupilaDilatada").name("Pupila Dilatada").listen().onChange(function(value) { 
    });
    partesDelOjo.add(params, "venas").name("Vasos sanguíneos").listen().onChange(function(value) { 
    });
    partesDelOjo.add(params, "iris").name("Iris").listen().onChange(function(value) { 
    });

    let vistaDelOjo = gui.addFolder("Vista del Ojo")
    gui.add(params, "play").name("Rotar").listen().onChange(function(value) {
    });
    gui.add(params, "stop").name("Parar").listen().onChange(function(value) { 
    });


    let ambiente = gui.addFolder("Ambiente");
    
    
   ambiente.add(params,"cine").name("Cine").listen().onChange(function(value) {
    });

   ambiente.add(params, "parque").name("Parque").listen().onChange(function(value) { 
   });
   ambiente.add(params, "tec").name("Tec").listen().onChange(function(value) {
    });
   ambiente.add(params, "fiesta").name("Fiesta").listen().onChange(function(value) { 
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
       //mesh.rotation.y = mesh.rotation.y + 0.01;
       if (params.orbitar) {
        mesh.rotation.y = mesh.rotation.y + 0.01
       }
       
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




