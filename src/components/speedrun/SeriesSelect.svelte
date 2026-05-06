<script>
    import { selectedSeries, selectedEvent } from "../../stores/sharedStore";
    import { slide } from "svelte/transition";

    const AllSeriesForFiltering = [
        { value: "Deus Ex",              label: "Deus Ex" },
        { value: "Jedi Knight",          label: "Jedi Knight" },
        { value: "Borderlands",          label: "Borderlands" },
        { value: "Mirror's Edge",        label: "Mirror's Edge" },
        { value: "Fast and Furious",     label: "Fast and Furious" },
        { value: "Sewer Rave",           label: "Sewer Rave" },
        { value: "No One Lives Forever", label: "NOLF" },
    ]

    const AllEventsForFiltering = [
        { value: "Hekathon",  label: "Hekathon" },
        { value: "ESA",       label: "European Speedrunner Assembly" },
        { value: "NSG",       label: "Norway Speedrunner Gathering" },
        { value: "GDQ",       label: "Games Done Quick" },
        { value: "SoB",       label: "Sum of Besties" },
    ]

    $: anyFilterActive = $selectedSeries.length > 0 || $selectedEvent.length > 0;
    let isOpen = false;

    function toggleFilter(list, item, store) {
        if (list.includes(item)) {
            store.update((f) => f.filter((x) => x !== item));
        } else {
            store.update((f) => [...f, item]);
        }
    }

    function resetSeries() {
        selectedSeries.update(() => []);
    }

    function resetEvents() {
        selectedEvent.update(() => []);
    }
</script>

<div class="flex flex-col gap-2">
    <button
        class="flex items-center gap-2 text-gray-300 hover:text-white hover:cursor-pointer w-fit"
        on:click={() => (isOpen = !isOpen)}
    >
        <span class="text-sm font-semibold tracking-wide uppercase">Filters</span>
        <span class="text-xs">{isOpen ? '▲' : '▼'}</span>
        {#if anyFilterActive}
            <span class="text-xs text-yellow-400 font-semibold">● Active</span>
        {/if}
    </button>

    {#if isOpen}
        <div class="flex flex-col gap-3" transition:slide={{ duration: 250 }}>
            <div class="flex flex-col gap-1">
                <span class="text-xs text-gray-500 uppercase tracking-widest">Game Series</span>
                <div class="flex flex-wrap gap-2">
                    {#each AllSeriesForFiltering as series}
                        <button
                            title={series.value}
                            class={`px-3 py-1 border rounded-md text-sm text-gray-300 ${$selectedSeries.includes(series.value) ? "bg-gray-600" : "bg-gray-800 sm:hover:bg-gray-600 hover:cursor-pointer"}`}
                            on:click={() => toggleFilter($selectedSeries, series.value, selectedSeries)}
                        >{series.label}</button>
                    {/each}
                    <button
                        title="Other"
                        class={`px-3 py-1 border rounded-md text-sm text-gray-300 ${$selectedSeries.includes("Other") ? "bg-gray-600" : "bg-gray-800 sm:hover:bg-gray-600 hover:cursor-pointer"}`}
                        on:click={() => toggleFilter($selectedSeries, "Other", selectedSeries)}
                    >Other</button>
                    {#if $selectedSeries.length > 0}
                        <button
                            class="px-3 py-1 border rounded-md text-sm text-gray-300 bg-gray-800 sm:hover:bg-gray-600 hover:cursor-pointer"
                            on:click={resetSeries}
                        >Reset</button>
                    {/if}
                </div>
            </div>

            <div class="flex flex-col gap-1">
                <span class="text-xs text-gray-500 uppercase tracking-widest">Event</span>
                <div class="flex flex-wrap gap-2">
                    {#each AllEventsForFiltering as event}
                        <button
                            title={event.label}
                            class={`px-3 py-1 border rounded-md text-sm text-gray-300 ${$selectedEvent.includes(event.value) ? "bg-gray-600" : "bg-gray-800 sm:hover:bg-gray-600 hover:cursor-pointer"}`}
                            on:click={() => toggleFilter($selectedEvent, event.value, selectedEvent)}
                        >{event.label}</button>
                    {/each}
                    <button
                        title="Other"
                        class={`px-3 py-1 border rounded-md text-sm text-gray-300 ${$selectedEvent.includes("Other") ? "bg-gray-600" : "bg-gray-800 sm:hover:bg-gray-600 hover:cursor-pointer"}`}
                        on:click={() => toggleFilter($selectedEvent, "Other", selectedEvent)}
                    >Other</button>
                    {#if $selectedEvent.length > 0}
                        <button
                            class="px-3 py-1 border rounded-md text-sm text-gray-300 bg-gray-800 sm:hover:bg-gray-600 hover:cursor-pointer"
                            on:click={resetEvents}
                        >Reset</button>
                    {/if}
                </div>
            </div>
        </div>
    {/if}
</div>
