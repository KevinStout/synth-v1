const audioContext = new (window.AudioContext || window.webkitAudioContext)();

const osc1 = audioContext.createOscillator();
osc1.type = "sine";
osc1.frequency.value = 440;

const masterGain = audioContext.createGain();
masterGain.gain.value = 0;

osc1.connect(masterGain);
masterGain.connect(audioContext.destination);

osc1.start();

document.addEventListener(
  "click",
  () => {
    audioContext.resume();
  },
  { once: true }
);

document.querySelector("#masterGain").addEventListener("input", (e) => {
  // Set the meastGain value to the input value this is a range from 0 to 100 so we multiply it by 0.01 to get a value from 0 to 1
  masterGain.gain.value = e.target.value * 0.01;
});

document.querySelector("#osc1Waveform").addEventListener("change", (e) => {
  osc1.type = e.target.value;
});

document.querySelector("#osc1").addEventListener("input", (e) => {
  osc1.frequency.value = e.target.value;
});
