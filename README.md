<img width="1904" height="964" alt="Pasted image 20251114124726" src="https://github.com/user-attachments/assets/b479fa2b-e8a2-4f20-86ba-ff638a2ac3fa" />
# WAPPY 

---
Wappy is the website for my course and graduation project. First of all, it was created to create media content (stock images from wallheven, gifs from tenor and svg from svgl). The number of API resources to search is limited by the budget and location :)

I'm not promoting this as a convenient tool or replacement for something, because I would never use it myself, but **you can use this project to understand the main technologies used or write your thesis project** :))

> website (gh-pages) - https://sevchik-f8fe.github.io/wappy-client/
> server repo - https://github.com/sevchik-f8fe/wappy-server

---
## How To Use 

when you visit the site, you get to the main page where you can search (in english only). Logs are collected during the search and other requests (req), but they are not shared with anyone. 
<img width="1903" height="960" alt="Pasted image 20251114130228" src="https://github.com/user-attachments/assets/eabd59da-c80b-447e-8dde-3611c75dcbe8" />
*how the search works*: the search queries are sent to the server in parallel. the returned results are checked and shuffled.
You don't have to register to download or find what you need.
<img width="1901" height="966" alt="Pasted image 20251114130713" src="https://github.com/user-attachments/assets/6f0e36aa-9b55-4c31-b354-c537404f81b2" />
**Key features**: two-factor authentication, registration, confirmation when changing email (Yandex SMTP), session storage encryption (absolutely all your data), CSRF token stored in axios, favorites, history of load, ~~inability to directly download images from Wallhaven~~:)

---
## Theme
<img width="1920" height="845" alt="Pasted image 20251114132238" src="https://github.com/user-attachments/assets/752c1b2d-a784-4e47-bda6-35bebd50865d" />
**fonts** - paluiSP, hasklig

---
## What To Fix?

- Unable to download images directly from Wallhaven (./src/util/dashboard.js)
- Typing in the search field on the main page lags terribly when changing state. The current casting solution is searching via refs.

---
## Coming Soon

- autocomplete search
- other sources
- the ability to change the password
- optimization
- mobile version

---
## Setup For Dev

1. in your directory:
```
git clone https://github.com/sevchik-f8fe/wappy-client.git
npm i
```
2. create **.env** file at the root of the project
```
VITE_CRYPTO_KEY=key-for-encrypt-session-stroage
VITE_BASE_SERVER_URL=http://127.0.0.1:3000
```
3. run
```
npm run dev
```
