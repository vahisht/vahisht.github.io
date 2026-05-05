<script>
    import { onMount, onDestroy } from "svelte"
    import news from "../../data/news.json"

    let newsIndex = $state(0)

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
</script>

<section class="news-section" style={`background: ${item.style.color};`}>

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

                            <div class="text-side">
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
        color: rgba(255, 255, 255, 0.6);
    }

    .title {
        font-family: 'Exo 2', sans-serif;
        font-size: clamp(1.4rem, 1.9vw, 2rem);
        font-weight: 800;
        line-height: 1.1;
        color: #ffffff;
        text-shadow: 0 2px 20px rgba(0, 0, 0, 0.5);
        margin: 0;
    }

    .description {
        font-family: 'Titillium Web', sans-serif;
        font-size: 1rem;
        line-height: 1.7;
        color: rgba(255, 255, 255, 0.75);
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
        background: rgba(255, 255, 255, 0.4);
        border: none;
        cursor: pointer;
        padding: 0;
        transition: background 0.2s, transform 0.2s;
    }

    .dot.active {
        background: rgba(255, 255, 255, 0.95);
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
        color: rgba(255, 255, 255, 0.5);
        cursor: pointer;
        padding: 0 0.5rem;
        transition: color 0.2s;
    }

    .nav-arrow:hover {
        color: #fff;
    }

    .nav-arrow svg {
        width: 2rem;
        height: 2rem;
    }
</style>