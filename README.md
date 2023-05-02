# P2P Messaging App
This app provides a web messaging platform based on WebRTC. The app doesn't utilize any intermediary parties to:
- establish peer connections (except when determining the user's public IP),
- send/receive messages,
- storing messages,
- storing contacts.

To achieve this, users are responsible for inviting/receiving an invite to connect with peers, and they can use any method that they deem fit. To store the peers and their chat history, the app will only use a browser's session storage, meaning that once the page is closed/refreshed, all the data will be removed.

<br />

The app is live at `https://p2p-messaging-slveh.ondigitalocean.app/`.

<br />

## Runnig locally
1. open terminal & go to the project root folder
2. make sure the correct node version (see the `.nvmrc` file) is being used, if not install
3. run `npm i`
4. run `npm start`
5. open your browser & go to `localhost:3000`

## Contributing - Deploying
The repository has CI/CD configured, which will deploy the `master` branch when there's a new commit. To deploy a newer version:
1. open a PR with your proposed changes,
2. request reviews from the project owners,
3. upon approval, merge, which will trigger the build & deploy scripts,
4. go to `https://p2p-messaging-slveh.ondigitalocean.app/` to access the new version.

<br />
<hr />

## Known issues
- The UI is not responsive & will not render properly when the screen width is < 1024px
- There is a hard limit on how many peers one can connect to (might be differ per browser/hardware)
- When generating an offer, there might be a delay in determining the public IP, causing the local IP to be present in the generated invite instead
- Router firewalls & VPNs might prevent establishing connection with peers
- No new message notifications/alerts (users need to click on peers to check for new messages)
- Although intended, page refresh will cause all connection & chat history to be destroyed