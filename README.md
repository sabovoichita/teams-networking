# Teams Networking

## Instructios to create new branch

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

# Initialize Project to use Prettier:

# create .prettierrc file

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
