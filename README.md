# Teams Networking

Teams job related networking (members, project name, project url)

In Current Demo you'll see some of projects created by my students.
You can also find new project ideas.

## 💠 Features & Usage

- [x] Teams Networking (CRUD\*) Operations
  - [ ] **C**reate
  - [x] **R**ead
  - [ ] **U**pdate
  - [ ] **D**elete
- [ ] Search
- [ ] Loading mask

## Start (Daily usage)

Start node-API

```sh
cd C:/Users/kita/Desktop/Projects/node-api-teams
npm start
```

start app(run in current project)

```sh
npm start
```

## Instructios to create new branch

```
bname=udemy

git switch --orphan $bname
touch .gitignore
echo /.vscode >> .gitignore
echo /.idea >> .gitignore
echo /node_modules >> .gitignore
touch README.md
echo "# Teams Networking" >> README.md
git add .
git commit -m "Initial commit"
git push origin $bname
git status

cd teams-networking
git checkout udemy //to switch to udemy branch
```

## Initialize Project to use Prettier:

## create .prettierrc file

```
touch .prettierrc
//Add following json inside .prettierrc
{
  "trailingComma": "none",
  "semi": true,
  "tabWidth": 2,
  "singleQuote": false,
  "printWidth": 120,
  "arrowParens": "avoid"
}
```

```
VSCode: Manage > Settings
Search: "Default Formatter" -> Select: "Prettier - Code..."
Search: "Format On Save" -> Check it
Right Click - Format Document With... (configure...)
```

## Initialize project to use NPM

```
npm -v
node -v
n
npm init -y
```

## Initialize project to use Webpack

## Installing required npm packages

```
npm install --save-dev webpack webpack-cli
npm i -D webpack-dev-server
npm i -D html-webpack-plugin
npm i -D html-loader style-loader css-loader

# create webpack.config.js file
touch webpack.config.js
```

paste into webpack.config.js

```
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = env => {
  const isProduction = !!env.WEBPACK_BUILD;
  return {
    mode: isProduction ? "production" : "development",
    entry: ["./src/index.js"],
    devtool: isProduction ? false : "inline-source-map",
    devServer: {
      static: ["src"],
      watchFiles: ["src/**/*.*"]
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: "./src/index.html"
      })
    ],
    module: {
      rules: [{
        test: /\.html$/i,
        loader: "html-loader"
      }, {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"]
      }]
    },
    output: {
      filename: "main.js",
      path: path.resolve(__dirname, "docs"),
      publicPath: ""
    }
  };
};
```

## Configure npm scripts

## Add following scripts inside package.json

```
{
  "scripts": {
    "clean": "rimraf docs",
    "clear": "npm run clean && rimraf node_modules",
    "prebuild": "npm run clean",
    "build": "webpack --mode production",
    "start": "webpack serve --open",
    "demo": "set PORT=8080 && serve docs"
  }
}
```

## Running scripts:

```
npm start
npm run build
npm run demo
```

! use it with PowerShell!

CTRL+C = to stop project in Terminal

## Change the way to import js & css

//delete from html file the import for style.css & index.js
//import "./style.css"; add it to index.js file at the top
`CTL + C to stop`

```npm run build

```

install line by line :

```
npm install --global serve
npm i -g rimraf
```

```
npm run demo
```

to remove docs folder

```
npm run clean
```

## If no data left run:

- stop API sever

```
npm run data
npm start
```
