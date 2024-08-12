import React, { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as THREE from 'three';

export const AvatarContent = ({ gltf }) => {
  const { scene, animations } = gltf;
  const mixer = useRef(null);

  useEffect(() => {
    if (animations.length) {
      mixer.current = new THREE.AnimationMixer(scene);
      animations.forEach((clip) => {
        const action = mixer.current.clipAction(clip);
        action.play();
      });
    }
  }, [animations, scene]);

  useFrame((state, delta) => {
    if (mixer.current) {
      mixer.current.update(delta);
    }
  });

  return <primitive object={scene.clone()} dispose={null} />;
};

const AvatarManager = ({ onAvatarLoad }) => {
  const [selectedGltf, setSelectedGltf] = useState(null);

  const handleAvatarUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      const loader = new GLTFLoader();
      loader.load(url, (gltf) => {
        console.log('AvatarManager: GLTF loaded', gltf);
        setSelectedGltf(gltf);
        onAvatarLoad(gltf.scene.clone());
      });
    }
  };

  return (
    <div>
      <div>
        <label>
          Carregar Avatar Animado:
          <input type="file" accept=".glb, .gltf" onChange={handleAvatarUpload} />
        </label>
      </div>
      {selectedGltf && (
        <Canvas camera={{ position: [0, 1.5, 5], fov: 50 }} style={{ width: '100%', height: '300px' }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <AvatarContent gltf={selectedGltf} />
          <OrbitControls />
        </Canvas>
      )}
    </div>
  );
};

export default AvatarManager;
