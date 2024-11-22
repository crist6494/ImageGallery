const urlUnsplash = import.meta.env.VITE_UNSPALSH_URL;
const unsplashAccessKey = import.meta.env.VITE_ACCESS_KEY;

const searchForm = document.getElementById('search-form') as HTMLFormElement;
const inputContent = document.getElementById('content-input') as HTMLInputElement;
const gallery = document.getElementById('gallery-container') as HTMLDivElement;
const btnLogout = document.getElementById('btn-logout') as HTMLButtonElement;
const btnFavorites = document.querySelector('.btn-favorites') as HTMLButtonElement;
const btnClearFavorites = document.querySelector('.btn-clear-favorites') as HTMLButtonElement;

function search(url: string) {
    fetch(url)
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        displayImages(data);
    })
}

function displayImages(data: any) {
    const images = data.results;
    gallery.innerHTML = '';
    if (images.length === 0) {
        gallery.innerHTML = '<p class="images-not-found">images not found</p>';
        return;
    }
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    images.forEach((image: any) => {
        const divImg = document.createElement('div');
        divImg.classList.add('gallery-img');

        const img = document.createElement('img');
        img.src = image.urls.regular;
        divImg.appendChild(img);

        const btnFavorites = document.createElement('button');
        btnFavorites.innerHTML = '<i class="bi bi-bookmark"></i>';
        if (favorites.includes(image.urls.regular)) {
            btnFavorites.classList.add('active');
        }
        btnFavorites.addEventListener('click', (event) => {
            btnFavorites.classList.toggle('active');
            btnFavorites.classList.contains('active') 
            toggleFavorite(image.urls.regular);
            event.stopPropagation();
        });

        divImg.appendChild(btnFavorites);
        gallery.appendChild(divImg);
    })
}

function toggleFavorite(imageUrl: string) {
    let favorites: Set<string> = new Set();
    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
        favorites = new Set(JSON.parse(savedFavorites));
    }
    favorites.has(imageUrl) ? favorites.delete(imageUrl) : favorites.add(imageUrl);
    localStorage.setItem('favorites', JSON.stringify(Array.from(favorites)));
}

function displayFavourites(){
    inputContent.value = '';
    const imgStore: any = localStorage.getItem('favorites');
    if(imgStore){
        gallery.innerHTML = '';
        const imgFavorites: string[] = JSON.parse(imgStore);
        imgFavorites.forEach((img: any) => {
            const divImg = document.createElement('div');
            divImg.classList.add('gallery-img');

            const imgElement = document.createElement('img');
            imgElement.src = img;

            const btnFavorites = document.createElement('button');
            btnFavorites.innerHTML = '<i class="bi bi-bookmark"></i>';
            btnFavorites.classList.add('active');
            btnFavorites.addEventListener('click', (event) => {
                toggleFavorite(img);
                divImg.remove();
                event.stopPropagation();
            });
            
            divImg.appendChild(imgElement);
            divImg.appendChild(btnFavorites);
            gallery.appendChild(divImg);
        });
    }
}

function clearFavorites(){
    localStorage.removeItem('favorites');
    gallery.innerHTML = '';
    inputContent.value = '';
}

const redirectToLogin = () => setTimeout(() => window.location.href = '../../index.html', 100);

if (localStorage.getItem('access_token')) {
    searchForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const query = inputContent.value;
        query ? search(`${urlUnsplash}search/photos?query=${query}&client_id=${unsplashAccessKey}`) : gallery.innerHTML = '';
    });

    btnFavorites.addEventListener('click', displayFavourites);
    btnClearFavorites.addEventListener('click', clearFavorites);
    btnLogout.addEventListener('click', () => {
        localStorage.removeItem('access_token');
        window.location.href = '../../index.html';
    });
} else {
    [searchForm, btnFavorites, btnClearFavorites, btnLogout].forEach(btn => 
        btn.addEventListener('click', () => {
            alert('No access token found. Redirecting to login...');
            redirectToLogin();
        })
    );
}
