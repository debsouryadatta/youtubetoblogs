### Issues I ran into & fixes:
1. First issue was getting the youtube subtitles with approach 1(using the functions used in npm youtube-captions-scraper) -> working fine on local machine but youtube blocked all direct requests to their Api from any cloud server ips
2. Second issue approach 2(npm youtube-transcript) -> Same issue
3. Finally with approach 3(mentioned here - https://github.com/algolia/youtube-captions-scraper/issues/30) -> This approach works fine but needs YOUTUBE_API_KEY
4. Another issue i ran into was - In the USER_NAMR secret key in github PRODUCTION env, I gave 'root' but then I saw the username is 'ubuntu' so I changed it to 'ubuntu'



### VPS Deployment steps:
1. Prerequisite - vps should already set up
2. Add the Dockerfile & the docker-compose.yml
3. git clone the repo in the vps, `docker-compose up --build -d` -> Already up in localhost:3000 & can be accessed at {ip}:3000
4. Add new 'a' record in the DNS with the name `youtubetoblogs.souryax.tech` -> can be accessed at `youtubetoblogs.souryax.tech:3000`
5. Add reverse proxy in the nginx.conf to redirect `youtubetoblogs.souryax.tech` to `localhost:3000`
6. Add a ssl certificate for the domain `youtubetoblogs.souryax.tech` with certbot(FREE)
7. (Optional): Add cicd with github actions, add the deploy.yml in .github/workflows, add the secret keys SSH_PRIVATE_KEY, SSH_HOST, USER_NAME to the PRODUCTION environment on github

Other resources to look into:
- souryax-course-generator README -> https://github.com/debsouryadatta/souryax-course-generator
- harkirat dailycode ec2 vps class -> https://projects.100xdevs.com/tracks/g0AcDSPl74nk45ZZjRdU/aws-7 
