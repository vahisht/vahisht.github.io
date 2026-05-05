<script>
    // ### Information about a given speedrun, received from the parent component in Section.svelte
    export let speedrun

    function getYouTubeThumbnail(videoUrl) {
        if (!videoUrl) return null;
        const match = videoUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?/]+)/);
        return match ? `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg` : null;
    }

    $: effectiveThumbnail = getYouTubeThumbnail(speedrun.video) || speedrun.thumbnail;

    function handleClick() {
        if (speedrun.video) {
            window.open(speedrun.video, '_blank', 'noopener,noreferrer');
        }
    }
</script>

<div class="flex flex-col w-[445px]">
    <div class="relative {speedrun.important ? 'gold-shine-wrapper' : ''}">
        <div class="relative aspect-video overflow-hidden rounded-md {speedrun.video ? 'hover:cursor-pointer' : ''}" on:click={handleClick} aria-hidden="true">
            <img
                src={effectiveThumbnail}
                alt={speedrun.game}
                class="w-full h-full object-cover {!speedrun.video ? 'grayscale brightness-50' : ''}"
            />
            {#if !speedrun.video}
                <div class="absolute inset-0 flex items-center justify-center">
                    <span class="text-gray-300 text-sm font-semibold tracking-widest uppercase opacity-80">Video Unavailable</span>
                </div>
            {/if}
        </div>
    </div>
    <p class="text-1xl font-bold text-gray-300">{speedrun.game} - {speedrun.category}</p>
    <p class="text-base text-gray-300">{speedrun.event_name}</p>
</div>

<style>
    /* --- PULSE GLOW ---
       0%/100% = minimum glow (tune the last number = opacity, e.g. 0.4 → brighter floor)
       50%     = maximum glow (tune opacity values for peak brightness)
       4s      = speed of pulse cycle */
    @keyframes goldPulse {
        0%, 100% {
            box-shadow: 0 0 14px 5px rgba(250, 204, 21, 0.4),
                        0 0 28px 10px rgba(250, 204, 21, 0.18);
        }
        50% {
            box-shadow: 0 0 20px 7px rgba(250, 204, 21, 0.45),
                        0 0 40px 14px rgba(250, 204, 21, 0.22),
                        0 0 65px 22px rgba(250, 204, 21, 0.08);
        }
    }

    /* --- RAYS ---
       6s = rotation speed (lower = faster)
       blur(5px) = how soft/wide the rays are
       opacity values inside conic-gradient = ray brightness
       degree ranges = how wide each ray is (e.g. 15deg→40deg = 25° wide) */
    @keyframes rotateRays {
        from { transform: translate(-50%, -50%) rotate(0deg); }
        to   { transform: translate(-50%, -50%) rotate(360deg); }
    }

    .gold-shine-wrapper {
        border-radius: 8px;
        isolation: isolate;
        animation: goldPulse 8s ease-in-out infinite;
    }

    .gold-shine-wrapper::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: calc(100% + 40px);
        height: calc(100% + 40px);
        border-radius: 14px;
        background: conic-gradient(
            from 0deg,
            transparent 0deg,
            rgba(250, 204, 21, 0.35) 10deg,
            transparent 22deg,
            transparent 90deg,
            rgba(250, 204, 21, 0.3) 100deg,
            transparent 112deg,
            transparent 180deg,
            rgba(250, 204, 21, 0.32) 190deg,
            transparent 202deg,
            transparent 270deg,
            rgba(250, 204, 21, 0.28) 280deg,
            transparent 292deg,
            transparent 360deg
        );
        animation: rotateRays 20s linear infinite;
        filter: blur(55px);
        z-index: -1;
    }
</style>