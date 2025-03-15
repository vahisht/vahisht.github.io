<script>
    import speedruns from "../../data/speedrun.json"
    import Game from "./Game.svelte"
    import { selectedSeries } from "../../stores/sharedStore";

    // ### Global state from the sharedStore file
    let seriesFilter;
    $: selectedSeries.subscribe((value) => (seriesFilter = value));

    // ### Props from the Parent in speedrun.astro
    export let sectionTitle
    export let section

    // ### Function to filter the speedruns based on type and/or game_series
    function FilteredSeries() {

        let filteredSpeedruns

        if (seriesFilter.length > 0) {
            filteredSpeedruns = speedruns
            .filter((speedrun) => speedrun.type === section)
            .filter((speedrun) => seriesFilter.includes(speedrun.game_series))
        } else {
            filteredSpeedruns = speedruns.filter((speedrun) => speedrun.type === section)
        }

        return filteredSpeedruns
    }
</script>

<div class="flex flex-col gap-2">
    <h1 class="text-4xl text-gray-300">{sectionTitle}</h1>
    <hr/>
    <div class="flex flex-wrap justify-around gap-3">
        {#each FilteredSeries().reverse() as speedrun}
            <Game speedrun={speedrun} />
        {/each}
    </div>
</div>