const authBtn = document.getElementById('auth-btn') as HTMLButtonElement;
const accessKey = import.meta.env.VITE_ACCESS_KEY;
const secretKey = import.meta.env.VITE_SECRET_KEY;
const redirectUri = import.meta.env.VITE_REDIRECT_URL;
const secretkey = import.meta.env.VITE_SECRET_KEY;

console.log('Access Key:', accessKey, 'Secret Key:', secretKey, 'Redirect URI:', redirectUri);


authBtn.addEventListener('click', () => {
    const authUrl = `https://unsplash.com/oauth/authorize?client_id=${accessKey}&redirect_uri=${redirectUri}&response_type=code&scope=public+read_user+write_user+read_photos+write_photos`;
    window.location.href = authUrl
})

const urlParams = new URLSearchParams(window.location.search)
const code = urlParams.get('code')
console.log('Code:', code);

if(code) {
    getAccessToken(code)
}

function getAccessToken(code: string) {
    const tokenUrl = 'https://unsplash.com/oauth/token'
    const payload = {
        client_id: accessKey,
        client_secret: secretkey,
        redirect_uri: redirectUri,
        code:code,
        grant_type: 'authorization_code'
    }

    fetch(tokenUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    }).then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    }).then(data => {
        localStorage.setItem('access_token', data.access_token)
        window.location.href = './src/gallery/gallery.html';
        console.log('Access Token:', data.access_token);
        //window.history.replaceState({}, document.title, redirectUri);
    }).catch(error => {
        console.error('Error:', error);
    })
}