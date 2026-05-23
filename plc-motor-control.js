/**
 * PLC Forward & Reverse Motor Control Simulation logic
 * Implements: state transitions, motor dynamics, ladder logic updates, and canvas plotting.
 */

document.addEventListener('DOMContentLoaded', () => {
    // State definitions
    const STATE_IDLE = 'IDLE';
    const STATE_FORWARD = 'FORWARD';
    const STATE_DWELL = 'DWELL';
    const STATE_REVERSE = 'REVERSE';

    let currentState = STATE_IDLE;
    let systemOn = false;
    let timerAccumulator = 0; // in milliseconds
    const TIMER_LIMIT_FWD = 10000; // 10s
    const TIMER_LIMIT_DWELL = 5000; // 5s
    const TIMER_LIMIT_REV = 10000;  // 10s

    // Motor physics
    let currentRPM = 0;
    let targetRPM = 0;
    const MAX_RPM = 1450; // standard 4-pole motor speed at 50Hz
    let rotorAngle = 0;

    // DOM elements
    const plcSwitch = document.getElementById('plc-switch');
    const labelOn = document.getElementById('label-on');
    const labelOff = document.getElementById('label-off');

    const lightPower = document.getElementById('light-power');
    const lightFwd = document.getElementById('light-fwd');
    const lightDwell = document.getElementById('light-dwell');
    const lightRev = document.getElementById('light-rev');

    const valFwdTimer = document.getElementById('val-fwd-timer');
    const valDwellTimer = document.getElementById('val-dwell-timer');
    const valRevTimer = document.getElementById('val-rev-timer');

    const panelFwdTimer = document.getElementById('panel-fwd-timer');
    const panelDwellTimer = document.getElementById('panel-dwell-timer');
    const panelRevTimer = document.getElementById('panel-rev-timer');

    const rotorGroup = document.getElementById('rotor-group');
    const arrowFwd = document.getElementById('arrow-fwd');
    const arrowRev = document.getElementById('arrow-rev');
    const motorSpeedVal = document.getElementById('motor-speed-val');
    const motorDirVal = document.getElementById('motor-dir-val');

    // Ladder Logic elements
    const rungLines = [
        document.getElementById('rung-line-0'),
        document.getElementById('rung-line-1'),
        document.getElementById('rung-line-2'),
        document.getElementById('rung-line-3')
    ];
    const contactSwitch = document.getElementById('contact-switch');
    const coilSystem = document.getElementById('coil-system');
    const contactFwdM0 = document.getElementById('contact-fwd-m0');
    const contactFwdT2 = document.getElementById('contact-fwd-t2');
    const contactFwdInterlock = document.getElementById('contact-fwd-interlock');
    const coilFwd = document.getElementById('coil-fwd');
    const contactRevM0 = document.getElementById('contact-rev-m0');
    const contactRevT2 = document.getElementById('contact-rev-t2');
    const contactRevT3 = document.getElementById('contact-rev-t3');
    const contactRevInterlock = document.getElementById('contact-rev-interlock');
    const coilRev = document.getElementById('coil-rev');
    const contactTimerM0 = document.getElementById('contact-timer-m0');
    const coilT1 = document.getElementById('coil-t1');
    const coilT3 = document.getElementById('coil-t3');

    // Canvas Plotter Setup
    const canvas = document.getElementById('scope-chart');
    const ctx = canvas.getContext('2d');
    let plotHistory = [];
    const MAX_HISTORY = 300;

    // Resize canvas properly
    function resizeCanvas() {
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Switch click handler
    plcSwitch.addEventListener('click', () => {
        systemOn = !systemOn;
        if (systemOn) {
            plcSwitch.classList.add('on');
            labelOn.classList.add('active');
            labelOff.classList.remove('active');
            currentState = STATE_FORWARD;
            timerAccumulator = 0;
        } else {
            plcSwitch.classList.remove('on');
            labelOn.classList.remove('active');
            labelOff.classList.add('active');
            currentState = STATE_IDLE;
            timerAccumulator = 0;
            targetRPM = 0;
        }
    });

    // Time tracking
    let lastTime = performance.now();

    function updateSimulation(time) {
        const dt = time - lastTime;
        lastTime = time;

        // 1. Process State Machine
        if (systemOn) {
            timerAccumulator += dt;

            switch (currentState) {
                case STATE_FORWARD:
                    targetRPM = MAX_RPM;
                    if (timerAccumulator >= TIMER_LIMIT_FWD) {
                        currentState = STATE_DWELL;
                        timerAccumulator = 0;
                    }
                    break;
                case STATE_DWELL:
                    targetRPM = 0;
                    if (timerAccumulator >= TIMER_LIMIT_DWELL) {
                        currentState = STATE_REVERSE;
                        timerAccumulator = 0;
                    }
                    break;
                case STATE_REVERSE:
                    targetRPM = -MAX_RPM;
                    if (timerAccumulator >= TIMER_LIMIT_REV) {
                        currentState = STATE_FORWARD;
                        timerAccumulator = 0;
                    }
                    break;
            }
        } else {
            currentState = STATE_IDLE;
            targetRPM = 0;
        }

        // 2. Motor physics (Smooth Acceleration & Deceleration)
        const accelRate = systemOn ? 0.05 : 0.08; // speed ramping factor
        currentRPM += (targetRPM - currentRPM) * accelRate;
        if (Math.abs(currentRPM) < 1) currentRPM = 0;

        // Calculate rotation speed for visual effect
        rotorAngle += (currentRPM / 60) * 360 * (dt / 1000);
        rotorAngle %= 360;
        if (rotorGroup) {
            rotorGroup.style.transform = `rotate(${rotorAngle}deg)`;
        }

        // Update Motor dashboard metrics
        if (motorSpeedVal) {
            motorSpeedVal.textContent = `${Math.round(Math.abs(currentRPM))} RPM`;
        }
        if (motorDirVal) {
            if (currentRPM > 10) {
                motorDirVal.textContent = 'FORWARD (CW)';
                motorDirVal.style.color = '#2ec4b6';
            } else if (currentRPM < -10) {
                motorDirVal.textContent = 'REVERSE (CCW)';
                motorDirVal.style.color = '#3a86c8';
            } else {
                motorDirVal.textContent = 'STOPPED';
                motorDirVal.style.color = 'var(--text-muted)';
            }
        }

        // Arrow animations
        if (arrowFwd && arrowRev) {
            if (currentRPM > 100) {
                arrowFwd.classList.add('active');
                arrowRev.classList.remove('active');
            } else if (currentRPM < -100) {
                arrowFwd.classList.remove('active');
                arrowRev.classList.add('active');
            } else {
                arrowFwd.classList.remove('active');
                arrowRev.classList.add('active'); // hide both by removing active
                arrowRev.classList.remove('active');
            }
        }

        // 3. Update Pilot Lights and LED Displays
        if (systemOn) {
            lightPower.classList.add('active');
            
            // Forward display
            const fwdTimeLeft = currentState === STATE_FORWARD ? Math.max(0, (TIMER_LIMIT_FWD - timerAccumulator) / 1000) : (currentState === STATE_DWELL || currentState === STATE_REVERSE ? 0 : 10);
            valFwdTimer.textContent = `${fwdTimeLeft.toFixed(1)}s`;
            
            // Dwell display
            const dwellTimeLeft = currentState === STATE_DWELL ? Math.max(0, (TIMER_LIMIT_DWELL - timerAccumulator) / 1000) : (currentState === STATE_REVERSE ? 0 : 5);
            valDwellTimer.textContent = `${dwellTimeLeft.toFixed(1)}s`;

            // Reverse display
            const revTimeLeft = currentState === STATE_REVERSE ? Math.max(0, (TIMER_LIMIT_REV - timerAccumulator) / 1000) : 10;
            valRevTimer.textContent = `${revTimeLeft.toFixed(1)}s`;

            panelFwdTimer.classList.toggle('active', currentState === STATE_FORWARD);
            panelDwellTimer.classList.toggle('active', currentState === STATE_DWELL);
            panelRevTimer.classList.toggle('active', currentState === STATE_REVERSE);

            lightFwd.classList.toggle('active', currentState === STATE_FORWARD);
            lightDwell.classList.toggle('active', currentState === STATE_DWELL);
            lightRev.classList.toggle('active', currentState === STATE_REVERSE);
        } else {
            lightPower.classList.remove('active');
            lightFwd.classList.remove('active');
            lightDwell.classList.remove('active');
            lightRev.classList.remove('active');

            valFwdTimer.textContent = '10.0s';
            valDwellTimer.textContent = '05.0s';
            valRevTimer.textContent = '10.0s';

            panelFwdTimer.classList.remove('active');
            panelDwellTimer.classList.remove('active');
            panelRevTimer.classList.remove('active');
        }

        // 4. Update Ladder Logic Visuals (highlighting coils/contacts)
        const isFwd = systemOn && currentState === STATE_FORWARD;
        const isDwell = systemOn && currentState === STATE_DWELL;
        const isRev = systemOn && currentState === STATE_REVERSE;

        // Rung 0: System on
        rungLines[0].classList.toggle('active', systemOn);
        contactSwitch.classList.toggle('active', systemOn);
        coilSystem.classList.toggle('active', systemOn);

        // Rung 1: Forward rung conduction (SYS_ON && !DWELL_DN && !REV_ILK)
        const rung1Active = systemOn && (currentState === STATE_FORWARD);
        rungLines[1].classList.toggle('active', rung1Active);
        contactFwdM0.classList.toggle('active', systemOn);
        // T2 contact is NC. If not in Dwell or Rev (dwell has run and is done), T2 is closed
        contactFwdT2.classList.toggle('active', !isDwell && !isRev); 
        contactFwdInterlock.classList.toggle('active', !isRev); // NC contact of O:0/2 (Reverse)
        coilFwd.classList.toggle('active', isFwd);

        // Rung 2: Reverse rung conduction (SYS_ON && DWELL_DN && !REV_DN && !FWD_ILK)
        const rung2Active = systemOn && (currentState === STATE_REVERSE);
        rungLines[2].classList.toggle('active', rung2Active);
        contactRevM0.classList.toggle('active', systemOn);
        // T2 is NO. It closes once dwell starts/finishes. Here we highlight it in reverse
        contactRevT2.classList.toggle('active', isRev || (systemOn && currentState === STATE_REVERSE)); 
        contactRevT3.classList.toggle('active', !isRev); // T3 is NC. Closed while T3 is counting, opens when done
        contactRevInterlock.classList.toggle('active', !isFwd); // NC contact of O:0/1 (Forward)
        coilRev.classList.toggle('active', isRev);

        // Rung 3: Timers conduction
        rungLines[3].classList.toggle('active', systemOn);
        contactTimerM0.classList.toggle('active', systemOn);
        coilT1.classList.toggle('active', isFwd);
        coilT3.classList.toggle('active', isRev);

        // 5. Canvas Oscilloscope Rendering
        recordGraphHistory();
        drawGraph();

        requestAnimationFrame(updateSimulation);
    }

    // Capture chart states
    function recordGraphHistory() {
        const isFwd = systemOn && currentState === STATE_FORWARD;
        const isDwell = systemOn && currentState === STATE_DWELL;
        const isRev = systemOn && currentState === STATE_REVERSE;

        plotHistory.push({
            fwd: isFwd ? 1 : 0,
            dwell: isDwell ? 1 : 0,
            rev: isRev ? 1 : 0,
            speed: currentRPM / MAX_RPM // normalized speed (-1 to +1)
        });

        if (plotHistory.length > MAX_HISTORY) {
            plotHistory.shift();
        }
    }

    // Draw the scope chart
    function drawGraph() {
        const rect = canvas.getBoundingClientRect();
        const w = rect.width;
        const h = rect.height;

        ctx.clearRect(0, 0, w, h);

        // Draw grid lines
        ctx.strokeStyle = 'rgba(142, 131, 122, 0.1)';
        ctx.lineWidth = 1;
        
        // Vertical grid lines
        for (let x = 0; x < w; x += 40) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, h);
            ctx.stroke();
        }

        // Horizontal grid lines
        for (let y = 0; y < h; y += 30) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(w, y);
            ctx.stroke();
        }

        // Center baseline
        ctx.strokeStyle = 'rgba(142, 131, 122, 0.2)';
        ctx.beginPath();
        ctx.moveTo(0, h / 2);
        ctx.lineTo(w, h / 2);
        ctx.stroke();

        if (plotHistory.length === 0) return;

        // Render each signal trace
        const points = plotHistory.length;
        const xStep = w / MAX_HISTORY;
        const startX = w - (points * xStep);

        const drawTrace = (valKey, color, offsetMultiplier) => {
            ctx.strokeStyle = color;
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            
            for (let i = 0; i < points; i++) {
                const x = startX + (i * xStep);
                // Plot digital signals in distinct vertical zones
                // Fwd on top third, Dwell in middle, Rev on bottom third
                let val = plotHistory[i][valKey];
                let y;
                
                if (valKey === 'speed') {
                    // Speed is analog, plots across the center
                    y = (h / 2) - (val * (h * 0.4));
                } else {
                    // Digital lines
                    let base = h * 0.5;
                    if (valKey === 'fwd') base = h * 0.25;
                    if (valKey === 'dwell') base = h * 0.5;
                    if (valKey === 'rev') base = h * 0.75;
                    y = base - (val * 15);
                }

                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.stroke();
        };

        drawTrace('fwd', '#2ec4b6');
        drawTrace('dwell', '#ff9f1c');
        drawTrace('rev', '#3a86c8');
    }

    // Start simulation loop
    requestAnimationFrame(updateSimulation);
});
