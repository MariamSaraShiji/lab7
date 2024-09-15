document.addEventListener('DOMContentLoaded', () => {
    const bookList = document.getElementById('bookList');
    const searchInput = document.getElementById('search');
    const genreSelect = document.getElementById('genre');
    const sortSelect = document.getElementById('sort');
    const prevPageBtn = document.getElementById('prevPage');
    const nextPageBtn = document.getElementById('nextPage');

    let books = [];
    let currentPage = 1;
    const itemsPerPage = 5;

    function fetchBooks() {
        fetch('books.json')
            .then(response => response.json())
            .then(data => {
                books = data;
                renderBooks();
            })
            .catch(error => {
                console.error('Error fetching books:', error);
            });
    }

    function renderBooks() {
        bookList.innerHTML = '';
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;

        let filteredBooks = books;

        if (searchInput.value) {
            filteredBooks = filteredBooks.filter(book =>
                book.title.toLowerCase().includes(searchInput.value.toLowerCase())
            );
        }

        if (genreSelect.value !== 'all') {
            filteredBooks = filteredBooks.filter(book => book.genre === genreSelect.value);
        }

        if (sortSelect.value === 'title') {
            filteredBooks.sort((a, b) => a.title.localeCompare(b.title));
        } else if (sortSelect.value === 'author') {
            filteredBooks.sort((a, b) => a.author.localeCompare(b.author));
        }

        filteredBooks.slice(startIndex, endIndex).forEach(book => {
            const bookItem = document.createElement('div');
            bookItem.className = 'book-item';
            bookItem.innerHTML = `
                
                <div>
                    <h2>${book.title}</h2>
                    <p><strong>Author:</strong> ${book.author}</p>
                    <p><strong>Year:</strong> ${book.year}</p>
                    <p><strong>Genre:</strong> ${book.genre}</p>
                </div>
                <img src="${book.image}" alt="${book.title}">
            `;
            bookList.appendChild(bookItem);
        });

        updateButtons(filteredBooks.length);
    }

    function updateButtons(totalItems) {
        prevPageBtn.disabled = currentPage === 1;
        nextPageBtn.disabled = currentPage * itemsPerPage >= totalItems;
    }

    searchInput.addEventListener('input', renderBooks);
    genreSelect.addEventListener('change', renderBooks);
    sortSelect.addEventListener('change', renderBooks);
    prevPageBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderBooks();
        }
    });
    nextPageBtn.addEventListener('click', () => {
        if (currentPage * itemsPerPage < books.length) {
            currentPage++;
            renderBooks();
        }
    });

    fetchBooks();
});
