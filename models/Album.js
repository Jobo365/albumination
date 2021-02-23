const mongoose = require('mongoose');
const AlbumSchema = new mongoose.Schema( {
    name: {
        type: String,
        required: true,
    },
    owner: {
        type: String,
        required: true,
    },
    pictures: {
        type: Array,
        default: {}
    }
});

const Album = mongoose.model('Album', AlbumSchema)

module.exports = Album