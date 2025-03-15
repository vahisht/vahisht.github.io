<script>
    import { selectedSeries } from "../../stores/sharedStore";

    // ### If you want to add another Series for filtering, just add it to this Array.
    const AllSeriesForFiltering = [
        "Deus Ex",
        "Jedi Knight",
    ]

    // ### Global state from the sharedStore file
    let seriesFilter;
    $: selectedSeries.subscribe((value) => (seriesFilter = value));

    // ### Functions to add, remove or reset the filter for selecting series.
    function addSeries(chosenSeries) {
        selectedSeries.update((gamesInFilter) => [...gamesInFilter, chosenSeries])
    }

    function removeSeries(choosenSeries) {
        selectedSeries.update((gamesInFilter) => gamesInFilter.filter((series) => series !== choosenSeries))
    }

    function resetFilter() {
        selectedSeries.update(() => [])
    }

</script>

<div class="flex gap-2">

    {#each AllSeriesForFiltering as series}
        <button 
            class={`p-2 border rounded-md text-gray-300  
                ${seriesFilter.includes(series) === true 
                    ? "bg-gray-600" 
                    : "bg-gray-800 sm:hover:bg-gray-600 hover:cursor-pointer"
                }`} 

            on:click={
                () => seriesFilter.includes(series) ==! true 
                    ? addSeries(series) 
                    : removeSeries(series)
            }
        >
            {series}
        </button>
    {/each}

    <button 
        class="p-2 border rounded-md text-gray-300 bg-gray-800 sm:hover:bg-gray-600 hover:cursor-pointer" 
        on:click={() => resetFilter()}
    >
        Reset
    </button>
</div>