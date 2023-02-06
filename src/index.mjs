//@ts-check
import * as commander from 'commander';
import packageJson from '../package.json' assert { type: "json" };
import { initializeTemplateCommand } from './commands/initialize-template.mjs';

const program = commander.program
    .version(packageJson.version)
    .description('🔥 CLI Template Generator 🔥')
    .helpOption('-h, --help', 'Muestra menú de ayuda')

initializeTemplateCommand(program)


if (!process.argv.slice(2).length) {
    program.outputHelp()
} else {
    program.parse(process.argv)
}
