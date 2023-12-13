const audioContext = new AudioContext();

const NOTE_DETAILS = [
  { note: "C", key: "Z", frequency: 261.626, active: false },
  { note: "Db", key: "S", frequency: 277.183, active: false },
  { note: "D", key: "X", frequency: 293.665, active: false },
  { note: "Eb", key: "D", frequency: 311.127, active: false },
  { note: "E", key: "C", frequency: 329.628, active: false },
  { note: "F", key: "V", frequency: 349.228, active: false },
  { note: "Gb", key: "G", frequency: 369.994, active: false },
  { note: "G", key: "B", frequency: 391.995, active: false },
  { note: "Ab", key: "H", frequency: 415.305, active: false },
  { note: "A", key: "N", frequency: 440, active: false },
  { note: "Bb", key: "J", frequency: 466.164, active: false },
  { note: "B", key: "M", frequency: 493.883, active: false },
];

// --- Listening for any key press down ---
document.addEventListener("keydown", (e) => {
  // Guard clause
  // When we press & hold a key, we don't want it to re-run multiple times
  if (e.repeat) return;

  const keyPressed = e.code.split("Key")[1];
  const noteDetailRetrieved = getNoteDetail(keyPressed);

  // Another guard clause to protect against a key not in list
  if (noteDetailRetrieved == null) return;

  // Set active to true to play note (Simulates hold down key)
  noteDetailRetrieved.active = true;
  playNote();
});

// --- Listening for any key let go ---
document.addEventListener("keyup", (e) => {
  const keyPressed = e.code.split("Key")[1];
  const noteDetailRetrieved = getNoteDetail(keyPressed);

  if (noteDetailRetrieved == null) return;

  // Set active to false to stop note (Simulates Release key)
  noteDetailRetrieved.active = false;
  playNote();
});

// --- HELPER FUNCTIONS (HF) ---
// HF to get the note detail
function getNoteDetail(keyPressed) {
  return NOTE_DETAILS.find((eachObj) => eachObj.key === keyPressed);
}

// HF to play the note
function playNote() {
  // --- Amending the visuals on the keyboard ---
  NOTE_DETAILS.forEach((eachKey) => {
    const keyElement = document.querySelector(`[data-note="${eachKey.note}"]`);
    // Toggle the key based on whether NOTE_DETAIL is true or false
    keyElement.classList.toggle("active", eachKey.active);

    if (eachKey.oscillator != null) {
      eachKey.oscillator.stop();
      eachKey.oscillator.disconnect();
    }
  });

  // --- Playing the note ---
  // Get an array of notes that are currently active
  const activeNotes = NOTE_DETAILS.filter((eachObj) => eachObj.active);

  // Reduce the volume if there is more than 1 note playing at once
  const gain = 1 / activeNotes.length;
  activeNotes.forEach((eachNote) => startNote(eachNote, gain));
}

// HF to start the note
function startNote(eachNoteDetails, gain) {
  // Setting the volume
  const gainNode = audioContext.createGain();
  gainNode.gain.value = gain;

  const oscillator = audioContext.createOscillator();
  oscillator.frequency.value = eachNoteDetails.frequency;
  oscillator.type = "sine";

  oscillator.connect(gainNode).connect(audioContext.destination);
  oscillator.start();

  // Save it to a global variable so we have access
  eachNoteDetails.oscillator = oscillator;
}
