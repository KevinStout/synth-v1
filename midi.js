// Create an audio context
let audioContext = new AudioContext();

// Create an oscillator and a gain node
let osc = audioContext.createOscillator();
let gainNode = audioContext.createGain();

// Connect the oscillator to the gain node and the gain node to the destination
osc.connect(gainNode);
gainNode.connect(audioContext.destination);

// Request MIDI access
navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure);

function onMIDISuccess(midiAccess) {
  // When we get a successful response, run this code
  console.log("MIDI Access Object", midiAccess);

  // Get all the input and output devices
  let inputs = midiAccess.inputs;
  let outputs = midiAccess.outputs;

  // Log the names of all connected MIDI input and output devices
  console.log("MIDI Input Devices:");
  inputs.forEach((input) => console.log(input.name));

  console.log("MIDI Output Devices:");
  outputs.forEach((output) => console.log(output.name));

  // Attach MIDI event listener to the first input device
  for (let input of inputs.values()) {
    input.onmidimessage = getMIDIMessage;
    break;
  }
}

function onMIDIFailure() {
  console.log("Could not access your MIDI devices.");
}

function getMIDIMessage(message) {
  let command = message.data[0];
  let note = message.data[1];
  let velocity = message.data.length > 2 ? message.data[2] : 0; // a velocity value might not be included with a noteOff command

  switch (command) {
    case 144: // noteOn
      if (velocity > 0) {
        noteOn(note);
      } else {
        noteOff();
      }
      break;
    case 128: // noteOff
      noteOff();
      break;
    // we could easily expand this switch statement to cover other types of commands such as controllers or sysex
  }
}

function noteOn(midiNote) {
  osc.frequency.value = midiNoteToFrequency(midiNote); // convert MIDI note to frequency
  gainNode.gain.value = 0.5; // set volume
  osc.start();
}

function noteOff() {
  osc.stop();
  osc = audioContext.createOscillator(); // create a new oscillator
  osc.connect(gainNode); // connect the new oscillator to the gain node
}

function midiNoteToFrequency(midiNote) {
  return Math.pow(2, (midiNote - 69) / 12) * 440; // formula to convert MIDI note to frequency
}
