"""One-shot rebrand of .github/workflows/*.yml functional identifiers.

Applies the literal replacements specified by the rebrand task. Protects the
external action reference QwenLM/qwen-code-action@SHA so it is never altered.
"""

import pathlib
import sys

WF = pathlib.Path(r"D:\HopCode\.github\workflows")

# (old, new) literal replacements, applied in order.
# Longer/more-specific patterns first so they win over shorter substrings.
REPLACEMENTS = [
    # Command-trigger tokens (at-sign + space, and at-sign + bracket for grep
    # character classes). Leaves the npm scope '@qwen-code' (quote-delimited)
    # untouched.
    ("@qwen-code[", "@hopcode["),
    ("@qwen-code /", "@hopcode /"),
    # Bot identities (disjoint substrings; order-safe).
    ("qwen-code-dev-bot", "hopcode-dev-bot"),
    ("qwen-code-ci-bot", "hopcode-ci-bot"),
    ("qwen-code-bot", "hopcode-bot"),
    # Comment / marker tokens.
    ("qwen-review-ack", "hopcode-review-ack"),
    ("qwen-pr-precheck:manual-required", "hopcode-pr-precheck:manual-required"),
    # Env vars / image / runner labels.
    ("QWEN_SANDBOX_IMAGE", "HOPCODE_SANDBOX_IMAGE"),
    ("QWEN_SKIP_PREPARE", "HOPCODE_SKIP_PREPARE"),
    ("QWEN_HOME", "HOPCODE_HOME"),
    ("ecs-qwen", "ecs-hopcode"),
]

ACTION_TOKEN = "QwenLM/qwen-code-action"
PLACEHOLDER = "\x00QWEN_CODE_ACTION\x00"


def rebrand(text: str) -> str:
    # Protect the external action ref so the QwenLM/qwen-code repo-check
    # replacement below cannot eat into "QwenLM/qwen-code-action@<sha>".
    text = text.replace(ACTION_TOKEN, PLACEHOLDER)
    for old, new in REPLACEMENTS:
        text = text.replace(old, new)
    # Repo check: every remaining "QwenLM/qwen-code" is now guaranteed NOT to be
    # the -action variant (those are placeholders), so a plain replace is safe.
    text = text.replace("QwenLM/qwen-code", "TaimoorSiddiquiOfficial/HopCode")
    text = text.replace(PLACEHOLDER, ACTION_TOKEN)
    return text


def main() -> int:
    changed = []
    for path in sorted(WF.glob("*.yml")):
        original = path.read_text(encoding="utf-8")
        updated = rebrand(original)
        if updated != original:
            path.write_text(updated, encoding="utf-8")
            changed.append(path.name)
    print(f"Changed {len(changed)} file(s):")
    for name in changed:
        print(f"  - {name}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
