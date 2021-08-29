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

    //Escribir la ruta origen del archivo
    const ruta_archivo = await inquirer.prompt({
        name: "ruta_archivo",
        message: "Escribe la ruta donde se encuentra guardado el archivo (incluir el nombre del archivo con su extensión)"
    })

    //Escribir la ruta destino del archivo
    const ruta_destino_archivo = await inquirer.prompt({
        name: "ruta_destino_archivo",
        message: "Escribe la ruta de la carpeta donde quieres que se guarde el archivo"
    })

    // Codificar archivo a base64
    const archivoBase64 = await base64_codificar(ruta_archivo.ruta_archivo);


    //Petición a la API para convertir
    let extencionDestino = ""
    let extencionFuente = ""

    let arrayRuta = ruta_archivo.ruta_archivo.split(path.sep)
    let nombreArchivo = arrayRuta[arrayRuta.length - 1]

    if (choice === 1) {
        extencionDestino = "ODT"
        extencionFuente = "DOCX"
    } else if (choice === 2) {
        extencionDestino = "ODS"
        extencionFuente = "XLSX"
    } else if (choice === 3) {
        extencionDestino = "ODP"
        extencionFuente = "PPTX"
    }

    const res = await axios.post('http://54.163.147.33:8080/convertir', {
        base64: archivoBase64,
        extencionDestino,
        extencionFuente,
        nombreArchivo
    })

    const data = res.data
    base64_decodificar(data, ruta_destino_archivo)


}
menu()


function base64_codificar(path) {
    let buff = fs.readFileSync(path);
    let base64data = buff.toString('base64');
    return base64data
}


function base64_decodificar(dataEnBase64, rutaDestino) {
    let stringBase64 = dataEnBase64.base64
    let rutaArchivo = path.join(rutaDestino.ruta_destino_archivo, dataEnBase64.nombreArchivo)
    let buff = new Buffer(stringBase64, 'base64');
    fs.writeFileSync(rutaArchivo, buff);
}