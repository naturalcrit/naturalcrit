### Setting the config file for NaturalCrit

NaturalCrit requires certain variables to be set. By default, the system looks in the `config/` directory to satisfy those variables. `reference.json` contains all the variables that the system expects. You are recommended to copy this file into another `.json` file (with a different name) and change the variables as appropriate.  

### Naming the appropriate config file

The system is set to look for a `.json` config file to define some of the necessary variables. The name of the `.json` config file is determined by the value of `NODE_ENV`.

If you run this through Docker, the variable `NODE_ENV` will be set to `docker` (based on the Dockerfile), and so the system will search for a `docker.json` file for the configuration.