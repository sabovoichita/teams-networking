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
