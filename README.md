# merge-reminder

## How to start?
Please install dependencies via
```
npm install
```

Then run development server
```
npm run dev
```

## Environment variables
* MODE - this value app uses for various logic.
For example during development we randomly throw error.
In the production we do not need it.
* TRPC_URL - this value apps/web need to fetch data from TRPC server
* MONGO_URL - this value apps/api need to connect to mongo db
* PORT - this value apps/api need to be deployed to the cloud
```
MODE=production
TRPC_URL=https://production.com/trpc
MONGO_URL=mongodb+srv://xxx:yyy@zzz.mongo.com/admin?tls=true&authSource=admin
PORT=3000
```

## Links
* [production](https://exmaple.com) URL to our app
* [deployment](https://exmaple.com) URL to your deployment
* [database](https://cloud.mongodb.com/v2/661119a2fb80c513aef9afcc) URL to your database