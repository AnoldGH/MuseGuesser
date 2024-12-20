const { getAccessToken } = require("../utility/tokenManager");
const axios = require('axios')

// Common filter functions
const PREVIEW_GENRE_FILTER_FAC = (genre) => (track) => track.preview_url && track.genre == genre
const PREVIEW_FILTER = (track) => track.preview_url
const ALL_FILTER = (track) => true

/* Singleton class to manage all spotify-related Requests */
class ProviderProxy {
    static instance = null;

    constructor() {
        this.cache = new Map()             // dictionary - trackId: trackInfo
        this.rateLimit = 0                      // rate limit estimate
        this.rlHandler = new CacheHandler()
    }

    // Singleton method
    static getInstance() {
        // Create a singleton instance if none available
        if (ProviderProxy.instance == null) {
            ProviderProxy.instance = new ProviderProxy()
        }

        return ProviderProxy.instance
    }

    // Add to cache
    addToCache(key, response) {
        const cacheDuration = CacheHandler.cacheDuration(this.rateLimit)

        // Store response with a timeout to remove it after cacheDuration
        const timeoutId = setTimeout(() => {
            this.cache.delete(key)
            console.log(`Cache expired for key: ${key}`)
        }, cacheDuration)

        if (this.cache.has(key)) {
            console.log(`Replaced track#${key}`)
        } else console.log(`Added track#${key}`)

        console.log(JSON.stringify(response))
        this.cache.set(key, {response, timeoutId})
    }

    // Clear the cache
    clearCache() {
        // Clear all timeouts and cache entries
        for (const [key, { timeoutId }] of this.cache.entries()) {
            clearTimeout(timeoutId)
            this.cache.delete(key)
        }
    }

    // Get track with ID
    async getTrack(trackId) {
        console.log(`Trying to get track with id ${trackId}`)

        if (!(trackId in this.cache)) {
            return null // trivial implementation
        }

        return this.cache[trackId]
    }

    // Recommends tracks from genre
    //  TODO: for now we assume there is only one genre
    async recommendTracks(genre, limit = 10) {
        return null // trivial implementation
    }

    // (base) Get a random track with filter
    //  returns null if no match
    getRandomTrackFilter(filter) {
        const filteredValues = [...this.cache.values()]
            .map(entry => entry.response)
            .filter((value) => filter(value))
        if (filteredValues.length == 0) return null
        return filteredValues[~~(Math.random() * filteredValues.length)]
    }

    // Get a random track
    getRandomTrack() {
        return this.getRandomTrackFilter(ALL_FILTER)
    }

    // Get a random track by genre
    async getRandomTrackByGenre(genre) {
        console.log("Fetching new recommendations of genre", genre)
        await this.recommendTracks(genre)

        console.log("Filtering results")
        const filter = PREVIEW_GENRE_FILTER_FAC(genre)
        const result = this.getRandomTrackFilter(filter)

        return result
    }
}

// Factory to produce different strategies handling rate limits
const LOW_RATE_CACHE = 600000               // 10 minutes
const MID_RATE_CACHE = LOW_RATE_CACHE * 2   // 20 minutes
const HIGH_RATE_CACHE = MID_RATE_CACHE * 2  // 40 minutes

class CacheHandler {
    constructor() {

    }

    static cacheDuration(rateLimit) {
        // TODO: strategies
        return LOW_RATE_CACHE
    }
}

async function test() {
    const proxy = ProviderProxy.getInstance()
    console.log(proxy.getRandomTrackByGenre("pop"))
    await proxy.recommendTracks("pop", 10)
    console.log(proxy.getRandomTrackByGenre("pop"))
}

module.exports = ProviderProxy