export default class NotificationResource {

    allTokens = [];
    tokensLoaded = false;
    user = null;

    constructor(messaging, database) {

        this.database = database
        this.messaging = messaging

        try {
            this.messaging
                .requestPermission()
                .then(res => {
                    console.log('Permission Granted')
                })
                .catch(err => {
                    console.log('No Access', err)
                })
        } catch(err) {
            console.log('No Notification Support.', err)
        }

        this.setupTokenRefresh()
        this.database
            .ref('/fcmTokens')
            .on('value', snapshot => {
                this.allTokens = snapshot.val()
                this.tokensLoaded = true
            })
    }


    changeUser(user) {
        this.user = user
        this.saveTokenToServer()
    }


    setupTokenRefresh() {
        this.messaging.onTokenRefresh(() => {
            this.saveTokenToServer()
        })
    }


    saveTokenToServer() {
        this.messaging
            .getToken()
            .then(token => {
                if (this.tokensLoaded) {
                    const existingToken = this.findExistingTokens(token)

                    if (existingToken) {
                        this.database
                            .ref(`/fcmTokens/${existingToken}`)
                            .set({
                                token,
                                user_id: this.user.uid
                            })
                    } else {
                        this.registerToken(token)
                    }
                }
            })
    }


    findExistingTokens(tokenToSave) {
        for (let tokenKey in this.allTokens) {
            const token = this.allTokens[tokenKey].token

            if (token === tokenToSave) {
                return tokenKey
            }
        }
        return false
    }


    registerToken(token) {
        this.database
            .ref('/fcmTokens')
            .push({
                token: token,
                user_id: this.user.uid
            })
    }
}