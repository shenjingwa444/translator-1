#!/usr/bin/env node

import {Command} from 'commander';
import {translator} from './main';
const program = new Command();
program
  .version('0.0.1')
  .name('tl')
  .usage('<English>')
  .argument('<English>')
  .action((english:string) => {
    translator(english)
  });

program.parse();
