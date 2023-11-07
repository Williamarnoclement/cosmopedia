// Set up the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

const spaceTextureLoader = new THREE.TextureLoader();
const spaceTexture = spaceTextureLoader.load('./img/space.jpg'); 

// Create a large sphere for the background
const backgroundGeometry = new THREE.SphereGeometry(500, 32, 32); // Increase the radius to ensure it surrounds the scene
const backgroundMaterial = new THREE.MeshBasicMaterial({ map: spaceTexture, side: THREE.BackSide });
const backgroundSphere = new THREE.Mesh(backgroundGeometry, backgroundMaterial);
scene.add(backgroundSphere);

document.getElementById("star-map-container").appendChild(renderer.domElement);

let uniforms;
let clock = new THREE.Clock();


// Shader code for the sun
const sunVertexShader = `
uniform vec2 uvScale;
			varying vec2 vUv;

			void main()
			{

				vUv = uvScale * uv;
				vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
				gl_Position = projectionMatrix * mvPosition;

			}

`;

const sunFragmentShader = `
uniform float time;

			uniform float fogDensity;
			uniform vec3 fogColor;

			uniform sampler2D texture1;
			uniform sampler2D texture2;

			varying vec2 vUv;

			void main( void ) {

				vec2 position = - 1.0 + 2.0 * vUv;

				vec4 noise = texture2D( texture1, vUv );
				vec2 T1 = vUv + vec2( 1.5, - 1.5 ) * time * 0.02;
				vec2 T2 = vUv + vec2( - 0.5, 2.0 ) * time * 0.01;

				T1.x += noise.x * 2.0;
				T1.y += noise.y * 2.0;
				T2.x -= noise.y * 0.2;
				T2.y += noise.z * 0.2;

				float p = texture2D( texture1, T1 * 2.0 ).a;

				vec4 color = texture2D( texture2, T2 * 2.0 );
				vec4 temp = color * ( vec4( p, p, p, p ) * 2.0 ) + ( color * color - 0.1 );

				if( temp.r > 1.0 ) { temp.bg += clamp( temp.r - 2.0, 0.0, 100.0 ); }
				if( temp.g > 1.0 ) { temp.rb += temp.g - 1.0; }
				if( temp.b > 1.0 ) { temp.rg += temp.b - 1.0; }

				gl_FragColor = temp;

				float depth = gl_FragCoord.z / gl_FragCoord.w;
				const float LOG2 = 1.442695;
				float fogFactor = exp2( - fogDensity * fogDensity * depth * depth * LOG2 );
				fogFactor = 1.0 - clamp( fogFactor, 0.0, 1.0 );

				gl_FragColor = mix( gl_FragColor, vec4( fogColor, gl_FragColor.w ), fogFactor );

			}


`;

const cloudTextureLoader = new THREE.TextureLoader();
const lavaTextureLoader = new THREE.TextureLoader();

const cloudTexture = cloudTextureLoader.load( './img/cloud.png' );
const lavaTexture = lavaTextureLoader.load( './img/lavatile.jpg' );

lavaTexture.colorSpace = THREE.SRGBColorSpace;

cloudTexture.wrapS = cloudTexture.wrapT = THREE.RepeatWrapping;
lavaTexture.wrapS = lavaTexture.wrapT = THREE.RepeatWrapping;

uniforms = {

					'fogDensity': { value: 0.45 },
					'fogColor': { value: new THREE.Vector3( 0, 0, 0 ) },
					'time': { value: 1.0 },
					'uvScale': { value: new THREE.Vector2( 3.0, 1.0 ) },
					'texture1': { value: cloudTexture },
					'texture2': { value: lavaTexture }

};

const size = 0.65;

				


//end sun shader

// Shader code for the planets
const planetVertexShader = `
void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const planetFragmentShader = `
void main() {
    gl_FragColor = vec4(0.0, 1.0, 0.0, 1.0); // Green color for the planets
}
`;

// Create a background with stars
const starGeometry = new THREE.BufferGeometry();
const starVertices = [];

for (let i = 0; i < 10000; i++) {
    const x = (Math.random() - 0.5) * 2000;
    const y = (Math.random() - 0.5) * 2000;
    const z = (Math.random() - 0.5) * 2000;
    starVertices.push(x, y, z);
}

starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.05 });
const stars = new THREE.Points(starGeometry, starMaterial);
//scene.add(stars);



const planetMaterial = new THREE.ShaderMaterial({
    vertexShader: planetVertexShader,
    fragmentShader: planetFragmentShader,
});

const sunMaterial = new THREE.ShaderMaterial( {
					uniforms: uniforms,
					vertexShader: sunVertexShader,
					fragmentShader: sunFragmentShader

				} );

// Create a central sun
const sunGeometry = new THREE.SphereGeometry(1, 32, 32);
//const sun = new THREE.Mesh(sunGeometry, sunMaterial);
const sun = new THREE.Mesh( new THREE.TorusGeometry( size, 0.3, 30, 30 ), sunMaterial );

sun.name = 'Solar System 4'; 
sun.desc1 = "Located in GALAXY 3.0.5.1.";
sun.desc2 = "Mass: 2 × 10^30 kg";
sun.desc3 = "Radius: 683,342 km";
sun.info = 'Never go to the planets of this galaxy. They are ruled by Hand Hunters. This system used to be populated by Human kind. But everything changed.'; 
scene.add(sun);

// Create planets with shader materials
const planets = [];
for (let i = 0; i < 5; i++) {
    const planetGeometry = new THREE.SphereGeometry(0.2, 32, 32);
    
    if (i == 0){
        const planetGeometry = new THREE.SphereGeometry(0.2, 40, 40);
    }
    if (i == 1){
        const planetGeometry = new THREE.SphereGeometry(0.2, 22, 22);
    }
    else {
        const planetGeometry = new THREE.SphereGeometry(0.2, 32, 32);
    }  
    
    
    const planet = new THREE.Mesh(planetGeometry, planetMaterial);
    const distance = 2;
    const angle = (i / 3) * Math.PI * 2; // Spread the planets evenly
    planet.position.x = distance * Math.cos(angle);
    planet.position.z = distance * Math.sin(angle);
    planets.push(planet);
    if (i == 2){
        planet.name = 'Ekanra';
        planet.info = 'NO INFORMATIONS ON DB..';
        planet.desc1 = 'Perihelion: 134,098,291 km';
        planet.desc2 = 'Surface gravity: 1 g';
        planet.desc3 = 'Specifications: Please never try to understand the joke behind this planet`s name.';
        
    }
    if (i == 1){
        planet.name = 'Ocarnia';
        planet.info = 'This planet was supposed to be the new capital of the Imagine Nations. But when every one is looking for dominating this world, what could go wrong ?';
        planet.desc1 = 'Perihelion: 107,476,170 km';
        planet.desc2 = '0.8 g ';
        planet.desc3 = 'Specifications: Currently occupated by Time-space pirates';
        
    }
    if (i == 3) {
        planet.name = 'Mathera';
        planet.info = 'This planet was populated by science people. By the way, they were pretty interested about the creation of the Universal Artificial Intelligence, a new race of beeings. They were killed by their creation. And now, this planet is abandonned. What an era for mathematics ;)';
        planet.desc1 = 'Perihelion: 206,655,215 km';
        planet.desc2 = '1 g (now, was 0.379 g before terraformation)';
        planet.desc3 = 'Specifications: green atmosphere, polluted air';
        
    }  
    
    if (i == 4) {
        planet.name = 'Finita';
        planet.info = 'Don`t ask me why the last planet should have a name ending with `a`....';
        planet.desc1 = 'Perihelion: 2,734,998,229 km';
        planet.desc2 = '1.998 g';
        planet.desc3 = 'Specifications: Is Uranus a system or a black hole ?';
        
    } 
    
    scene.add(planet);
}

camera.position.set(0, 0, 8);

const animate = () => {
    requestAnimationFrame(animate);

    planets.forEach((planet, index) => {
        let cur_time = (Date.now() * 0.0001 * (index + 1));
        let cur_distance = index * 1.5;

        planet.position.x = cur_distance * Math.cos(cur_time);
        planet.position.z = cur_distance * Math.sin(cur_time);
    });
    
    render();


    renderer.render(scene, camera);
};

function render() {

				const delta = 5 * clock.getDelta();

				uniforms[ 'time' ].value += 0.2 * delta;

				sun.rotation.y += 0.0125 * delta;
				sun.rotation.x += 0.05 * delta;

				renderer.clear();

			}



animate();

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const planetNameElement = document.getElementById('planet-name'); 
const planetInfoElement = document.getElementById('planet-info'); 
const planetdesc1 = document.getElementById('planet-1'); 
const planetdesc2 = document.getElementById('planet-2'); 
const planetdesc3 = document.getElementById('planet-3'); 

document.addEventListener('mousemove', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(scene.children);

    if (intersects.length > 0) {
        const object = intersects[0].object;
        if (object.name) {
            planetNameElement.textContent = object.name;
            planetInfoElement.textContent = object.info;
            planetdesc1.textContent = object.desc1;
            planetdesc2.textContent = object.desc2;
            planetdesc3.textContent = object.desc3;
        }
    } else {
        planetNameElement.textContent = 'Welcome, Captain Keeper.';
    }
});
