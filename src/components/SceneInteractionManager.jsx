// components/SceneInteractionManager.jsx
import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import AvatarManager from './AvatarManager';
import StaticSceneManager from './StaticSceneManager';
import AvatarInteraction from './AvatarInteraction'; // Importe o novo componente
import * as THREE from 'three';

const getTimestamp = () => new Date().toISOString();

const SceneInteractionManager = () => {
  const [avatarModel, setAvatarModel] = useState(null);
  const [staticModel, setStaticModel] = useState(null);
  const [selectedMesh, setSelectedMesh] = useState(null);
  const [interactionSceneLoaded, setInteractionSceneLoaded] = useState(false);
  const [lastMeshPosition, setLastMeshPosition] = useState(null);

  useEffect(() => {
    if (avatarModel && staticModel) {
      console.log(`[${getTimestamp()}] SceneInteractionManager: Both models loaded. Ready for interaction.`);
      if (!interactionSceneLoaded) {
        setInteractionSceneLoaded(true);
        console.log(`[${getTimestamp()}] SceneInteractionManager: Interaction scene loaded successfully.`);
      }
    }
  }, [avatarModel, staticModel]);

  const handleMeshSelect = (mesh) => {
    console.log(`[${getTimestamp()}] SceneInteractionManager: Mesh selected in interaction scene.`, mesh);

    if (lastMeshPosition && !mesh.position.equals(lastMeshPosition)) {
      console.log(`[${getTimestamp()}] SceneInteractionManager: Mesh position has changed from previous interaction.`, {
        name: mesh.name,
        lastPosition: lastMeshPosition,
        currentPosition: mesh.position,
      });
    }

    setLastMeshPosition(mesh.position.clone());
    setSelectedMesh(mesh);
  };

  useEffect(() => {
    console.log(`[${getTimestamp()}] SceneInteractionManager: AvatarManager and StaticSceneManager mounted.`);
  }, []);

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div style={{ flex: 2, position: 'relative' }}>
        {interactionSceneLoaded && (
          <Canvas camera={{ position: [0, 5, 10], fov: 50 }} style={{ width: '100%', height: '100%' }}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1} />
            {staticModel && <primitive object={staticModel.clone()} dispose={null} />}
            {avatarModel && selectedMesh && (
              <AvatarInteraction avatarModel={avatarModel} selectedMesh={selectedMesh} /> // Use o novo componente
            )}
            <OrbitControls />
          </Canvas>
        )}
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1, borderBottom: '1px solid black', padding: '10px' }}>
          <AvatarManager onAvatarLoad={setAvatarModel} />
        </div>
        <div style={{ flex: 1, padding: '10px' }}>
          <StaticSceneManager onMeshSelect={handleMeshSelect} onStaticModelLoad={setStaticModel} />
        </div>
      </div>
    </div>
  );
};

export default SceneInteractionManager;
