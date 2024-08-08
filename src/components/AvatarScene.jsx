import React, { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as THREE from 'three';
import '../App.css';

const Avatar = ({ gltf }) => {
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
    mixer.current?.update(delta);
  });

  return <primitive object={scene} />;
};

const AvatarScene = () => {
  const [gltfFiles, setGltfFiles] = useState([]);
  const [selectedGltf, setSelectedGltf] = useState(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      const loader = new GLTFLoader();
      loader.load(url, (gltf) => {
        console.log('GLTF loaded:', gltf);
        setGltfFiles((prevFiles) => [...prevFiles, { file, gltf }]);
        // Seleciona automaticamente o primeiro arquivo carregado
        setSelectedGltf(gltf);
      });
    }
  };

  const handleSelectionChange = (event) => {
    const selectedIndex = event.target.value;
    setSelectedGltf(gltfFiles[selectedIndex].gltf);
  };

  return (
    <div>
      <div className="controls">
        <input type="file" accept=".glb, .gltf" onChange={handleFileUpload} />
        <select onChange={handleSelectionChange}>
          {gltfFiles.map((gltfFile, index) => (
            <option key={index} value={index}>
              {gltfFile.file.name}
            </option>
          ))}
        </select>
      </div>
      <div className="canvas-container">
        {selectedGltf && (
          <Canvas
            camera={{ position: [0, 1.5, 5], fov: 50 }} /* Ajusta a posição e o campo de visão da câmera */
            style={{ width: '100%', height: '100%' }}
          >
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1} />
            <Avatar gltf={selectedGltf} />
            <OrbitControls />
          </Canvas>
        )}
      </div>
    </div>
  );
};

export default AvatarScene;
