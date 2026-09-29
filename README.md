# Naturalcrit
Top-tier tools for the discerning D&amp;D DM

Naturalcrit is an organization created circa 2020, to keep maintenance of the Homebrewery, this is the repository that tracks the main website, naturalcrit.com.

naturalcrit.com holds the account system, so all accounts go through it, as of now, no other traffic runs through it.

While the site originaly had another tool called the badgeRender, but has been non-functional for years as of the writing of this article.

The current maintainer of this repository is @5e-Cleric, me, but anyone should be able to create pull requests or open issues. Please keep the issues in this repository about the account system or other related stuff, for issues about the homebrewery or any other tool, open them in their respective repository.

Updated, December 5th, 2024

### Installation
First, install three programs that naturalcrit and The Homebrewery requires to run and retrieve
updates:

1. install [node](https://nodejs.org/en/), version v24 or higher.
1. install [mongodb](https://www.mongodb.com/try/download/community) (Community version)

    For the easiest installation, follow these steps:
    1. In the installer, uncheck the option to run as a service.
    1. You can install MongoDB Compass if you want a GUI to view your database documents.
    1. If you install any version over 6.0, you will have to install [MongoDB Shell](https://www.mongodb.com/try/download/shell).
    1. Go to the C:\ drive and create a folder called "data".
    1. Inside the "data" folder, create a new folder called "db".
    1. Open a command prompt or other terminal and navigate to your MongoDB install folder (C:\Program Files\Mongo\Server\6.0\bin).
    1. In the command prompt, run "mongod", which will start up your local database server.
    1. While MongoD is running, open a second command prompt and navigate to the MongoDB install folder.
    1. Search in Windows for "Advanced system settings" and open it.
    1. Click "Environment variables", find the "path" variable, and double-click to open it.
    1. Click "New" and paste in the path to the MongoDB "bin" folder.
    1. Click "OK" three times to close all the windows.
    1. In the second command prompt, run "mongo", which allows you to edit the database.
    1. Type `use naturalcrit` to create the naturalcrit database. You should see `switched to db naturalcrit`.
    1. Type `db.accounts.insertOne({"username":"test"})` to create a blank account. You should see `{
acknowledged: true,
insertedId: ObjectId("63c2fce9e5ac5a94fe2410cf")
}`
   
1. install [git](https://git-scm.com/downloads) (select the option that allows Git to run from the command prompt).

Checkout the repo ([documentation][github-clone-repo-docs-url]):
```
git clone https://github.com/naturalcrit/naturalcrit.git
```

[github-clone-repo-docs-url]: https://docs.github.com/en/free-pro-team@latest/github/creating-cloning-and-archiving-repositories/cloning-a-repository

Second, you will need to add the environment variable `NODE_ENV=local` to allow
the project to run locally.

You can set this **temporarily** (until you close the terminal) in your shell of choice with admin privileges:
* Windows Powershell: `$env:NODE_ENV="local"`
* Windows CMD: `set NODE_ENV=local`
* Linux / macOS: `export NODE_ENV=local`

If you want to add this variable **permanently** the steps are as follows:
    1. Search in Windows for "Advanced system settings" and open it.
    1. Click "Environment variables".
    1. In System Variables, click "New"
    1. Click "New" and write `NODE_ENV` as a name and `local` as the value.
    1. Click "OK" three times to close all the windows.
  This can be undone at any time if needed.

Third, you will need to install the Node dependencies, compile the app, and run
it using the two commands:

1. `npm install`
1. `npm run build`
1. `npm run start`

On completion, you should be able to go to [http://localhost:8010](http://localhost:8010) in your browser and use naturalcrit offline.

If you had any issue at all, here are some links that may be useful:
- [Course](https://learn.mongodb.com/courses/m103-basic-cluster-administration) on cluster administration, useful for beginners
- [Mongo community forums](https://www.mongodb.com/community/forums/)
- Useful Stack Overflow links for your most probable errors: [1](https://stackoverflow.com/questions/44962540/mongod-and-mongo-commands-not-working-on-windows-10), [2](https://stackoverflow.com/questions/15053893/mongo-command-not-recognized-when-trying-to-connect-to-a-mongodb-server/41507803#41507803), [3](https://stackoverflow.com/questions/51224959/mongo-is-not-recognized-as-an-internal-or-external-command-operable-program-o)

If you still have problems, post in [Our Subreddit](https://www.reddit.com/r/homebrewery/) and we will help you.

Google integration is a whole other beast and we should add the instructions at some point too.
