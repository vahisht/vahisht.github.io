<script>

    // ### Mount Twitch Javascript file to the body 
    // ### Used to Embed the Twitch player
    import { onMount } from "svelte";
    onMount(() => {
        const script = document.createElement("script");
        script.src = "https://embed.twitch.tv/embed/v1.js";
        script.async = true;
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    });

    // ### Receive ID and passocde from .env for Twitch API
    // ### Define other Variables
    export let clientId
    export let clientSecret
    const username = "vahisht"
    let isLive = false

    // ###Function to get Twitch OAuth Token
    async function getAccessToken() {
        const response = await fetch("https://id.twitch.tv/oauth2/token", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
                client_id: clientId,
                client_secret: clientSecret,
                grant_type: "client_credentials"
            })
        });
        const data = await response.json();
        return data.access_token;
        }

    // ### Function to check if User is currently Live on Twitch
    async function checkIfLive() {
        const accessToken = await getAccessToken()
        try {
            const response = await fetch(`https://api.twitch.tv/helix/streams?user_login=${username}`, {
                headers: {
                    "Client-ID": clientId,
                    "Authorization": `Bearer ${accessToken}`
                }
            });
            const data = await response.json();
            // ### If User is Live
            if (data.data.length > 0) {
                embedTwitchPlayer()
                isLive = true
                return true
            // ### If User is not Live
            } else {
                return false
            }
        } catch(error) {
            console.log(error)
            return false
        }
        
    }

    // ### Embed the Twitch Player with the help of the external Twitch .js that was mounted at the start
    function embedTwitchPlayer() {
        new Twitch.Embed("twitch-embed", {
            width: "100%",
            height: "100%",
            channel: username,
            layout: "video",
            muted: true,
            parent: [
                "localhost", 
                "vahisht-website.vercel.app", 
                "vahisht.dev"
            ]
        });
    }

    checkIfLive()

</script>

<div class="w-full h-full">

    <section class="{isLive === true ? "flex" : "hidden"} w-screen h-full sm:h-screen bg-gray-500 flex-col lg:flex-row justify-center items-center">

        <div id="twitch-embed" class="max-w-[1000px] w-full aspect-video p-2"></div>

        <iframe 
            class="w-full lg:w-[300px] max-w-[1000px] h-[600px] p-2"
            title="Twitch Chat"
            src="https://www.twitch.tv/embed/{username}/chat?parent=localhost&parent=vahisht-website.vercel.app&vahisht.dev"
        >
        </iframe>
        
    </section>
</div>