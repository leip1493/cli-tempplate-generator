#!/usr/bin/env node

import * as commander from 'commander';
import glob from 'glob';
import inquirer from 'inquirer';
import replace from 'replace-in-file';
import simpleGit from 'simple-git';
import fs from 'fs/promises'
import packageJson from './package.json' assert { type: "json" }



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

const program = commander.program

program
    .version(packageJson.version)
    .description('Test plantilla cli')
    .action(async () => {
        const answers = await inquirer.prompt(QUESTIONS)
        const { name, serviceType } = answers
        const repository = repositoriesByType[serviceType]
        const dest = `./${name}`
        const git = simpleGit()
        try {
            await git.clone(repository, dest)
            await git.cwd(dest)
            const init = await git.init()
            if (init.existing) {
                await fs.rm(init.gitDir, { recursive: true, force: true })
                await git.init()
            }
            //TODO Aplicar el cambio del {{APP_NAME}} por el nombre del proyecto

            // const files = glob.sync(`${dest}/**/*.{js,ts,json}`)
            // const options = {
            //     files,
            //     from: /{{PARAMETRO_A_REEMPLAZAR}}/g,
            //     to: name
            // }
            // const resp = await replace.replaceInFile(options)
            // console.log("REPLACE")
            // resp.forEach(r => console.log(r.file))
        } catch (error) {
            return console.error(error)
        }


    })

program.parse(process.argv)