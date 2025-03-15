// ### These are variables that are shared between different Svelte components

import { writable } from "svelte/store";

export const speedrunDialogbox = writable({ isOpen: false})

export const selectedSeries = writable([])

export const currentGame = writable({
    "game": "",
    "category": "",
    "event_line": "",
    "event_name": "",
    "year": 0,
    "month": 0,
    "video": "",
    "description": "",
    "game_series": "",
    "runner": "",
    "type": "",
    "thumbnail": ""
})