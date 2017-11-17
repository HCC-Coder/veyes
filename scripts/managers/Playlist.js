class Playlist
{
    constructor()
    {
        this.items = [];
    }

    add_video(video) {
        this.items.push(video)
    }

    get_videos()
    {
        return this.items;
    }
}

module.exports = Playlist