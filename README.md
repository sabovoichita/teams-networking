# Teams Networking

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
