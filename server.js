const { exec } = require("child_process");
const path = require("path");

// Define the directory for the Python installation
const pythonInstallDir = "/python"; // Customize the installation directory

// Define the directory for the Python virtual environment
const virtualEnvDir = "my_venv";

// Define the Python version to install (e.g., Python 3.11.5)
const pythonVersion = "3.11.5";

// curl -o python-installer.exe ${pythonInstallerUrl} && python-installer.exe /quiet InstallAllUsers=1 DefaultAllUsersTargetDir="${pythonInstallDir}" PrependPath=1
// Install Python from the amd64 exe
const installPythonCommand = `curl https://www.python.org/ftp/python/${pythonVersion}/python-${pythonVersion}-amd64.exe -o python-${pythonVersion}.exe && python-${pythonVersion}.exe /quiet DefaultAllUsersTargetDir="${pythonInstallDir}" PrependPath=1`;

exec(installPythonCommand, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error installing Python: ${error}`);
    return;
  }

  console.log(`Python ${pythonVersion} installed successfully.`);

  // Create the Python virtual environment
  const createEnvCommand = `python3 -m venv ${virtualEnvDir}`;

  exec(createEnvCommand, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error creating virtual environment: ${error}`);
      return;
    }

    console.log(
      `Virtual environment created at ${path.resolve(virtualEnvDir)}`
    );

    // Activate the Python virtual environment
    const activateScript =
      process.platform === "win32" ? "Scripts/activate" : "bin/activate";
    const activateCommand = path.join(virtualEnvDir, activateScript);

    // Install Python packages within the virtual environment
    const installRequirementsCommand = `${activateCommand} && pip install -r requirements.txt`;

    exec(
      installRequirementsCommand,
      { cwd: __dirname },
      (error, stdout, stderr) => {
        if (error) {
          console.error(`Error installing requirements: ${error}`);
          return;
        }

        console.log(`Python packages installed successfully.`);

        // Run the Flask app within the virtual environment
        const runFlaskAppCommand = `${activateCommand} && python app.py`;

        const flaskApp = exec(runFlaskAppCommand, { cwd: __dirname });

        flaskApp.stdout.on("data", (data) => {
          console.log(`Flask App Output: ${data}`);
        });

        flaskApp.stderr.on("data", (data) => {
          console.error(`Flask App Error: ${data}`);
        });

        flaskApp.on("close", (code) => {
          console.log(`Flask App exited with code ${code}`);
        });
      }
    );
  });
});
