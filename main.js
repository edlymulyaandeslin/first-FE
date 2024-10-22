document.addEventListener("DOMContentLoaded", () => {
  const EVENT_SET_BOOKS = "BOOKS_APP";
  const BOOKS_KEY = "list-data-book";

  let books = localStorage.getItem(BOOKS_KEY)
    ? JSON.parse(localStorage.getItem(BOOKS_KEY))
    : [];

  const form = document.getElementById("bookForm");

  const title = document.getElementById("bookFormTitle");
  const author = document.getElementById("bookFormAuthor");
  const year = document.getElementById("bookFormYear");
  const isCompleted = document.getElementById("bookFormIsComplete");
  const btnTitle = document.getElementById("bookFormSubmit");

  let isEditing = document.getElementById("isEditing");
  const formSearch = document.getElementById("searchBook");

  isCompleted.addEventListener("change", () => {
    if (!isEditing) {
      btnTitle.innerHTML = !isCompleted.checked
        ? "Masukkan Buku ke rak Belum selesai dibaca"
        : "Masukkan Buku ke rak Selesai dibaca";
    }
  });

  document.addEventListener(EVENT_SET_BOOKS, () => {
    if (!Storage) {
      return alert("Browser kamu tidak mendukung local storage");
    }

    localStorage.setItem(BOOKS_KEY, JSON.stringify(books));
    displayBooks();
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (isEditing) {
      const id = isEditing.value;

      const book = books.find((book) => book.id == id);

      book.title = title.value;
      book.author = author.value;
      book.year = Number(year.value);
      book.isCompleted = isCompleted.checked;
    } else {
      const newBook = {
        id: generateId(),
        title: title.value,
        author: author.value,
        year: Number(year.value),
        isCompleted: isCompleted.checked,
      };

      books.push(newBook);

      title.value = "";
      author.value = "";
      year.value = "";
      isCompleted.checked = false;
    }

    document.dispatchEvent(new Event(EVENT_SET_BOOKS));
  });

  formSearch.addEventListener("submit", (e) => {
    e.preventDefault();

    const searchInput = document.getElementById("searchBookTitle").value;

    if (searchInput) {
      const filteredBooks = books.filter((book) => {
        return book.title.toLowerCase().includes(searchInput.toLowerCase());
      });

      displayBooks(filteredBooks);
      return;
    }

    displayBooks();
  });

  const generateId = () => {
    return new Date().getTime() + Math.floor(Math.random() * 1000);
  };

  function isCompletedRead(id) {
    const book = books.find((book) => book.id === id);
    book.isCompleted = !book.isCompleted;

    document.dispatchEvent(new Event(EVENT_SET_BOOKS));
  }

  function deleteBook(id) {
    books = books.filter((book) => book.id !== id);

    document.dispatchEvent(new Event(EVENT_SET_BOOKS));
  }

  function updateBook(id) {
    const book = books.find((book) => book.id === id);

    document.getElementById("titleForm").innerHTML = "Edit Buku";
    btnTitle.innerHTML = "Update";

    document.getElementById("bookFormTitle").value = book.title;
    document.getElementById("bookFormAuthor").value = book.author;
    document.getElementById("bookFormYear").value = book.year;
    document.getElementById("bookFormIsComplete").checked = book.isCompleted;

    if (isEditing) {
      isEditing.remove();
    }

    isEditing = document.createElement("input");

    isEditing.setAttribute("type", "hidden");
    isEditing.setAttribute("name", "id");
    isEditing.setAttribute("id", "hiddenInput");
    isEditing.setAttribute("value", book.id);
    form.appendChild(isEditing);
  }

  const displayBooks = (filteredBooks) => {
    const incompleteBookList = document.getElementById("incompleteBookList");
    const completeBookList = document.getElementById("completeBookList");

    incompleteBookList.innerHTML = "";
    completeBookList.innerHTML = "";

    let data = filteredBooks ? filteredBooks : books;

    data.map((book) => {
      const { id, title, author, year, isCompleted } = book;

      if (isCompleted) {
        completeBookList.innerHTML += `
          <div data-bookid="${id}" data-testid="bookItem">
            <h3 data-testid="bookItemTitle">${title}</h3>
            <p data-testid="bookItemAuthor">Penulis: ${author}</p>
            <p data-testid="bookItemYear">Tahun: ${year}</p>
            <div>
              <button class="check-button" data-testid="bookItemIsCompleteButton" type="button" onClick="isCompletedRead(${id})">
               <span class="check-icon" style="color: red">&#10006;</span> Belum Selesai dibaca
              </button>
              <button data-testid="bookItemDeleteButton" type="button" onClick="deleteBook(${id})">Hapus Buku</button>
              <button data-testid="bookItemEditButton" type="button" onClick="updateBook(${id})">Edit Buku</button>
            </div>
          </div>
        `;
      } else {
        incompleteBookList.innerHTML += `
          <div data-bookid="${id}" data-testid="bookItem">
            <h3 data-testid="bookItemTitle">${title}</h3>
            <p data-testid="bookItemAuthor">Penulis: ${author}</p>
            <p data-testid="bookItemYear">Tahun: ${year}</p>
            <div>
              <button class="check-button" data-testid="bookItemIsCompleteButton" type="button" onClick="isCompletedRead(${id})">
                <span class="check-icon">&#10004;</span> Selesai dibaca
              </button>
              <button data-testid="bookItemDeleteButton" type="button" onClick="deleteBook(${id})">Hapus Buku</button>
              <button data-testid="bookItemEditButton" type="button" onClick="updateBook(${id})">Edit Buku</button>
            </div>
          </div>
        `;
      }
    });
  };

  displayBooks();
  window.isCompletedRead = isCompletedRead;
  window.deleteBook = deleteBook;
  window.updateBook = updateBook;
});
