# Velo Backend

FastAPI backend for the Velo.

## Setup

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Copy `.env.example` to `.env` and fill in your values:
```bash
cp .env.example .env
```

4. Run the development server:
```bash
uvicorn app.main:app --reload
```

## Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py          # FastAPI application
│   ├── config.py        # Configuration settings
│   ├── api/             # API routes
│   │   └── __init__.py
│   ├── models/          # SQLAlchemy models
│   │   └── __init__.py
│   ├── schemas/         # Pydantic models
│   │   └── __init__.py
│   └── services/        # Business logic
│       └── __init__.py
├── tests/               # Test files
│   └── __init__.py
├── .env                 # Environment variables
├── .env.example         # Example environment file
├── requirements.txt     # Project dependencies
└── README.md           # This file
```

## Development

- API documentation available at `/docs` or `/redoc`
- Run tests: `pytest`
- Format code: `black .`
- Sort imports: `isort .`
- Lint code: `flake8` 