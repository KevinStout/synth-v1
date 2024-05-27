const audioContext = new AudioContext();

// This array holds all the notes we want to be able to play
const notes = [
  { note: "A4", frequency: 440.0, key: "z" },
  { note: "B4", frequency: 493.88, key: "x" },
  { note: "C4", frequency: 261.63, key: "c" },
  { note: "D4", frequency: 293.66, key: "v" },
  { note: "E4", frequency: 329.63, key: "b" },
  { note: "F4", frequency: 349.23, key: "n" },
  { note: "G4", frequency: 392.0, key: "m" },
];

// This object will hold all the active oscillators
const activeOscillators = {};

// This is the master gain node that all the oscillators will connect to (it is like the volume control)
const masterGain = audioContext.createGain();
masterGain.gain.value = 0.5;

// This function creates an oscillator with the frequency passed in and connects it to the masterGain
function makeOscillator(frequency) {
  const osc = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  const pannerNode = new PannerNode(audioContext, { panningModel: "equalpower" });

  osc.type = document.querySelector("#osc1Waveform").value;
  osc.frequency.value = frequency;
  osc.connect(gainNode);
  gainNode.connect(pannerNode);
  pannerNode.connect(masterGain);
  osc.start();
  // this is smoothing the volume of the oscillator so it doesn't click when it starts
  gainNode.gain.setValueAtTime(0, audioContext.currentTime); // set the gain to 0
  gainNode.gain.linearRampToValueAtTime(1, audioContext.currentTime + 0.01); // linearly ramp the gain up to 1 over 0.01 seconds
  return { osc, gainNode, pannerNode };
}

masterGain.connect(audioContext.destination);

document.querySelector("#masterGain").addEventListener("input", (e) => {
  // Set the meastGain value to the input value this is a range from 0 to 100 so we multiply it by 0.01 to get a value from 0 to 1
  masterGain.gain.value = e.target.value * 0.01;
});

// This event listener listens for keydown events and if the key pressed is one of the keys in the notes array it will create an oscillator with the frequency of the note
document.addEventListener("keydown", (e) => {
  for (let note of notes) {
    if (e.key === note.key && !activeOscillators[note.key]) {
      audioContext.resume();
      activeOscillators[note.key] = makeOscillator(note.frequency);
    }
  }
});

// This event listener listens for keyup events and if the key released is one of the keys in the notes array it will stop the oscillator
document.addEventListener("keyup", (e) => {
  for (let note of notes) {
    if (e.key === note.key && activeOscillators[note.key]) {
      activeOscillators[note.key].gainNode.gain.setValueAtTime(1, audioContext.currentTime); // start at full volume
      activeOscillators[note.key].gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.01); // ramp to 0 volume over 0.01 seconds
      activeOscillators[note.key].osc.stop(audioContext.currentTime + 0.02); // stop the oscillator after the volume has ramped down
      delete activeOscillators[note.key];
    }
  }
});

// this creates a row of buttons for each note that can be clicked to play the note
for (let i = 0; i < notes.length; i++) {
  const note = notes[i];
  const button = document.createElement("button");
  button.textContent = note.note;
  button.addEventListener("mousedown", () => {
    audioContext.resume();
    makeOscillator(note.frequency);
  });
  button.addEventListener("mouseup", () => {
    if (osc) {
      osc.stop();
      osc = null;
    }
  });
  document.querySelector("#keyboard").appendChild(button);
}

// document.querySelector("#pannerSlider").addEventListener("input", (e) => {
//   const panValue = e.target.value * 0.01;
//   for (let key in activeOscillators) {
//     const { pannerNode } = activeOscillators[key];
//     pannerNode.positionX.setValueAtTime(panValue, audioContext.currentTime);
//   }
// });

function animate() {
  const time = audioContext.currentTime;

  for (let key in activeOscillators) {
    const { pannerNode } = activeOscillators[key];
    pannerNode.positionX.setValueAtTime(Math.sin(time), audioContext.currentTime);
  }

  requestAnimationFrame(animate);
}

animate();
