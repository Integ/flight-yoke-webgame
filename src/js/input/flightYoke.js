// Lightweight flight yoke input helper using the Gamepad API.
// Exports:
// - initFlightYoke(): call once (e.g., on user gesture) to enable event logging and detection
// - readFlightYokeInput(): call each frame to read latest axis/button values or null if not found

let _detectedIndex = null;
let _debug = false;

export function initFlightYoke({ debug = true } = {}) {
    _debug = debug;

    if (!('getGamepads' in navigator)) {
        console.error('Gamepad API not supported in this browser');
        return;
    }

    window.addEventListener('gamepadconnected', (e) => {
        const gp = e.gamepad;
        if (_debug) console.log('Gamepad connected:', gp.index, gp.id);
        // Try to claim if it's a likely yoke
        if (isLikelyYoke(gp.id)) {
            _detectedIndex = gp.index;
            console.log('Detected Flight Yoke at index', _detectedIndex, gp.id);
        }
    });

    window.addEventListener('gamepaddisconnected', (e) => {
        if (_debug) console.log('Gamepad disconnected:', e.gamepad.index, e.gamepad.id);
        if (e.gamepad.index === _detectedIndex) {
            _detectedIndex = null;
            console.warn('Previously detected Flight Yoke disconnected');
        }
    });

    // Encourage user to move an axis or press a button to make the browser enumerate the device
    if (_debug) console.info('Call readFlightYokeInput() each frame. If yoke is not found, try moving axes or pressing a button on the device to wake the Gamepad API.');
}

function isLikelyYoke(id) {
    if (!id) return false;
    const lower = id.toLowerCase();
    // common substrings for Logitech yoke / joystick devices
    return lower.includes('logitech') || lower.includes('yoke') || lower.includes('flight');
}

export function readFlightYokeInput() {
    if (!('getGamepads' in navigator)) {
        if (_debug) console.error('Gamepad API not supported');
        return null;
    }

    const gamepads = navigator.getGamepads();

    // If we have previously detected an index, prefer that
    if (_detectedIndex !== null) {
        const gp = gamepads[_detectedIndex];
        if (gp) return _mapGamepadToYoke(gp);
        // otherwise fall through and attempt discovery
        _detectedIndex = null;
    }

    // Try to find a matching gamepad by id heuristics
    for (const gp of gamepads) {
        if (!gp) continue;
        if (isLikelyYoke(gp.id)) {
            _detectedIndex = gp.index;
            if (_debug) console.log('Found Flight Yoke at index', gp.index, gp.id);
            return _mapGamepadToYoke(gp);
        }
    }

    // If none matched, optionally log all connected gamepads for debugging
    if (_debug) {
        const connected = Array.from(gamepads).filter(g => g).map(g => `${g.index}: ${g.id}`);
        console.log('Connected gamepads:', connected.length ? connected : 'none');
    }

    return null;
}

function _mapGamepadToYoke(gp) {
    // Provide safe access to axes; mapping here is heuristic and may need adjustment per device
    const axes = gp.axes || [];
    const getAxis = (i) => (typeof axes[i] === 'number' ? axes[i] : 0);
    
    // Convert raw axis reading (-1 to 1) to proper range with correct directions
    const normalizeAxis = (value) => value;  // Keep -1 to 1 for control surfaces
    const normalizeThrottle = (value) => (-value + 1) / 2;  // Invert and convert to 0,1 range
    
    // Heuristic mapping (common for many yokes):
    // pitch: axis 0 (inverted), throttle: axis 2 (inverted), yaw: axis 3, roll: axis 1
    const pitch = -normalizeAxis(getAxis(0));     // Invert pitch: left should be negative
    const throttle = normalizeThrottle(getAxis(2));  // Invert throttle: forward should be more
    const yaw = normalizeAxis(getAxis(3));
    const roll = normalizeAxis(getAxis(1));

    if (_debug) {
        // throttle/pitch/roll/yaw rounded for compact logging
        console.debug('Yoke axes', {
            index: gp.index,
            id: gp.id,
            roll: Number(roll.toFixed(3)),
            pitch: Number(pitch.toFixed(3)),
            yaw: Number(yaw.toFixed(3)),
            throttle: Number(throttle.toFixed(3))
        });
    }

    return { throttle, pitch, roll, yaw };
}

export function getFlightYokeStatus() {
    const connected = ('getGamepads' in navigator) ? Array.from(navigator.getGamepads()).filter(g => g).map(g => ({ index: g.index, id: g.id, axes: g.axes.length, buttons: g.buttons.length })) : [];
    const detected = (typeof _detectedIndex === 'number' && _detectedIndex !== null) ? connected.find(c => c.index === _detectedIndex) : null;
    return {
        detectedIndex: _detectedIndex,
        detectedId: detected ? detected.id : null,
        connected
    };
}

export default { initFlightYoke, readFlightYokeInput, getFlightYokeStatus };