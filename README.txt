ZEROWATT WIND - FIELD SIMULATION - CONTROL FIX UPDATE

START HERE
1. Extract the complete ZIP. Keep assets/ and vendor/ beside index.html.
2. Windows: double-click START-SERVER.bat. Mac/Linux: run node serve.js.
3. Open http://localhost:5500 in desktop Chrome. Keep the terminal open.
4. Click JARVIS, enable the desired controls, and allow camera/microphone.

Node.js is required for the local server: https://nodejs.org/
No npm install or build is needed to run this copy.
For friend-friendly instructions and troubleshooting, read CONTROL-GUIDE.md.

WHAT WAS FIXED
- Face control leaves wind unchanged by default. Optional lip wind input is
  explicitly enabled, requires a deliberate hold, and stops after two seconds.
  It is suspended while Voice is on. Lip shape is not a measurement of blowing.
- Face control calibrates your straight-ahead position and rearms at centre.
- Pinch clicks have priority over zoom and use a short time-based hold.
  Begin with fingers apart. Hold and move to drag; release before clicking again.
- Cursor smoothing accounts for frame timing, and closing fingers keeps your aim.
- Two-finger adjustment requires a half-second hold and ignores small jitter.
- Voice previews cannot execute commands; each final result runs once.
- Offline English voice recognition is bundled and selected by default. This
  bypasses Chrome's online speech service and its repeated session failures.
- Browser service errors keep their actual cause; normal silence is retried.
- Decimal and spoken-number commands work, including seven point five.
- Spoken replies start off to reduce microphone feedback.
- Camera model imports are fixed, and the MediaPipe runtime/models are bundled.
- STOP ALL CONTROLS cancels pending startup and releases camera/microphone.

QUICK CONTROLS
Hands: point to aim; pinch thumb+index to click; hold pinch and move to drag;
       open palm swipe to switch window; open palm vertical motion to scroll.
Face: look straight for one second, turn and hold to switch window, return
      to centre to rearm. Use Recenter if you change position.
Voice: say one command and pause. Try "set wind speed to seven point five",
       "increase wind speed", "switch window", "pause", or "zoom in".
Mouse/keyboard have priority. Wait two seconds after using them before gesturing.
Alt+J opens/closes the Jarvis panel.

Leave Voice engine set to Offline English and wait for the model to load.
This mode does not need internet or an API key. Browser speech service is an
optional alternative; if it reports a service error, switch back to Offline
English. Keep offline-voice.js and vendor/vosk/ in the extracted folder.
Do not launch index.html directly when using camera/mic. Use localhost or HTTPS.
Your localhost URL is not a shareable internet link: send the ZIP, or host the
complete static site on HTTPS. Each visitor grants their own camera/mic access.

VERIFY / EDIT
- npm install, then npm test: control regression tests (simulated input).
- Open /tests/model-smoke.html on the local server: real bundled model smoke test.
- Open /tests/voice-smoke.html: actual offline recognition of a generated recording.
- jarvis.js: control logic; jarvis.css: panel/cursors. Refresh after editing.
- offline-voice.js: local English audio processing and recognizer lifecycle.
- app.js / scene.js: interface and 3D scene. Rebuild with npm run build.
- model.js: physics/catalogue, loaded directly. Refresh after editing.
- get-models.js: refresh the bundled model downloads with npm run get-models.
- get-voice-model.js: refresh offline speech files with node get-voice-model.js.

SCENE CONTROLS
Wind speed/pattern: windsock, tree lean, clouds, rotor speed, debris.
Rain: rain/puddles/pond rings. Temperature: heat haze or water tint.
Rotor diameter: rotor size. Gear reduction: gold reduction gear size.
Installed units: roof prototypes. Pond mounting: moving or moored pontoons.
Room volume/occupants/ventilation: building size, people, open windows.
Pond volume/oxygen demand: basin size and fish behaviour.
Manual brake: red shaft collar (amber indicates storm lock).

Wind patterns naturally vary the live wind readout. Choose Steady wind when
checking that the Wind speed slider stays fixed during idle control input.
