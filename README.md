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

## Demo
https://github.com/user-attachments/assets/ec0472da-58fb-4aef-8d92-9acdcf8f0561

## Requirements
```
docker --version
```
Docker version 27.4.0

```
node --version
```
v18.19.1


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

## Links
Some of this information could be more secure, but since it is a pet project, I do not mind sharing it.
This information is more like a collection of project URL bookmarks.
* [production url](https://merge-reminder.onrender.com)
* [deployment dashboard](https://dashboard.render.com)
* [mail provider](https://resend.com/emails)
* [database dashboard](https://cloud.mongodb.com)
* [analytics dashboard](https://plausible.io)



