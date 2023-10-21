# backend


### DB Setup
```
1. run database/initialize.sql
2. run database/initialData.sql
3. run database/createUserAccountAndUser-UDF.sql
```

### Compiles and hot-reloads for development
```
nodemon app.js
```

### Compiles and minifies for production
```
pkg app.js
```

### Re-deploy TLS Instructions
```
[Let's Encrypt Manual Update](https://eff-certbot.readthedocs.io/en/latest/using.html#manual)

PowerShell CMD

> certbot certonly --manual --preferred-challenges dns

To renew this certificate, repeat this same certbot command before the certificate's expiry date.

fullChain.pem = server.crt
privkey.pem = server.key

Zip up Contents of Backend folder minus; readme.md, database folder, node_modules folders.
Upload to AWS->EB->Environments->My-grocery-list-env
```

### Lints and fixes files
```
npx eslint .
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
