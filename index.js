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
        _steps: [],
        
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

            const animation = animaster()
                .addMove(moveDuration, { x: 100, y: 20 })
                .addFadeOut(fadeDuration);
            animation.play(element);

            return {
                reset() {
                    resetMoveAndScale(element);
                    resetFadeOut(element);
                }
            };
        },

        showAndHide(element, duration) {
            const step = duration / 3;
            const animation = animaster()
                .addFadeIn(step)
                .addDelay(step)
                .addFadeOut(step);

            animation.play(element);
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
        },

        addMove(duration, translation) {
            this._steps.push({
                name: 'move',
                duration: duration,
                translation: translation
            });
            return this;
        },

        addScale(duration, ratio) {
            this._steps.push({
                name: 'scale',
                duration: duration,
                ratio: ratio
            });
            return this;
        },

        addFadeIn(duration) {
            this._steps.push({
                name: 'fadeIn',
                duration: duration
            });
            return this;
        },

        addFadeOut(duration) {
            this._steps.push({
                name: 'fadeOut',
                duration: duration
            });
            return this;
        },

        addDelay(duration) {
            this._steps.push({
                name: 'delay',
                duration: duration
            });
            return this;
        },

        play(element) {
            let totalDelay = 0;
            for (let step of this._steps) {
                setTimeout(() => {
                    switch (step.name) {
                        case 'move':
                            this.move(element, step.duration, step.translation);
                            break;
                        case 'scale':
                            this.scale(element, step.duration, step.ratio);
                            break;
                        case 'fadeIn':
                            this.fadeIn(element, step.duration);
                            break;
                        case 'fadeOut':
                            this.fadeOut(element, step.duration);
                            break;
                        case 'delay':
                            // Просто ждем, ничего не делаем
                            break;
                    }
                }, totalDelay);
                totalDelay += step.duration;
            }
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
            // Пример с добавлением в steps:
            animaster()
                .addMove(1000, { x: 100, y: 10 })
                .play(block);
        });

    document.getElementById('scalePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            animaster().scale(block, 1000, 1.25);
        });

    let moveAndHideAnimation = null;
    document.getElementById('moveAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            moveAndHideAnimation = animaster().moveAndHide(block, 3000);
        });

    document.getElementById('moveAndHideReset')
        .addEventListener('click', function () {
            if (moveAndHideAnimation) {
                moveAndHideAnimation.reset();
                moveAndHideAnimation = null;
            }
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