<script>
    import news from "../../data/news.json"

    let newsIndex = $state(0)

    function nextNews() {
        if (news.length === newsIndex + 1) {
            newsIndex = 0
        } else {
            newsIndex++
        }
    }

    function prevNews() {
        if (newsIndex === 0) {
            newsIndex = news.length - 1
        } else {
            newsIndex-- 
        }
    }

    setInterval(nextNews, 5000)
</script>

<section class="w-screen h-screen bg-gray-700 flex flex-col gap-2 justify-center items-center">

    <h1 class="text-3xl">News Gallery</h1>

    <div class="flex w-full justify-center">

        <button
            class="bg-black bg-opacity-50 w-14 transition-all hover:bg-opacity-70 rounded-l-lg"
            onclick={prevNews}
            aria-label="Previous News Button"
        >
            <i class="text-white text-6xl font-bold">
                &lt;
            </i>
        </button>

        <div class="flex relative overflow-hidden max-w-[1000px] w-full">
            
            {#each news as n}
                <a href={n.link} target="_blank">
                    <div
                        class="relative w-[1000px] h-[400px] bg-cover transition-all translate-x-full"
                        style={"background-image: url('/news/"+n.thumbnail+"'); transform: translate(-"+newsIndex * 100+"%);"}
                    >
                        <div class="absolute bottom-0 left-0 h-[100px] w-full bg-black bg-opacity-80 p-4 flex flex-col items-start justify-center">
                            <p class="text-gray-400 text-base">{n.category}</p>
                            <p class="text-gray-300 text-xl sm:text-2xl">{n.title}</p>
                        </div>
                    </div>
                </a>
            {/each}
            
            <div class="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
                {#each news, index}
                    <button 
                        class={`w-3 h-3 rounded-full bg-white transition-all ${newsIndex === index ? "opacity-100 scale-125" : "opacity-50"}`}  
                        onclick={() => newsIndex = index}
                        aria-label="dot for each news"
                    ></button>
                {/each}
            </div>

        </div>

        <button
            class=" bg-black bg-opacity-50 w-14 h-full z-50 transition-all hover:bg-opacity-70 rounded-r-lg"
            onclick={nextNews}
            aria-label="Next News Button"
        >
            <i class="text-white text-6xl font-bold">
                &gt;
            </i>
        </button>

    </div>
        
</section>