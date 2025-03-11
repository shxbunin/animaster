function animaster() {
    function resetFadeIn(element) {
        element.style.transitionDuration = null;
        element.classList.remove('show');
    }

    function resetFadeOut(element) {
        element.style.transitionDuration = null;
        element.classList.remove('hide');
    }

    function resetMoveAndScale(element) {
        element.style.transitionDuration = null;
        element.style.transform = null;
    }

    return {
        fadeIn(element, duration) {
            element.style.transitionDuration = `${duration}ms`;
            element.classList.remove('hide');
            element.classList.add('show');
        },

        fadeOut(element, duration) {
            element.style.transitionDuration = `${duration}ms`;
            element.classList.remove('show');
            element.classList.add('hide');
        },

        move(element, duration, translation) {
            element.style.transitionDuration = `${duration}ms`;
            element.style.transform = `translate(${translation.x}px, ${translation.y}px)`;
        },

        scale(element, duration, ratio) {
            element.style.transitionDuration = `${duration}ms`;
            element.style.transform = `scale(${ratio})`;
        },

        moveAndHide(element, duration) {
            const moveDuration = (2 * duration) / 5;
            const fadeDuration = (3 * duration) / 5;
            this.move(element, moveDuration, { x: 100, y: 20 });
            setTimeout(() => {
                this.fadeOut(element, fadeDuration);
            }, moveDuration);
        },

        showAndHide(element, duration) {
            const step = duration / 3;
            this.fadeIn(element, step);
            setTimeout(() => {
                setTimeout(() => {
                    this.fadeOut(element, step);
                }, step);
            }, step);
        },

        heartBeating(element) {
            let isScaledUp = false;

            const intervalId = setInterval(() => {
                if (!isScaledUp) {
                    this.scale(element, 500, 1.4);
                    isScaledUp = true;
                } else {
                    this.scale(element, 500, 1);
                    isScaledUp = false;
                }
            }, 500);

            return {
                stop() {
                    clearInterval(intervalId);
                    resetMoveAndScale(element);
                }
            };
        }
    };
}

function addListeners() {
    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            animaster().fadeIn(block, 5000);
        });

    document.getElementById('movePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            animaster().move(block, 1000, { x: 100, y: 10 });
        });

    document.getElementById('scalePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            animaster().scale(block, 1000, 1.25);
        });

    document.getElementById('moveAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            animaster().moveAndHide(block, 3000);
        });

    document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            animaster().showAndHide(block, 3000);
        });

    let heartBeatingAnimation = null;

    document.getElementById('heartBeatingPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            heartBeatingAnimation = animaster().heartBeating(block);
        });

    document.getElementById('heartBeatingStop')
        .addEventListener('click', function () {
            if (heartBeatingAnimation) {
                heartBeatingAnimation.stop();
                heartBeatingAnimation = null;
            }
        });
}

addListeners();