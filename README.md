# merge-reminder

The app is designed to solve a very common problem during development.<br/>
If you use GitFlow during development, you typically work with two branches: master and develop.<br/>
The develop branch is used for ongoing development,<br/>
while the master branch is used for deploying to production.<br/>
When a release is ready, the develop branch is merged into master.<br/>
If any issues arise in production, they are usually fixed directly there and then merged back into develop.<br/>
If fixes are not merged back into develop,<br/>
it can lead to merge conflicts, which are time-consuming.<br/>
Time equals money, and that's why this project aims to streamline the development process.

## How to start?
Please create .env files 
```
/apps/api/.env
/apps/web/.env
/apps/cron/.env
```
Please look at .env.example.
They should be place in the same folder, with the same properties, but different values.

Please install dependencies by
```
npm install
```
Then run development server
```
npm run dev
```