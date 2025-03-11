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

        play(element, cycled = false) {
            let totalDelay = 0;
            const playStep = () => {
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
                if (cycled) {
                    setTimeout(playStep, totalDelay);
                }
            };

            playStep();

            return {
                stop: () => {
                    this._steps = [];
                    resetMoveAndScale(element);
                    resetFadeIn(element);
                    resetFadeOut(element);
                },
                reset: () => {
                    resetMoveAndScale(element);
                    resetFadeIn(element);
                    resetFadeOut(element);
                }
            };
        },

        buildHandler() {
            return (event) => {
                this.play(event.currentTarget);
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
            moveAndHideAnimation = animaster()
                .addMove(1200, { x: 100, y: 20 })
                .addFadeOut(1800)
                .play(block);
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
            animaster()
                .addFadeIn(1000)
                .addDelay(1000)
                .addFadeOut(1000)
                .play(block);
        });

    let heartBeatingAnimation = null;
    document.getElementById('heartBeatingPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            heartBeatingAnimation = animaster()
                .addScale(500, 1.4)
                .addScale(500, 1)
                .play(block, true);
        });

    document.getElementById('heartBeatingStop')
        .addEventListener('click', function () {
            if (heartBeatingAnimation) {
                heartBeatingAnimation.stop();
                heartBeatingAnimation = null;
            }
        });

    const worryAnimationHandler = animaster()
        .addMove(200, { x: 80, y: 0 })
        .addMove(200, { x: 0, y: 0 })
        .addMove(200, { x: 80, y: 0 })
        .addMove(200, { x: 0, y: 0 })
        .buildHandler();

    document.getElementById('worryAnimationBlock')
        .addEventListener('click', worryAnimationHandler);
}

addListeners();