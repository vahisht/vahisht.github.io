<script lang="ts">
    import { visibleRunCounts, selectedSeries, selectedEvent } from "../../stores/sharedStore";
    import Section from "./Section.svelte";

    $: hasRuns = $visibleRunCounts.speedrun > 0;
    $: hasCommentary = $visibleRunCounts.commentary > 0;
    $: anyFilterActive = $selectedSeries.length > 0 || $selectedEvent.length > 0;
    $: noResults = anyFilterActive && !hasRuns && !hasCommentary;

    $: if (typeof document !== 'undefined') {
        document.body.style.background = hasCommentary ? 'rgb(97, 108, 124)' : '#020617';
    }
</script>

<div class="bands-wrapper">

<!-- Runs band — always present with #020617 background -->
<div class="runs-band" class:no-results-mode={noResults} class:runs-fill={!hasCommentary} class:empty-band={!hasRuns && !noResults}>
    <div class="inner">
        {#if noResults}
            <p class="no-results-text">No runs matching filters</p>
        {/if}
        <!-- Always mounted so the store stays up to date; renders nothing when empty -->
        <Section sectionTitle="My Marathon Runs" section="speedrun" />
    </div>
</div>

<!-- Commentary band — only gets background + padding when it has results -->
<div class:commentary-band={hasCommentary}>
    <div class="inner">
        <!-- Always mounted so the store stays up to date; renders nothing when empty -->
        <Section sectionTitle="Marathon Runs With Me On Commentary" section="commentary" />
    </div>
</div>

</div>

<style>
    .bands-wrapper {
        display: flex;
        flex-direction: column;
        flex: 1;
    }
    .runs-band {
        width: 100%;
        background: #020617;
        padding: 2rem 0;
    }

    .runs-fill {
        flex: 1;
    }

    .empty-band {
        padding: 0;
    }

    .runs-band.no-results-mode {
        min-height: 60vh;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .runs-band.no-results-mode .inner {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .no-results-text {
        color: #ffffff;
        font-size: 1.5rem;
        font-weight: 600;
        text-align: center;
        margin: 0;
    }

    .commentary-band {
        flex: 1;
        width: 100%;
        background: rgb(97, 108, 124);
        padding: 2rem 0;
    }

    .inner {
        width: 100%;
        max-width: 1400px;
        margin: 0 auto;
        padding: 0 1rem;
    }
</style>
