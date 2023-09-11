const fs = require('fs');
const os = require('os');
const { spawn } = require('child_process');

const getProcess = () => {
  const platform = os.platform();
  
  if (platform === 'linux' || platform === 'darwin') {
    return `ps -A -o %cpu,%mem,comm | sort -nr | head -n 1`;
  } else if (platform === 'win32') {
    return `powershell "Get-Process | Sort-Object CPU -Descending | Select-Object -Property Name, CPU, WorkingSet -First 1 | ForEach-Object { $_.Name + \' \' + $_.CPU + \' \' + $_.WorkingSet }"`;
  }
}

const logToFile = (processData) => {
  const currentTime = Math.floor(Date.now() / 1000);
  if (currentTime % 60 === 0) {
    fs.appendFile(
      'activityMonitor.log', `${currentTime} : ${processData}\n`, 
      (err) => {
        if (err) {
          console.error('Error writing to the log file:', err);
        }
      }
    );
  }
}

setInterval(() => {
  const command = getProcess();
  const childProcess = spawn(command, { shell: true });

  childProcess.stdout.on('data', (data) => {
    const processData = data.toString().trim();

    if (processData) {
      process.stdout.write('\x1b[36m' + '\r' + processData);
      logToFile(processData);
    }
  });

  childProcess.stderr.on('data', (data) => {
    console.error('\x1b[91m' + 'Error:', data.toString().trim());
  });
}, 100);
