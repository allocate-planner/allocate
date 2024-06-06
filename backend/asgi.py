import uvicorn

from api import create_app


app = create_app()


if __name__ == "__main__":
    uvicorn.run(
        "api:create_app",
        host="127.0.0.1",
        port=5000,
        reload=app.state.config.DEBUG,
        factory=True,
    )
