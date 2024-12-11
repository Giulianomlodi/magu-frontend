"use client";
import { Canvas } from "@react-three/fiber";
import {
    PresentationControls,
} from "@react-three/drei";
import Model from "./ModelComponent";

export function CanvasComponent() {

    const env_position = { x: 0, y: 0, z: 0 };
    const env_scale = 2;

    return (
        <>
            <Canvas>

                <PresentationControls
                    snap
                    global
                    zoom={0.8}
                    rotation={[0, -Math.PI / 5, 0]}

                >
                    <ambientLight />
                    <pointLight position={[10, 10, 10]} />
                    <Model env_position={env_position} env_scale={env_scale} />
                </PresentationControls>
            </Canvas>
        </>
    );
}

// "use client";

// import { useRef, useEffect, useState, Suspense } from "react";
// import { Canvas } from "@react-three/fiber";
// import {
//   PositionalAudio,
//   CameraControls,
//   PresentationControls,
// } from "@react-three/drei";
// import { useControls } from "leva";
// import Environment from "./Environment";
// import { useAccount } from "wagmi";

// interface ModelControlProps {
//   model_position: { x: number; y: number; z: number };
//   camera_position: { x: number; y: number; z: number };
//   model_scale: number;
// }
// interface EnvControlProps {
//   env_position: { x: number; y: number; z: number };
//   env_scale: number;
// }

// export function Graffiti() {
//   const { isConnected } = useAccount();
//   const [audioReady, setAudioReady] = useState(false);

//   const env_controls = useControls({
//     env_position: {
//       x: 0,
//       y: 0,
//       z: 0,
//     },
//     env_scale: 2,
//   }) as EnvControlProps; // Cast to the correct type

//   const { env_position, env_scale } = env_controls;

//   return (
//     <>
//       <Canvas className="canvasGeneral">
//         <PresentationControls
//           snap
//           global
//           zoom={0.8}
//           rotation={[0, -Math.PI / 5, 0]}
//           polar={[0, Math.PI / 4]}
//           azimuth={[-Math.PI / 4, Math.PI / 4]}
//         >
//           <ambientLight />
//           <pointLight position={[10, 10, 10]} />
//           <Environment env_position={env_position} env_scale={env_scale} />
//         </PresentationControls>
//       </Canvas>
//     </>
//   );
// }