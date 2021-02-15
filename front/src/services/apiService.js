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
        for (let i = 0; ratings.reviews[0] !== undefined && i < ratings.reviews[0].length; i++) {
            sum += parseInt(ratings.reviews[0][i].rating, 10);
        }
        book.rating = ratings.reviews[0] === undefined ? 0 : sum / ratings.reviews[0].length;
        book.reviewers = reviewers.user_reviews[0] === undefined ? [] : reviewers.user_reviews[0];
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