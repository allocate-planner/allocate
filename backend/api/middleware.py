import logging
from collections.abc import Awaitable, Callable

import jwt
from fastapi import HTTPException, Request, Response
from fastapi.responses import JSONResponse

from api.audio.errors.audio_processing_error import AudioProcessingError
from api.config import config
from api.events.errors.event_not_found_error import EventNotFoundError
from api.events.errors.events_not_found_error import EventsNotFoundError
from api.events.errors.recurring_event_edit_error import RecurringEventEditError
from api.users.errors.invalid_credentials_error import InvalidCredentialsError
from api.users.errors.invalid_token_error import InvalidTokenError
from api.users.errors.missing_token_error import MissingTokenError
from api.users.errors.refresh_token_error import RefreshTokenError
from api.users.errors.user_already_exists_error import UserAlreadyExistsError
from api.users.errors.user_not_found_error import UserNotFoundError

logger = logging.getLogger(__name__)

ANONYMOUS_USER_ID = "ANONYMOUS"


async def request_logging_middleware(
    request: Request,
    call_next: Callable[[Request], Awaitable[Response]],
) -> Response:
    user_id = ANONYMOUS_USER_ID

    auth_header = request.headers.get("authorization")
    if auth_header and auth_header.startswith("Bearer "):
        token = auth_header.split(" ")[1]
        try:
            if config.JWT_SECRET_KEY:
                payload = jwt.decode(
                    token,
                    config.JWT_SECRET_KEY,
                    algorithms=[config.JWT_ALGORITHM],
                )
                user_id = str(payload.get("sub", ANONYMOUS_USER_ID))
        except Exception:  # noqa: S110  # nosec B110
            pass

    logger.info(
        "USER %s %s %s",
        user_id,
        request.method,
        request.url.path,
    )

    return await call_next(request)


async def error_handling_middleware(  # noqa: C901
    request: Request,
    call_next: Callable[[Request], Awaitable[Response]],
) -> Response:
    try:
        return await call_next(request)
    except HTTPException as err:
        logger.exception(
            "HTTP error on %s %s",
            request.method,
            request.url.path,
        )
        return JSONResponse(status_code=err.status_code, content={"detail": err.detail})
    except MissingTokenError:
        logger.exception(
            "Auth error on %s %s",
            request.method,
            request.url.path,
        )
        return JSONResponse(status_code=401, content={"detail": "Unauthorized"})
    except InvalidTokenError:
        logger.exception(
            "Auth error on %s %s",
            request.method,
            request.url.path,
        )
        return JSONResponse(status_code=401, content={"detail": "Unauthorized"})
    except RefreshTokenError:
        logger.exception(
            "Auth error on %s %s",
            request.method,
            request.url.path,
        )
        return JSONResponse(status_code=401, content={"detail": "Unauthorized"})
    except UserNotFoundError:
        logger.exception(
            "Business logic error on %s %s",
            request.method,
            request.url.path,
        )
        return JSONResponse(status_code=404, content={"detail": "User not found"})
    except EventNotFoundError:
        logger.exception(
            "Business logic error on %s %s",
            request.method,
            request.url.path,
        )
        return JSONResponse(status_code=404, content={"detail": "Event not found"})
    except EventsNotFoundError:
        logger.exception(
            "Business logic error on %s %s",
            request.method,
            request.url.path,
        )
        return JSONResponse(status_code=404, content={"detail": "Events not found"})
    except RecurringEventEditError:
        logger.exception(
            "Business logic error on %s %s",
            request.method,
            request.url.path,
        )
        return JSONResponse(
            status_code=400, content={"detail": "Cannot edit first repeated event"}
        )
    except UserAlreadyExistsError:
        logger.exception(
            "Business logic error on %s %s",
            request.method,
            request.url.path,
        )
        return JSONResponse(status_code=409, content={"detail": "User already exists"})
    except InvalidCredentialsError:
        logger.exception(
            "Business logic error on %s %s",
            request.method,
            request.url.path,
        )
        return JSONResponse(
            status_code=401,
            content={"detail": "Invalid email or password"},
        )
    except AudioProcessingError:
        logger.exception(
            "Business logic error on %s %s",
            request.method,
            request.url.path,
        )
        return JSONResponse(
            status_code=400,
            content={"detail": "Audio processing failed"},
        )
    except Exception:
        logger.exception(
            "Unexpected error on %s %s",
            request.method,
            request.url.path,
        )
        return JSONResponse(
            status_code=500,
            content={"detail": "An unexpected error occurred. Please try again later."},
        )
