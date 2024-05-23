// script.js

document.addEventListener("DOMContentLoaded", () => {
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const canvasContext = canvas.getContext('2d');

    // Access the camera
    navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
        .then((stream) => {
            video.srcObject = stream;
            video.setAttribute("playsinline", true); // Required to tell iOS safari we don't want fullscreen
            video.play();
            requestAnimationFrame(tick);
        })
        .catch((err) => {
            console.error("Error accessing the camera: ", err);
        });

    function tick() {
        if (video.readyState === video.HAVE_ENOUGH_DATA) {
            canvas.hidden = false;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            canvasContext.drawImage(video, 0, 0, canvas.width, canvas.height);

            const imageData = canvasContext.getImageData(0, 0, canvas.width, canvas.height);
            const code = jsQR(imageData.data, imageData.width, imageData.height, {
                inversionAttempts: "dontInvert",
            });

            if (code) {
                console.log("QR code found:", code.data);
                alert(`QR Code detected: ${code.data}`);
            }
        }
        requestAnimationFrame(tick);
    }
});
