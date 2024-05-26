const audioContext = new (window.AudioContext || window.webkitAudioContext)();

const osc1 = audioContext.createOscillator();
osc1.type = "sine";
osc1.frequency.value = 440;

const masterGain = audioContext.createGain();
masterGain.gain.value = 0;

const waveShaper = audioContext.createWaveShaper();

function makeDistortionCurve(amount) {
  var k = typeof amount === "number" ? amount : 50,
    n_samples = 44100,
    curve = new Float32Array(n_samples),
    deg = Math.PI / 180,
    i = 0,
    x;
  for (; i < n_samples; ++i) {
    x = (i * 2) / n_samples - 1;
    curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
  }
  return curve;
}

// function makeDistortionCurve(amount = 50) {
//   let n_samples = 44100;
//   let curve = new Float32Array(n_samples);
//   let deg = Math.PI / 180;
//   for (let i = 0; i < n_samples; ++i) {
//     let x = (i * 2) / n_samples - 1;
//     curve[i] = ((Math.PI / 2) * x) / (Math.PI / 2 - Math.abs(x) * amount);
//   }
//   return curve;
// }

waveShaper.curve = makeDistortionCurve(0);
waveShaper.oversample = "4x";

osc1.connect(waveShaper);
waveShaper.connect(masterGain);
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

document.querySelector("#waveShaper").addEventListener("input", (e) => {
  waveShaper.curve = makeDistortionCurve(e.target.value);
});
