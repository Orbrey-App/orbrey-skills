"""Adapter registry.

Each adapter is imported defensively — a missing optional dependency (e.g.
playwright not installed, or a future adapter requiring a different SDK) skips
that adapter rather than crashing the CLI. Use `--list-adapters` to see what
loaded and `pip install -r requirements.txt` for missing deps.

Add a new adapter by importing it inside its own try/except block below, then
registering the class under REGISTRY[<name>] on success.
"""

from __future__ import annotations

import logging

from .base import GroceryAdapter

_logger = logging.getLogger(__name__)

REGISTRY: dict[str, type[GroceryAdapter]] = {}
LOAD_ERRORS: dict[str, str] = {}


def _try_register(name: str, import_path: str, class_name: str) -> None:
    """Attempt to import and register an adapter; swallow ImportError gracefully."""
    try:
        module = __import__(import_path, fromlist=[class_name])
        REGISTRY[name] = getattr(module, class_name)
    except ImportError as exc:
        LOAD_ERRORS[name] = (
            f"{exc.__class__.__name__}: {exc}. "
            f"Run `pip install -r requirements.txt` and `playwright install chromium`."
        )
        _logger.warning("Adapter '%s' unavailable: %s", name, exc)
    except Exception as exc:  # noqa: BLE001
        LOAD_ERRORS[name] = f"{exc.__class__.__name__}: {exc}"
        _logger.warning("Adapter '%s' failed to load: %s", name, exc)


_try_register("woolworths", "adapters.woolworths", "WoolworthsAdapter")
_try_register("coles", "adapters.coles", "ColesAdapter")
_try_register("uber_eats", "adapters.uber_eats", "UberEatsAdapter")


__all__ = ["REGISTRY", "LOAD_ERRORS", "GroceryAdapter"]
