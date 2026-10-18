# ZeroWatt Wind — guide to share with friends

## Start the website

1. Unzip the complete downloaded ZIP. Keep `vendor`, `assets`, and the other files together.
2. Install Node.js if it is not already installed: https://nodejs.org/ .
3. On Windows, double-click **START-SERVER.bat**. Keep its terminal window open. On Mac/Linux, run `node serve.js` from the extracted folder.
4. Open **http://localhost:5500** in desktop Google Chrome. Edge can also be tried if its speech service is available. Use a normal browser window, not a messaging app's embedded browser.
5. Click **JARVIS**, then turn on **Hands**, **Face**, or **Voice** individually, or click **ACTIVATE ALL**. Allow the camera and microphone for this site when asked.
6. Wait for the selected controls to show **ON**. Let go of the mouse for two seconds before trying gestures. Leave **Gesture sensitivity** at 60% to start.

No `npm install` or build is needed to run this copy. The hand/face models and offline English speech model are included, so they do not need a first-run download. The microphone is enabled only when Voice is switched on.

## Hand control

Use one hand first, in good light, about 40–80 cm from the camera. Keep the whole hand in view. Movement is mirrored: moving your hand right moves the ring right.

| Action | What to do |
| --- | --- |
| Move the cursor | Point your index finger; keep thumb and index apart. Aim the green ring at the control. |
| Click a button | Touch thumb and index together and hold briefly, about 0.2 seconds. Then separate them. A held pinch clicks only once. |
| Drag a slider | Point at its track, pinch, keep pinching and move left or right. Separate fingers to release. |
| Rotate the 3D view | Point at the 3D scene, pinch and move your hand. Release to stop. |
| Change a dropdown | Point at it and pinch once to select its next option. Repeat to cycle through the choices. |
| Switch building / pond | With an open palm, sweep horizontally across the camera view. |
| Scroll | With an open palm, move up or down. |
| Zoom | Put the ring over the 3D scene. Keep thumb and index apart; slowly open your fingers to zoom in or close them to zoom out. |
| Fine adjustment | Hold index and middle fingers up over a control for half a second, until it gets a blue outline. Slide sideways. Lower your fingers to release. Small movements are ignored. |

Start each click with fingers apart. If a hand enters the picture already pinched, it will not click until you release and pinch again. This prevents accidental clicks after tracking is lost.

If you see **MOUSE IN USE**, stop moving the mouse or typing and wait two seconds. If aiming is shaky, lower sensitivity and move more slowly. Pinch detection itself does not become harder when you lower sensitivity.

## Face control

1. Turn **Face** on and look straight ahead, staying still for about one second. The status changes from calibration to ready.
2. Turn your head noticeably left or right and hold for about half a second to switch between building ventilation and pond aeration.
3. Return to the centre and pause briefly before turning again. Holding your head turned causes just one switch.
4. Click **Recenter face — look straight** if your seating position changes. After your face leaves and returns, look straight again for calibration.

**Face control does not change wind speed by default.** Talking, smiling, or sitting still should leave the wind setting alone.

The optional **Enable lip gesture to raise wind** checkbox recognises a lip shape, not actual blowing or airflow. To try it, turn Voice off, enable the checkbox, relax your lips first, then pucker and hold for roughly a second. Wind increases for at most two seconds per hold. Relax to rearm. Keep this option off during normal use and conversation. It is always off when the page first loads.

## Voice control

Leave **Voice engine** set to **Offline English** and turn **Voice** on. Wait for “Offline English ready”; the first model load can take a moment. Check that the MIC bar moves when you speak. Speak one English command clearly and then pause. The VOICE row previews what is heard; a command runs once the speech engine finishes the utterance.

To check the input separately, click **CHECK MICROPHONE · 8 SECONDS** and speak. The MIC bar shows an input percentage and reports silence or a device mute. The check releases the microphone automatically after eight seconds; it does not run commands. **STOP ALL CONTROLS** ends it immediately. Audio startup failures now appear as errors instead of leaving a motionless bar with a misleading “mic OK” message.

The building has framed side windows with actual wall openings. **Background ventilation** opens the hinged panes; blue particles enter through those openings. At the minimum setting the panes close, while the model retains 0.2 ACH for leakage.

Offline English processes your microphone audio locally in a browser worker. It does not use Chrome's online speech-recognition service, an API key, or internet access. Keep `offline-voice.js` and `vendor/vosk/` in the extracted folder. The ZIP is larger because it contains the speech model.

**Browser speech service** is an optional alternative. Only for that engine, pick **English (India)**, **English (US)**, or **English (UK)** to suit your accent. This engine may require internet and an available browser service. The language selector is disabled for Offline English because that bundled model is English.

Try these exact phrases, optionally starting with “Jarvis”:

- “Set the wind speed to seven point five” or “Set wind speed to 7.5.”
- “Increase wind speed” / “Decrease wind speed.” These change it by 2 m/s.
- “Increase wind speed by one.”
- “Set rain intensity to zero point two.”
- “Wind pattern gusts” / “Wind pattern steady.”
- “Next condition,” “Monsoon,” “Cyclone,” or “Case three.”
- “Pond aeration,” “Building ventilation,” or “Switch window.”
- “Pause,” “Play,” “Zoom in,” “Zoom out,” “Rotate left,” or “Scroll down.”
- “Fit to screen,” “Exit,” “Reset camera,” or “Reset.”
- “Brake on,” “Brake off,” “Change the wind sensor,” or “Pick rugged parts.”
- “Stop listening” to switch Voice off.

The same increase/decrease/set commands work for air temperature, rotor diameter, gear reduction, room volume, occupants, background ventilation, duct pressure, pond volume, water temperature, oxygen demand, units, and boats where those controls are available.

**Spoken replies are off initially** to avoid speaker feedback. Enable them if desired, preferably with headphones. You can also test the command parser by typing a phrase into the Jarvis command box and pressing Enter.

If Voice does not work:

1. Check the VOICE and MIC rows for the actual error. Use **Offline English** if the browser speech service reports **N/A**, **SERVICE**, **network**, or repeated session endings.
2. If the mic bar does not move, allow Microphone in the browser's site permissions and check the selected input device and your operating system's microphone permission.
3. If the mic bar moves, capture works, but that does not prove the browser's online speech service is working. Select **Offline English**, then turn Voice on. A browser network/service error is no longer replaced by a generic microphone message.
4. Use a quiet room and one short command followed by a pause. For the optional browser engine, you can also try another English accent setting.
5. Switch Voice off and on after correcting permissions. Typing a command can confirm that the app understands the phrase even if speech recognition is unavailable.

## Stop and share

- Click **STOP ALL CONTROLS** to stop hand, face and voice control and release the camera/microphone. Mouse and keyboard remain available.
- Voice turns off if you leave the browser tab. Turn it on again when you return. Face calibration restarts on return.
- Send friends the complete fixed ZIP. Each friend extracts it and starts their own local server. **Your localhost link only works on your own computer.**
- For a single link that friends can visit, host the extracted website files on an **HTTPS** static host. Include `assets/`, `offline-voice.js`, and the entire `vendor/` directory. Each visitor grants their own camera/mic permissions. An ordinary HTTP link to a LAN address is not sufficient for camera/mic access.
- In “Gusts,” “Repeating lull,” or “Storm gusts” patterns, the live simulated wind naturally varies. The **Wind speed slider** is the setting controlled by commands; choose **Steady wind** when checking for unwanted changes.

## Verification and development

Regression checks: `npm install`, then `npm test`. The tests cover idle wind, face calibration and rearming, limited optional lip gestures, single pinch clicks, slider dragging, tracking loss, adjustment jitter, decimal/spoken numbers, speech previews and duplicates, and cancelling pending microphone requests.

To verify the bundled camera runtime without using a camera, visit `http://localhost:5500/tests/model-smoke.html` and click **Test models**. Both models should report PASS.

For a real offline speech test without a microphone, visit `http://localhost:5500/tests/voice-smoke.html` and click **Test offline voice**. It activates the actual Voice button with a generated recording, checks that the MIC bar moves and the real recognizer changes wind to 7.5 m/s, then verifies that stopping resets the meter and releases the input. The generated stream substitution exists only in the diagnostic iframe.

The unit tests use simulated landmarks and speech events; the smoke tests use the real models. Actual recognition quality still depends on your camera, lighting, microphone, accent and browser; try the controls on those devices before demonstrating them. The optional browser speech service also depends on service availability and often internet access.

References: [Vosk browser recognizer](https://www.npmjs.com/package/vosk-browser), [Vosk models](https://alphacephei.com/vosk/models), [Chrome Web Speech API](https://developer.chrome.com/blog/voice-driven-web-apps-introduction-to-the-web-speech-api/), [MediaPipe face landmark web guide](https://developers.google.com/edge/mediapipe/solutions/vision/face_landmarker/web_js).
