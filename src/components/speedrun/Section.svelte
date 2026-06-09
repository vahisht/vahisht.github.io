<script>
    import speedruns from "../../data/speedrun.json"
    import Game from "./Game.svelte"
    import { selectedSeries, selectedEvent, visibleRunCounts } from "../../stores/sharedStore";

    // ### Props from the Parent in speedrun.astro
    export let sectionTitle
    export let section

    // ### The named series/events that have their own filter button.
    // ### "Other" will match anything not in these lists.
    const namedSeries = ["Deus Ex", "Jedi Knight", "Borderlands", "Mirror's Edge", "Fast and Furious", "Sewer Rave", "No One Lives Forever"];
    const namedEvents = ["Hekathon", "ESA", "NSG", "GDQ", "SoB"];

    $: results = (() => {
        let filtered = speedruns.filter((s) => s.type === section);

        if ($selectedSeries.length > 0) {
            filtered = filtered.filter((s) => {
                if ($selectedSeries.includes(s.game_series)) return true;
                if ($selectedSeries.includes("Other") && !namedSeries.includes(s.game_series)) return true;
                return false;
            });
        }

        if ($selectedEvent.length > 0) {
            filtered = filtered.filter((s) => {
                if ($selectedEvent.includes(s.event_line)) return true;
                if ($selectedEvent.includes("Other") && !namedEvents.includes(s.event_line)) return true;
                return false;
            });
        }

        return filtered.reverse();
    })();

    $: anyFilterActive = $selectedSeries.length > 0 || $selectedEvent.length > 0;
    $: visibleRunCounts.update((counts) => ({ ...counts, [section]: results.length }));
</script>

{#if results.length > 0}
    <div class="flex flex-col gap-4">
        <h2 class="section-heading">{sectionTitle}</h2>
        <div class="card-grid">
            {#each results as speedrun}
                <Game speedrun={speedrun} />
            {/each}
        </div>
    </div>
{/if}

<style>
    /* Matches the .bragging-heading style on the hire-me page (Death Stranding feel). */
    .section-heading {
        font-family: 'Josefin Sans', sans-serif;
        font-weight: 400;
        text-transform: uppercase;
        letter-spacing: 0.2em;
        font-size: 1.5rem;
        color: #ffffff;
        margin: 0;
    }

    .card-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(min(380px, 100%), 1fr));
        gap: 1.25rem;
    }
</style>