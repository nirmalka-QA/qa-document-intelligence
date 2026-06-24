from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from slowapi import Limiter
from slowapi.errors import RateLimitExceeded
from slowapi.util import get_remote_address


limiter = Limiter(
    key_func=get_remote_address,
    default_limits=[],
)


def add_rate_limiting(app: FastAPI, *, default_limits=None):
    if default_limits is not None:
        limiter.default_limits = default_limits

    @app.exception_handler(RateLimitExceeded)
    async def rate_limit_handler(request: Request, exc: RateLimitExceeded):
        return JSONResponse(
            status_code=429,
            content={"detail": "Rate limit exceeded"},
        )

    app.state.limiter = limiter

