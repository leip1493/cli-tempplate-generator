//@ts-check
import ejs from 'ejs';
import fs from 'fs/promises';
import path from 'path';
import url from 'url';
/**
 * 
 * @param {import('commander').Command} program 
 */

const __filename = url.fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export function generateController(program) {
    program
        .command('generate:controller')
        .alias('gc')
        .argument('<module>', 'Nombre del modulo donde se va a crear el controlador')
        .argument('<name>', 'Nombre del controlador')
        .description("Genera un controlador")
        .action(async (module, name) => {
            const data = {
                controllerName: `${name}Controller`,
            }

            try {
                const template = await fs.readFile(path.join(__dirname, '..', 'templates', 'controller-template.ejs'), { encoding: 'utf-8' })

                const output = ejs.render(template, data)

                const outputPath = path.join(process.cwd(), 'src', 'Infra', 'Controllers', module)

                await fs.mkdir(outputPath, { recursive: true })

                const outputFile = path.join(outputPath, `${data.controllerName}.ts`)

                await fs.writeFile(outputFile, output, 'utf8')

                console.log("Creado controlador en", outputFile, '😎')

            } catch (error) {
                return console.error(error)
            }
        })
} 