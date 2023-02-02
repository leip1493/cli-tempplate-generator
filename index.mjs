import * as commander from 'commander'
import gitClone from 'git-clone';
import glob from 'glob';
import replace from 'replace-in-file';
import inquirer from 'inquirer'
import simpleGit from 'simple-git'


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
            const cloned = await git.clone(repo, dest)
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