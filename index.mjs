#!/usr/bin/env node

import * as commander from 'commander'
import glob from 'glob';
// import replace from 'replace-in-file';
import inquirer from 'inquirer'
import simpleGit from 'simple-git'
import ejs from 'ejs'
import fs from 'fs'


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

        // definir todas las variables a reemplazar
        const data = {
            env: {
                parametroA: 'valorA',
                header: {
                    name: 'This is a header',
                }
            }
        }

        console.log({ name, url });

        const repo = 'https://github.com/LucasSequeDev/template-test'
        const projectName = name
        const dest = `../${projectName}`

        const git = simpleGit()
        try {
            const cloned = await git.clone(repo, dest)
            const files = glob.sync(`${dest}/**/*.ejs`)

            // const options = {
            //     files,
            //     from: /{{PARAMETRO_A_REEMPLAZAR}}/g,
            //     to: projectName
            // }

            files.map( file => {
                const content = fs.readFileSync(file, 'utf8')
                const newFile = ejs.render(content, { ...data } )

                const newName = file.replace('.ejs', '')
                
                fs.writeFileSync(newName, newFile)
                fs.rmSync(file)
            })

            // const resp = await replace.replaceInFi// le(options)
            // console.log("REPLACE")
            // resp.forEach(r => console.log(r.file))
        } catch (error) {
            return console.error(error)
        }


    })

program.parse(process.argv)