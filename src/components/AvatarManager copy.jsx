import React, { useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as THREE from 'three';

const AvatarContent = ({ gltf, addHeadband, addTexture, addParticles }) => {
  const { scene, animations } = gltf;
  const mixer = useRef(null);
  const headbandRef = useRef(null);
  const confettiParticles = useRef(null);

  useEffect(() => {
    console.log('AvatarContent: Scene loaded', scene);

    if (animations.length) {
      mixer.current = new THREE.AnimationMixer(scene);
      animations.forEach((clip) => {
        const action = mixer.current.clipAction(clip);
        action.play();
      });
    }

    if (addHeadband && !headbandRef.current) {
      const head = scene.getObjectByName('Head') || scene.getObjectByName('head') || scene.getObjectByName('Cabeça');
      if (head) {
        const geometry = new THREE.TorusGeometry(0.5, 0.05, 16, 100);
        const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        const headband = new THREE.Mesh(geometry, material);

        headband.position.set(0, 0.2, 0);
        headband.rotation.x = Math.PI / 2;

        head.add(headband);
        headbandRef.current = headband;
      }
    } else if (!addHeadband && headbandRef.current) {
      headbandRef.current.parent.remove(headbandRef.current);
      headbandRef.current = null;
    }

    if (addTexture) {
      const textureLoader = new THREE.TextureLoader();
      const customTexture = textureLoader.load('path/to/your/texture.png');

      scene.traverse((child) => {
        if (child.isMesh) {
          child.material.map = customTexture;
          child.material.needsUpdate = true;
        }
      });
    } else {
      scene.traverse((child) => {
        if (child.isMesh && child.material.map) {
          child.material.map = null;
          child.material.needsUpdate = true;
        }
      });
    }

    if (addParticles && !confettiParticles.current) {
      const confettiGeometry = new THREE.PlaneGeometry(0.1, 0.1);
      const confettiMaterial = new THREE.MeshBasicMaterial({ color: 0xffcc00 });
      confettiParticles.current = new THREE.Group();

      for (let i = 0; i < 100; i++) {
        const confetti = new THREE.Mesh(confettiGeometry, confettiMaterial);
        confetti.position.set(
          (Math.random() - 0.5) * 2,
          Math.random() * 2 + 1,
          (Math.random() - 0.5) * 2
        );
        confetti.velocity = new THREE.Vector3(
          (Math.random() - 0.5) * 0.02,
          -Math.random() * 0.02,
          (Math.random() - 0.5) * 0.02
        );
        confettiParticles.current.add(confetti);
      }

      scene.add(confettiParticles.current);
    } else if (!addParticles && confettiParticles.current) {
      scene.remove(confettiParticles.current);
      confettiParticles.current = null;
    }
  }, [animations, scene, addHeadband, addTexture, addParticles]);

  return <primitive object={scene} />;
};

const AvatarManager = ({ onAvatarLoad }) => {
  const [selectedGltf, setSelectedGltf] = useState(null);
  const [addHeadband, setAddHeadband] = useState(false);
  const [addTexture, setAddTexture] = useState(false);
  const [addParticles, setAddParticles] = useState(false);

  const handleAvatarUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      const loader = new GLTFLoader();
      loader.load(url, (gltf) => {
        console.log('AvatarManager: GLTF loaded', gltf);
        setSelectedGltf(gltf);
        onAvatarLoad(gltf.scene);
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
      <div>
        <label>
          <input
            type="checkbox"
            checked={addHeadband}
            onChange={(e) => setAddHeadband(e.target.checked)}
          />
          Adicionar Faixa na Cabeça
        </label>
      </div>
      <div>
        <label>
          <input
            type="checkbox"
            checked={addTexture}
            onChange={(e) => setAddTexture(e.target.checked)}
          />
          Aplicar Textura Personalizada
        </label>
      </div>
      <div>
        <label>
          <input
            type="checkbox"
            checked={addParticles}
            onChange={(e) => setAddParticles(e.target.checked)}
          />
          Adicionar Efeito de Confete
        </label>
      </div>
      {selectedGltf && (
        <Canvas camera={{ position: [0, 1.5, 5], fov: 50 }} style={{ width: '100%', height: '300px' }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <AvatarContent
            gltf={selectedGltf}
            addHeadband={addHeadband}
            addTexture={addTexture}
            addParticles={addParticles}
          />
          <OrbitControls />
        </Canvas>
      )}
    </div>
  );
};

export default AvatarManager;
