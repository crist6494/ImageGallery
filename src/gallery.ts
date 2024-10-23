const searchForm = document.getElementById('search-form') as HTMLFormElement;
const inputContent = document.getElementById('content-input') as HTMLInputElement;
const accessKey = import.meta.env.VITE_ACCESS_KEY;
const urlUnsplash = import.meta.env.VITE_UNSPALSH_URL;
const btnLogout = document.getElementById('btn-logout') as HTMLButtonElement;

searchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const query = inputContent.value;
    if (query) {
        const url = `${urlUnsplash}search/photos?query=${query}&client_id=${accessKey}`;
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

function displayImages(data: any) {
    const images = data.results;
    const gallery = document.getElementById('gallery') as HTMLDivElement;
    gallery.innerHTML = '';
    if (images.length === 0) {
        gallery.innerHTML = '<p>No se encontraron imágenes.</p>';
        return;
    }
    images.forEach((image: any) => {
        const img = document.createElement('img');
        img.src = image.urls.regular;
        gallery.appendChild(img);
    })
}

btnLogout.addEventListener('click', () => {
    localStorage.removeItem('access_token');
    window.location.href = './index.html';
});
