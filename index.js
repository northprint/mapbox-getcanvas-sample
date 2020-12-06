
(() => {
    window.addEventListener('DOMContentLoaded', () => {
        init();
        window.addEventListener('keydown', (event) => {
            run = event.key !== 'Escape';
        }, false);
        run = true;
        render();
    }, false);

    let run = true;
    let map;
    let scene;
    let camera;
    let renderer;
    let geometry;
    let plane;
    let controls;
    let composer;
    let renderPass;
    let glitchPass;

    const CAMERA_PARAM = {
        fovy: 60,
        aspect: window.innerWidth / window.innerHeight,
        near: 0.1,
        far: 10.0,
        x: 0.0,
        y: -4.0,
        z: 2.0,
        lookAt: new THREE.Vector3(0.0, 0.0, 0.0),
    };

    const RENDERER_PARAM = {
        clearColor: 0x666666,       // 背景をクリアする色
        width: window.innerWidth,
        height: window.innerHeight,
    };

    function init(){


        map = new mapboxgl.Map({
            container: 'map',
            style:
                '', // タイルURLを設定
            center: [142.365061, 43.770795],
            zoom: 12
        });

        scene = new THREE.Scene();
        renderer = new THREE.WebGLRenderer();
        renderer.setClearColor(new THREE.Color(RENDERER_PARAM.clearColor));
        renderer.setSize(RENDERER_PARAM.width, RENDERER_PARAM.height);
        const wrapper = document.querySelector('#webgl');
        wrapper.appendChild(renderer.domElement);

        camera = new THREE.PerspectiveCamera(
            CAMERA_PARAM.fovy,
            CAMERA_PARAM.aspect,
            CAMERA_PARAM.near,
            CAMERA_PARAM.far
        );
        camera.position.set(CAMERA_PARAM.x, CAMERA_PARAM.y, CAMERA_PARAM.z);
        camera.lookAt(CAMERA_PARAM.lookAt);

        composer = new THREE.EffectComposer(renderer);
        renderPass = new THREE.RenderPass(scene, camera);
        composer.addPass(renderPass);
        glitchPass = new THREE.GlitchPass();
        composer.addPass(glitchPass);
        glitchPass.renderToScreen = true;

        geometry = new THREE.PlaneGeometry( 5, 5, 32 );
        plane = createMesh(geometry);

        scene.add(plane);

        controls = new THREE.OrbitControls(camera, renderer.domElement);

    }

    function createMesh (geometry) {
        const canvas = new THREE.Texture(map.getCanvas()); // canvas要素を読み込む
        const material = new THREE.MeshBasicMaterial({side: THREE.DoubleSide});
        material.map = canvas;
        return new THREE.Mesh(geometry, material);
    }

    function render(){
        if(run === true){
            requestAnimationFrame(render);
        }

        plane.material.map.needsUpdate = true;
        composer.render();
    }
})();
