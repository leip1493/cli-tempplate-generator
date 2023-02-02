import * as commander from 'commander';
import glob from 'glob';
import inquirer from 'inquirer';
import replace from 'replace-in-file';
import simpleGit from 'simple-git';


const program = commander.program

program
    .version('0.1.0')
    .description('Test plantilla cli')
    .action(async () => {
        const questions = [
            {
                type: 'input',
                name: 'name',
                message: 'Nombre del proyecto',
                default: 'cli-template-generator'
            },
            {
                type: 'input',
                name: 'url',
                message: 'URL del repositorio',
                default: 'https://gitlab.com/cencosud-ds/cencommerce/post-purchase-experience/internal-customer-service/template/backend/tmp-graphql-experienciaposventa.git'
            }
        ]

        const answers = await inquirer.prompt(questions)

        const { name, url } = answers

        console.log({ name, url });

        const repo = url
        const projectName = name
        const dest = `../${projectName}`

        const git = simpleGit()
        try {
            const cloned = git.clone(repo, dest)
            console.log({ cloned })
            const files = glob.sync(`${dest}/**/*.{js,ts,json}`)
            const options = {
                files,
                from: /{{PARAMETRO_A_REEMPLAZAR}}/g,
                to: projectName
            }
            const resp = await replace.replaceInFile(options)
            console.log("REPLACE")
            resp.forEach(r => console.log(r.file))
        } catch (error) {
            return console.error(error)
        }


    })

program.parse(process.argv)