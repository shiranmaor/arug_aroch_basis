(function () {
  function createFabricGeometry(width, height, segX, segY) {
    return new THREE.PlaneGeometry(width, height, segX, segY);
  }

  window.createFabricScene = function (canvas) {
    if (!window.THREE || !canvas) {
      throw new Error("Three.js unavailable");
    }

    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance"
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(0, 0, 14);

    const ambient = new THREE.AmbientLight(0xffffff, 1.45);
    const point = new THREE.PointLight(0xf8dccd, 3.2, 50, 2);
    point.position.set(4, 5, 8);
    const rim = new THREE.PointLight(0xc8d1bc, 2.1, 40, 2);
    rim.position.set(-6, -2, 7);
    scene.add(ambient, point, rim);

    const groups = [];
    const pointer = { x: 0, y: 0 };
    const scrollState = { progress: 0 };

    function createRibbon(options) {
      const geometry = createFabricGeometry(options.width, options.height, 84, 16);
      const material = new THREE.MeshPhysicalMaterial({
        color: options.color,
        transparent: true,
        opacity: options.opacity,
        roughness: 0.55,
        metalness: 0.04,
        transmission: 0.08,
        thickness: 0.7,
        clearcoat: 0.6,
        clearcoatRoughness: 0.8,
        side: THREE.DoubleSide
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.rotation.z = options.rotation;
      mesh.position.set(options.x, options.y, options.z);
      scene.add(mesh);

      groups.push({
        mesh: mesh,
        base: Float32Array.from(geometry.attributes.position.array),
        amplitude: options.amplitude,
        speed: options.speed,
        noise: options.noise
      });
    }

    createRibbon({
      width: 18,
      height: 4.4,
      color: 0xdfb8a3,
      opacity: 0.7,
      rotation: -0.45,
      x: 1.7,
      y: 0.9,
      z: -1.4,
      amplitude: 0.65,
      speed: 1.05,
      noise: 0.28
    });

    createRibbon({
      width: 15,
      height: 3,
      color: 0xb7c2ad,
      opacity: 0.38,
      rotation: 0.34,
      x: -2.8,
      y: -2.3,
      z: -2.8,
      amplitude: 0.5,
      speed: 0.82,
      noise: 0.19
    });

    createRibbon({
      width: 11,
      height: 2.5,
      color: 0xf5ede7,
      opacity: 0.28,
      rotation: -0.15,
      x: -2.6,
      y: 2.8,
      z: -3.8,
      amplitude: 0.32,
      speed: 0.7,
      noise: 0.12
    });

    function resize() {
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) {
        return;
      }
      renderer.setSize(rect.width, rect.height, false);
      camera.aspect = rect.width / rect.height;
      camera.updateProjectionMatrix();
    }

    function updateProgress() {
      const hero = document.getElementById("hero");
      if (!hero) {
        return;
      }
      const rect = hero.getBoundingClientRect();
      const distance = Math.max(rect.height, window.innerHeight);
      scrollState.progress = Math.min(Math.max((-rect.top) / distance, 0), 1);
    }

    function render(time) {
      const t = time * 0.001;
      updateProgress();

      groups.forEach(function (entry, index) {
        const attr = entry.mesh.geometry.attributes.position;
        const array = attr.array;

        for (let i = 0; i < array.length; i += 3) {
          const x = entry.base[i];
          const y = entry.base[i + 1];
          array[i + 2] = Math.sin(x * 0.8 + t * entry.speed + index) * entry.amplitude
            + Math.cos(y * 1.2 + t * entry.speed * 1.1) * entry.noise;
        }

        attr.needsUpdate = true;
        entry.mesh.rotation.x = pointer.y * 0.12 + scrollState.progress * 0.18;
        entry.mesh.rotation.y = pointer.x * 0.12 - scrollState.progress * 0.08;
        entry.mesh.position.y += Math.sin(t * (0.45 + index * 0.12)) * 0.0018;
      });

      renderer.render(scene, camera);
    }

    function onPointerMove(event) {
      const rect = canvas.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      pointer.y = ((event.clientY - rect.top) / rect.height - 0.5) * -2;
    }

    resize();
    renderer.setAnimationLoop(render);
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    return function cleanup() {
      renderer.setAnimationLoop(null);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      groups.forEach(function (entry) {
        entry.mesh.geometry.dispose();
        entry.mesh.material.dispose();
      });
      renderer.dispose();
    };
  };
})();
