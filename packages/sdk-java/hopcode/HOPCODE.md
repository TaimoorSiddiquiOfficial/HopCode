# HopCode Java SDK

## Project Overview

The HopCode Java SDK is a minimum experimental SDK for programmatic access to HopCode functionality. It provides a Java interface to interact with the HopCode CLI, allowing developers to integrate HopCode capabilities into their Java applications.

**Context Information:**

- Current Date: Monday 5 January 2026
- Operating System: darwin
- Working Directory: /Users/weigeng/repos/hopcode/packages/sdk-java

## Project Details

- **Group ID**: com.alibaba
- **Artifact ID**: qwencode-sdk (as per pom.xml)
- **Version**: 0.0.1-SNAPSHOT
- **Packaging**: JAR
- **Java Version**: 1.8+ (source and target)
- **License**: Apache-2.0

## Architecture

The SDK follows a layered architecture:

- **API Layer**: Provides the main entry points through `HopCodeCli` class (alias: `QwenCodeCli`) with simple static methods for basic usage
- **Session Layer**: Manages communication sessions with the HopCode CLI through the `Session` class
- **Transport Layer**: Handles the communication mechanism between the SDK and CLI process (currently using process transport via `ProcessTransport`)
- **Protocol Layer**: Defines data structures for communication based on the CLI protocol
- **Utils**: Common utilities for concurrent execution, timeout handling, and error management

## Key Components

### Main Classes

- `QwenCodeCli`: Main entry point with static methods for simple queries
- `Session`: Manages communication sessions with the CLI
- `Transport`: Abstracts the communication mechanism (currently using process transport)
- `ProcessTransport`: Implementation that communicates via process execution
- `TransportOptions`: Configuration class for transport layer settings
- `SessionEventSimpleConsumers`: High-level event handler for processing responses
- `AssistantContentSimpleConsumers`: Handles different types of content within assistant messages

### Dependencies

- **Logging**: ch.qos.logback:logback-classic
- **Utilities**: org.apache.commons:commons-lang3
- **JSON Processing**: com.alibaba.fastjson2:fastjson2
- **Testing**: JUnit 5 (org.junit.jupiter:junit-jupiter)

## Building and Running

### Prerequisites

- Java 8 or higher
- Apache Maven 3.6.0 or higher

### Build Commands

```bash
# Compile the project
mvn compile

# Run tests
mvn test

# Package the JAR
mvn package

# Install to local repository
mvn install
```

## FAQ / Troubleshooting

### Q: Do I need to install the HopCode CLI separately?

A: No, from v0.1.1, the CLI is bundled with the SDK, so no standalone CLI installation is needed.

### Q: What Java versions are supported?

A: The SDK requires Java 1.8 or higher.

## Maintainers

- **Developer**: skyfire (gengwei.gw(at)alibaba-inc.com)
- **Organization**: Alibaba Group
