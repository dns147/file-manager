import { EOL, cpus, homedir } from 'node:os';

let homeDir = homedir();

const runOsCommand = (cmd) => {
  const splitedCmd = cmd.split(' ');

  switch (splitedCmd[1]) {
    case '--EOL':
      console.log('\n', JSON.stringify(EOL));
      console.log(`\x1b[32m\nDone! You are currently in\x1b[0m \x1b[33m${homeDir}\n\x1b[0m`);
      break;
    
    case '--cpus':
      const cpuCores = cpus();
      const cpuCoresFilter = cpuCores.map((value) => value.model);
      
      console.table(cpuCoresFilter);
      console.log(`\x1b[32m\nDone! You are currently in\x1b[0m \x1b[33m${homeDir}\n\x1b[0m`);
      break;
  
    default:
      console.log('\x1b[31m\nOperation failed. Command not found.\n\x1b[0m');
      break;
  }

};

export { 
  runOsCommand,
};