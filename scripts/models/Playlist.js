class Playlist
{
    constructor(items)
    {
        this._to_be_played_index = 0
        this._items = items;
    }

    go_previous() {
        if (this._to_be_played_index <= 0) {
            this._to_be_played_index = (this._items.length-1)
        } else {
            this._to_be_played_index -= 1
        }
    }
    go_next() {
        if (this._to_be_played_index >= (this._items.length-1)) {
            this._to_be_played_index = 0
        } else {
            this._to_be_played_index += 1
        }
    }

    get to_be_played_index() {
        return this._to_be_played_index
    }
    get to_be_played() {
        return this._items[this._to_be_played_index]
    }

    set_to_be_played(i) {
        this._to_be_played_index = i
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