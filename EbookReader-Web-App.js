import React, { useState, useRef, useEffect } from 'react';

function EbookReaderWebApp() {
  const [library, setLibrary] = useState([
    { title: "Moby Dick", author: "Herman Melville", content: "Call me Ishmael..." },
    { title: "1984", author: "George Orwell", content: "It was a bright cold day in April..." },
    { title: "The Hobbit", author: "J.R.R. Tolkien", content: "In a hole in the ground there lived a hobbit..." }
  ]);
  const [selectedBook, setSelectedBook] = useState(library[0]);
  const [page, setPage] = useState(1);
  const [fontSize, setFontSize] = useState(18);
  const [bookmarks, setBookmarks] = useState([]);
  const readerRef = useRef();

  useEffect(() => setPage(1), [selectedBook]);

  function addBookmark() {
    setBookmarks(prev =>
      prev.concat({ book: selectedBook.title, page, note: `Bookmark at page ${page}` })
    );
  }

  function goToBookmark(b) {
    setSelectedBook(library.find(x => x.title === b.book));
    setPage(b.page);
  }

  function changeFontSize(delta) {
    setFontSize(f => Math.max(12, Math.min(32, f + delta)));
  }

  function nextPage() {
    setPage(p => Math.min(p + 1, getMaxPage()));
  }

  function prevPage() {
    setPage(p => Math.max(p - 1, 1));
  }

  function getMaxPage() {
    return Math.ceil(selectedBook.content.length / 250);
  }

  function getCurrentText() {
    const start = (page - 1) * 250;
    return selectedBook.content.slice(start, start + 250) || "(End of book)";
  }

  return (
    <div style={{ maxWidth: 600, margin: "40px auto", fontFamily: "serif", background: "#f9f7f2", borderRadius: 12, padding: 24 }}>
      <h2>EbookReader Web App</h2>
      <BookSelector library={library} selected={selectedBook} setSelected={setSelectedBook} />
      <div style={{ marginTop: 18 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span>
            <b>{selectedBook.title}</b> by {selectedBook.author}
          </span>
          <span>
            <button onClick={() => changeFontSize(-2)}>-</button>
            <span style={{ margin: "0 10px" }}>{fontSize}px</span>
            <button onClick={() => changeFontSize(2)}>+</button>
          </span>
        </div>
        <div
          ref={readerRef}
          style={{
            marginTop: 18,
            minHeight: 120,
            background: "#fff",
            borderRadius: 8,
            padding: 16,
            fontSize,
            lineHeight: "1.8"
          }}>
          {getCurrentText()}
        </div>
        <div style={{ marginTop: 10, display: "flex", justifyContent: "space-between" }}>
          <button onClick={prevPage} disabled={page === 1}>Previous</button>
          <span>Page {page} / {getMaxPage()}</span>
          <button onClick={nextPage} disabled={page === getMaxPage()}>Next</button>
        </div>
        <button onClick={addBookmark} style={{ marginTop: 14 }}>Bookmark Page</button>
      </div>
      <BookmarkList bookmarks={bookmarks} goToBookmark={goToBookmark} />
    </div>
  );
}

function BookSelector({ library, selected, setSelected }) {
  return (
    <div>
      <label>
        <span>Select Book:</span>
        <select
          value={selected.title}
          onChange={e => setSelected(library.find(b => b.title === e.target.value))}
          style={{ marginLeft: 10, padding: 6 }}
        >
          {library.map(book => (
            <option key={book.title} value={book.title}>
              {book.title} ({book.author})
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}

function BookmarkList({ bookmarks, goToBookmark }) {
  if (!bookmarks.length) return null;
  return (
    <div style={{ marginTop: 24 }}>
      <b>Bookmarks:</b>
      <ul>
        {bookmarks.map((b, idx) => (
          <li key={idx}>
            <button onClick={() => goToBookmark(b)}>{b.book} @ page {b.page}</button> — {b.note}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default EbookReaderWebApp;