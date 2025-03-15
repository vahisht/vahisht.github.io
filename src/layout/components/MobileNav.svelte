<script>
    let isNavOpen = false
</script>

<div 
    class="sm:hidden flex flex-col justify-center m-2 gap-2 w-8 cursor-pointer"
    on:click={() => isNavOpen = !isNavOpen}
    aria-hidden="true"
>
    <p class="w-full h-1 bg-gray-300"></p>
    <p class="w-full h-1 bg-gray-300"></p>
    <p class="w-full h-1 bg-gray-300"></p>
</div>

<div class={`${isNavOpen === true ? "w-[300px]" : "w-0"} fixed flex flex-col top-0 right-0 h-screen z-50 bg-gray-700 bg-opacity-70 backdrop-blur-lg transition-all`}>
    
    <div class="w-full h-20 flex justify-end items-center">
        <div
            class="relative m-2 w-10 h-10 cursor-pointer"
            on:click={() => isNavOpen = false}
            aria-hidden="true"
        >

            <p class="absolute top-2 m-2 w-8 h-1 bg-gray-300 rotate-45"></p>
            <p class="absolute top-2 m-2 w-8 h-1 bg-gray-300 -rotate-45"></p>
        </div>
    </div>
    
    <a href={"/"}>
        <p class="text-xl text-gray-300 p-4">Home</p>
    </a>
    <a href={"/speedrun"}>
        <p class="text-xl text-gray-300 p-4">Speedrun</p>
    </a>
    <a href={"/research"}>
        <p class="text-xl text-gray-300 p-4">Research</p>
    </a>
    <a href={"/portfolio"}>
        <p class="text-xl text-gray-300 p-4">Portfolio</p>
    </a>
</div>