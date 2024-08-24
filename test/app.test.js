const request = require('supertest');
const { expect } = require('chai');
const app = require('../app'); // assuming your app.js is the entry point of your application
const mysql = require('mysql2/promise');

// Setup database connection
let db;

before(async () => {
    db = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'yourpassword',
        database: 'movies_db'
    });
});

after(async () => {
    await db.end();
});

// Test cases
describe('Movies API', () => {

    // Test movie creation
    it('should create a new movie', async () => {
        const movieData = {
            title: 'Test Movie',
            genre: 'Action',
            release_year: 2024,
            image_url: 'https://example.com/test-image.jpg',
            video_url: 'https://example.com/test-video.mp4'
        };

        const res = await request(app)
            .post('/movies')
            .send(movieData)
            .expect(201);

        expect(res.body).to.include.keys('id', 'title', 'genre', 'release_year', 'image_url', 'video_url');
        expect(res.body.title).to.equal(movieData.title);
    });

    // Test fetching all movies
    it('should fetch all movies', async () => {
        const res = await request(app)
            .get('/movies')
            .expect(200);

        expect(res.body).to.be.an('array');
    });

    // Test fetching a specific movie by ID
    it('should fetch a movie by ID', async () => {
        const res = await request(app)
            .get('/movies/1')
            .expect(200);

        expect(res.body).to.include.keys('id', 'title', 'genre', 'release_year', 'image_url', 'video_url');
    });

    // Test searching movies
    it('should search for movies by title or genre', async () => {
        const query = 'Action';
        const res = await request(app)
            .get(`/movies/search?query=${query}`)
            .expect(200);

        expect(res.body).to.be.an('array');
    });

    // Test movie deletion
    it('should delete a movie', async () => {
        const res = await request(app)
            .delete('/movies/1')
            .expect(200);

        expect(res.body).to.have.property('message', 'Movie deleted successfully');
    });
});
