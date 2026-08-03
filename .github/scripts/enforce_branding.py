#!/usr/bin/env python3
"""Apply and validate HopCode/IZN white-label rules."""
from __future__ import annotations

import argparse
import fnmatch
import json
import os
import re
import subprocess
import sys
from pathlib import Path

CONFIG = Path('.github/branding/branding-rules.json')


def git(*args: str) -> bytes:
    return subprocess.check_output(['git', *args])

