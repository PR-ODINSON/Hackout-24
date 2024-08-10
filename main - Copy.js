const System = () =>{
    // Scene, Camera, Renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true }); // Enable antialiasing for smoother edges
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio); // Improve the render resolution
document.body.appendChild(renderer.domElement);

// Lighting
const ambientLight = new THREE.AmbientLight(0x404040);
const pointLight = new THREE.PointLight(0xffffff, 1, 100);
pointLight.position.set(0, 0, 0); // Center of the solar system (Sun)
scene.add(ambientLight);
scene.add(pointLight);

// Texture loader
const textureLoader = new THREE.TextureLoader();

// Planets
const planetData = [
    { name: 'Mercury', radius: 0.2, distance: 2, texture: 'textures/mercury.jpeg' },
    { name: 'Venus', radius: 0.3, distance: 3, texture: 'textures/venus.jpeg' },
    { name: 'Earth', radius: 0.3, distance: 4, texture: 'textures/earth.jpeg' },
    { name: 'Mars', radius: 0.25, distance: 5, texture: 'textures/mars.jpeg' },
    { name: 'Jupiter', radius: 0.5, distance: 7, texture: 'textures/jupiter.jpeg' },
    { name: 'Saturn', radius: 0.45, distance: 9, texture: 'textures/saturn.jpeg' },
    { name: 'Uranus', radius: 0.4, distance: 11, texture: 'textures/uranus.jpeg' },
    { name: 'Neptune', radius: 0.4, distance: 13, texture: 'textures/neptune.jpeg' }
];

const planets = [];

planetData.forEach(data => {
    const geometry = new THREE.SphereGeometry(data.radius, 32, 32);
    const texture = textureLoader.load(data.texture);
    const material = new THREE.MeshBasicMaterial({ map: texture });
    const planet = new THREE.Mesh(geometry, material);
    planet.position.x = data.distance;
    planet.userData = { name: data.name };
    scene.add(planet);
    planets.push(planet);
});

// Sun
const sunGeometry = new THREE.SphereGeometry(1, 64, 64); // Increased segments for smoothness
const sunTexture = textureLoader.load('textures/sun.jpeg'); // Replace with your sun texture path
const sunMaterial = new THREE.MeshBasicMaterial({ map: sunTexture });
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

// Spaceship
const spaceshipGeometry = new THREE.BoxGeometry(0.2, 0.2, 0.4);
const spaceshipMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
const spaceship = new THREE.Mesh(spaceshipGeometry, spaceshipMaterial);
spaceship.position.set(0, 0, 5); // Start position in 3D space
scene.add(spaceship);

// OrbitControls
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.enableZoom = true;
controls.zoomSpeed = 1.0;
controls.enableRotate = true;
controls.rotateSpeed = 1.0;
controls.enablePan = true;
controls.panSpeed = 0.8;

// Key events
const movementControls = {
    forward: false,
    backward: false,
    left: false,
    right: false,
    up: false,
    down: false,
    boost: false
};

window.addEventListener('keydown', function (event) {
    if (event.key === 'w') movementControls.forward = true;
    if (event.key === 's') movementControls.backward = true;
    if (event.key === 'a') movementControls.left = true;
    if (event.key === 'd') movementControls.right = true;
    if (event.key === 'ArrowUp') movementControls.up = true;
    if (event.key === 'ArrowDown') movementControls.down = true;
    if (event.key === 'Shift') movementControls.boost = true;
    if (event.key === 'Enter') checkPlanetProximity();
});

window.addEventListener('keyup', function (event) {
    if (event.key === 'w') movementControls.forward = false;
    if (event.key === 's') movementControls.backward = false;
    if (event.key === 'a') movementControls.left = false;
    if (event.key === 'd') movementControls.right = false;
    if (event.key === 'ArrowUp') movementControls.up = false;
    if (event.key === 'ArrowDown') movementControls.down = false;
    if (event.key === 'Shift') movementControls.boost = false;
});

// Spaceship movement
function moveSpaceship() {
    const speed = movementControls.boost ? 0.1 : 0.05;
    const rotationSpeed = 0.02; // Rotation speed

    // Move forward/backward
    if (movementControls.forward) spaceship.translateZ(-speed);
    if (movementControls.backward) spaceship.translateZ(speed);

    // Move left/right (yaw)
    if (movementControls.left) spaceship.rotation.y += rotationSpeed;
    if (movementControls.right) spaceship.rotation.y -= rotationSpeed;

    // Move up/down (pitch)
    if (movementControls.up) spaceship.rotation.x += rotationSpeed;
    if (movementControls.down) spaceship.rotation.x -= rotationSpeed;
}

// Check proximity to planets
function checkPlanetProximity() {
    planets.forEach(planet => {
        const distance = spaceship.position.distanceTo(planet.position);
        if (distance < 1) {
            alert(`Press Enter to learn more about ${planet.userData.name}`);
            // Logic to open the information page can be added here.
        }
    });
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    // Update controls
    controls.update();

    // Planet orbits
    planets.forEach((planet, index) => {
        planet.position.x = Math.cos(Date.now() * 0.0001 * (index + 1)) * planetData[index].distance;
        planet.position.z = Math.sin(Date.now() * 0.0001 * (index + 1)) * planetData[index].distance;
        planet.rotation.y += 0.01; // Minimal rotation for each planet
    });

    // Move spaceship
    moveSpaceship();

    // Render the scene
    renderer.render(scene, camera);
}

camera.position.set(0, 0, 10); // Adjusted to view the 3D space better
animate();

// Resize handler
window.addEventListener('resize', function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
}
