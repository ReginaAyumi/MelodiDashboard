import React, { useRef, useEffect, useState } from "react";
import { Box, Button, Typography } from "@mui/material";

const CameraComponent = () => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [detections, setDetections] = useState([]);

    // Initialize camera
    useEffect(() => {
        const startCamera = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (error) {
                console.error("Error starting camera:", error);
            }
        };
        startCamera();
    }, []);

    // Capture frame and send to API
    const captureFrame = async () => {
        try {
            const canvas = canvasRef.current;
            const context = canvas.getContext("2d");
            const video = videoRef.current;

            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            context.drawImage(video, 0, 0, canvas.width, canvas.height);

            const frame = canvas.toDataURL("image/jpeg");
            console.log("Frame data:", frame);
            
            const response = await fetch("http://localhost:5001/api/recognize", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ frameData: frame }),
            });

            if (!response.ok) {
                throw new Error(`API Error: ${response.statusText}`);
            }

            const data = await response.json();
            setDetections(data.detections || []);
        } catch (error) {
            console.error("Error capturing frame or sending to API:", error);
        }
    };

    return (
        <Box m="1.5rem 2.5rem">
            <Typography variant="h4" mb={2}>Face Recognition Camera</Typography>
            <Box display="flex" flexDirection="column" alignItems="center">
                <video ref={videoRef} autoPlay muted style={{ width: "100%", maxWidth: "500px" }}></video>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={captureFrame}
                    style={{ margin: "1rem 0" }}
                >
                    Capture Frame
                </Button>
            </Box>
            <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
            {/* <Box>
                {console.log("Current detections:", detections)}
                {detections.length > 0 ? (
                    detections.map((detection, index) => (
                        <Box key={index} p={2} border="1px solid #ccc" borderRadius="8px" mb={2}>
                            <Typography variant="body1">Gender: {detection.gender}</Typography>
                            <Typography variant="body1">
                                Age: {detection.age.value} ({detection.age.category})
                            </Typography>
                            <Typography variant="body1">Expression: {detection.expression}</Typography>
                        </Box>
                    ))
                ) : (
                    <Typography variant="body2">No detections available.</Typography>
                )}
            </Box> */}
        </Box>
    );
};

export default CameraComponent;