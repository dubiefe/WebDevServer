# 🎬 Exercise T5: BlockBuster API

## The Videoclub of the futur (that is now in the past)

## 📖 History

An eccentric and nostalgic millionaire wants to recreate the experience of 90s video stores, but with modern technology. He has hired you to create the API that manages his movie catalog and rental system.

The system must allow users to view the catalog, rent movies (if copies are available), return them, and view statistics on the most popular titles.

## 📋 Requirements

### Movie's Model

```javascript
{
  title: String,            // Required, min 2 characters
  director: String,         // Required
  year: Number,             // Between 1888 and current year
  genre: String,            // Enum: action, comedy, drama, horror, scifi
  copies: Number,           // Total of copies (default: 5)
  availableCopies: Number,  // Available copies
  timesRented: Number,      // Rental counter (default: 0)
  cover: String             // Name of the folder of the cover (default: null)
}
```

### Endpoints

| Method |         Route          |              Description              |
|--------|------------------------|---------------------------------------|
| GET    | /api/movies            | List movies (filter: `?genre=comedy`) |
| GET    | /api/movies/:id        | Get movie from ID                     |
| POST   | /api/movies            | Create new movie                      |
| PUT    | /api/movies/:id        | Update movie                          |
| DELETE | /api/movies/:id        | Delete movie                          |
| POST   | /api/movies/:id/rent   | Rent movie                            |
| POST   | /api/movies/:id/return | Return movie                          |
| PATCH  | /api/movies/:id/cover  | Upload / Replace cover (multipart)    |
| GET    | /api/movies/:id/cover  | Get image from the cover              |
| GET    | /api/movies/stats/top  | Top 5 most rented                     |

### Lógica de negocio

1. **Rent**: Decrease `availableCopies`, increase `timesRented`
2. **Return**: Increase `availableCopies` (without exceed `copies`)
3. **Validate**: Forbid renting if `availableCopies === 0`

### FOrlders (Multer)

1. **Upload cover**: Send image with `multipart/form-data` (field `cover`). Just images (jpeg, png, webp, gif), maximum 5 MB
2. **Replace**: If the movie already has a cover, delete the previous and replace by the new one
3. **Get**: `GET /api/movies/:id/cover` returns the image directly. Also available at `/uploads/<filename>`
4. **Delete movie**: When you delete a movie, its cover is also deleted.

## 🚀 Execute

```bash
cd ejercicios/T5
npm install
cp .env.example .env
# Edit .env with your MONGODB_URI
npm run dev
```

## 🧪 Tests

Use the `tests/movies.http` file with the VS Code REST Client extension.

## 🎯 Success criteria

- [ ] Complete CRUD for movies working
- [ ] Filter for genres implemented
- [ ] System of rental/return with validations
- [ ] Stats of top 5 movies
- [ ] Proper error handling (404, 400, etc.)
- [ ] Validation in the Mongoose model
- [ ] Cover upload with Multer running
- [ ] Endpoint GET to recover the cover

## 🎁 BONUS

- Add pagination to GET /api/movies (`?page=1&limit=10`)
- Implement search by title (`?search=matrix`)
- Add `rating` field and endpoint to rate movies
- Create endpoint `/api/movies/available` that only shows movies with available copies