<script>
    import { selectedSeries, selectedEvent } from "../../stores/sharedStore";

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

<div class="filter-panel">
    <span class="filter-title">Filters</span>

    <div class="filter-rows">
        <!-- Game series row -->
        <div class="filter-group">
            <span class="group-label">Game Series</span>
            <div class="filter-row">
                {#each AllSeriesForFiltering as series}
                    <button
                        title={series.value}
                        class="fbtn"
                        class:active={$selectedSeries.includes(series.value)}
                        on:click={() => toggleFilter($selectedSeries, series.value, selectedSeries)}
                    >{series.label}</button>
                {/each}
                <button
                    title="Other"
                    class="fbtn"
                    class:active={$selectedSeries.includes("Other")}
                    on:click={() => toggleFilter($selectedSeries, "Other", selectedSeries)}
                >Other</button>
                {#if $selectedSeries.length > 0}
                    <button class="fbtn reset" on:click={resetSeries}>Reset</button>
                {/if}
            </div>
        </div>

        <!-- Event row -->
        <div class="filter-group">
            <span class="group-label">Event</span>
            <div class="filter-row">
                {#each AllEventsForFiltering as event}
                    <button
                        title={event.label}
                        class="fbtn"
                        class:active={$selectedEvent.includes(event.value)}
                        on:click={() => toggleFilter($selectedEvent, event.value, selectedEvent)}
                    >{event.label}</button>
                {/each}
                <button
                    title="Other"
                    class="fbtn"
                    class:active={$selectedEvent.includes("Other")}
                    on:click={() => toggleFilter($selectedEvent, "Other", selectedEvent)}
                >Other</button>
                {#if $selectedEvent.length > 0}
                    <button class="fbtn reset" on:click={resetEvents}>Reset</button>
                {/if}
            </div>
        </div>
    </div>
</div>

<style>
    .filter-panel {
        display: flex;
        align-items: center;
        gap: 1.75rem;
        flex-wrap: wrap;
    }

    .filter-title {
        font-family: 'Pixelify Sans', sans-serif;
        font-weight: 700;
        font-size: 2.4rem;
        line-height: 1;
        color: #000000;
        flex-shrink: 0;
    }

    .filter-rows {
        display: flex;
        flex-direction: column;
        gap: 0.7rem;
        flex: 1;
        min-width: 0;
    }

    .filter-group {
        display: flex;
        flex-direction: column;
        gap: 0.3rem;
    }

    .group-label {
        font-family: 'Josefin Sans', sans-serif;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.14em;
        font-size: 0.68rem;
        color: #0b2740;
    }

    .filter-row {
        display: flex;
        flex-wrap: nowrap;
        gap: 0.4rem;
    }

    .fbtn {
        font-family: 'Josefin Sans', sans-serif;
        font-weight: 400;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        font-size: 0.72rem;
        padding: 0.18rem 0.6rem;
        border-radius: 6px;
        border: 1px solid #1e3a5f;
        background: #0d1326;
        color: #dbe4ff;
        cursor: pointer;
        white-space: nowrap;
        transition: background 0.15s ease, transform 0.1s ease, box-shadow 0.15s ease;
    }
    .fbtn:hover {
        background: #1b2848;
        transform: translateY(-1px);
    }
    .fbtn.active {
        background: #f8fafc;
        color: #0b1020;
        border-color: #f8fafc;
        box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.5);
    }
    .fbtn.reset {
        background: transparent;
        color: #0b2740;
        border-color: #0b2740;
    }
    .fbtn.reset:hover {
        background: rgba(11, 39, 64, 0.12);
    }
</style>
