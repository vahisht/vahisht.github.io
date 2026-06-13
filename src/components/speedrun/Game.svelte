<script>
    // ### Information about a given speedrun, received from the parent component in Section.svelte
    export let speedrun
    // ### Light variant = cream commentary section (changes border + caption colors).
    export let light = false

    function getYouTubeThumbnail(videoUrl) {
        if (!videoUrl) return null;
        const match = videoUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?/]+)/);
        return match ? `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg` : null;
    }

    $: effectiveThumbnail = getYouTubeThumbnail(speedrun.video) || speedrun.thumbnail;

    $: runnerDisplay = speedrun.runner
        ? (Array.isArray(speedrun.runner) ? speedrun.runner.join(', ') : speedrun.runner.split(',').map(r => r.trim()).join(', '))
        : null;

    const seriesGradientColors = {
        "Deus Ex":           "rgba(180, 130, 0, 0.3)",
        "Jedi Knight":       "rgba(30, 80, 180, 0.3)",
        "Mirror's Edge":     "rgba(200, 20, 20, 0.3)",
        "Borderlands":       "rgba(220, 160, 0, 0.3)",
        "Halo":              "rgba(0, 140, 120, 0.3)",
        "Sewer Rave":        "rgba(120, 20, 200, 0.3)",
        "Fast and Furious":  "rgba(200, 60, 0, 0.3)",
        "World of Warcraft": "rgba(200, 150, 20, 0.3)",
        "Hitman":            "rgba(180, 10, 10, 0.3)",
        "Garry's Mod":       "rgba(30, 100, 210, 0.3)",
        "No One Lives Forever": "rgba(210, 100, 10, 0.3)",
    };
    const defaultGradientColor = "rgba(20, 40, 120, 0.3)";

    $: gradientColor = seriesGradientColors[speedrun.game_series] || defaultGradientColor;

    // All run titles share one arcade face — Pixelify Sans.
    const titleFontSize = '1.3rem';

    function fitText(node, baseSize) {
        function adjust(base) {
            const pxPerRem = parseFloat(getComputedStyle(document.documentElement).fontSize);
            let size = parseFloat(base) * pxPerRem;
            node.style.fontSize = size + 'px';
            while (node.scrollWidth > node.clientWidth && size > 9) {
                size -= 0.5;
                node.style.fontSize = size + 'px';
            }
        }
        adjust(baseSize);
        return { update: (newBase) => adjust(newBase) };
    }

    function handleClick() {
        if (speedrun.video) {
            const isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;
            if (isTouch) {
                window.location.href = speedrun.video;
            } else {
                window.open(speedrun.video, '_blank', 'noopener,noreferrer');
            }
        }
    }
</script>

<div
    class="card-wrap {speedrun.video ? 'clickable' : ''}"
    class:light={light}
    on:click={handleClick}
    aria-hidden="true"
>
    <!-- Thumbnail frame — un-clipped so the gold rays can spill outside -->
    <div class="thumb-frame {speedrun.important ? 'gold-shine' : ''}">
        <div class="thumb {speedrun.video ? 'clickable' : ''}">
            {#if speedrun.video}
                <div class="shine-overlay"></div>
            {/if}
            <img
                src={effectiveThumbnail}
                alt={speedrun.game}
                class="thumbnail {!speedrun.video ? 'unavailable' : ''}"
            />
            {#if speedrun.video}
                <div class="tint-overlay"></div>
            {/if}
            <div class="series-gradient" style="background: linear-gradient(to top, {gradientColor} 0%, transparent 50%);"></div>
            {#if !speedrun.video}
                <div class="unavailable-overlay">
                    <span>Video Unavailable</span>
                </div>
            {/if}
        </div>
    </div>

    <!-- Caption sits directly on the page background, below the thumbnail -->
    <div class="caption">
        <div class="name-slot">
            <p class="game-name" use:fitText={titleFontSize}>{speedrun.game}</p>
        </div>
        <span class="card-meta"><span class="bracket">[</span><span class="meta-cat">&nbsp;{speedrun.category}&nbsp;</span><span class="bracket">]</span>{speedrun.year ? ` · ${speedrun.year}` : ''}{runnerDisplay ? ` · ${runnerDisplay}` : ''}</span>
    </div>
</div>

<style>
    .card-wrap {
        position: relative;
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 7px;
    }
    .card-wrap.clickable {
        cursor: pointer;
    }

    /* --- Thumbnail frame: keeps overflow visible so gold rays aren't clipped --- */
    .thumb-frame {
        position: relative;
    }

    .thumb {
        position: relative;
        box-sizing: border-box;
        aspect-ratio: 16 / 9;
        overflow: hidden;
        border-radius: 2px;
        /* Always-on edge ring so the image never blends into the page. */
        border: 1px solid rgba(255, 255, 255, 0.14);
        transition: transform 0.4s ease, border-color 0.35s ease, box-shadow 0.35s ease;
    }
    .card-wrap.light .thumb {
        border-color: rgba(0, 0, 0, 0.16);
    }

    /* Hover anywhere on the card (thumbnail OR its caption) raises the thumbnail. */
    .card-wrap.clickable:hover .thumb {
        /* Lift + slight tilt up so the growing thumbnail clears the caption below. */
        transform: perspective(600px) rotateX(2.5deg) scale(1.05) translateY(-11px);
        z-index: 5;
        /* 2px accent ring — a 1px ring aliases badly under the 3D transform. */
        border: 2px solid #3ee0ff;
        box-shadow: 0 10px 22px -8px rgba(0, 0, 0, 0.8);
    }
    .card-wrap.light.clickable:hover .thumb {
        border-color: #f59e0b;
        /* Stronger lift shadow + a warm halo so the accent ring actually reads on cream. */
        box-shadow: 0 14px 30px -8px rgba(70, 45, 12, 0.6), 0 0 0 4px rgba(245, 158, 11, 0.22);
    }
    /* Important runs keep their gold glow — no cyan/warm accent ring on them. */
    .card-wrap.clickable:hover .gold-shine .thumb {
        border-color: rgba(255, 255, 255, 0.14);
    }
    .card-wrap.light.clickable:hover .gold-shine .thumb {
        border-color: rgba(0, 0, 0, 0.16);
    }

    /* Moving highlight sweep across the thumbnail */
    .shine-overlay {
        position: absolute;
        inset: -20% 0;
        pointer-events: none;
        z-index: 10;
        background: linear-gradient(
            160deg,
            transparent 0%,
            transparent 2%,
            rgba(255,255,255,0.18) 8%,
            rgba(255,255,255,0.10) 28%,
            transparent 38%,
            transparent 100%
        );
        transform: translateY(-8%);
        transition: transform 0.45s ease;
    }
    .card-wrap.clickable:hover .shine-overlay {
        transform: translateY(8%);
    }

    .thumbnail {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
        transition: filter 0.35s ease;
    }
    .thumbnail.unavailable {
        filter: grayscale(1) brightness(0.5);
    }

    /* Dark tint overlay — fades out on hover */
    .tint-overlay {
        position: absolute;
        inset: 0;
        background: rgba(8, 12, 28, 0.1);
        transition: opacity 0.35s ease;
        pointer-events: none;
    }
    .card-wrap.clickable:hover .tint-overlay {
        opacity: 0;
    }

    /* Series-coded bottom gradient — fades on hover */
    .series-gradient {
        position: absolute;
        inset: 0;
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.35s ease;
    }
    .card-wrap.clickable:hover .series-gradient {
        opacity: 0;
    }

    .unavailable-overlay {
        position: absolute;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .unavailable-overlay span {
        font-size: 0.75rem;
        font-weight: 600;
        letter-spacing: 0.15em;
        text-transform: uppercase;
        color: #9ca3af;
        opacity: 0.8;
    }

    /* --- Caption (directly on the page, no fill) --- */
    .caption {
        display: flex;
        flex-direction: column;
        gap: 2px;
    }

    .name-slot {
        height: 1.9rem;
        overflow: hidden;
    }

    .game-name {
        font-family: 'Pixelify Sans', sans-serif;
        font-size: 1.3rem;
        font-weight: 500;
        color: #cdd6e4;
        margin: 0;
        line-height: 1.25;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        transition: color 0.35s ease;
    }
    .card-wrap.light .game-name {
        color: #3a3024;
    }
    /* Hover anywhere on the card → caption brightens (the text itself does not move) */
    .card-wrap.clickable:hover .game-name {
        color: #ffffff;
        text-shadow: 0 0 12px rgba(62, 224, 255, 0.5);
    }
    .card-wrap.light.clickable:hover .game-name {
        color: #000000;
        text-shadow: 0 0 14px rgba(245, 150, 30, 0.6);
    }

    .card-meta {
        font-family: 'Josefin Sans', sans-serif;
        font-weight: 400;
        text-transform: uppercase;
        letter-spacing: 0.14em;
        font-size: 0.74rem;
        color: #828ea6;
        margin: 0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        transition: color 0.35s ease;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-rendering: optimizeLegibility;
    }
    .bracket {
        color: #4f5a6e;
        transition: color 0.35s ease;
    }
    .card-wrap.light .card-meta {
        color: #8a7c64;
    }
    .card-wrap.light .bracket {
        color: #b09e82;
    }
    /* Caption meta brightens on hover too */
    .card-wrap.clickable:hover .card-meta {
        color: #b4bfd6;
    }
    .card-wrap.clickable:hover .bracket {
        color: #7e8ba6;
    }
    .card-wrap.light.clickable:hover .card-meta {
        color: #4a3d28;
    }
    .card-wrap.light.clickable:hover .bracket {
        color: #7a6438;
    }

    /* --- Gold glow for important runs (rays on the un-clipped frame) --- */
    @keyframes legendaryPulse {
        0%, 100% {
            box-shadow:
                0 0 0 1.5px rgba(255, 185, 30, 0.75),
                0 0 10px 3px  rgba(255, 165, 20, 0.5),
                0 0 28px 8px  rgba(220, 115, 0, 0.3),
                0 0 55px 16px rgba(170, 65, 0, 0.15);
        }
        50% {
            box-shadow:
                0 0 0 1.5px rgba(255, 220, 65, 0.95),
                0 0 14px 5px  rgba(255, 190, 30, 0.65),
                0 0 38px 12px rgba(235, 140, 0, 0.4),
                0 0 70px 22px rgba(180, 75, 0, 0.2);
        }
    }
    @keyframes legendaryHover {
        0%, 100% {
            box-shadow:
                0 0 0 2px   rgba(255, 210, 50, 0.95),
                0 0 18px 6px  rgba(255, 180, 25, 0.7),
                0 0 45px 15px rgba(235, 140, 0, 0.5),
                0 0 85px 28px rgba(185, 80, 0, 0.28);
        }
        50% {
            box-shadow:
                0 0 0 2px   rgba(255, 240, 100, 1),
                0 0 24px 9px  rgba(255, 205, 50, 0.85),
                0 0 62px 20px rgba(245, 160, 0, 0.6),
                0 0 105px 34px rgba(195, 90, 0, 0.35);
        }
    }
    @keyframes rotateRays {
        from { transform: translate(-50%, -50%) scale(1) rotate(0deg); }
        to   { transform: translate(-50%, -50%) scale(1) rotate(360deg); }
    }
    @keyframes rotateRaysSmall {
        from { transform: translate(-50%, -50%) scale(0.45) rotate(0deg); }
        to   { transform: translate(-50%, -50%) scale(0.45) rotate(360deg); }
    }

    .gold-shine::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: calc(100% + 60px);
        height: calc(100% + 60px);
        border-radius: 14px;
        background: conic-gradient(
            from 0deg,
            transparent 0deg,
            rgba(255, 195, 40, 0.45)  7deg,
            rgba(255, 150, 0,  0.25) 13deg,
            transparent 20deg,
            transparent 88deg,
            rgba(255, 190, 30, 0.42) 94deg,
            rgba(255, 140, 0,  0.2) 100deg,
            transparent 108deg,
            transparent 178deg,
            rgba(255, 195, 40, 0.4) 185deg,
            transparent 192deg,
            transparent 268deg,
            rgba(255, 185, 25, 0.38) 274deg,
            transparent 282deg,
            transparent 360deg
        );
        animation: rotateRaysSmall 10s linear infinite;
        filter: blur(22px);
        z-index: -1;
    }
    .card-wrap.clickable:hover .gold-shine::before {
        animation: rotateRays 10s linear infinite;
    }
    .gold-shine .thumb {
        animation: legendaryPulse 5s ease-in-out infinite;
    }
    .card-wrap.clickable:hover .gold-shine .thumb {
        animation: legendaryHover 1.5s ease-in-out infinite;
    }

    /* ── Touch devices: disable hover transforms that overflow the page ── */
    @media (hover: none), (pointer: coarse) {
        .card-wrap.clickable:hover .thumb {
            transform: none;
            z-index: auto;
            border: 1px solid rgba(255, 255, 255, 0.14);
            box-shadow: none;
        }
        .card-wrap.light.clickable:hover .thumb {
            border-color: rgba(0, 0, 0, 0.16);
        }
        .card-wrap.clickable:hover .shine-overlay {
            transform: translateY(-8%);
        }
        .card-wrap.clickable:hover .game-name {
            color: #cdd6e4;
            text-shadow: none;
        }
        .card-wrap.light.clickable:hover .game-name {
            color: #3a3024;
        }
        .card-wrap.clickable:hover .card-meta {
            color: #828ea6;
        }
        .card-wrap.clickable:hover .bracket {
            color: #4f5a6e;
        }
        .card-wrap.light.clickable:hover .card-meta {
            color: #8a7c64;
        }
        .card-wrap.light.clickable:hover .bracket {
            color: #b09e82;
        }
        .card-wrap.clickable:hover .gold-shine::before {
            animation: rotateRaysSmall 10s linear infinite;
        }
        .card-wrap.clickable:hover .gold-shine .thumb {
            animation: legendaryPulse 5s ease-in-out infinite;
        }
    }
</style>
