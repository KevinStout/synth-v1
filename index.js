const audioContext = new AudioContext();
let osc1;
const masterGain = audioContext.createGain();
masterGain.gain.value = 0.5;

function makeOscillator() {
  osc1 = audioContext.createOscillator();
  osc1.type = "sine";
  osc1.frequency.value = document.querySelector("#osc1").value;
  osc1.connect(masterGain);
  osc1.start();
}

masterGain.connect(audioContext.destination);

document.querySelector("#play").addEventListener("mousedown", () => {
  audioContext.resume();
  makeOscillator();
});

document.querySelector("#play").addEventListener("mouseup", () => {
  if (osc1) {
    osc1.stop();
    osc1 = null;
  }
});

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
  if (!osc1) {
    osc1.type = e.target.value;
  }
});

document.querySelector("#osc1").addEventListener("input", (e) => {
  if (osc1) {
    osc1.frequency.value = e.target.value;
  }
});

document.querySelector("#waveShaper").addEventListener("input", (e) => {
  waveShaper.curve = makeDistortionCurve(e.target.value);
});
