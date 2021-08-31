const inquirer = require("inquirer")
const axios = require("axios")
const fs = require("fs")
const path = require("path")
const ora = require("ora")
const mainMenu = require("./constants/mainMenu")
const pdfMenu = require("./constants/pdfMenu")
const getExtensionsConvertFiles = require("./utils/getExtensionsConvertFiles")
const getFilenameWithExtension = require("./utils/getFileNameWithExtension")

async function main() {
    let choice = 0

    do {
        // Menu of actions to be performed by the user

        const res_menu = await inquirer.prompt(mainMenu)

        // Get the option that the user chose in the menu

        choice = get_user_option_number(res_menu)

        // Validate if the user wants to exit the program or want to convert a pdf

        let res_menu_pdf = ""

        if (choice == 9) {
            console.log("Adios!")
            return
        } else if (choice == 8) {
            res_menu_pdf = await inquirer.prompt(pdfMenu)
        }

        try {
            // The user is prompted for the file source path

            const file_source_path = await inquirer.prompt({
                name: "file_source_path",
                message:
                    "Por favor, escriba la ruta completa del archivo (Debe incluir el nombre del archivo y su extensión). Ej: /home/camilo/Downloads/pruebas.docx",
            })

            // The user is prompted for the file destination path.

            const file_destination_path = await inquirer.prompt({
                name: "file_destination_path",
                message:
                    "Por favor, escriba la ruta de la carpeta donde quiere que se guarde el archivo (No se debe colocar el nombre del archivo). Ej: /home/camilo/Downloads/",
            })

            // Encode file to base64

            const fileBase64 = await base64_encode(file_source_path.file_source_path)

            //Get file name
            let file_name_with_extension = getFilenameWithExtension(file_source_path)

            // Obtain the extensions according to the option provided by the user.

            let extensions = getExtensionsConvertFiles(
                res_menu,
                choice,
                file_source_path,
                res_menu_pdf
            )

            // API Request
            let spinner
            try {
                spinner = ora("Convirtiendo...").start()
                const res = await axios.post("http://54.163.147.33:8080/convertir", {
                    base64: fileBase64,
                    extensionFuente: extensions[0],
                    extensionDestino: extensions[1],
                    nombreArchivo: file_name_with_extension,
                })

                // Decode the API response

                const data = res.data
                base64_uncode(data, file_destination_path)
                spinner.stopAndPersist({
                    symbol: '✅',
                    text: 'El archivo ha sido creado'
                })
            } catch (error) {
                spinner.stopAndPersist({
                    symbol: '❌',
                    text: 'Ha ocurrido un error al procesar tu petición, inténtalo nuevamente'
                })
            }
        } catch (error) {
            if(error.message === "ENOENT: no such file or directory, open"){
                console.log("❌ Por favor, revisa la ruta de origen, recuerda que debes indicar en la ruta el nombre del archivo y su extención");
            }
        }
    } while (choice != 9)
}

main()

function get_user_option_number(res_menu) {
    return parseInt(res_menu.choice_1.split(")")[0])
}

function base64_encode(path) {
    let buff = fs.readFileSync(path)
    let base64data = buff.toString("base64")
    return base64data
}

function base64_uncode(data, file_destination_path) {
    const { base64: stringBase64, nombreArchivo } = data
    let file_path = path.join(
        file_destination_path.file_destination_path,
        nombreArchivo
    )
    let buff = Buffer.from(stringBase64, "base64")
    fs.writeFileSync(file_path, buff)
}
