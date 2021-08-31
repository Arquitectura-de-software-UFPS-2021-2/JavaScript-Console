const path = require("path")

module.exports = function (file_source_path) {
    let arr_path = file_source_path.file_source_path.split(path.sep)
    return arr_path[arr_path.length - 1]
}