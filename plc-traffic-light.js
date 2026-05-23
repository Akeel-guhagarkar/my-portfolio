/**
 * PLC Traffic Light Control Simulation Logic
 * Recreates Delta Dop HMI panel behavior and intersection traffic flow animations.
 */

document.addEventListener('DOMContentLoaded', () => {
    let systemRun = false;
    let timerAccumulator = 0; // in ms
    const TIMER_LIMIT = 25000; // 25s total cycle (250 ticks of 100ms)

    // HMI elements
    const hmiStartBtn = document.getElementById('hmi-start-btn');
    const hmiStopBtn = document.getElementById('hmi-stop-btn');
    const hmiTimerVal = document.getElementById('hmi-timer-val');
    const hmiStatusDot = document.getElementById('hmi-status-dot');

    const hmiLightRed = document.getElementById('hmi-light-red');
    const hmiLightYellow = document.getElementById('hmi-light-yellow');
    const hmiLightGreen = document.getElementById('hmi-light-green');

    // SVG intersection lights
    const roadLightRed = document.getElementById('road-light-red');
    const roadLightYellow = document.getElementById('road-light-yellow');
    const roadLightGreen = document.getElementById('road-light-green');

    // Ladder Logic elements
    const rungLines = [
        document.getElementById('rung-line-0'),
        document.getElementById('rung-line-1'),
        document.getElementById('rung-line-2'),
        document.getElementById('rung-line-3'),
        document.getElementById('rung-line-4')
    ];
    const contactStart = document.getElementById('contact-start');
    const contactStop = document.getElementById('contact-stop');
    const contactSeal = document.getElementById('contact-seal');
    const coilRun = document.getElementById('coil-run');

    const contactR1M0 = document.getElementById('contact-r1-m0');
    const contactR1Red = document.getElementById('contact-r1-red');
    const coilY20 = document.getElementById('coil-y20');

    const contactR2M0 = document.getElementById('contact-r2-m0');
    const contactR2Yel = document.getElementById('contact-r2-yel');
    const coilY21 = document.getElementById('coil-y21');

    const contactR3M0 = document.getElementById('contact-r3-m0');
    const contactR3Grn = document.getElementById('contact-r3-grn');
    const coilY22 = document.getElementById('coil-y22');

    const contactR4M0 = document.getElementById('contact-r4-m0');
    const contactR4T0 = document.getElementById('contact-r4-t0');
    const coilT0 = document.getElementById('coil-t0');

    const hmiHomeBtn = document.getElementById('hmi-home-btn');

    // Traffic Car variables
    const car1Element = document.getElementById('car-1');
    const car2Element = document.getElementById('car-2');

    let car1Pos = -40; // X position of Car 1
    let car2Pos = 420; // X position of Car 2
    let car1Speed = 0;
    let car2Speed = 0;
    const MAX_CAR_SPEED = 2.0; // pixels per frame at 60fps
    const CAR_ACCEL = 0.08;
    const CAR_DECEL = 0.15;

    // START button click
    hmiStartBtn.addEventListener('click', () => {
        if (!systemRun) {
            systemRun = true;
            timerAccumulator = 0;
            hmiStatusDot.style.backgroundColor = '#0f0';
            hmiStatusDot.style.boxShadow = '0 0 8px #0f0';
            
            // momentary flash start contact in ladder logic
            contactStart.classList.add('active');
            setTimeout(() => contactStart.classList.remove('active'), 250);
        }
    });

    // STOP button click
    hmiStopBtn.addEventListener('click', () => {
        if (systemRun) {
            systemRun = false;
            timerAccumulator = 0;
            hmiStatusDot.style.backgroundColor = '#999';
            hmiStatusDot.style.boxShadow = 'none';

            // momentary flash stop NC contact
            contactStop.classList.add('active'); // in NC active usually means opened/green, let's trigger highlights
            setTimeout(() => contactStop.classList.remove('active'), 250);
        }
    });

    // Home button reset
    hmiHomeBtn.addEventListener('click', () => {
        systemRun = false;
        timerAccumulator = 0;
        car1Pos = -40;
        car2Pos = 420;
        car1Speed = 0;
        car2Speed = 0;
        hmiStatusDot.style.backgroundColor = '#999';
        hmiStatusDot.style.boxShadow = 'none';
    });

    let lastTime = performance.now();

    function updateSimulation(time) {
        const dt = time - lastTime;
        lastTime = time;

        // 1. Process PLC Sequence Timers
        if (systemRun) {
            timerAccumulator += dt;
            if (timerAccumulator >= TIMER_LIMIT) {
                timerAccumulator = 0; // T0 reset contact opened, resetting accumulator
            }
        } else {
            timerAccumulator = 0;
        }

        // Timer ticks in 100ms (0 to 250)
        const ticks = Math.floor(timerAccumulator / 100);
        hmiTimerVal.textContent = ticks.toString().padStart(3, '0');

        // Determine active light phase
        let isRed = false;
        let isYellow = false;
        let isGreen = false;

        if (systemRun) {
            if (ticks >= 0 && ticks <= 100) {
                isRed = true; // Phase 1: Red ON (0.0s to 10.0s)
            } else if (ticks > 100 && ticks <= 150) {
                isYellow = true; // Phase 2: Yellow ON (10.0s to 15.0s)
            } else if (ticks > 150 && ticks <= 250) {
                isGreen = true; // Phase 3: Green ON (15.0s to 25.0s)
            }
        }

        // 2. Drive Cabinet Pilot Lights & Intersection Traffic Lights
        if (isRed) {
            hmiLightRed.classList.add('active');
            hmiLightYellow.classList.remove('active');
            hmiLightGreen.classList.remove('active');
            roadLightRed.setAttribute('fill', '#ff3333');
            roadLightYellow.setAttribute('fill', '#333');
            roadLightGreen.setAttribute('fill', '#333');
        } else if (isYellow) {
            hmiLightRed.classList.remove('active');
            hmiLightYellow.classList.add('active');
            hmiLightGreen.classList.remove('active');
            roadLightRed.setAttribute('fill', '#333');
            roadLightYellow.setAttribute('fill', '#ffea33');
            roadLightGreen.setAttribute('fill', '#333');
        } else if (isGreen) {
            hmiLightRed.classList.remove('active');
            hmiLightYellow.classList.remove('active');
            hmiLightGreen.classList.add('active');
            roadLightRed.setAttribute('fill', '#333');
            roadLightYellow.setAttribute('fill', '#333');
            roadLightGreen.setAttribute('fill', '#33cc33');
        } else {
            // OFF
            hmiLightRed.classList.remove('active');
            hmiLightYellow.classList.remove('active');
            hmiLightGreen.classList.remove('active');
            roadLightRed.setAttribute('fill', '#333');
            roadLightYellow.setAttribute('fill', '#333');
            roadLightGreen.setAttribute('fill', '#333');
        }

        // 3. Ladder Logic Visuals (Coil & Contact conduction)
        // Rung 0: Start/Stop latch
        rungLines[0].classList.toggle('active', systemRun);
        contactSeal.classList.toggle('active', systemRun);
        coilRun.classList.toggle('active', systemRun);

        // Rung 1: Red Signal
        rungLines[1].classList.toggle('active', isRed);
        contactR1M0.classList.toggle('active', systemRun);
        contactR1Red.classList.toggle('active', isRed);
        coilY20.classList.toggle('active', isRed);

        // Rung 2: Yellow Signal
        rungLines[2].classList.toggle('active', isYellow);
        contactR2M0.classList.toggle('active', systemRun);
        contactR2Yel.classList.toggle('active', isYellow);
        coilY21.classList.toggle('active', isYellow);

        // Rung 3: Green Signal
        rungLines[3].classList.toggle('active', isGreen);
        contactR3M0.classList.toggle('active', systemRun);
        contactR3Grn.classList.toggle('active', isGreen);
        coilY22.classList.toggle('active', isGreen);

        // Rung 4: Timer Rung
        const isTimerRungActive = systemRun && (ticks < 250);
        rungLines[4].classList.toggle('active', isTimerRungActive);
        contactR4M0.classList.toggle('active', systemRun);
        contactR4T0.classList.toggle('active', isTimerRungActive); // NC contact remains active green while timer accumulates
        coilT0.classList.toggle('active', isTimerRungActive);

        // 4. Traffic Cars Animation
        // Stop lines are at x = 160 (Car 1 moving right) and x = 240 (Car 2 moving left)
        const stopLineCar1 = 130; // buffer stop point
        const stopLineCar2 = 250; // buffer stop point

        // Car 1 Behavior
        if (isRed || isYellow) {
            // Decelerate if before stop line
            if (car1Pos < stopLineCar1 && car1Pos > stopLineCar1 - 80) {
                car1Speed -= CAR_DECEL;
                if (car1Speed < 0) car1Speed = 0;
            } else {
                car1Speed += CAR_ACCEL;
                if (car1Speed > MAX_CAR_SPEED) car1Speed = MAX_CAR_SPEED;
            }
        } else if (isGreen) {
            // Green: Accelerate
            car1Speed += CAR_ACCEL;
            if (car1Speed > MAX_CAR_SPEED) car1Speed = MAX_CAR_SPEED;
        } else {
            // Offline caution mode (flashing warning) - drive through slowly
            car1Speed = 0.8;
        }

        // Car 2 Behavior
        if (isRed || isYellow) {
            // Decelerate if before stop line
            if (car2Pos > stopLineCar2 && car2Pos < stopLineCar2 + 80) {
                car2Speed -= CAR_DECEL;
                if (car2Speed < 0) car2Speed = 0;
            } else {
                car2Speed += CAR_ACCEL;
                if (car2Speed > MAX_CAR_SPEED) car2Speed = MAX_CAR_SPEED;
            }
        } else if (isGreen) {
            // Green: Accelerate
            car2Speed += CAR_ACCEL;
            if (car2Speed > MAX_CAR_SPEED) car2Speed = MAX_CAR_SPEED;
        } else {
            // Offline caution mode
            car2Speed = 0.8;
        }

        // Move Cars
        car1Pos += car1Speed;
        if (car1Pos > 430) {
            car1Pos = -40; // Reset off-screen left
        }
        car1Element.setAttribute('transform', `translate(${car1Pos}, 160)`);

        car2Pos -= car2Speed;
        if (car2Pos < -40) {
            car2Pos = 430; // Reset off-screen right
        }
        car2Element.setAttribute('transform', `translate(${car2Pos}, 122)`);

        requestAnimationFrame(updateSimulation);
    }

    // Start simulation loop
    requestAnimationFrame(updateSimulation);
});
