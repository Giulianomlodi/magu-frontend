'use client'
import React, { useEffect, useRef, useState } from 'react';
import { Application } from '@splinetool/runtime';

interface Test3DSplineProps {
    splineUrl: string;
}

const Test3DSpline: React.FC<Test3DSplineProps> = ({ splineUrl }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [loading, setLoading] = useState(true); // Added loading state

    useEffect(() => {
        if (canvasRef.current) {
            const app = new Application(canvasRef.current);
            app.load(splineUrl).then(() => {
                setLoading(false); // Set loading to false when loaded
            });
        }
    }, [splineUrl]);

    return (
        <>
            {loading && <div></div>} {/* Display loading message */}
            <canvas style={{ cursor: 'grab' }} ref={canvasRef} id="canvas3d" />
        </>
    );
};

export default Test3DSpline;
