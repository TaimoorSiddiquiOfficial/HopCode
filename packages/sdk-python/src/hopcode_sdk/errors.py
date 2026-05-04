"""Error types for hopcode_sdk."""

from __future__ import annotations


class HopCodeSDKError(Exception):
    """Base error for all SDK failures."""


class ValidationError(HopCodeSDKError):
    """Raised when query options are invalid."""


class AbortError(HopCodeSDKError):
    """Raised when an operation is aborted by caller or transport."""


class ProcessExitError(HopCodeSDKError):
    """Raised when hopcode CLI exits with non-zero status or signal."""

    def __init__(self, message: str, exit_code: int | None = None) -> None:
        super().__init__(message)
        self.exit_code = exit_code


class ControlRequestTimeoutError(HopCodeSDKError):
    """Raised when a control request times out waiting for response."""


# Backward-compatibility alias
QwenSDKError = HopCodeSDKError
