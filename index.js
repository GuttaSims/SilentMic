let audioContext;
let meter;
let serverURL = "YOUR_SECOND_LIFE_URL_HERE";  // Replace this with your SL script's URL

async function startMic() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioContext = new AudioContext();
        const source = audioContext.createMediaStreamSource(stream);
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        source.connect(analyser);

        meter = new Uint8Array(analyser.frequencyBinCount);

        function updateMeter() {
            analyser.getByteFrequencyData(meter);
            let volume = Math.max(...meter); // Get peak volume

            // Send volume to Second Life
            fetch(serverURL, {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: `volume=${volume}`
            });

            requestAnimationFrame(updateMeter);
        }

        updateMeter();
    } catch (error) {
        console.error("Microphone access denied!", error);
    }
}

document.getElementById("startButton").addEventListener("click", startMic);
