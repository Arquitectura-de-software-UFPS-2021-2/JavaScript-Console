const getFilenameWithExtension = require("./getFileNameWithExtension")

module.exports = function (
    res_menu,
    choice,
    file_source_path
) {
    arr = []
    if (choice >= 1 && choice <= 6) {
        separate_response = res_menu.choice_1.split(" ")
        arr.push(
            separate_response[3].toUpperCase(),
            separate_response[5].toUpperCase()
        )
    } else {
        extension_source = getFilenameWithExtension(file_source_path)
            .split(".")[1]
            .toUpperCase()
        extension_destination = "PDF"
        arr.push(extension_source, extension_destination)
    }
    return arr
}