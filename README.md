# Restaurant Finder Backend

This is the backend service for the **Restaurant Finder AI** application.
It exposes an API that accepts a natural language query, interprets the request, retrieves restaurant data from the Foursquare Places API, and returns clean structured restaurant information.

The backend is built using **Node.js, Express, and TypeScript** and follows a layered architecture designed for maintainability, type safety, and robustness.

---

# Tech Stack

Core Technologies

* Node.js
* Express
* TypeScript

Libraries

* Axios — HTTP client for external APIs
* Zod — schema validation
* dotenv — environment variable management

External APIs

* Foursquare Places API — restaurant search
* Groq API — natural language query interpretation (LLM inference)

---

# Project Structure

```text
src
├── controllers
│   └── execute.controller.ts
├── routes
│   └── execute.routes.ts
├── middleware
│   └── validation.middleware.ts
├── services
│   ├── foursquare.service.ts
│   └── interpreter.service.ts
├── models
│   ├── foursquare.model.ts
│   └── restaurant.model.ts
├── schemas
│   └── search.schema.ts
├── utils
│   └── foursquareClient.ts
└── index.ts
```

Architecture flow:

```
Route → Middleware → Controller → Services → External APIs
```

Responsibilities are separated so that:

* Routes handle HTTP routing
* Middleware handles request validation and access control
* Controllers orchestrate requests
* Services contain business logic and external API integrations
* Models define shared types

---

# Setup Instructions

## 1. Clone the repository

```bash
git clone <repository-url>
cd restaurant-finder-backend
```

## 2. Install dependencies

```bash
npm install
```

---

# Environment Variables

Create a `.env` file in the project root.

Example:

```env
PORT=3001
FOURSQUARE_API_KEY=your_foursquare_api_key
GROQ_API_KEY=your_groq_api_key
BASE_URL=foursquare_base_url
```

Notes:

* `.env` should **not be committed to version control**
* API keys are loaded using `dotenv`
* The server will fail fast if required environment variables are missing

---

# Running the Application

Start the development server:

```bash
npm run dev
```

The server runs at:

```
http://localhost:3001
```

### LLM Provider Update (Gemini → Groq)

The backend now uses **Groq** instead of Gemini for query interpretation.

### Model Rotation (Implemented)

To improve reliability under rate limits and provider-side transient failures, the backend now rotates across multiple Groq models in sequence.

Current fallback order:

1. `llama-3.1-8b-instant`
2. `llama-3.3-70b-versatile`
3. `moonshotai/kimi-k2-instruct-0905`

If one model fails (for example due to rate limiting), the request automatically retries on the next model until one succeeds or all models fail.

Reason for the change:

* better support for larger-model capability in this use case
* fewer interruptions caused by Gemini rate limit constraints during development/testing
* more consistent response latency for prompt-to-JSON interpretation

---

# Unit Tests

What is tested:

* `interpreter.service.ts` parsing and validation behavior
* `foursquare.service.ts` mapping logic and handling of optional fields
* Service behavior is tested with mocked dependencies so no real external API calls are made

How to run the tests:

```bash
npm test
```

Watch mode:

```bash
npm run test:watch
```

What is intentionally not tested:

* Real integration calls to Groq or Foursquare APIs
* Express route/controller integration behavior
* End-to-end API testing through the `/api/execute` endpoint

Those areas were left out on purpose to keep the current test suite fast, deterministic, and focused on unit-level business logic.

---

# API Endpoint

### Execute Restaurant Search

```
GET /api/execute
```

Query parameters:

| Parameter | Description                        |
| --------- | ---------------------------------- |
| `message` | Natural language restaurant query  |
| `code`    | Access gate value (`pioneerdevai`) |

Example request:

```
http://localhost:3001/api/execute?message=cheap sushi in los angeles open now&code=pioneerdevai
```

---

# Example API Response

```json
{
  "query": "cheap sushi in los angeles open now",
  "results": [
    {
      "id": "4ae4b9b7f964a5207c9f21e3",
      "name": "Sushi Gen",
      "address": "422 E 2nd St Los Angeles",
      "category": "Sushi Restaurant",
      "rating": 8.7,
      "priceLevel": 2,
      "openNow": true
    }
  ]
}
```

Returned fields include:

* **id** – unique restaurant identifier
* **name** – restaurant name
* **address** – formatted address *(optional)*
* **category** – cuisine or restaurant type *(optional)*
* **rating** – restaurant rating when available *(optional)*
* **priceLevel** – price tier provided by the API *(optional)*
* **openNow** – current open status *(optional)*
* **hours** – business hours when available *(optional)*
* **website** – restaurant website if available *(optional)*

Optional fields are **only included when the external API provides them**.

If a value is unavailable, the field is **omitted entirely from the response** instead of returning `null` or `undefined`.
This keeps the API responses clean and avoids unnecessary or misleading data.

---

# Testing the API

## Using Postman

Method

```
GET
```

URL

```
http://localhost:3001/api/execute
```

Params

```
message = ramen near san francisco open now
code = pioneerdevai
```

---

## Using curl

```bash
curl "http://localhost:3001/api/execute?message=sushi%20in%20los%20angeles&code=pioneerdevai"
```

---

# Security and Robustness

The backend includes several safeguards:

Secrets

* API keys are stored in environment variables
* Sensitive values are never hardcoded

Input validation

* Requests are validated before processing
* Missing or invalid parameters return proper HTTP errors

Authorization gate

* Requests must include the correct `code` query parameter
* Unauthorized requests return `401`

Error handling

* External API failures are handled with `try/catch`
* Internal errors return safe responses without leaking system details

Defensive access

* Optional chaining prevents runtime crashes when API fields are missing

---

# Technical Design Decisions

### Layered Architecture

A layered structure was chosen to keep responsibilities separated and maintainable.

```
Controller → Services → External APIs
```

Controllers remain thin while services handle business logic.

---

### Structured API Responses

External API responses are mapped into a simplified `Restaurant` model to:

* avoid leaking unnecessary data
* provide consistent responses
* simplify frontend integration

---

### Controlled External API Usage

Only the top search results are fetched for detailed information to reduce:

* API usage
* response latency
* unnecessary external calls

---

# Assumptions

* The user provides a natural language query describing restaurant preferences.
* An LLM interprets the message into structured parameters before calling the Foursquare API.
* The API returns only the most relevant restaurant data.

---

# Tradeoffs

Simplified authentication

The API uses a simple query parameter gate:

```
code=pioneerdevai
```

This is sufficient for the assignment but would normally be replaced with proper authentication in production.

Limited results

Only a subset of restaurants are returned to keep responses fast and manageable.

---

# Limitations

* Natural language interpretation may not always perfectly match the user's intent.
* External API availability and rate limits may affect results.
* Location accuracy depends on the specificity of the user's query.

---

# Future Improvements

Possible enhancements include:

* caching search results
* improved prompt engineering for LLM interpretation
* request rate limiting
* pagination for restaurant results
* logging and observability improvements

---

# Deployment

Deployed backend URL

```
<your-backend-url>
```

Example endpoint

```
<your-backend-url>/api/execute
```
