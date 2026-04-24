/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */

import type {
  SlashCommand,
  CommandContext,
  SlashCommandActionReturn,
} from './types.js';
import { CommandKind } from './types.js';
import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Python MCP Server Generator Command
 *
 * Generates a complete Python MCP (Model Context Protocol) server from a description.
 * Creates:
 * - Server implementation with tools
 * - Tool definitions and handlers
 * - Configuration files (pyproject.toml, .env.example)
 * - Tests with pytest
 * - README with usage instructions
 * - Docker support (optional)
 */
export const pythonMcpServerCommand: SlashCommand = {
  name: 'python-mcp-server',
  description: 'Generate a Python MCP server from a description',
  kind: CommandKind.BUILT_IN,
  action: async (
    context: CommandContext,
    args: string,
  ): Promise<SlashCommandActionReturn> => {
    try {
      if (!args.trim()) {
        return {
          type: 'message',
          messageType: 'info',
          content: generateUsageGuide(),
        };
      }

      const description = args.trim();
      const projectName = extractProjectName(description);
      const outputDir = join(process.cwd(), projectName);

      // Generate the MCP server
      const generatedFiles = await generatePythonMcpServer(
        projectName,
        description,
        outputDir,
      );

      return {
        type: 'message',
        messageType: 'info',
        content: generateSuccessReport(projectName, outputDir, generatedFiles),
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      return {
        type: 'message',
        messageType: 'error',
        content: `# ❌ Python MCP Server Generation Failed

**Error**: ${errorMessage}

## Troubleshooting

1. Ensure the directory is writable
2. Check disk space
3. Verify Python is installed (run \`python --version\`)

Run: \`hopcode /python-mcp-server <description>\` after fixing issues.

**Example**:
\`\`\`
hopcode /python-mcp-server Create an MCP server for interacting with the GitHub API
\`\`\``,
      };
    }
  },
};

/**
 * Generated file information
 */
interface GeneratedFile {
  path: string;
  description: string;
  content: string;
}

/**
 * Extract project name from description
 */
function extractProjectName(description: string): string {
  // Try to extract a name from the description
  const match = description.match(
    /(?:create|build|make|generate)\s+(?:an?|a)?\s*(?:MCP\s+)?(?:server\s+)?(?:for\s+)?(.+?)(?:\s|$|\.)/i,
  );
  if (match && match[1]) {
    const name = match[1]
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 50);
    return name ? `mcp-${name}` : 'mcp-server';
  }
  return 'mcp-server';
}

/**
 * Generate Python MCP server
 */
async function generatePythonMcpServer(
  projectName: string,
  _description: string,
  outputDir: string,
): Promise<GeneratedFile[]> {
  const generatedFiles: GeneratedFile[] = [];

  // Create output directory
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  // Generate server implementation
  const serverCode = generateServerCode(projectName, _description);
  const serverPath = join(outputDir, 'server.py');
  writeFileSync(serverPath, serverCode, 'utf-8');
  generatedFiles.push({
    path: 'server.py',
    description: 'Main MCP server implementation',
    content: serverCode,
  });

  // Generate tools module
  const toolsCode = generateToolsModule(projectName, _description);
  const toolsPath = join(outputDir, 'tools.py');
  writeFileSync(toolsPath, toolsCode, 'utf-8');
  generatedFiles.push({
    path: 'tools.py',
    description: 'Tool definitions and handlers',
    content: toolsCode,
  });

  // Generate pyproject.toml
  const pyprojectContent = generatePyproject(projectName);
  const pyprojectPath = join(outputDir, 'pyproject.toml');
  writeFileSync(pyprojectPath, pyprojectContent, 'utf-8');
  generatedFiles.push({
    path: 'pyproject.toml',
    description: 'Python project configuration and dependencies',
    content: pyprojectContent,
  });

  // Generate .env.example
  const envExampleContent = generateEnvExample(_description);
  const envExamplePath = join(outputDir, '.env.example');
  writeFileSync(envExamplePath, envExampleContent, 'utf-8');
  generatedFiles.push({
    path: '.env.example',
    description: 'Environment variables template',
    content: envExampleContent,
  });

  // Generate README
  const readmeContent = generateReadme(projectName, _description);
  const readmePath = join(outputDir, 'README.md');
  writeFileSync(readmePath, readmeContent, 'utf-8');
  generatedFiles.push({
    path: 'README.md',
    description: 'Project documentation and usage instructions',
    content: readmeContent,
  });

  // Generate tests
  const testContent = generateTests(projectName, _description);
  const testPath = join(outputDir, 'test_server.py');
  writeFileSync(testPath, testContent, 'utf-8');
  generatedFiles.push({
    path: 'test_server.py',
    description: 'Pytest test suite',
    content: testContent,
  });

  // Generate Dockerfile
  const dockerfileContent = generateDockerfile(projectName);
  const dockerfilePath = join(outputDir, 'Dockerfile');
  writeFileSync(dockerfilePath, dockerfileContent, 'utf-8');
  generatedFiles.push({
    path: 'Dockerfile',
    description: 'Docker container configuration',
    content: dockerfileContent,
  });

  // Generate .gitignore
  const gitignoreContent = generateGitignore();
  const gitignorePath = join(outputDir, '.gitignore');
  writeFileSync(gitignorePath, gitignoreContent, 'utf-8');
  generatedFiles.push({
    path: '.gitignore',
    description: 'Git ignore patterns',
    content: gitignoreContent,
  });

  return generatedFiles;
}

/**
 * Generate main server code
 */
function generateServerCode(projectName: string, description: string): string {
  return `#!/usr/bin/env python3
"""
${projectName} - MCP Server

${description}

Generated by HopCode CLI
"""

import asyncio
import os
import sys
from typing import Any

from mcp.server import Server
from mcp.server.stdio import stdio_server
from mcp.types import Tool, TextContent

from tools import create_tools


# Initialize the MCP server
app = Server("${projectName}")

# Create tools from description
TOOLS = create_tools(description="${description}")


@app.list_tools()
async def list_tools() -> list[Tool]:
    """List all available tools."""
    return TOOLS


@app.call_tool()
async def call_tool(name: str, arguments: dict[str, Any]) -> list[TextContent]:
    """Call a tool by name with arguments."""
    # Import tool handlers dynamically
    from tools import TOOL_HANDLERS
    
    if name not in TOOL_HANDLERS:
        raise ValueError(f"Unknown tool: {name}")
    
    handler = TOOL_HANDLERS[name]
    result = await handler(arguments)
    
    return [TextContent(type="text", text=str(result))]


async def main():
    """Run the MCP server."""
    async with stdio_server() as (read_stream, write_stream):
        await app.run(
            read_stream,
            write_stream,
            app.create_initialization_options()
        )


if __name__ == "__main__":
    asyncio.run(main())
`;
}

/**
 * Generate tools module
 */
function generateToolsModule(
  projectName: string,
  _description: string,
): string {
  return `"""
Tool definitions and handlers for ${projectName}

Generated by HopCode CLI
"""

from typing import Any, Callable
from mcp.types import Tool


def create_tools(description: str = "") -> list[Tool]:
    """
    Create tool definitions based on the server description.
    
    This function should be customized based on the specific functionality
    you want to expose through the MCP server.
    """
    tools = [
        Tool(
            name="query",
            description="Query the system for information",
            inputSchema={
                "type": "object",
                "properties": {
                    "query": {
                        "type": "string",
                        "description": "The query string"
                    }
                },
                "required": ["query"]
            }
        ),
        Tool(
            name="execute",
            description="Execute an operation",
            inputSchema={
                "type": "object",
                "properties": {
                    "action": {
                        "type": "string",
                        "description": "The action to execute"
                    },
                    "parameters": {
                        "type": "object",
                        "description": "Action parameters"
                    }
                },
                "required": ["action"]
            }
        ),
        Tool(
            name="list_resources",
            description="List available resources",
            inputSchema={
                "type": "object",
                "properties": {
                    "limit": {
                        "type": "integer",
                        "description": "Maximum number of resources to return",
                        "default": 10
                    },
                    "offset": {
                        "type": "integer",
                        "description": "Pagination offset",
                        "default": 0
                    }
                }
            }
        )
    ]
    
    return tools


# Tool handlers registry
TOOL_HANDLERS: dict[str, Callable] = {}


async def handle_query(arguments: dict[str, Any]) -> str:
    """Handle query tool execution."""
    query = arguments.get("query", "")
    
    # TODO: Implement actual query logic
    # This is a placeholder that should be replaced with real functionality
    
    return f"Query result for: {query}"


async def handle_execute(arguments: dict[str, Any]) -> str:
    """Handle execute tool execution."""
    action = arguments.get("action", "")
    parameters = arguments.get("parameters", {})
    
    # TODO: Implement actual execution logic
    # This is a placeholder that should be replaced with real functionality
    
    return f"Executed action: {action} with parameters: {parameters}"


async def handle_list_resources(arguments: dict[str, Any]) -> str:
    """Handle list_resources tool execution."""
    limit = arguments.get("limit", 10)
    offset = arguments.get("offset", 0)
    
    # TODO: Implement actual resource listing logic
    # This is a placeholder that should be replaced with real functionality
    
    resources = []
    for i in range(offset, min(offset + limit, 100)):
        resources.append(f"Resource {i}")
    
    return f"Resources ({len(resources)} items):\\n" + "\\n".join(resources)


# Register handlers
TOOL_HANDLERS["query"] = handle_query
TOOL_HANDLERS["execute"] = handle_execute
TOOL_HANDLERS["list_resources"] = handle_list_resources
`;
}

/**
 * Generate pyproject.toml
 */
function generatePyproject(projectName: string): string {
  return `[build-system]
requires = ["hatchling"]
build-backend = "hatchling.build"

[project]
name = "${projectName}"
version = "0.1.0"
description = "MCP Server generated by HopCode CLI"
readme = "README.md"
license = "MIT"
requires-python = ">=3.10"
authors = [
    { name = "Generated by HopCode", email = "user@example.com" }
]
classifiers = [
    "Development Status :: 3 - Alpha",
    "Intended Audience :: Developers",
    "License :: OSI Approved :: MIT License",
    "Programming Language :: Python :: 3",
    "Programming Language :: Python :: 3.10",
    "Programming Language :: Python :: 3.11",
    "Programming Language :: Python :: 3.12",
]
dependencies = [
    "mcp>=1.0.0",
    "python-dotenv>=1.0.0",
]

[project.optional-dependencies]
dev = [
    "pytest>=7.0.0",
    "pytest-asyncio>=0.21.0",
    "pytest-cov>=4.0.0",
    "black>=23.0.0",
    "ruff>=0.1.0",
    "mypy>=1.0.0",
]

[project.scripts]
${projectName.replace(/-/g, '_')} = "${projectName}.server:main"

[tool.hatch.build.targets.wheel]
packages = ["."]

[tool.black]
line-length = 88
target-version = ["py310"]

[tool.ruff]
line-length = 88
target-version = "py310"
select = ["E", "F", "W", "I", "N", "UP", "YTT", "B", "C4", "SIM"]

[tool.mypy]
python_version = "3.10"
warn_return_any = true
warn_unused_configs = true
disallow_untyped_defs = false

[tool.pytest.ini_options]
asyncio_mode = "auto"
testpaths = ["."]
python_files = "test_*.py"
`;
}

/**
 * Generate .env.example
 */
function generateEnvExample(_description: string): string {
  return `# MCP Server Environment Configuration
# Copy this file to .env and fill in your values

# Server Configuration
MCP_SERVER_NAME=mcp-server
MCP_LOG_LEVEL=info

# API Configuration (if applicable)
# API_KEY=your_api_key_here
# API_BASE_URL=https://api.example.com

# Database Configuration (if applicable)
# DATABASE_URL=postgresql://user:password@localhost:5432/dbname

# Redis Configuration (if applicable)
# REDIS_URL=redis://localhost:6379/0

# Feature Flags
# ENABLE_DEBUG=false
# ENABLE_METRICS=true
`;
}

/**
 * Generate README
 */
function generateReadme(projectName: string, description: string): string {
  return `# ${projectName}

${description}

Generated by [HopCode CLI](https://github.com/hoptrendy/hopcode-cli)

## Features

- MCP (Model Context Protocol) server implementation
- Tool-based architecture with extensible handlers
- Async/await support for high performance
- Docker support for containerized deployment
- Comprehensive test suite with pytest

## Prerequisites

- Python 3.10 or higher
- pip or uv package manager
- (Optional) Docker for containerized deployment

## Installation

### Option 1: Using pip

\`\`\`bash
# Clone or navigate to the project directory
cd ${projectName}

# Create a virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\\Scripts\\activate

# Install dependencies
pip install -e ".[dev]"
\`\`\`

### Option 2: Using uv (recommended)

\`\`\`bash
# Install uv if you haven't already
curl -LsSf https://astral.sh/uv/install.sh | sh

# Create a virtual environment and install
uv venv
source .venv/bin/activate
uv pip install -e ".[dev]"
\`\`\`

## Usage

### Running the Server

\`\`\`bash
# Run directly with Python
python server.py

# Or use the installed command
${projectName.replace(/-/g, '_')}

# With environment variables
export MCP_LOG_LEVEL=debug
python server.py
\`\`\`

### Running Tests

\`\`\`bash
# Run all tests
pytest

# Run with coverage
pytest --cov=. --cov-report=html

# Run specific test file
pytest test_server.py -v
\`\`\`

### Code Quality

\`\`\`bash
# Format code
black .

# Lint code
ruff check .

# Type checking
mypy .
\`\`\`

## Docker Support

### Build Docker Image

\`\`\`bash
docker build -t ${projectName} .
\`\`\`

### Run Docker Container

\`\`\`bash
docker run -it ${projectName}
\`\`\`

### Docker Compose (if applicable)

\`\`\`bash
docker-compose up -d
\`\`\`

## Configuration

Copy \`.env.example\` to \`.env\` and configure:

\`\`\`bash
cp .env.example .env
\`\`\`

Edit \`.env\` with your configuration values.

## Development

### Project Structure

\`\`\`
${projectName}/
├── server.py          # Main server implementation
├── tools.py           # Tool definitions and handlers
├── test_server.py     # Test suite
├── pyproject.toml     # Project configuration
├── .env.example       # Environment variables template
├── Dockerfile         # Docker configuration
└── README.md          # This file
\`\`\`

### Adding New Tools

1. Define the tool in \`tools.py\` \`create_tools()\` function
2. Implement the handler function
3. Register the handler in \`TOOL_HANDLERS\` dictionary

Example:

\`\`\`python
# In tools.py

# Add tool definition
tools.append(
    Tool(
        name="my_new_tool",
        description="Does something useful",
        inputSchema={...}
    )
)

# Implement handler
async def handle_my_new_tool(arguments: dict[str, Any]) -> str:
    # Your implementation here
    return "Result"

# Register handler
TOOL_HANDLERS["my_new_tool"] = handle_my_new_tool
\`\`\`

## Troubleshooting

### Common Issues

**ImportError: No module named 'mcp'**
- Ensure dependencies are installed: \`pip install -e ".[dev]"\`

**Server not starting**
- Check Python version: \`python --version\` (must be 3.10+)
- Verify virtual environment is activated

**Tests failing**
- Install dev dependencies: \`pip install -e ".[dev]"\`
- Run tests with verbose output: \`pytest -v\`

## License

MIT License - see LICENSE file for details

## Credits

Generated by [HopCode CLI](https://github.com/hoptrendy/hopcode-cli)

For more information about MCP, see the [MCP Specification](https://modelcontextprotocol.io/).
`;
}

/**
 * Generate test file
 */
function generateTests(projectName: string, _description: string): string {
  return `"""
Test suite for ${projectName}

Generated by HopCode CLI
"""

import pytest
import asyncio
from unittest.mock import AsyncMock, patch

from tools import create_tools, TOOL_HANDLERS, handle_query, handle_execute, handle_list_resources


class TestTools:
    """Test tool definitions."""

    def test_create_tools_returns_list(self):
        """Test that create_tools returns a list."""
        tools = create_tools()
        assert isinstance(tools, list)
        assert len(tools) > 0

    def test_create_tools_returns_tool_objects(self):
        """Test that create_tools returns Tool objects."""
        tools = create_tools()
        for tool in tools:
            assert hasattr(tool, 'name')
            assert hasattr(tool, 'description')
            assert hasattr(tool, 'inputSchema')

    def test_tools_have_required_properties(self):
        """Test that tools have required properties."""
        tools = create_tools()
        for tool in tools:
            assert tool.name is not None
            assert tool.description is not None
            assert isinstance(tool.inputSchema, dict)

    def test_tool_names_are_unique(self):
        """Test that tool names are unique."""
        tools = create_tools()
        names = [tool.name for tool in tools]
        assert len(names) == len(set(names))


class TestToolHandlers:
    """Test tool handlers."""

    @pytest.mark.asyncio
    async def test_handle_query(self):
        """Test query handler."""
        result = await handle_query({"query": "test query"})
        assert isinstance(result, str)
        assert "test query" in result

    @pytest.mark.asyncio
    async def test_handle_execute(self):
        """Test execute handler."""
        result = await handle_execute({"action": "test_action", "parameters": {"key": "value"}})
        assert isinstance(result, str)
        assert "test_action" in result

    @pytest.mark.asyncio
    async def test_handle_list_resources(self):
        """Test list_resources handler."""
        result = await handle_list_resources({"limit": 5, "offset": 0})
        assert isinstance(result, str)
        assert "Resources" in result
        assert "5" in result or "items" in result.lower()

    @pytest.mark.asyncio
    async def test_handle_list_resources_default_limit(self):
        """Test list_resources handler with default limit."""
        result = await handle_list_resources({})
        assert isinstance(result, str)

    def test_tool_handlers_registry(self):
        """Test that TOOL_HANDLERS contains all handlers."""
        assert isinstance(TOOL_HANDLERS, dict)
        assert "query" in TOOL_HANDLERS
        assert "execute" in TOOL_HANDLERS
        assert "list_resources" in TOOL_HANDLERS

    def test_handlers_are_callable(self):
        """Test that all handlers are callable."""
        for name, handler in TOOL_HANDLERS.items():
            assert callable(handler), f"Handler {name} is not callable"


class TestServerIntegration:
    """Test server integration."""

    @pytest.mark.asyncio
    async def test_server_initialization(self):
        """Test server can be initialized."""
        from server import app, TOOLS
        
        assert app is not None
        assert TOOLS is not None
        assert len(TOOLS) > 0

    @pytest.mark.asyncio
    async def test_list_tools_endpoint(self):
        """Test list_tools endpoint."""
        from server import list_tools
        
        tools = await list_tools()
        assert isinstance(tools, list)
        assert len(tools) > 0

    @pytest.mark.asyncio
    async def test_call_tool_endpoint(self):
        """Test call_tool endpoint."""
        from server import call_tool
        
        result = await call_tool("query", {"query": "test"})
        assert isinstance(result, list)
        assert len(result) > 0


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
`;
}

/**
 * Generate Dockerfile
 */
function generateDockerfile(_projectName: string): string {
  return `# Use Python 3.11 slim image
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \\
    PYTHONUNBUFFERED=1 \\
    PIP_NO_CACHE_DIR=1 \\
    PIP_DISABLE_PIP_VERSION_CHECK=1

# Install uv package manager (faster than pip)
COPY --from=ghcr.io/astral-sh/uv:latest /uv /usr/local/bin/uv

# Copy project files
COPY pyproject.toml .
COPY server.py .
COPY tools.py .

# Install dependencies
RUN uv pip install --system -e ".[dev]"

# Create non-root user for security
RUN useradd --create-home --shell /bin/bash appuser \\
    && chown -R appuser:appuser /app
USER appuser

# Expose port if needed (adjust based on your server configuration)
# EXPOSE 8080

# Health check
# HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \\
#     CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8080/health')"

# Run the server
CMD ["python", "server.py"]
`;
}

/**
 * Generate .gitignore
 */
function generateGitignore(): string {
  return `# Byte-compiled / optimized / DLL files
__pycache__/
*.py[cod]
*$py.class

# C extensions
*.so

# Distribution / packaging
.Python
build/
develop-eggs/
dist/
downloads/
eggs/
.eggs/
lib/
lib64/
parts/
sdist/
var/
wheels/
*.egg-info/
.installed.cfg
*.egg

# PyInstaller
*.manifest
*.spec

# Installer logs
pip-log.txt
pip-delete-this-directory.txt

# Unit test / coverage reports
htmlcov/
.tox/
.nox/
.coverage
.coverage.*
.cache
nosetests.xml
coverage.xml
*.cover
*.py,cover
.hypothesis/
.pytest_cache/

# Translations
*.mo
*.pot

# Environments
.env
.venv
env/
venv/
ENV/
env.bak/
venv.bak/

# IDE
.idea/
.vscode/
*.swp
*.swo
*~

# Jupyter Notebook
.ipynb_checkpoints

# pyenv
.python-version

# mypy
.mypy_cache/
.dmypy.json
dmypy.json

# Pyre type checker
.pyre/

# OS
.DS_Store
Thumbs.db
`;
}

/**
 * Generate usage guide
 */
function generateUsageGuide(): string {
  return `# Python MCP Server Generator

Generate a complete Python MCP (Model Context Protocol) server from a natural language description.

## Usage

\`\`\`
hopcode /python-mcp-server <description>
\`\`\`

## Examples

\`\`\`bash
# Generate a GitHub API MCP server
hopcode /python-mcp-server Create an MCP server for interacting with the GitHub API

# Generate a database MCP server
hopcode /python-mcp-server Build an MCP server that queries PostgreSQL databases

# Generate a file system MCP server
hopcode /python-mcp-server Make an MCP server for file system operations like read, write, and search
\`\`\`

## What Gets Generated

The generator creates a complete Python MCP server with:

- **server.py** - Main MCP server implementation
- **tools.py** - Tool definitions and handlers
- **pyproject.toml** - Project configuration and dependencies
- **.env.example** - Environment variables template
- **README.md** - Documentation and usage instructions
- **test_server.py** - Pytest test suite
- **Dockerfile** - Docker container configuration
- **.gitignore** - Git ignore patterns

## Next Steps

1. Navigate to the generated directory
2. Copy \`.env.example\` to \`.env\` and configure
3. Install dependencies: \`pip install -e ".[dev]"\`
4. Run the server: \`python server.py\`
5. Run tests: \`pytest\`

## Customization

After generation, customize the \`tools.py\` file to implement your specific functionality:

1. Add new tool definitions in \`create_tools()\`
2. Implement handler functions
3. Register handlers in \`TOOL_HANDLERS\` dictionary

See the generated README.md for detailed instructions.
`;
}

/**
 * Generate success report
 */
function generateSuccessReport(
  projectName: string,
  outputDir: string,
  generatedFiles: GeneratedFile[],
): string {
  const filesList = generatedFiles
    .map((f) => `- **${f.path}** - ${f.description}`)
    .join('\n');

  return `# ✅ Python MCP Server Generated Successfully

**Project Name**: \`${projectName}\`
**Output Directory**: \`${outputDir}\`

## Generated Files

${filesList}

## Next Steps

### 1. Navigate to Project

\`\`\`bash
cd "${outputDir}"
\`\`\`

### 2. Configure Environment

\`\`\`bash
cp .env.example .env
# Edit .env with your configuration
\`\`\`

### 3. Install Dependencies

\`\`\`bash
# Using pip
python -m venv venv
source venv/bin/activate  # Windows: venv\\Scripts\\activate
pip install -e ".[dev]"

# Or using uv (recommended)
uv venv
source .venv/bin/activate
uv pip install -e ".[dev]"
\`\`\`

### 4. Run the Server

\`\`\`bash
python server.py
\`\`\`

### 5. Run Tests

\`\`\`bash
pytest
\`\`\`

### 6. Build Docker Image (Optional)

\`\`\`bash
docker build -t ${projectName} .
\`\`\`

## Customization

Edit \`tools.py\` to implement your specific functionality:

1. Add tool definitions in \`create_tools()\` function
2. Implement handler functions for each tool
3. Register handlers in \`TOOL_HANDLERS\` dictionary

See the generated \`README.md\` for detailed documentation.

---

**Tip**: Use \`/python-mcp-server\` again to generate another MCP server with different functionality.
`;
}
