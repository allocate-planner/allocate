FROM python:3.12.1-slim

RUN pip install uv

WORKDIR /app

COPY uv.lock pyproject.toml ./
RUN uv sync --frozen --no-group dev

COPY . .

ENV UVICORN_HOST=0.0.0.0
ENV UVICORN_PORT=5000

CMD ["uv", "run", "--no-sync", "python", "asgi.py"]