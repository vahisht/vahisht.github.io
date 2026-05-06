<script>
    import { onMount, onDestroy } from "svelte"
    import news from "../../data/news.json"

    let newsIndex = $state(Math.floor(Math.random() * news.length))

    let timer
    function resetTimer() {
        clearInterval(timer)
        timer = setInterval(nextNews, 7000)
    }

    onMount(() => { timer = setInterval(nextNews, 7000) })
    onDestroy(() => clearInterval(timer))

    function nextNews() {
        newsIndex = (newsIndex + 1) % news.length
    }

    function prevNews() {
        newsIndex = (newsIndex - 1 + news.length) % news.length
    }

    function getYoutubeThumbnail(url) {
        const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?/]+)/)
        return match ? `https://img.youtube.com/vi/${match[1]}/maxresdefault.jpg` : null
    }

    let item = $derived(news[newsIndex])

    const triangles = [
        { x:  5, y: 20, size: 30, duration: 12, delay:  -3, opacity: 0.35, dx:  40, dy: -25 },
        { x: 15, y: 65, size: 18, duration:  9, delay:  -7, opacity: 0.45, dx: -30, dy:  20 },
        { x: 25, y: 40, size: 45, duration: 15, delay:  -5, opacity: 0.25, dx:  55, dy:  30 },
        { x: 35, y: 75, size: 22, duration: 11, delay:  -1, opacity: 0.40, dx: -25, dy: -35 },
        { x: 45, y: 15, size: 35, duration: 13, delay: -10, opacity: 0.28, dx:  60, dy:  15 },
        { x: 55, y: 55, size: 20, duration: 10, delay:  -4, opacity: 0.45, dx: -45, dy: -20 },
        { x: 65, y: 30, size: 40, duration: 16, delay:  -8, opacity: 0.25, dx:  35, dy:  40 },
        { x: 72, y: 70, size: 25, duration:  8, delay:  -2, opacity: 0.40, dx: -35, dy: -15 },
        { x: 82, y: 45, size: 15, duration: 14, delay:  -6, opacity: 0.50, dx:  40, dy:  25 },
        { x: 90, y: 20, size: 50, duration: 11, delay:  -9, opacity: 0.20, dx: -55, dy:  30 },
        { x: 48, y: 80, size: 28, duration: 17, delay: -13, opacity: 0.35, dx:  20, dy: -40 },
        { x: 10, y: 50, size: 55, duration: 20, delay: -16, opacity: 0.18, dx: -30, dy:  20 },
    ]

    const waves = [
        { top: -15, dx:  50, duration: 14, delay:  -2, opacity: 0.30 },
        { top:   0, dx: -60, duration: 19, delay:  -8, opacity: 0.30 },
        { top:  15, dx:  45, duration: 12, delay:  -5, opacity: 0.32 },
        { top:  30, dx: -50, duration: 17, delay: -12, opacity: 0.30 },
        { top:  45, dx:  55, duration: 22, delay:  -3, opacity: 0.32 },
        { top:  60, dx: -40, duration: 15, delay: -16, opacity: 0.30 },
        { top:  75, dx:  35, duration: 13, delay:  -9, opacity: 0.35 },
        { top:  90, dx: -45, duration: 20, delay:  -6, opacity: 0.35 },
    ]

    // ── Static
    function makeHexGrid() {
        const s = 40
        const cw = Math.sqrt(3) * s
        const rh = 1.5 * s
        const cols = 25, rows = 9
        const grid = []
        for (let r = -1; r < rows; r++) {
            for (let c = -1; c < cols; c++) {
                const x = c * cw + (r % 2 !== 0 ? cw / 2 : 0)
                const y = r * rh
                const delay = -((c * 3 + r * 7) % 19)
                const dur = 3 + ((c * 2 + r * 5) % 4)
                grid.push({ x, y, delay, dur })
            }
        }
        return grid
    }
    function hexPoints(cx, cy, sz) {
        return Array.from({ length: 6 }, (_, i) => {
            const a = (Math.PI / 3) * i + Math.PI / 6
            return `${cx + sz * Math.cos(a)},${cy + sz * Math.sin(a)}`
        }).join(' ')
    }
    const hexGrid = makeHexGrid()

    // ── Glitch — each strip has an R, G, or B channel color
    const glitchStrips = [
        { top:  8, h: 2, duration: 5.0, delay: -1.0, color: '#ff0000' },
        { top: 22, h: 4, duration: 7.3, delay: -3.2, color: '#00ff00' },
        { top: 41, h: 2, duration: 4.1, delay: -0.4, color: '#0000ff' },
        { top: 57, h: 5, duration: 6.8, delay: -5.1, color: '#ff0000' },
        { top: 73, h: 3, duration: 8.2, delay: -2.7, color: '#0000ff' },
        { top: 88, h: 4, duration: 5.5, delay: -4.3, color: '#00ff00' },
    ]

    // ── Static
    let staticTimer
    $effect(() => {
        if (item.style.type === 'static') {
            let seed = 0
            staticTimer = setInterval(() => {
                seed = (seed + 1) % 1000
                document.getElementById('noise-turbulence')?.setAttribute('seed', String(seed))
            }, 60)
            return () => clearInterval(staticTimer)
        }
    })
</script>

<section class="news-section" style={`background: ${item.style.color}; color: ${item.style.text ?? '#ffffff'}; --color2: ${item.style.color2 ?? '#ffffff'}; --color: ${item.style.color};`}>

    {#if item.style.type === 'tech'}
        <div class="tech-bg" aria-hidden="true">
            {#each triangles as tri}
                <svg
                    class="tri"
                    style="left: {tri.x}%; top: {tri.y}%; width: {tri.size}px; height: {tri.size}px; animation-duration: {tri.duration}s; animation-delay: {tri.delay}s; --tri-opacity: {tri.opacity}; --dx: {tri.dx}px; --dy: {tri.dy}px;"
                    viewBox="0 0 100 100"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <polygon points="50,4 3,97 97,97" fill="none" stroke="var(--color2)" stroke-width="6"/>
                </svg>
            {/each}
        </div>
    {/if}

    {#if item.style.type === 'grunge'}
        <div class="grunge-bg" aria-hidden="true">
            {#each waves as w}
                <div
                    class="wave"
                    style="top: {w.top}%; animation-duration: {w.duration}s; animation-delay: {w.delay}s; --wave-opacity: {w.opacity}; --dx: {w.dx}px;"
                ></div>
            {/each}
        </div>
    {/if}

    {#if item.style.type === 'glitch'}
        <div class="glitch-bg" aria-hidden="true">
            {#each glitchStrips as gs}
                <div class="glitch-strip" style="top: {gs.top}%; height: {gs.h}%; animation-duration: {gs.duration}s; animation-delay: {gs.delay}s; --strip-color: {gs.color};"></div>
            {/each}
        </div>
    {/if}
    {#if item.style.type === 'hex'}
        <div class="hex-bg" aria-hidden="true">
            <svg width="100%" height="100%">
                {#each hexGrid as h}
                    <polygon points={hexPoints(h.x, h.y, 38)} fill="none" stroke-width="1.5" class="hex-cell" style="stroke: var(--color2); animation-duration: {h.dur}s; animation-delay: {h.delay}s;"/>
                {/each}
            </svg>
        </div>
    {/if}

    {#if item.style.type === 'static'}
        <div class="static-bg" aria-hidden="true">
            <svg width="100%" height="100%">
                <defs>
                    <filter id="noise-filter" x="0" y="0" width="100%" height="100%">
                        <feTurbulence id="noise-turbulence" type="turbulence" baseFrequency="0.85" numOctaves="1" seed="0" stitchTiles="stitch"/>
                        <feColorMatrix type="saturate" values="0"/>
                    </filter>
                </defs>
                <rect width="100%" height="100%" filter="url(#noise-filter)" opacity="0.12"/>
            </svg>
        </div>
    {/if}

    <div class="inner">

        <div class="carousel">

            {#if news.length > 1}
                <button class="nav-arrow" onclick={() => { prevNews(); resetTimer() }} aria-label="Previous">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="15 18 9 12 15 6"/>
                    </svg>
                </button>
            {/if}

            <div class="track-clip">
                <div class="track" style={`transform: translateX(-${newsIndex * 100}%)`}>
                    {#each news as n}
                        {@const thumb = n.link ? getYoutubeThumbnail(n.link) : null}
                        <div class="slide">

                            <div class="text-side" style="color: {n.style.text ?? '#ffffff'}">
                                <span class="category-label">{n.category}</span>
                                <h1 class="title">{n.title}</h1>
                                <p class="description">{n.description}</p>
                            </div>

                            {#if n.link && thumb}
                                <a href={n.link} target="_blank" rel="noopener noreferrer" class="thumb-link">
                                    <div class="thumb-wrapper">
                                        <img src={thumb} alt={n.title} class="thumb-img" />
                                        <div class="play-overlay">
                                            <svg class="play-icon" viewBox="0 0 80 80" fill="none">
                                                <circle cx="40" cy="40" r="38" fill="rgba(0,0,0,0.55)" stroke="rgba(255,255,255,0.25)" stroke-width="2"/>
                                                <polygon points="32,24 60,40 32,56" fill="white"/>
                                            </svg>
                                        </div>
                                    </div>
                                </a>
                            {:else if n.image}
                                <div class="thumb-link {n.imageAnchor === 'bottom' ? 'anchor-bottom' : ''}">
                                    <div class="thumb-wrapper image-wrapper {n.imageAnchor === 'bottom' ? 'anchor-bottom' : ''}">
                                        <img src={`/${n.image}`} alt={n.title} class="thumb-img" />
                                    </div>
                                </div>
                            {/if}

                        </div>
                    {/each}
                </div>
            </div>

            {#if news.length > 1}
                <button class="nav-arrow" onclick={() => { nextNews(); resetTimer() }} aria-label="Next">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="9 18 15 12 9 6"/>
                    </svg>
                </button>
            {/if}

        </div>

        {#if news.length > 1}
            <div class="dots">
                {#each news as _, i}
                    <button
                        class="dot {newsIndex === i ? 'active' : ''}"
                        onclick={() => { newsIndex = i; resetTimer() }}
                        aria-label={`Go to slide ${i + 1}`}
                    ></button>
                {/each}
            </div>
        {/if}

    </div>

</section>

<style>
    .news-section {
        position: relative;
        width: 100%;
        height: 40vh;
        display: flex;
        align-items: stretch;
        transition: background-color 0.5s ease;
    }

    .inner {
        flex: 1;
        max-width: 1600px;
        margin: 0 auto;
        padding: 0 2rem;
        display: flex;
        flex-direction: column;
    }

    /* ── Carousel ── */
    .carousel {
        flex: 1;
        display: flex;
        align-items: stretch;
        min-height: 0;
    }

    .track-clip {
        flex: 1;
        overflow: hidden;
        min-width: 0;
    }

    .track {
        display: flex;
        height: 100%;
        transition: transform 0.5s ease;
    }

    /* ── Slide ── */
    .slide {
        flex: 0 0 100%;
        width: 100%;
        min-width: 0;
        display: flex;
        gap: 2rem;
        align-items: stretch;
        overflow: hidden;
    }

    /* ── Text side ── */
    .text-side {
        flex: 1;
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 1.25rem;
        padding-top: 5rem;
    }

    .category-label {
        font-family: 'Titillium Web', sans-serif;
        font-size: 0.8rem;
        letter-spacing: 0.2em;
        text-transform: uppercase;
        color: currentColor;
        opacity: 0.6;
    }

    .title {
        font-family: 'Exo 2', sans-serif;
        font-size: clamp(1.4rem, 1.9vw, 2rem);
        font-weight: 800;
        line-height: 1.1;
        color: currentColor;
        text-shadow: 0 2px 20px rgba(0, 0, 0, 0.5);
        margin: 0;
    }

    .description {
        font-family: 'Titillium Web', sans-serif;
        font-size: 1rem;
        line-height: 1.7;
        color: currentColor;
        opacity: 0.75;
        margin: 0;
    }

    /* ── Thumbnail side ── */
    .thumb-link {
        flex: 1;
        min-width: 0;
        display: flex;
        align-items: center;
    }

    .thumb-wrapper {
        position: relative;
        width: 100%;
        max-height: calc(40vh - 4rem);
        aspect-ratio: 16 / 9;
        overflow: hidden;
        border-radius: 6px;
        box-shadow: 0 8px 40px rgba(0, 0, 0, 0.5);
    }

    .image-wrapper {
        aspect-ratio: unset;
        max-height: calc(40vh - 4rem);
    }

    .image-wrapper.anchor-bottom {
        max-height: 100%;
        border-radius: 6px 6px 0 0;
    }

    .thumb-link.anchor-bottom {
        align-items: flex-end;
    }

    .thumb-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
        transition: transform 0.3s ease, filter 0.3s ease;
    }

    a.thumb-link:hover .thumb-img {
        transform: scale(1.03);
        filter: brightness(0.75);
    }

    .play-overlay {
        position: absolute;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        pointer-events: none;
    }

    .play-icon {
        width: 80px;
        height: 80px;
        transition: transform 0.2s ease, opacity 0.2s ease;
        opacity: 0.85;
        filter: drop-shadow(0 2px 8px rgba(0,0,0,0.6));
    }

    .thumb-link:hover .play-icon {
        transform: scale(1.12);
        opacity: 1;
    }

    /* ── Dot navigation ── */
    .dots {
        position: absolute;
        bottom: 0.5rem;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        gap: 0.5rem;
    }

    .dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: currentColor;
        opacity: 0.4;
        border: none;
        cursor: pointer;
        padding: 0;
        transition: opacity 0.2s, transform 0.2s;
    }

    .dot.active {
        opacity: 0.95;
        transform: scale(1.35);
    }

    /* ── Nav arrows ── */
    .nav-arrow {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        background: none;
        border: none;
        color: currentColor;
        opacity: 0.5;
        cursor: pointer;
        padding: 0 0.5rem;
        transition: opacity 0.2s;
    }

    .nav-arrow:hover {
        opacity: 1;
    }

    .nav-arrow svg {
        width: 2rem;
        height: 2rem;
    }

    /* ── Tech background triangles ── */
    .tech-bg {
        position: absolute;
        inset: 0;
        overflow: hidden;
        pointer-events: none;
    }

    .tri {
        position: absolute;
        overflow: visible;
        opacity: var(--tri-opacity, 0.3);
        animation: float-around ease-in-out infinite alternate;
        will-change: transform;
    }

    @keyframes float-around {
        0%   { transform: translate(0, 0) rotate(0deg); }
        33%  { transform: translate(calc(var(--dx) * 0.6), calc(var(--dy) * -0.8)) rotate(80deg); }
        66%  { transform: translate(calc(var(--dx) * -0.4), calc(var(--dy) * 0.5)) rotate(160deg); }
        100% { transform: translate(var(--dx), var(--dy)) rotate(240deg); }
    }

    /* ── Grunge background waves ── */
    .grunge-bg {
        position: absolute;
        inset: 0;
        overflow: hidden;
        pointer-events: none;
    }

    .wave {
        position: absolute;
        left: -30%;
        width: 160%;
        height: 80%;
        border-radius: 50%;
        background: var(--color2);
        opacity: var(--wave-opacity, 0.3);
        animation: wave-drift ease-in-out infinite alternate;
        will-change: transform;
    }

    @keyframes wave-drift {
        from { transform: translateX(0) rotate(-1.5deg) scaleX(1);   }
        to   { transform: translateX(var(--dx)) rotate(1.5deg) scaleX(1.05); }
    }

    /* ── Circuit background ── */
    /* removed */

    /* ── Hex background ── */
    .hex-bg {
        position: absolute;
        inset: 0;
        overflow: hidden;
        pointer-events: none;
    }

    .hex-cell {
        animation: hex-breathe ease-in-out infinite alternate;
        opacity: 0.06;
    }
    @keyframes hex-breathe {
        from { opacity: 0.04; }
        to   { opacity: 0.45; }
    }

    /* ── Static background ── */
    .static-bg {
        position: absolute;
        inset: 0;
        overflow: hidden;
        pointer-events: none;
    }

    /* ── Glitch background ── */
    .glitch-bg {
        position: absolute;
        inset: 0;
        overflow: hidden;
        pointer-events: none;
    }

    .glitch-strip {
        position: absolute;
        left: -5%;
        width: 110%;
        background: var(--strip-color);
        mix-blend-mode: screen;
        opacity: 0;
        animation: glitch-fire linear infinite;
    }

    @keyframes glitch-fire {
        0%, 91%, 100% { opacity: 0;    transform: translateX(0); }
        92%           { opacity: 0.55; transform: translateX(-12px); }
        93%           { opacity: 0.40; transform: translateX(8px); }
        94%           { opacity: 0.50; transform: translateX(-4px); }
        95%           { opacity: 0;    transform: translateX(0); }
    }
</style>