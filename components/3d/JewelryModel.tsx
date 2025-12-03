import React, { useRef, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, MathUtils, MeshStandardMaterial, MeshPhysicalMaterial, DoubleSide, Color } from 'three';
import { MeshTransmissionMaterial, Environment, Float, Sparkles, useGLTF } from '@react-three/drei';

interface JewelryModelProps {
  metalColor: string;
  gemColor: string;
  modelUrl?: string; // New prop for external files
  hovered?: boolean;
  scale?: number;
}

export const JewelryModel: React.FC<JewelryModelProps> = ({ 
  metalColor, 
  gemColor, 
  modelUrl,
  hovered = false,
  scale = 1 
}) => {
  const meshRef = useRef<Mesh>(null);
  
  // Smooth rotation animation
  useFrame((state, delta) => {
    if (meshRef.current) {
      // Base rotation
      meshRef.current.rotation.y += delta * 0.2;
      
      // Interactive rotation boost on hover
      if (hovered) {
         meshRef.current.rotation.x = MathUtils.lerp(meshRef.current.rotation.x, 0.5, delta * 2);
         meshRef.current.rotation.y += delta * 0.5;
      } else {
         meshRef.current.rotation.x = MathUtils.lerp(meshRef.current.rotation.x, 0, delta * 2);
      }
    }
  });

  return (
    <group scale={scale}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <group ref={meshRef}>
            {modelUrl ? (
                <ImportedModel url={modelUrl} metalColor={metalColor} gemColor={gemColor} />
            ) : (
                <ProceduralRing metalColor={metalColor} gemColor={gemColor} />
            )}
        </group>
      </Float>
      
      {/* Extra ambient sparkles for luxury feel */}
      <Sparkles 
        count={60} 
        scale={8} 
        size={6} 
        speed={0.4} 
        opacity={0.5} 
        color="#FFF"
      />
      <Environment preset="studio" />
    </group>
  );
};

// Sub-component for loading GLB files
const ImportedModel = ({ url, metalColor, gemColor }: { url: string, metalColor: string, gemColor: string }) => {
    const { scene } = useGLTF(url);
    // Clone scene to avoid modifying the cached original if used elsewhere
    const clonedScene = useMemo(() => scene.clone(), [scene]);

    useEffect(() => {
        clonedScene.traverse((child: any) => {
            if (child.isMesh) {
                const matName = child.material.name ? child.material.name.toLowerCase() : '';
                
                // Heuristic: Check name or if the original material was transparent
                const isGem = matName.includes('gem') || 
                              matName.includes('diamond') || 
                              matName.includes('stone') || 
                              matName.includes('crystal') ||
                              child.material.transparent === true ||
                              child.material.opacity < 1;

                if (isGem) {
                    // High-quality physical material for gems
                    child.material = new MeshPhysicalMaterial({
                        color: gemColor,
                        roughness: 0.02, // Tiny bit of texture to catch specular highlights
                        metalness: 0.1, // Slight metalness adds contrast to reflections
                        transmission: 0.98, // Not 100% transparent gives it "body"
                        thickness: 3.5, // High thickness for substantial volume refraction
                        ior: 2.42, // Accurate Diamond IOR
                        dispersion: 15, // High dispersion for rainbow fire
                        clearcoat: 1,
                        clearcoatRoughness: 0,
                        specularIntensity: 5, // Blinding highlights
                        envMapIntensity: 3,
                        transparent: true,
                        opacity: 1,
                        side: DoubleSide, // Render backfaces for internal reflection
                        flatShading: true, // CRITICAL: Creates the "shattered" / faceted look
                        attenuationColor: new Color(gemColor), // Absorbs its own color
                        attenuationDistance: 0.5 // Light absorbs quickly, creating depth in corners
                    });
                    child.castShadow = true;
                } else {
                    // Ultra-polished Luxury Metal
                    child.material = new MeshStandardMaterial({
                        color: metalColor,
                        metalness: 1,
                        roughness: 0.01,
                        envMapIntensity: 2.5,
                    });
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            }
        });
    }, [clonedScene, metalColor, gemColor]);

    return <primitive object={clonedScene} />;
};

// Original Procedural Geometry
const ProceduralRing = ({ metalColor, gemColor }: { metalColor: string, gemColor: string }) => (
    <>
        {/* The Band */}
        <mesh castShadow receiveShadow rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2, 0.15, 16, 100]} />
        <meshStandardMaterial 
            color={metalColor} 
            metalness={1} 
            roughness={0.02}
            envMapIntensity={3}
        />
        </mesh>

        {/* The Settings */}
        {[0, 90, 180, 270].map((angle, i) => (
            <mesh key={i} position={[0, 2.1, 0]} rotation={[0, 0, (angle * Math.PI) / 180]}>
                <boxGeometry args={[0.1, 0.4, 0.1]} />
                <meshStandardMaterial color={metalColor} metalness={1} roughness={0.1} />
            </mesh>
        ))}

        {/* The Main Gem */}
        <mesh position={[0, 2.4, 0]} castShadow>
            <octahedronGeometry args={[0.8, 0]} />
            <MeshTransmissionMaterial 
                backside
                backsideThickness={1}
                thickness={3}
                chromaticAberration={1} 
                anisotropicBlur={0.5}
                ior={2.4} 
                color={gemColor}
                resolution={512}
                distortion={0.8} // High distortion for "shattered" look
                distortionScale={0.8}
                temporalDistortion={0.1}
            />
        </mesh>
    </>
);