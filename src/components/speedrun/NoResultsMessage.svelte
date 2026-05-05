<script>
    import { selectedSeries, selectedEvent, visibleRunCounts } from "../../stores/sharedStore";

    $: anyFilterActive = $selectedSeries.length > 0 || $selectedEvent.length > 0;
    $: allEmpty = $visibleRunCounts.speedrun === 0 && $visibleRunCounts.commentary === 0;
</script>

{#if anyFilterActive && allEmpty}
    <p class="text-gray-500 italic">No runs matching filters</p>
{/if}
