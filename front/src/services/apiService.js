import http from "./httpService";

export function getHelloWorld() {
    return http.get(`/`);
}

export async function getAllBooks() {
    const books = await fetch('/all_books/').then(res => res.json());
    for (const book of books.books) {
        const ratings = await getBookRating(book.isbn);
        const reviewers = await getBookReviews(book.isbn);
        let sum = 0;
        for (let i = 0; ratings.reviews[0] !== undefined && i < ratings.reviews.length; i++) {
            sum += parseInt(ratings.reviews[i][0].rating, 10);
        }
        book.rating = ratings.reviews[0] === undefined ? 0 : (sum / ratings.reviews.length).toFixed(2);
        book.reviewers = [];
        for (let i = 0; reviewers.user_reviews[0]!== undefined && i < reviewers.user_reviews.length; i++) {
            book.reviewers.push(reviewers.user_reviews[i][0]);
        }
    }
    return books;
}

export function getBookRating(isbn) {
    return fetch('/ratings/' + isbn).then(res => res.json());
}

export function getBookReviews(isbn) {
    return fetch('/reviews/' + isbn).then(res => res.json());
}

export function getUserReviews(user) {
    return fetch('/user/reviews/' + user).then(res => res.json());
}

export function getFriendsBooks(user) {
    return fetch('/user/friends/books/' + user).then(res => res.json());
}

export function rateBook(isbn, rating) {
    let response;
    return http.post(
        '/rating/' + isbn,
        {rating: rating},
    ).then(res => response = res.data);
}