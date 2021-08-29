const inquirer = require("inquirer")
const axios = require("axios")
const fs = require("fs")
const path = require("path")

async function menu() {



    //Menú de las acciones que desea realizar el usuario
    const res_menu = await inquirer.prompt({
        type: "list",
        name: "choice_1",
        message: "¿Qué quieres hacer?",
        choices: [
            "1) Documentos .docx a .odt",
            "2) Documentos .xlsx a .ods",
            "3) Documentos .pptx a .odp",
            "4) Documentos .docx .odt .xlsx .ods .pptx .odp a .pdf",
            "5) Salir"
        ]
    })

    //Extraer la opción del menú
    let choice = res_menu.choice_1.split(")")[0]
    choice = parseInt(choice)

    //Validar si el usuario desea salir del programa
    if (choice == 5) {
        console.log("Hasta luego :)");
        return
    }

    //Escribir la ruta del archivo
    const ruta_archivo = await inquirer.prompt({
        name: "ruta_archivo",
        message: "Escribe la ruta del archivo"
    })


    // Codificar archivo a base64
    const archivoBase64 = await base64_codificar(ruta_archivo.ruta_archivo);


    //Petición a la API para convertir
    let extensionDestino = ""
    let extensionFuente = ""

    let arrayRuta = ruta_archivo.ruta_archivo.split(path.sep)
    let nombreArchivo = arrayRuta[arrayRuta.length - 1]

    if (choice === 1) {
        extensionDestino = "ODT"
        extensionFuente = "DOCX"
    } else if (choice === 2) {
        extensionDestino = "ODS"
        extensionFuente = "XLSX"
    } else if (choice === 3) {
        extensionDestino = "ODP"
        extensionFuente = "PPTX"
    }



    const res = await axios.post('http://54.163.147.33:8080/convertir', {
        "base64": archivoBase64,
        "extencionDestino": extensionDestino,
        "extencionFuente": extensionFuente,
        "nombreArchivo": nombreArchivo
    })

    const data = res.data
    base64_decodificar(data)


}
menu()

function base64_codificar(path) {
    let binaryData = fs.readFileSync(path) // leyendo datos binarios del archivo
    let base64String = new Buffer(binaryData).toString("base64") //convirtiendo datos binarios a string en base 64
    return base64String
}




function base64_decodificar(dataEnBase64) {
    let stringBase64 = dataEnBase64.base64
    let rutaArchivo = "../archivos_convertidos/" + dataEnBase64.nombreArchivo
    const file = fs.writeFile(dataEnBase64.nombreArchivo, stringBase64, { enconding: "base64" }, function(err) {
        if (err) {
            console.log(err)
        } else {
            console.log("archivo creado")
        }
    })
}