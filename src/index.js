const inquirer = require("inquirer")
const axios = require("axios")
const fs = require("fs")
const path = require("path")

async function menu() {

    let choice = 0

    do {
        // Menu of actions to be performed by the user

        const res_menu = await inquirer.prompt({
            type: "list",
            name: "choice_1",
            message: "¿Qué quieres hacer?",
            choices: [
                "1) Documentos de docx a odt",
                "2) Documentos de odt a docx",
                "3) Documentos de xlsx a ods",
                "4) Documentos de ods a xlsx",
                "5) Documentos de pptx a odp",
                "6) Documentos de odp a pptx",
                "7) Documentos de docx odt xlsx ods pptx odp a pdf",
                "8) Documentos PDF a cualquier otro formato",
                "9) Salir"
            ]
        })

        // Get the option that the user chose in the menu

        choice = get_user_option_number(res_menu)

        // Validate if the user wants to exit the program

        if (choice == 9) {
            console.log("Adios!");
            return
        }

        // The user is prompted for the file source path

        const file_source_path = await inquirer.prompt({
            name: "file_source_path",
            message: "Por favor, escriba la ruta completa del archivo (Debe incluir el nombre del archivo y su extensión). Ej: /home/camilo/Downloads/pruebas.docx"
        })

        // The user is prompted for the file destination path.

        const file_destination_path = await inquirer.prompt({
            name: "file_destination_path",
            message: "Por favor, escriba la ruta de la carpeta donde quiere que se guarde el archivo (No se debe colocar el nombre del archivo). Ej: /home/camilo/Downloads/"
        })

        // Encode file to base64

        const fileBase64 = await base64_codificar(file_source_path.file_source_path);

        //Get file name

        let file_name = get_file_name(file_source_path)

        // Obtain the extensions according to the option provided by the user.

        let extensions = get_extensions_convert_files(res_menu, choice)

        // API Request

        const res = await axios.post('http://54.163.147.33:8080/convertir', {
            "base64": fileBase64,
            "extencionFuente": extensions[0],
            "extencionDestino": extensions[1],
            "nombreArchivo": file_name
        })

        // Decode the API response

        const data = res.data
        base64_decodificar(data, file_destination_path)
        console.log("Archivo creado :)")
    } while (choice != 9);
}

menu()

function get_user_option_number(res_menu) {
    return parseInt(res_menu.choice_1.split(")")[0])
}

function get_file_name(file_source_path) {
    let arr_path = file_source_path.file_source_path.split(path.sep)
    return arr_path[arr_path.length - 1]
}

function get_extensions_convert_files(res_menu, choice) {
    arr = []
    if ((choice >= 1) && (choice <= 6)) {
        separate_response = res_menu.choice_1.split(" ")
        arr.push(separate_response[3].toUpperCase(), separate_response[5].toUpperCase())
    }
    return arr
}

function base64_codificar(path) {
    let buff = fs.readFileSync(path);
    let base64data = buff.toString('base64');
    return base64data
}

function base64_decodificar(data, file_destination_path) {
    let stringBase64 = data.base64
    let file_path = path.join(file_destination_path.file_destination_path, data.nombreArchivo)
    let buff = new Buffer(stringBase64, 'base64');
    fs.writeFileSync(file_path, buff);
}