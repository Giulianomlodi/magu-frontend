"use client";
import { useRef, useEffect } from "react";
import { useLoader, useFrame } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { useGLTF, useAnimations } from "@react-three/drei";
import { Group } from "three";

interface EnvComponentProps {
    env_position: { x: number; y: number; z: number };
    env_scale: number;
}

export default function Model({
    env_position,
    env_scale,
}: EnvComponentProps) {
    const fileUrl = "/model/g.glb";
    const gltf = useLoader(GLTFLoader, fileUrl);
    const { animations } = useGLTF(fileUrl);
    const { names, actions } = useAnimations(animations);
    const groupRef = useRef<Group>(null!);

    console.log("animations", animations);
    console.log("actions", actions);

    useEffect(() => {
        const animationsToPlay = ["Curve3", "Curve5", "Curve6", "Curve7"];
        animationsToPlay.forEach((animationName) => {
            const index = names.indexOf(animationName);
            if (index !== -1) {
                const action = actions[index];
                console.log(`Playing animation: ${animationName}`);
                action?.reset().fadeIn(0.5).play();
            } else {
                console.log(`Animation not found: ${animationName}`);
            }
        });
    }, [actions, names]);

    useFrame(({ clock }) => {
        if (groupRef.current) {
            const elapsedTime = clock.getElapsedTime();
            groupRef.current.rotation.y = elapsedTime * 0.1; // Adjust the rotation speed as needed
        }
    });

    const handlePointerOver = () => {
        console.log("Pointer over");
        const animationsToPlay = ["Curve3", "Curve5", "Curve6", "Curve7"];
        animationsToPlay.forEach((animationName) => {
            const index = names.indexOf(animationName);
            if (index !== -1) {
                const action = actions[index];
                console.log(`Playing animation on hover: ${animationName}`);
                action?.reset().fadeIn(0.5).play();
            } else {
                console.log(`Animation not found on hover: ${animationName}`);
            }
        });
    };

    const handlePointerOut = () => {
        console.log("Pointer out");
        const animationsToStop = ["Curve3", "Curve5", "Curve6", "Curve7"];
        animationsToStop.forEach((animationName) => {
            const index = names.indexOf(animationName);
            if (index !== -1) {
                const action = actions[index];
                console.log(`Stopping animation on pointer out: ${animationName}`);
                action?.fadeOut(0.5).stop();
            } else {
                console.log(`Animation not found on pointer out: ${animationName}`);
            }
        });
    };

    return (
        <group
            ref={groupRef}
            position={[env_position.x, env_position.y, env_position.z]}
            scale={env_scale}
            onPointerOver={handlePointerOver}
            onPointerOut={handlePointerOut}
        >
            <primitive object={gltf.scene} />
        </group>
    );
}