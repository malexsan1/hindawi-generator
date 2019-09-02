const Generator = require('yeoman-generator')

const GENERATOR_TYPES = {
  component: 'component',
  microservice: 'microservice',
}

const toUppercaseAndUnderscore = packageName => packageName.toUpperCase().replace('-', '_')

module.exports = class extends Generator {
  async prompting() {
    let answers
    const { packageType } = await this.prompt([
      {
        type: 'list',
        name: 'packageType',
        required: true,
        message: 'Yo! What kind of package do you want to create?',
        choices: [
          { name: 'Hindawi component', value: GENERATOR_TYPES.component },
          { name: 'Hindawi microservice', value: GENERATOR_TYPES.microservice },
        ],
      },
    ])

    if (packageType === GENERATOR_TYPES.component) {
      answers = await this.prompt([
        {
          type: 'input',
          name: 'packageName',
          required: true,
          message:
            'What is the component name? (e.g. authentication or submission)',
        },
        {
          type: 'input',
          name: 'description',
          required: true,
          message:
            'What is the component description? (e.g. Hindawi implementation of the peer review process.)',
        },
      ])
    } else {
      answers = await this.prompt([
        {
          type: 'input',
          name: 'packageName',
          required: true,
          message: 'What is the microservice name? (e.g. file-conversion)',
        },
        {
          type: 'input',
          name: 'description',
          required: true,
          message:
            'What is the microservice supposed to do? (e.g. service used to convert files)',
        },
        {
          type: 'input',
          name: 'dependencies',
          required: false,
          message:
            'Does this service depend on other services? (add comma separated values)',
          filter: values => (values ? values.split(', ') : undefined),
        }
      ])
    }

    this.packageType = packageType
    this.answers = answers
  }

  writing() {
    const { packageName, description, dependencies} = this.answers
    if (this.packageType === GENERATOR_TYPES.component) {
      this.fs.copy(
        this.templatePath('package/client'),
        this.destinationPath(`packages/component-${packageName}/client`),
      )

      this.fs.copy(
        this.templatePath('package/server'),
        this.destinationPath(`packages/component-${packageName}/server`),
      )

      this.fs.copy(
        this.templatePath('package/config'),
        this.destinationPath(`packages/component-${packageName}/config`),
      )

      this.fs.copyTpl(
        this.templatePath('package/package.json'),
        this.destinationPath(`packages/component-${packageName}/package.json`),
        {
          description,
          projectVersion: '0.0.1',
          componentName: packageName,
        },
      )

      this.fs.copy(
        this.templatePath('package/index.js'),
        this.destinationPath(`packages/component-${packageName}/index.js`),
      )
    } else {
      this.fs.copy(
        this.templatePath('microservice/src'),
        this.destinationPath(`packages/service-${packageName}/src`),
      )

      this.fs.copy(
        this.templatePath('microservice/Dockerfile'),
        this.destinationPath(`packages/service-${packageName}/Dockerfile`),
      )

      this.fs.copy(
        this.templatePath('microservice/Dockerfile-development'),
        this.destinationPath(`packages/service-${packageName}/Dockerfile-development`),
      )

      this.fs.copy(
        this.templatePath('microservice/AWS/devops_script.sh'),
        this.destinationPath(`packages/service-${packageName}/AWS/devops_script.sh`),
      )
            
      this.fs.copy(
        this.templatePath('microservice/AWS/ForUpload'),
        this.destinationPath(`packages/service-${packageName}/AWS/ForUpload`),
      )

      this.fs.copy(
        this.templatePath('microservice/AWS/README.md'),
        this.destinationPath(`packages/service-${packageName}/AWS/README.md`),
      )

      this.fs.copy(
        this.templatePath('microservice/AWS/repo_access.json'),
        this.destinationPath(`packages/service-${packageName}/AWS/repo_access.json`),
      )

      this.fs.copyTpl(
        this.templatePath('microservice/AWS/Dockerrun.aws.json'),
        this.destinationPath(`packages/service-${packageName}/AWS/Dockerrun.aws.json`),
        {
          serviceName: packageName,
        },
      )

      this.fs.copyTpl(
        this.templatePath('microservice/.gitlab-ci.yml'),
        this.destinationPath(`packages/service-${packageName}/.gitlab-ci.yml`),
        {
          serviceName: packageName,
          ecrName: toUppercaseAndUnderscore(packageName),
        },
      )

      this.fs.copyTpl(
        this.templatePath('microservice/.env'),
        this.destinationPath(`packages/service-${packageName}/.env`),
        {
          serviceName: packageName,
        },
      )

      this.fs.copyTpl(
        this.templatePath('microservice/package.json'),
        this.destinationPath(`packages/service-${packageName}/package.json`),
        {
          description,
          projectVersion: '0.0.1',
          serviceName: packageName,
        },
      )

      this.fs.copyTpl(
        this.templatePath('microservice/Docker-compose.yml'),
        this.destinationPath(
          `packages/service-${packageName}/Docker-compose.yml`,
        ),
        {
          dependencies,
          serviceName: packageName,
        },
      )

      this.fs.copy(
        this.templatePath('microservice/index.js'),
        this.destinationPath(`packages/service-${packageName}/index.js`),
      )
    }
  }

  install() {
    if (this.packageType === GENERATOR_TYPES.component) {
      this.installDependencies({
        npm: false,
        bower: false,
        yarn: true,
      })
    }
  }
}
