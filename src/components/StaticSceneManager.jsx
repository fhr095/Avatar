import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const getTimestamp = () => new Date().toISOString(); // Definindo a função getTimestamp

const StaticSceneContent = ({ model }) => {
  return <primitive object={model} dispose={null} />;
};

const StaticSceneManager = ({ onMeshSelect, onStaticModelLoad }) => {
  const [staticModel, setStaticModel] = useState(null);
  const [staticMeshes, setStaticMeshes] = useState([]);
  const [lastSelectedMesh, setLastSelectedMesh] = useState(null);

  useEffect(() => {
    if (staticModel) {
      const meshes = [];
      staticModel.traverse((child) => {
        if (child.isMesh || child.isGroup) {
          meshes.push(child.clone()); // Clonando os meshes para evitar compartilhamento de referências
        }
      });
      setStaticMeshes(meshes);
      onStaticModelLoad(staticModel); // Passar o modelo estático carregado para o SceneInteractionManager
    }
  }, [staticModel, onStaticModelLoad]);

  const handleStaticModelUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      const loader = new GLTFLoader();
      loader.load(url, (gltf) => {
        const model = gltf.scene.clone();
        setStaticModel(model);
        console.log(`[${getTimestamp()}] StaticSceneManager: GLTF model loaded for preview.`, model);
      });
    }
  };

  const handleMeshSelection = (event) => {
    const selectedMeshIndex = event.target.value;
    const selectedMesh = staticMeshes[selectedMeshIndex];
    console.log(`[${getTimestamp()}] StaticSceneManager: Mesh selected in preview.`, selectedMesh);

    // Log adicional para monitorar o mesh selecionado
    console.log(`[${getTimestamp()}] StaticSceneManager: Selected mesh details`, {
      uuid: selectedMesh.uuid,
      name: selectedMesh.name,
      position: selectedMesh.position,
    });

    if (lastSelectedMesh && lastSelectedMesh.uuid !== selectedMesh.uuid) {
      console.log(`[${getTimestamp()}] StaticSceneManager: Previous selected mesh position before new selection:`, {
        name: lastSelectedMesh.name,
        position: lastSelectedMesh.position,
      });
    }

    setLastSelectedMesh(selectedMesh);
    onMeshSelect(selectedMesh.clone()); // Enviando uma cópia do mesh selecionado
  };

  return (
    <div>
      <div>
        <label>
          Carregar Modelo Estático:
          <input type="file" accept=".glb, .gltf" onChange={handleStaticModelUpload} />
        </label>
      </div>
      {staticModel && (
        <>
          <Canvas camera={{ position: [0, 5, 10], fov: 50 }} style={{ width: '100%', height: '300px' }}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1} />
            <StaticSceneContent model={staticModel} />
            <OrbitControls />
          </Canvas>
          <div>
            <label>
              Selecionar Mesh/Group:
              <select onChange={handleMeshSelection}>
                {staticMeshes.map((mesh, index) => (
                  <option key={index} value={index}>
                    {mesh.name || `Mesh/Group ${index + 1}`}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </>
      )}
    </div>
  );
};

export default StaticSceneManager;
