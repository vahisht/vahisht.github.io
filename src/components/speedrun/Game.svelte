<script>
    import { speedrunDialogbox, currentGame } from "../../stores/sharedStore";

    // ### Information about a given speedrun, received from the parent component in Section.svelte
    export let speedrun

    // ### Global state from the sharedStore file
    let dialogboxState;
    $: speedrunDialogbox.subscribe((value) => (dialogboxState = value));

    // ### Function to open and update the dialogbox when clicking on a video thumbnail.
    // ### Closing function is in DialogBox.svelte
    function handleClick() {
        speedrunDialogbox.update((state) => ({...state, isOpen: true}))
        currentGame.update((state) => ({
            ...state, 
            game: speedrun.game,
            category: speedrun.category,
            event_line: speedrun.event_line,
            event_name: speedrun.event_name,
            year: speedrun.year,
            month: speedrun.month,
            video: speedrun.video,
            description: speedrun.description,
            game_series: speedrun.game_series,
            runner: speedrun.runner,
            type: speedrun.type,
            thumbnail: speedrun.thumbnail
        }))
    }
</script>

<div class="flex flex-col">
    <img
        src={speedrun.thumbnail}
        alt={speedrun.game}
        width={445}
        height={240}
        on:click={handleClick}
        aria-hidden="true"
        class="rounded-md hover:cursor-pointer"
    />
    <p class="text-1xl font-bold text-gray-300">{speedrun.game} - {speedrun.category}</p>
    <p class="text-base text-gray-300">{speedrun.event_name}</p>
</div>