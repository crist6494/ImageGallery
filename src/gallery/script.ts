const searchForm = document.getElementById('search-form') as HTMLFormElement;
const inputContent = document.getElementById('content-input') as HTMLInputElement;
const unsplashAccessKey = import.meta.env.VITE_ACCESS_KEY;
const urlUnsplash = import.meta.env.VITE_UNSPALSH_URL;
const btnLogout = document.getElementById('btn-logout') as HTMLButtonElement;

searchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const query = inputContent.value;
    if (query) {
        const url = `${urlUnsplash}search/photos?query=${query}&client_id=${unsplashAccessKey}`;
        console.log(url);
        search(url);
    }
})

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

function saveFavorite(imageUrl: any) {
    let favorites: string[] = [];
    const savedFavorites = localStorage.getItem('favourites');
    if (savedFavorites) {
        favorites = JSON.parse(savedFavorites);
    }

    favorites.push(imageUrl);
    console.log(favorites);
    localStorage.setItem('favourites', JSON.stringify(favorites));
}



function displayImages(data: any) {
    const images = data.results;
    const gallery = document.getElementById('gallery-container') as HTMLDivElement;
    gallery.innerHTML = '';
    if (images.length === 0) {
        gallery.innerHTML = '<p>No se encontraron imágenes.</p>';
        return;
    }
    images.forEach((image: any) => {
        const divImg = document.createElement('div');
        divImg.classList.add('gallery-img');

        const img = document.createElement('img');
        img.src = image.urls.regular;
        divImg.appendChild(img);

        const btnFavorites = document.createElement('button');
        btnFavorites.innerHTML = '<i class="bi bi-bookmark"></i>';
        btnFavorites.addEventListener('click', (event) => {
            const icon = btnFavorites.querySelector('i');
            if (icon) {
                btnFavorites.classList.toggle('active');
            }
            console.log(image.urls.regular);
            saveFavorite(image.urls.regular);
            // Evitar que el click se propague a los elementos padres
            event.stopPropagation();
        });

        divImg.appendChild(btnFavorites);
        gallery.appendChild(divImg);
    })
}

btnLogout.addEventListener('click', () => {
    localStorage.removeItem('access_token');
    window.location.href = './index.html';
});
