/**
 * Created by vanessamnoble on 12/19/16.
 */
var WIN = 20;
var DURATION = 500;
var strictMode = false;
var counter = document.getElementById('counter');
var buttons = document.getElementsByClassName('button');

var tempo, // tempo increases 5th, 9th & 13th step
    steps,
    currentMove,
    buttonsEnabled,
    timeout;

function updateSequence() {
    // starts when start button pressed
    // reset on reset button or strict mode mistake
    // ends on game win
    switch (steps.length) {
        case 5:
            tempo = 0.8;
            updateTimeout();
            break;
        case 9:
            tempo = 0.6;
            updateTimeout();
            break;
        case 13:
            tempo = 0.4;
            updateTimeout();
            break;
    }
    buttonsEnabled = false;

    //pick a random number and add it to sequence
    steps.push(Math.floor(Math.random() * 4));
    updateCounter(steps.length);

    displaySequence();

    buttonsEnabled = true;
}

function displaySequence() {
    buttonsEnabled = false;
    var i = 0;
    function displayLoop() {
        setTimeout(function() {
            var selector = '[data-number="' + steps[i] + '"]';
            var element = document.querySelector(selector);
            activateButton(element, steps[i]);
            i++;
            if (i < steps.length) {
                setTimeout(function() {
                    displayLoop();
                }, timeout);
            } else {
                buttonsEnabled = true;
            }
        }, timeout);
    }
    displayLoop();
}

function activateButton(element, step) {
    element.classList.add('highlight');
    var sound;
    switch (step){
        case 0:
            sound = 'r2a-sound';
            break;
        case 1:
            sound = 'r2b-sound';
            break;
        case 2:
            sound = 'r2c-sound';
            break;
        case 3:
            sound = 'r2d-sound';
            break;
    }
    document.getElementById(sound).play();
    setTimeout(function() {
        element.classList.remove('highlight');
    }, timeout);
}

function pressButton() {
    if (buttonsEnabled) {
        var buttonNumber = parseInt(this.getAttribute('data-number'));
        if (buttonNumber === steps[currentMove]) {
            activateButton(this, buttonNumber);
            currentMove++;
            if (currentMove >= WIN) {
                winGame();
            } else {
                if (currentMove === steps.length) {
                    clearTimeout();
                    currentMove = 0;
                    setTimeout(function() {
                        updateSequence();
                    }, timeout);
                }
            }
        } else {
            buttonsEnabled = false;
            document.getElementById('miss-sound').play();
            if (strictMode) {
                resetGame();
                updateSequence();
            } else {
                currentMove = 0;
                displaySequence();
            }
        }
    }
}

function updateTimeout() {
    timeout = DURATION * tempo;
}

function resetGame() {
    steps = []; // new game, empty steps array TODO - reset and start same
    currentMove = 0;
    tempo = 1;
    updateTimeout();
    buttonsEnabled = false;
    updateCounter('--');
}

function winGame() {
    buttonsEnabled = false;
    document.getElementById('win-sound').play();
    resetGame();
}

function updateCounter(steps) {
    counter.innerHTML = steps;
}

document.getElementById('start').addEventListener('click', function(e) {
    resetGame();
    updateSequence();
});

document.getElementById('reset').addEventListener('click', function(e) {
    resetGame();
});

document.getElementById('strict').addEventListener('click', function(e) {
    resetGame();
    if (!strictMode) {
        strictMode = true;
        this.innerHTML = 'Normal';
    } else {
        strictMode = false;
        this.innerHTML = 'Strict';
    }
});

for (var j = 0; j < buttons.length; j++) {
    buttons[j].addEventListener('click', pressButton, false);
}

resetGame();