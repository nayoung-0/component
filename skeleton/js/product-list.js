(function (window, document) {
    'use strict';

    if (window.AisoulSkeleton) return;

    function toElement(target) {
        if (!target) return null;

        if (typeof target === 'string') {
            return document.querySelector(target);
        }

        return target;
    }

    function toElements(target, root) {
        if (!target) return [];

        if (typeof target === 'string') {
            return Array.prototype.slice.call(
                (root || document).querySelectorAll(target)
            );
        }

        if (target.nodeType === 1) {
            return [target];
        }

        return Array.prototype.slice.call(target);
    }

    function waitForImages(items, imageSelector) {
        var promises = [];

        items.forEach(function (item) {
            var images = item.matches &&
                item.matches(imageSelector)
                ? [item]
                : Array.prototype.slice.call(
                    item.querySelectorAll(imageSelector)
                );

            images.forEach(function (image) {
                if (image.complete) return;

                promises.push(
                    new Promise(function (resolve) {
                        image.addEventListener(
                            'load',
                            resolve,
                            { once: true }
                        );

                        image.addEventListener(
                            'error',
                            resolve,
                            { once: true }
                        );
                    })
                );
            });
        });

        return Promise.all(promises);
    }

    function reveal(options) {
        var root = toElement(options.root);

        if (
            !root ||
            !root.classList.contains(options.loadingClass) ||
            root.dataset.skeletonRevealing === 'true'
        ) {
            return;
        }

        var items = toElements(
            options.items,
            root
        );

        var imageSelector =
            options.imageSelector || 'img';

        root.dataset.skeletonRevealing = 'true';

        waitForImages(
            items,
            imageSelector
        ).then(function () {
            requestAnimationFrame(function () {
                requestAnimationFrame(function () {
                    var skeletons;

                    root.classList.remove(
                        options.loadingClass
                    );

                    root.removeAttribute(
                        'aria-busy'
                    );

                    if (options.skeletonSelector) {
                        skeletons =
                            root.querySelectorAll(
                                options.skeletonSelector
                            );

                        Array.prototype.forEach.call(
                            skeletons,
                            function (skeleton) {
                                skeleton.remove();
                            }
                        );
                    }

                    delete root.dataset.skeletonRevealing;

                    if (
                        typeof options.onComplete ===
                        'function'
                    ) {
                        options.onComplete(root);
                    }
                });
            });
        });
    }

    window.AisoulSkeleton = {
        reveal: reveal
    };
})(window, document);