<script>
    // ### Information about a given speedrun, received from the parent component in Section.svelte
    export let speedrun

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

    const gameFonts = {
        "Deus Ex":              "Michroma",
        "Mirror's Edge":        "Titillium Web",
        "Jedi Knight":          "Orbitron",
        "Call of Duty":         "Rajdhani",
        "Halo":                 "Rajdhani",
        "SWAT4":                "Rajdhani",
        "Command & Conquer":    "Rajdhani",
        "Titanfall":            "Rajdhani",
        "Borderlands":          "Righteous",
        "Sewer Rave":           "Audiowide",
        "Hitman":               "Josefin Sans",
        "No One Lives Forever": "Righteous",
    };
    const gameFontSizes = {
        "Michroma":      "1.1rem",
        "Orbitron":      "1.25rem",
        "Josefin Sans":  "1.3rem",
        "Titillium Web": "1.3rem",
        "Audiowide":     "1.05rem",
        "Rajdhani":      "1.4rem",
    };
    $: gameFont = gameFonts[speedrun.game_series] || 'Exo 2';
    $: gameFontSize = gameFontSizes[gameFont] || '1.15rem';

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

<div class="glow-wrapper {speedrun.important ? 'gold-shine' : ''}">
    <div
        class="card {speedrun.video ? 'clickable' : ''}"
        on:click={handleClick}
        aria-hidden="true"
    >
        {#if speedrun.video}
            <div class="shine-overlay"></div>
        {/if}
        <!-- Thumbnail -->
        <div class="thumbnail-wrap">
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

        <!-- Info below image -->
        <div class="card-body">
            <div class="name-event-slot">
                <p class="game-name-hover" use:fitText={gameFontSize} style="font-family: '{gameFont}', sans-serif;">{speedrun.game}</p>
            </div>
            <div class="meta-row">
                <span class="card-meta">{speedrun.category}{speedrun.event_name ? ` · ${speedrun.event_name}` : ''}{runnerDisplay ? ` · ${runnerDisplay}` : ''}</span>
            </div>
        </div>
    </div>
</div>

<style>
    :root {
        --card-bg: #0f1117;
        --card-border: #1e2130;
        --card-border-hover: #3d4460;
        --card-radius: 10px;
        --game-color: #f0f0f0;
        --category-color: #8b92b8;
        --category-bg: #1a1f35;
        --badge-bg: rgba(10, 12, 18, 0.65);
        --badge-color: #aab0c8;
    }

    /* --- Glow wrapper: separate from card so overflow:hidden doesn't clip rays --- */
    .glow-wrapper {
        position: relative;
        isolation: isolate;
        width: 100%;
        border-radius: var(--card-radius);
    }

    .gold-shine {
        z-index: 1;
    }

    .glow-wrapper:hover {
        z-index: 2;
    }

    .card {
        position: relative;
        background: linear-gradient(135deg, #0f1117 0%, #0f1117 40%, #1e3a8a 58%, #c8d4ff 72%, #eef0ff 85%, #eef0ff 100%);
        background-size: 250% 250%;
        background-position: 0% 0%;
        border: none;
        border-radius: var(--card-radius);
        overflow: hidden;
        transition: transform 0.4s ease, background-position 0.5s ease;
    }

    .card.clickable {
        cursor: pointer;
    }

    .card.clickable:hover {
        transform: perspective(600px) rotateX(3deg) scale(1.05);
        background-position: 100% 100%;
    }

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
    .card.clickable:hover .shine-overlay {
        transform: translateY(8%);
    }

    /* --- Thumbnail --- */
    .thumbnail-wrap {
        position: relative;
        aspect-ratio: 16 / 9;
        overflow: hidden;
    }

    .thumbnail {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
        transition: filter 0.35s ease;
    }
    .card.clickable:hover .thumbnail {
        filter: blur(0px);
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
    .card.clickable:hover .tint-overlay {
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
    .card.clickable:hover .series-gradient {
        opacity: 0;
    }

    /* Centered game name overlay */
    .thumb-text {
        position: absolute;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 10px 14px;
        pointer-events: none;
        transition: opacity 0.25s ease, transform 0.25s ease;
    }
    .card.clickable:hover .thumb-text {
        opacity: 0;
        transform: translateY(-6px);
    }

    .game-name {
        font-size: clamp(1.1rem, 3.5vw, 2rem);
        font-weight: 700;
        font-family: 'Exo 2', sans-serif;
        color: #fff;
        margin: 0;
        text-align: center;
        text-shadow: 0 2px 12px rgba(0,0,0,0.95), 0 0 30px rgba(0,0,0,0.7);
        line-height: 1.25;
        letter-spacing: -0.01em;
        transition: color 0.4s ease;
    }
    .card.clickable:hover .game-name {
        color: #fff;
    }

    .event-badge {
        position: absolute;
        top: 8px;
        right: 8px;
        font-size: 0.62rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: var(--badge-color);
        background: var(--badge-bg);
        backdrop-filter: blur(4px);
        -webkit-backdrop-filter: blur(4px);
        padding: 3px 8px;
        border-radius: 999px;
        border: 1px solid rgba(255,255,255,0.08);
        white-space: nowrap;
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

    /* --- Card body --- */
    .card-body {
        padding: 8px 12px 10px;
        display: flex;
        flex-direction: column;
        gap: 5px;
    }

    .meta-row {
        display: flex;
    }

    .card-meta {
        font-size: 0.88rem;
        color: #6b7280;
        margin: 0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        transition: color 0.4s ease;
    }
    .card.clickable:hover .card-meta {
        color: #555;
    }

    /* Fixed-height slot replaced with simple stack */
    .name-event-slot {
        display: flex;
        flex-direction: column;
        gap: 1px;
        height: 1.75rem;
        overflow: hidden;
    }

    .event-line {
        font-size: 0.68rem;
        color: #6b7280;
        margin: 0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .game-name-hover {
        font-size: 1.15rem;
        font-weight: 700;
        color: #e2e8f0;
        margin: 0;
        line-height: 1.25;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        transition: color 0.4s ease;
    }
    .card.clickable:hover .game-name-hover {
        color: #111;
    }

    /* --- Gold glow for important runs --- */
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

    /* Rotating ambient rays on the wrapper — always behind, blurred */
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
    .gold-shine:hover::before {
        animation: rotateRays 10s linear infinite;
    }

    /* Box-shadow on the card so it follows the 3D transform */
    .gold-shine > .card {
        animation: legendaryPulse 5s ease-in-out infinite;
    }
    .gold-shine > .card.clickable:hover {
        animation: legendaryHover 1.5s ease-in-out infinite;
    }

    /* ── Touch devices: disable hover transforms that overflow the page ──
       Also key off pointer:coarse — Firefox for Android (and some others)
       falsely report hover:hover, so the hover query alone misses them. ── */
    @media (hover: none), (pointer: coarse) {
        .glow-wrapper:hover {
            z-index: 1;
        }
        .card.clickable:hover {
            transform: none;
            background-position: 0% 0%;
        }
        .card.clickable:hover .shine-overlay {
            transform: translateY(-8%);
        }
        .card.clickable:hover .game-name-hover {
            color: #e2e8f0;
        }
        .card.clickable:hover .card-meta {
            color: #6b7280;
        }
        .gold-shine:hover::before {
            animation: rotateRaysSmall 10s linear infinite;
        }
        .gold-shine > .card.clickable:hover {
            animation: legendaryPulse 5s ease-in-out infinite;
        }
    }
</style>
