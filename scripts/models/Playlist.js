class Playlist
{
    constructor(items)
    {
        this._items = items;
        if (this._items.length > 0)
            this._to_be_played = this._items[0]
    }

    get to_be_played() {
        return this._to_be_played
    }

    set_to_be_played(i) {
        this._to_be_played = this._items[i]
    }

    add_video(video) {
        this._items.push(video)
    }

    get_videos()
    {
        return this._items;
    }

    delete_video(i)
    {
        this._items.splice(i, 1);
    }

    get_array()
    {
        return this._items;
    }
}

module.exports = Playlist