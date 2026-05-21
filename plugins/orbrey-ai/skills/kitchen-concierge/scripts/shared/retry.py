"""Exponential backoff retry helper for flaky DOM interactions."""

from __future__ import annotations

import logging
import time
from typing import Callable, TypeVar

T = TypeVar("T")

_logger = logging.getLogger(__name__)


def retry(
    fn: Callable[[], T],
    *,
    attempts: int = 3,
    initial_delay_s: float = 1.0,
    factor: float = 2.0,
    exceptions: tuple[type[BaseException], ...] = (Exception,),
    label: str = "operation",
) -> T:
    """Run `fn` with exponential backoff. Re-raises the last exception on exhaustion."""
    delay = initial_delay_s
    last_exc: BaseException | None = None
    for attempt in range(1, attempts + 1):
        try:
            return fn()
        except exceptions as exc:
            last_exc = exc
            if attempt == attempts:
                _logger.warning("%s failed after %d attempts: %s", label, attempts, exc)
                raise
            _logger.info("%s attempt %d/%d failed (%s); retrying in %.1fs", label, attempt, attempts, exc, delay)
            time.sleep(delay)
            delay *= factor
    # unreachable; appeases the type checker
    assert last_exc is not None
    raise last_exc
