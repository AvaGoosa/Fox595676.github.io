(function () {
    function loadScript(url, cb) {
        const s = document.createElement('script');
        s.src = url;
        s.onload = cb;
        document.head.appendChild(s);
    }

    function quantize16Bit(ctx, width, height) {
        const imageData = ctx.getImageData(0, 0, width, height);
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
            let r = data[i];
            let g = data[i + 1];
            let b = data[i + 2];

            r = (r >> 3) << 3;
            g = (g >> 2) << 2;
            b = (b >> 3) << 3;

            data[i] = r;
            data[i + 1] = g;
            data[i + 2] = b;
        }

        ctx.putImageData(imageData, 0, 0);
    }

    function createOverlayCanvas() {
        const overlay = document.createElement('canvas');
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100vw';
        overlay.style.height = '100vh';
        overlay.style.pointerEvents = 'none';
        overlay.style.zIndex = '999999';
        overlay.style.imageRendering = 'pixelated';
        document.body.appendChild(overlay);
        return overlay;
    }

    function applyRetroFilter() {
        const vw = window.innerWidth;
        const vh = window.innerHeight;

        const scale = 0.5;  // Downscale factor
        const sw = Math.floor(vw * scale);
        const sh = Math.floor(vh * scale);

        html2canvas(document.body, {
            backgroundColor: null,
            x: window.scrollX,
            y: window.scrollY,
            width: vw,
            height: vh,
            scale: scale,
            logging: false,
            useCORS: true,
            ignoreElements: el => el === window.__retroOverlay,
        })
            .then(canvas => {
                const ctx = canvas.getContext('2d');
                quantize16Bit(ctx, canvas.width, canvas.height);

                if (!window.__retroOverlay) {
                    window.__retroOverlay = createOverlayCanvas();
                }

                const overlay = window.__retroOverlay;
                // Set overlay canvas resolution to match scaled snapshot
                overlay.width = canvas.width;
                overlay.height = canvas.height;
                // CSS size full viewport
                overlay.style.width = vw + 'px';
                overlay.style.height = vh + 'px';

                const overlayCtx = overlay.getContext('2d');
                overlayCtx.clearRect(0, 0, overlay.width, overlay.height);
                overlayCtx.drawImage(canvas, 0, 0);

                window.requestAnimationFrame(applyRetroFilter);
            }).catch(err => {
                console.warn('retro.js html2canvas error:', err);
                window.requestAnimationFrame(applyRetroFilter);
            });
    }

    function start() {
        applyRetroFilter();
        window.addEventListener('resize', () => {
            if (window.__retroOverlay) {
                window.__retroOverlay.style.width = window.innerWidth + 'px';
                window.__retroOverlay.style.height = window.innerHeight + 'px';
            }
        });
    }

    if (window.html2canvas) {
        start();
    } else {
        loadScript('https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js', start);
    }
})();
