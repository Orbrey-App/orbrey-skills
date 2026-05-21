"""Credential loading. Reads from environment variables only — never from files.

The skill's security posture forbids storing grocer credentials in any tracked
file. Each adapter declares the env-var name pair it needs and this helper
raises a clear error if they are unset.
"""

from __future__ import annotations

import os
from dataclasses import dataclass


class CredentialError(RuntimeError):
    """Raised when required credential env vars are not set."""


@dataclass(frozen=True)
class Credentials:
    user: str
    password: str


def load(adapter_name: str) -> Credentials:
    """Load credentials for a named adapter.

    Looks up `ORBREY_<UPPER>_USER` and `ORBREY_<UPPER>_PASS`. Raises
    `CredentialError` with a remediation hint if either is missing.
    """
    prefix = f"ORBREY_{adapter_name.upper()}"
    user_var = f"{prefix}_USER"
    pass_var = f"{prefix}_PASS"

    user = os.environ.get(user_var)
    password = os.environ.get(pass_var)

    if not user or not password:
        raise CredentialError(
            f"{adapter_name} credentials missing. Set {user_var} and {pass_var} in your shell."
        )

    return Credentials(user=user, password=password)
