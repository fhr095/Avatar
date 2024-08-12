import React, { useEffect, useState } from 'react';
import * as THREE from 'three';

const getTimestamp = () => new Date().toISOString();

const Marker = ({ position, color }) => {
  return (
    <mesh position={position}>
      <sphereGeometry args={[0.5, 32, 32]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
};

const AvatarInteraction = ({ avatarModel, selectedMesh }) => {
    const [key, setKey] = useState(0);

    useEffect(() => {
        if (selectedMesh) {
            // Incrementa a chave para forçar a recriação do componente
            setKey(prevKey => prevKey + 1);
            console.log(`[${getTimestamp()}] AvatarInteraction: Component key updated to force re-render.`);
        }
    }, [selectedMesh]);

    return (
        avatarModel && selectedMesh && (
            <>
                {/* Recriar o grupo toda vez que o selectedMesh mudar */}
                <group key={key} position={selectedMesh.position} scale={new THREE.Vector3(1, 1, 1)}>
                    <primitive object={avatarModel.clone()} />
                </group>

                {/* Cubo azul para depuração */}
                <mesh position={selectedMesh.position} scale={1}>
                    <boxGeometry args={[1, 1, 1]} />
                    <meshStandardMaterial color="blue" />
                </mesh>

                {/* Marcadores */}
                <Marker position={selectedMesh.position} color="red" />
                <Marker position={selectedMesh.position} color="green" />
            </>
        )
    );
};

export default AvatarInteraction;
