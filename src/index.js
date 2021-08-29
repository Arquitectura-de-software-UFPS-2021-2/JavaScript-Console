const inquirer = require("inquirer")

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
        console.log("Hasta luego :)")
        return
    }
}
menu()