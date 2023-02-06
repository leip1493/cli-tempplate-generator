//@ts-check
import fs from 'fs/promises';
import inquirer from 'inquirer';
import ora from 'ora';
import simpleGit from 'simple-git';

const repositoriesByType = {
    REST: 'https://gitlab.com/cencosud-ds/cencommerce/post-purchase-experience/internal-customer-service/template/backend/tmp-bff-experienciaposventa.git',
    GraphQL: 'https://gitlab.com/cencosud-ds/cencommerce/post-purchase-experience/internal-customer-service/template/backend/tmp-graphql-experienciaposventa.git'
}

const QUESTIONS = [
    {
        type: 'list',
        name: 'serviceType',
        message: 'Cual template quieres descargarte?',
        choices: Object.keys(repositoriesByType)
    },
    {
        type: 'input',
        name: 'name',
        message: 'Nombre del proyecto',
        default: 'cli-template-generator'
    }

]

/**
 * 
 * @param {import('commander').Command} program 
 */
export function initializeTemplateCommand(program) {
    program
        .command('initialize-template')
        .alias('it')
        .description("Inicia el menú de selección para inicializar plantilla de código")
        .action(async () => {
            const answers = await inquirer.prompt(QUESTIONS)
            const { name, serviceType } = answers
            const repository = repositoriesByType[serviceType]
            const dest = `./${name}`
            const git = simpleGit()
            const spinner = ora('Descargando el repo 😁').start()
            try {
                await git.clone(repository, dest)
                spinner.stopAndPersist({ symbol: '✔', })
                spinner.start('Inicializando git por ti 😜')
                await git.cwd(dest)
                const init = await git.init()
                if (init.existing) {
                    await fs.rm(init.gitDir, { recursive: true, force: true })
                    await git.init()
                }
                spinner.stopAndPersist({ symbol: '✔' })
                //TODO Aplicar el cambio del {{APP_NAME}} por el nombre del proyecto
                // const files = glob.sync(`${dest}/**/*.{js,ts,json}`)
                // const options = {
                //     files,
                //     from: /{{PARAMETRO_A_REEMPLAZAR}}/g,
                //     to: name
                // }
                // const resp = await replace.replaceInFile(options)            
                // resp.forEach(r => console.log(r.file))
            } catch (error) {
                spinner.stop()
                return console.error(error)
            }
        })
}