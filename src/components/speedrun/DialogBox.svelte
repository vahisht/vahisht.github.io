<script>
    import { speedrunDialogbox, currentGame } from "../../stores/sharedStore";

    // ### Global state from the sharedStore file
    let dialogboxState;
    $: speedrunDialogbox.subscribe((value) => (dialogboxState = value));

    let speedrunInDialogBox;
    $: currentGame.subscribe((value) => (speedrunInDialogBox = value))

    // ### Function to close and empty the dialogbox when clicking on a video thumbnail.
    // ### Opening function is in Game.svelte
    function handleClick() {
        speedrunDialogbox.update((state) => ({...state, isOpen: false}))
        currentGame.update((state) => ({
            ...state, 
            game: "",
            category: "",
            event_line: "",
            event_name: "",
            year: 0,
            month: 0,
            video: "",
            description: "",
            game_series: "",
            runner: "",
            type: "",
            thumbnail: ""
        }))
    }

</script>

<div 
    aria-hidden="true" 
    class={`${dialogboxState.isOpen === true ? "flex" : "hidden"} fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-60 flex justify-center items-center`}
    on:click={handleClick}
>

    <div 
        role="dialog" 
        aria-hidden="true" 
        class="w-full max-w-[1200px] bg-gray-500 rounded-2xl flex flex-col gap-2 justify-center items-center m-1 sm:m-6 p-2" 
        on:click|stopPropagation
    >
        <p class="text-2xl">{speedrunInDialogBox.game} - {speedrunInDialogBox.category}</p>
        
            {#if speedrunInDialogBox.video.includes("youtube") === true}

                <!-- Embed YouTube Video -->
                <iframe 
                    class="w-full h-auto aspect-video" 
                    src={"https://www.youtube.com/embed/"+speedrunInDialogBox.video.split("?v=")[1]} 
                    title="YouTube video player" 
                    frameborder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                    referrerpolicy="strict-origin-when-cross-origin" 
                    allowfullscreen
                ></iframe>

            {:else if speedrunInDialogBox.video.includes("twitch") === true}
                
                <!-- Embed Twitch Video -->
                <iframe 
                    class="w-full h-auto aspect-video" 
                    src={"https://player.twitch.tv/?video="+speedrunInDialogBox.video.split("videos/")[1]+"&parent=localhost&parent=vahisht-website.vercel.app&parent=vahisht.dev"} 
                    title="Twitch video player" 
                    allowfullscreen 
                    scrolling="no" 
                    allow="encrypted-media;"                
                ></iframe>
            
            {:else}

                <!-- Might probably wanna change or remove this sections. When no YouTube or Twitch video is found -->
                <img src="videos.png" alt="videos" class="h-[400px]" />

            {/if}

        <p>{speedrunInDialogBox.event_name}</p>
        <p>{speedrunInDialogBox.description}</p>
    </div>

</div>