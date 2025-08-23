# Yarn install

We don't tell you to run npm install -g yarn to install Yarn - we even recommend against it. The reason is simple: just like your project dependencies must be locked, so should be the package manager itself.

Corepack is a tool that aims to provide zero-cost, reliable, and portable workflows for package managers like Yarn. Here's how you can use Corepack to install the latest version of Yarn:

1. Ensure that you have Node.js version 18 or later installed on your system (Corepack is shipped with Node.js).

2. Enable Corepack in your current shell session using the following command:

```bash
corepack enable
```

3. Any time you'll want to update Yarn to the latest version, just run:

```bash
yarn set version stable
```

4. After the installation, you can verify the installed version of Yarn using the following command:

```bash
yarn --version
```

This will output the version of Yarn that is currently installed on your system.
