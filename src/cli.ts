import {Command} from 'commander';
const program = new Command();
program
  .version('0.0.1')
  .name('tl')
  .usage('<English>')
  .argument('<English>')
  .action((english) => {
    console.log(english);
  });

program.parse();
