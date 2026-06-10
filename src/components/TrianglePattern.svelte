<script lang="ts">
    import { onMount } from "svelte";

    /** Main colour the whole field is built from. Accepts #rgb, #rrggbb or rgb()/rgba(). */
    export let baseColor: string = "#020617";
    /** Max +/- lightness shift per triangle, in HSL lightness percentage points. */
    export let deviation: number = 6;
    /** How many squares tall the field is, measured against the viewport height. */
    export let rows: number = 12;
    /** 4 = pinwheel (split by both diagonals), 2 = simple diagonal split. */
    export let trianglesPerCell: 2 | 4 = 4;
    /** Darkening of the edges, 0 disables. Rendered as a cheap CSS overlay. */
    export let vignetteStrength: number = 0.35;
    /** Changes which cells get which shade; same seed = same pattern. */
    export let seed: number = 1;

    let bgUrl = "";
    let tileW = 0;
    let tileH = 0;
    let mounted = false;
    let timer: ReturnType<typeof setTimeout>;
    // The param-set the current tile was built from; guards against redundant rebuilds.
    let builtKey: string | null = null;

    function parseColor(c: string): [number, number, number] {
        c = c.trim();
        if (c[0] === "#") {
            let hex = c.slice(1);
            if (hex.length === 3) hex = hex.split("").map((h) => h + h).join("");
            const n = parseInt(hex, 16);
            return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
        }
        const m = c.match(/rgba?\(([^)]+)\)/);
        if (m) {
            const p = m[1].split(",").map((s) => parseFloat(s));
            return [p[0], p[1], p[2]];
        }
        return [0, 0, 0];
    }

    function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
        r /= 255; g /= 255; b /= 255;
        const max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h = 0, s = 0;
        const l = (max + min) / 2;
        const d = max - min;
        if (d !== 0) {
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                default: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }
        return [h * 360, s * 100, l * 100];
    }

    function hslToRgb(h: number, s: number, l: number): [number, number, number] {
        h /= 360; s /= 100; l /= 100;
        let r: number, g: number, b: number;
        if (s === 0) {
            r = g = b = l;
        } else {
            const hue2rgb = (p: number, q: number, t: number) => {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1 / 6) return p + (q - p) * 6 * t;
                if (t < 1 / 2) return q;
                if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                return p;
            };
            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            r = hue2rgb(p, q, h + 1 / 3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1 / 3);
        }
        return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
    }

    /** Deterministic per-cell hash in [0, 1). */
    function hash(x: number, y: number): number {
        let n = (x * 374761393 + y * 668265263 + seed * 982451653) | 0;
        n = (n ^ (n >>> 13)) * 1274126177 | 0;
        n = (n ^ (n >>> 16)) >>> 0;
        return n / 4294967296;
    }

    /**
     * Render ONE tileable swatch and expose it as a repeating background image.
     * The tile is one viewport wide (so no horizontal repeat shows on screen) and a
     * fixed number of rows tall. The browser repeats it for free over any band height,
     * so there is no per-frame work while scrolling or animating filters.
     */
    function buildTile() {
        if (typeof window === "undefined") return;
        // Mark this param-set as built so the reactive guard won't rebuild it again.
        builtKey = paramKey;

        // Cell size is driven by viewport height so we always get `rows` squares tall.
        const cell = Math.max(8, window.innerHeight / rows);
        const cols = Math.max(1, Math.ceil(window.innerWidth / cell));
        const rws = Math.max(1, Math.ceil(rows * 1.5)); // a bit over a screen tall, keeps vertical repeat unobtrusive
        const tw = cols * cell;
        const th = rws * cell;

        // dpr 1 is plenty for a soft background and keeps the one-off tile cheap.
        const c = document.createElement("canvas");
        c.width = Math.ceil(tw);
        c.height = Math.ceil(th);
        const ctx = c.getContext("2d");
        if (!ctx) return;

        const [br, bg, bb] = parseColor(baseColor);
        const [bh, bs, bl] = rgbToHsl(br, bg, bb);

        for (let cy = 0; cy < rws; cy++) {
            for (let cx = 0; cx < cols; cx++) {
                const x = cx * cell, y = cy * cell;
                const mx = x + cell / 2, my = y + cell / 2;
                const tris: number[][][] =
                    trianglesPerCell === 4
                        ? [
                              [[x, y], [x + cell, y], [mx, my]],
                              [[x + cell, y], [x + cell, y + cell], [mx, my]],
                              [[x + cell, y + cell], [x, y + cell], [mx, my]],
                              [[x, y + cell], [x, y], [mx, my]],
                          ]
                        : [
                              [[x, y], [x + cell, y], [x + cell, y + cell]],
                              [[x, y], [x + cell, y + cell], [x, y + cell]],
                          ];

                for (let t = 0; t < tris.length; t++) {
                    const r = hash(cx * 4 + t, cy);
                    const l = Math.max(0, Math.min(100, bl + (r * 2 - 1) * deviation));
                    const [rr, gg, bb2] = hslToRgb(bh, bs, l);
                    const fill = `rgb(${rr},${gg},${bb2})`;
                    const tri = tris[t];
                    ctx.beginPath();
                    ctx.moveTo(tri[0][0], tri[0][1]);
                    ctx.lineTo(tri[1][0], tri[1][1]);
                    ctx.lineTo(tri[2][0], tri[2][1]);
                    ctx.closePath();
                    ctx.fillStyle = fill;
                    ctx.fill();
                    // Stroke with the same colour to cover sub-pixel seams between triangles.
                    ctx.strokeStyle = fill;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }
        }

        c.toBlob((blob) => {
            if (!blob) return;
            const url = URL.createObjectURL(blob);
            // Decode the new tile fully before swapping it in, so a rebuild never
            // paints a blank frame between the old and new background.
            const img = new Image();
            img.onload = () => {
                const old = bgUrl;
                bgUrl = url;
                tileW = tw;
                tileH = th;
                if (old) URL.revokeObjectURL(old);
            };
            img.onerror = () => URL.revokeObjectURL(url);
            img.src = url;
        });
    }

    function schedule() {
        clearTimeout(timer);
        timer = setTimeout(buildTile, 150);
    }

    // A change to any of these means the tile pixels must be regenerated.
    $: paramKey = `${baseColor}|${deviation}|${rows}|${trianglesPerCell}|${seed}`;

    // Rebuild only when the param-set actually changes (not on scroll/band resize,
    // and not redundantly right after the initial build in onMount).
    $: if (mounted && paramKey !== builtKey) {
        schedule();
    }

    // Vignette is a static CSS overlay stretched across the band — costs nothing per frame.
    $: vignette =
        vignetteStrength > 0
            ? `radial-gradient(ellipse 120% 120% at center, rgba(0,0,0,0) 55%, rgba(0,0,0,${vignetteStrength}) 100%), `
            : "";

    $: style = bgUrl
        ? `background-image:${vignette}url(${bgUrl});` +
          `background-size:${vignetteStrength > 0 ? "100% 100%," : ""}${tileW}px ${tileH}px;` +
          `background-repeat:${vignetteStrength > 0 ? "no-repeat," : ""}repeat;` +
          `background-position:left top;`
        : "";

    onMount(() => {
        // Build first (sets builtKey === paramKey), then flag mounted so the reactive
        // guard sees the tile is already current and doesn't schedule a duplicate build.
        buildTile();
        mounted = true;
        let lastW = window.innerWidth;
        let lastH = window.innerHeight;
        const onResize = () => {
            if (window.innerWidth !== lastW || window.innerHeight !== lastH) {
                lastW = window.innerWidth;
                lastH = window.innerHeight;
                schedule();
            }
        };
        window.addEventListener("resize", onResize);
        return () => {
            window.removeEventListener("resize", onResize);
            clearTimeout(timer);
            if (bgUrl) URL.revokeObjectURL(bgUrl);
        };
    });
</script>

<div class="pattern" aria-hidden="true" style={style}></div>

<style>
    .pattern {
        position: absolute;
        inset: 0;
        z-index: 0;
        pointer-events: none;
    }
</style>
