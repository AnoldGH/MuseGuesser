const { getAccessToken } = require("../utility/tokenManager");
const axios = require('axios');
const providerProxy = require("./providerProxy");

/* Singleton class to manage all spotify-related Requests */
class SpotifyProxy extends providerProxy {
    static instance = null;

    // Singleton method
    static getInstance() {
        // Create a singleton instance if none available
        if (SpotifyProxy.instance == null) {
            SpotifyProxy.instance = new SpotifyProxy()
        }

        return SpotifyProxy.instance
    }

    // Get track with ID
    async getTrack(trackId) {
        console.log(`Trying to get track with id ${trackId}`)

        if (!(trackId in this.cache)) {
            // request for specific track
            console.log(`Requesting track with id ${trackId} from Spotify`)
            try {
                const accessToken = await getAccessToken();
                const response = await axios.get(
                  `https://api.spotify.com/v1/tracks/${trackId}`,
                  {
                    headers: {
                      Authorization: `Bearer ${accessToken}`,
                    },
                  }
                ).catch((error) => {console.log(error)});

                this.addToCache(trackId, response.data) // add to cache
              } catch (error) {
                // TODO: error handling
                throw error
              }
        }

        return this.cache[trackId]
    }

    // Recommends tracks from genre
    //  TODO: for now we assume there is only one genre
    async recommendTracks(genre, limit = 10) {
        try {
            const accessToken = await getAccessToken();
            const response = await axios.get(
            `https://api.spotify.com/v1/recommendations?seed_genres=${genre}&limit=${limit}`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
            ).catch((error) => console.log(error));

            console.log("Getting responses")
            response.data.tracks.forEach(track => {
                track.genre = genre // append genre to the song
                this.addToCache(track.id, track)
            });

            return response.data.tracks
        } catch (error) {
            // TODO: error handling
            throw error
        }

        // TODO: Form recommendation from cache
        //      TODO: could race condition happens here?
    }
}

async function test() {
    const proxy = SpotifyProxy.getInstance()
    console.log(proxy.getRandomTrackByGenre("pop"))
    await proxy.recommendTracks("pop", 10)
    console.log(proxy.getRandomTrackByGenre("pop"))
}

module.exports = SpotifyProxy