import http from "./httpService";

export function getHelloWorld() {
    return http.get(`/`);
}

export function getAllBooks() {
    return fetch('/all_books').then(res => res.json());
}