# GitHub Copilot Skills Exploration

**Date**: 2026-04-24  
**Source**: https://awesome-copilot.github.com/skills/  
**Total Skills**: 308

---

## 🎯 Skills by Category

### AI & Agent Skills (26 skills)

| Skill                                      | Use Case                                            | Relevance to HopCode                     |
| ------------------------------------------ | --------------------------------------------------- | ---------------------------------------- |
| **Acquire Codebase Knowledge**             | Map, document, onboard into codebases               | ✅ Already have codebase-map skill       |
| **Agent Governance**                       | Add governance, safety, trust controls to AI agents | 🔥 **HIGH** - Building agentic systems   |
| **Agent Owasp Compliance**                 | Check AI agent codebases against OWASP Top 10       | 🔥 **HIGH** - Security for GitHub agents |
| **Agent Supply Chain**                     | Verify supply chain integrity for AI plugins        | ⚠️ Medium - Future consideration         |
| **Agentic Eval**                           | Evaluate and improve AI agent outputs               | 🔥 **HIGH** - Test GitHub subagents      |
| **Ai Prompt Engineering Safety Review**    | Analyze prompts for safety, bias, security          | ⚠️ Medium - Prompt quality               |
| **Autoresearch**                           | Autonomous iterative experimentation                | ⚠️ Low - Research tasks                  |
| **Create Agentsmd**                        | Generate AGENTS.md file                             | ✅ Already have                          |
| **Declarative Agents**                     | Microsoft 365 Copilot declarative agents            | ⚠️ Low - MS ecosystem                    |
| **Eval Driven Dev**                        | Setup eval-based QA for LLM apps                    | 🔥 **HIGH** - Test quality               |
| **Foundry Agent Sync**                     | Create/sync agents in Azure AI Foundry              | ⚠️ Low - Azure specific                  |
| **Mcp Copilot Studio Server Generator**    | Generate MCP servers for Copilot Studio             | 🔥 **HIGH** - Already have MCP           |
| **Mcp Security Audit**                     | Audit MCP server configs for security               | 🔥 **CRITICAL** - Security audit needed  |
| **Structured Autonomy Generate/Implement** | Structured autonomy implementation                  | ⚠️ Medium - Agent architecture           |

**Priority Actions:**

1. ✅ **Mcp Security Audit** - Audit our MCP servers
2. ✅ **Agent Owasp Compliance** - Security scan GitHub agents
3. ✅ **Agentic Eval** - Add eval framework for subagents
4. ✅ **Agent Governance** - Add governance controls

---

### Azure & Cloud Skills (26 skills)

| Skill                                  | Use Case                                  | Relevance                                 |
| -------------------------------------- | ----------------------------------------- | ----------------------------------------- |
| **Appinsights Instrumentation**        | Instrument webapps with App Insights      | ✅ Already have skill                     |
| **Azure Architecture Autopilot**       | Design Azure infra with natural language  | ⚠️ Low                                    |
| **Azure Deployment Preflight**         | Preflight validation of Bicep deployments | ✅ Already have azure-validate            |
| **Azure Devops Cli**                   | Manage Azure DevOps via CLI               | ⚠️ Low                                    |
| **Azure Resource Visualizer**          | Generate Mermaid architecture diagrams    | ✅ Already have azure-resource-visualizer |
| **Microsoft Code Reference**           | Look up Microsoft API references          | ⚠️ Medium                                 |
| **Microsoft Docs**                     | Query official Microsoft docs             | ✅ Already have                           |
| **Power Platform Architect**           | Power Platform solution architecture      | ⚠️ Low                                    |
| **Power Platform Mcp Connector Suite** | Power Platform custom connector with MCP  | ⚠️ Medium                                 |

**Already Implemented:** 9/26 Azure skills in HopCode

---

### Testing & Quality Skills (40 skills)

| Skill                       | Use Case                               | Relevance                            |
| --------------------------- | -------------------------------------- | ------------------------------------ |
| **Bigquery Pipeline Audit** | Audit Python + BigQuery pipelines      | ⚠️ Low                               |
| **Breakdown Test**          | Generate comprehensive test strategies | 🔥 **HIGH** - Test planning          |
| **Doublecheck**             | Three-layer verification pipeline      | 🔥 **HIGH** - Output validation      |
| **Phoenix Evals**           | Build/run evaluators for AI apps       | 🔥 **HIGH** - LLM evals              |
| **Polyglot Test Agent**     | Generate unit tests for any language   | 🔥 **HIGH** - Multi-language testing |
| **Quality Playbook**        | Generate quality artifacts             | 🔥 **HIGH** - Quality standards      |
| **Scoutqa Test**            | Automated QA for web apps              | ⚠️ Medium                            |

**Priority Actions:**

1. ✅ **Breakdown Test** - Add test strategy generation
2. ✅ **Doublecheck** - Add verification layer
3. ✅ **Phoenix Evals** - Integrate LLM evaluation

---

### Documentation & Planning Skills (47 skills)

| Skill                                | Use Case                              | Relevance                          |
| ------------------------------------ | ------------------------------------- | ---------------------------------- |
| **Add Educational Comments**         | Add educational comments to files     | ⚠️ Medium                          |
| **Architecture Blueprint Generator** | Create architectural documentation    | ✅ Similar to codebase-map         |
| **Breakdown Epic/Feature/Plan**      | Create technical plans from PRDs      | 🔥 **HIGH** - Planning             |
| **Code Tour**                        | Create CodeTour .tour files           | ⚠️ Medium                          |
| **Conventional Commit**              | Generate conventional commit messages | ✅ Already have git-workflow       |
| **Create Llms**                      | Create llms.txt files                 | 🔥 **HIGH** - LLM context          |
| **Create Specification**             | Create spec files for AI consumption  | 🔥 **HIGH** - Spec-driven dev      |
| **Create Technical Spike**           | Create time-boxed research docs       | ⚠️ Medium                          |
| **Documentation Writer**             | Diátaxis documentation expert         | 🔥 **HIGH** - Docs quality         |
| **Meeting Minutes**                  | Generate meeting minutes              | ⚠️ Low                             |
| **Prd**                              | Generate PRDs                         | 🔥 **HIGH** - Product requirements |

**Priority Actions:**

1. ✅ **Create Llms** - Add llms.txt generation
2. ✅ **Create Specification** - Enhance spec-driven skill
3. ✅ **Documentation Writer** - Improve docs quality

---

### Development & Coding Skills (52 skills)

| Skill                                 | Use Case                       | Relevance                        |
| ------------------------------------- | ------------------------------ | -------------------------------- |
| **Aspnet Minimal Api Openapi**        | Create ASP.NET Minimal APIs    | ⚠️ Low - .NET specific           |
| **Csharp Mcp Server Generator**       | Generate MCP servers in C#     | 🔥 **HIGH** - MCP expansion      |
| **Go Mcp Server Generator**           | Generate MCP servers in Go     | 🔥 **HIGH** - MCP expansion      |
| **Java Mcp Server Generator**         | Generate MCP servers in Java   | 🔥 **HIGH** - MCP expansion      |
| **Kotlin Mcp Server Generator**       | Generate MCP servers in Kotlin | 🔥 **HIGH** - MCP expansion      |
| **Python Mcp Server Generator**       | Generate MCP servers in Python | 🔥 **CRITICAL** - Most requested |
| **Review And Refactor**               | Review and refactor code       | ✅ Already have review skill     |
| **Refactor Method Complexity Reduce** | Reduce cognitive complexity    | ✅ Already have                  |
| **Multi Stage Dockerfile**            | Create optimized Dockerfiles   | 🔥 **HIGH** - Containerization   |

**Priority Actions:**

1. ✅ **Python Mcp Server Generator** - Build Python MCP generator
2. ✅ **Multi-language MCP Generators** - Expand beyond JS/TS
3. ✅ **Multi Stage Dockerfile** - Add Dockerfile optimization

---

### CLI & Tool Skills (16 skills)

| Skill                      | Use Case                                          | Relevance                        |
| -------------------------- | ------------------------------------------------- | -------------------------------- |
| **Boost Prompt**           | Interactive prompt refinement                     | 🔥 **HIGH** - Prompt improvement |
| **Cli Mastery**            | Interactive CLI training                          | ⚠️ Medium - Training             |
| **Copilot Cli Quickstart** | Learn Copilot CLI                                 | ⚠️ Medium - Onboarding           |
| **First Ask**              | Interactive task refinement                       | 🔥 **HIGH** - Task clarification |
| **Gh Cli**                 | GitHub CLI reference                              | ✅ Already have                  |
| **Git Commit**             | Execute git commit with conventional messages     | ✅ Already have git-workflow     |
| **Lsp Setup**              | Install/configure LSP servers                     | 🔥 **HIGH** - Code intelligence  |
| **Mcp Cli**                | Interface for MCP servers via CLI                 | 🔥 **CRITICAL** - MCP management |
| **Napkin**                 | Visual whiteboard collaboration                   | ⚠️ Medium - Visual collaboration |
| **Noob Mode**              | Plain-English translation for non-technical users | 🔥 **HIGH** - Accessibility      |

**Priority Actions:**

1. ✅ **Mcp Cli** - Build MCP management CLI
2. ✅ **Lsp Setup** - Add LSP configuration skill
3. ✅ **Boost Prompt** - Add prompt refinement
4. ✅ **First Ask** - Add task clarification

---

### Diagram & Visualization Skills (6 skills)

| Skill                            | Use Case                         | Relevance                           |
| -------------------------------- | -------------------------------- | ----------------------------------- |
| **Draw Io Diagram Generator**    | Create draw.io diagram files     | 🔥 **HIGH** - Architecture diagrams |
| **Excalidraw Diagram Generator** | Generate Excalidraw diagrams     | 🔥 **HIGH** - Whiteboarding         |
| **Plantuml Ascii**               | Generate ASCII PlantUML diagrams | ⚠️ Medium                           |
| **Power Bi Report Design**       | Power BI report visualization    | ⚠️ Low                              |

**Priority Actions:**

1. ✅ **Draw Io Diagram Generator** - Add draw.io support
2. ✅ **Excalidraw Diagram Generator** - Add Excalidraw support

---

### GitHub & Repository Skills (14 skills)

| Skill                                        | Use Case                                   | Relevance                         |
| -------------------------------------------- | ------------------------------------------ | --------------------------------- |
| **Codeql**                                   | Setup CodeQL code scanning                 | 🔥 **HIGH** - Security scanning   |
| **Copilot Instructions Blueprint Generator** | Generate copilot-instructions.md           | ✅ Already have                   |
| **Copilot Sdk**                              | Build agentic apps with Copilot SDK        | 🔥 **HIGH** - Copilot integration |
| **Copilot Spaces**                           | Project-specific context for conversations | 🔥 **HIGH** - Context management  |
| **Copilot Usage Metrics**                    | Retrieve Copilot usage metrics             | ⚠️ Medium - Analytics             |
| **Dependabot**                               | Configure Dependabot                       | ✅ Already have                   |
| **Github Issues**                            | Create/update/manage GitHub issues         | ✅ Already have github-agents     |
| **Make Repo Contribution**                   | Ensure code follows repo guidance          | ✅ Already have review            |
| **Make Skill Template**                      | Create new Agent Skills from prompts       | 🔥 **CRITICAL** - Skill creation  |
| **Roundup**                                  | Generate personalized status briefings     | ⚠️ Medium - Productivity          |
| **Secret Scanning**                          | Configure GitHub secret scanning           | 🔥 **HIGH** - Security            |

**Priority Actions:**

1. ✅ **Make Skill Template** - Build skill generator
2. ✅ **Codeql** - Add CodeQL setup skill
3. ✅ **Secret Scanning** - Add secret scanning config

---

### Data & Analytics Skills (19 skills)

| Skill                            | Use Case                       | Relevance                           |
| -------------------------------- | ------------------------------ | ----------------------------------- |
| **Power Bi Dax Optimization**    | Optimize Power BI DAX formulas | ⚠️ Low                              |
| **Power Bi Model Design Review** | Evaluate Power BI data models  | ⚠️ Low                              |
| **Qdrant \*** (9 skills)         | Qdrant vector DB operations    | 🔥 **HIGH** - Vector search for RAG |

**Priority Actions:**

1. ✅ **Qdrant skills** - Add vector DB support for RAG

---

### Linux & System Skills (4 skills)

| Skill                                | Use Case                              | Relevance      |
| ------------------------------------ | ------------------------------------- | -------------- |
| **Arch/CentOS/Debian/Fedora Triage** | Linux distro-specific troubleshooting | ⚠️ Low - Niche |

---

### Go-To-Market & Business Skills (10 skills)

| Skill                        | Use Case                               | Relevance                         |
| ---------------------------- | -------------------------------------- | --------------------------------- |
| **Gtm 0 To 1 Launch**        | Launch products from idea to customers | 🔥 **HIGH** - Product launches    |
| **Gtm Ai Gtm**               | Go-to-market for AI products           | 🔥 **HIGH** - AI product strategy |
| **Gtm Positioning Strategy** | Find defensible market position        | 🔥 **HIGH** - Market positioning  |
| **Gtm Product Led Growth**   | Build self-serve acquisition           | 🔥 **HIGH** - Growth strategy     |

**Priority Actions:**

1. ✅ **Gtm Ai Gtm** - AI product GTM strategy

---

### Security & Compliance Skills (3 skills)

| Skill                       | Use Case                         | Relevance                         |
| --------------------------- | -------------------------------- | --------------------------------- |
| **Apple Appstore Reviewer** | Review codebases for App Store   | ⚠️ Low                            |
| **Gdpr Compliant**          | Apply GDPR-compliant engineering | 🔥 **HIGH** - Compliance          |
| **Security Review**         | AI-powered security scanner      | 🔥 **CRITICAL** - Security audits |

**Priority Actions:**

1. ✅ **Security Review** - Build security scanning skill
2. ✅ **Gdpr Compliant** - Add compliance checking

---

### UI/UX & Frontend Skills (5 skills)

| Skill                            | Use Case                        | Relevance |
| -------------------------------- | ------------------------------- | --------- |
| **Game Engine**                  | Build web-based game engines    | ⚠️ Low    |
| **Gsap Framer Scroll Animation** | Build scroll animations         | ⚠️ Medium |
| **Linkedin Post Formatter**      | Format LinkedIn posts           | ⚠️ Low    |
| **Penpot Uiux Design**           | Create UI/UX designs in Penpot  | ⚠️ Medium |
| **Premium Frontend Ui**          | Craft immersive web experiences | ⚠️ Medium |

---

### Communication & Productivity Skills (6 skills)

| Skill                                | Use Case                                   | Relevance                         |
| ------------------------------------ | ------------------------------------------ | --------------------------------- |
| **Daily Prep**                       | Prepare for tomorrow's meetings            | ⚠️ Medium - Personal productivity |
| **Email Drafter**                    | Draft professional emails                  | ⚠️ Low                            |
| **Mentoring Juniors**                | Socratic mentoring for juniors             | 🔥 **HIGH** - Teaching mode       |
| **Remember**                         | Transform lessons into memory instructions | ✅ Already have memory system     |
| **Remember Interactive Programming** | Remind agent it's interactive programmer   | ✅ Already implemented            |

---

### Image & Media Skills (2 skills)

| Skill                               | Use Case                            | Relevance |
| ----------------------------------- | ----------------------------------- | --------- |
| **Image Manipulation Image Magick** | Process images with ImageMagick     | ⚠️ Medium |
| **Nano Banana Pro Openrouter**      | Generate/edit images via OpenRouter | ⚠️ Low    |

---

### Other Skills (20 skills)

| Skill                                       | Use Case                                      | Relevance                           |
| ------------------------------------------- | --------------------------------------------- | ----------------------------------- |
| **Aspire**                                  | Aspire CLI and integrations                   | ⚠️ Low - .NET specific              |
| **Automate This**                           | Analyze screen recordings, produce automation | 🔥 **HIGH** - Automation from video |
| **Chrome Devtools**                         | Browser automation with DevTools MCP          | 🔥 **HIGH** - Browser automation    |
| **Cloud Design Patterns**                   | 42 patterns for distributed systems           | 🔥 **HIGH** - Architecture patterns |
| **Context Map**                             | Generate map of relevant files                | ✅ Already have                     |
| **Editorconfig**                            | Generate .editorconfig files                  | ⚠️ Medium                           |
| **Flowstudio Power Automate \*** (5 skills) | Power Automate build/debug/governance         | ⚠️ Medium - MS ecosystem            |
| **FreeCAD Scripts**                         | Write FreeCAD Python scripts                  | ⚠️ Low - CAD specific               |
| **Geofeed Tuner**                           | IP geolocation feeds                          | ⚠️ Low - Niche                      |
| **Integrate Context Matic**                 | Discover/integrate third-party APIs           | 🔥 **HIGH** - API integration       |
| **Markdown To Html**                        | Convert Markdown to HTML                      | ⚠️ Medium                           |
| **Memory Merger**                           | Merge lessons from domain memory              | ✅ Already have memory system       |
| **Model Recommendation**                    | Recommend optimal AI models                   | 🔥 **HIGH** - Model selection       |
| **Prompt Builder**                          | Guide users through creating prompts          | 🔥 **HIGH** - Prompt engineering    |
| **Shuffle Json Data**                       | Shuffle JSON objects safely                   | ⚠️ Low                              |

---

## 🎯 Top Priority Skills to Implement

### Critical (Implement Immediately)

1. **Mcp Security Audit** - Audit MCP server security
2. **Security Review** - AI-powered security scanning
3. **Make Skill Template** - Generate new skills from prompts
4. **Python Mcp Server Generator** - Python MCP server creation
5. **Agent Owasp Compliance** - OWASP security for agents

### High Priority (Next Sprint)

6. **Agentic Eval** - Evaluation framework for agents
7. **Mcp Cli** - MCP management CLI
8. **Codeql** - CodeQL security scanning setup
9. **Draw Io Diagram Generator** - Architecture diagrams
10. **Chrome Devtools** - Browser automation
11. **First Ask** - Task clarification workflow
12. **Prompt Builder** - Prompt engineering guide
13. **Model Recommendation** - AI model selection
14. **Cloud Design Patterns** - Distributed systems patterns
15. **Integrate Context Matic** - API integration

### Medium Priority (Future Consideration)

16. **Breakdown Test** - Test strategy generation
17. **Doublecheck** - Output verification
18. **Phoenix Evals** - LLM evaluation
19. **Create Llms** - llms.txt generation
20. **Lsp Setup** - LSP server configuration
21. **Boost Prompt** - Prompt refinement
22. **Agent Governance** - Agent governance controls
23. **Gtm Ai Gtm** - AI go-to-market strategy
24. **Qdrant skills** - Vector DB for RAG
25. **Automate This** - Video-to-automation

---

## 📊 Skills Gap Analysis

### Already Implemented (HopCode)

- ✅ Codebase mapping (codebase-map)
- ✅ Documentation generation (docs-audit-and-refresh, docs-update-from-diff)
- ✅ Review and refactor (review)
- ✅ Testing (test-engineer, e2e-testing)
- ✅ Git workflow (git-workflow)
- ✅ Memory system (auto memory)
- ✅ MCP servers (mcp-builder)
- ✅ Azure skills (26 Azure skills)
- ✅ GitHub integration (github-agents, github-mcp-client)
- ✅ Spec-driven development (spec-driven)
- ✅ Accessibility (accessibility)
- ✅ SEO optimization (seo)

### Missing Skills (Opportunities)

- ❌ Security scanning (Security Review, CodeQL, MCP Security Audit)
- ❌ Agent evaluation (Agentic Eval, Agent Owasp Compliance)
- ❌ Skill generation (Make Skill Template)
- ❌ Multi-language MCP (Python, Go, Java, Kotlin MCP generators)
- ❌ Diagram generation (Draw.io, Excalidraw)
- ❌ Browser automation (Chrome DevTools)
- ❌ Vector DB integration (Qdrant)
- ❌ Prompt engineering (Prompt Builder, Boost Prompt)
- ❌ Model selection (Model Recommendation)

---

## 🚀 Implementation Roadmap

### Phase 1: Security & Quality (Week 1-2)

1. **Mcp Security Audit** - Audit existing MCP servers
2. **Security Review** - Build security scanning skill
3. **Agent Owasp Compliance** - OWASP Top 10 for agents
4. **Codeql** - CodeQL integration
5. **Agentic Eval** - Evaluation framework

### Phase 2: MCP Expansion (Week 3-4)

6. **Python Mcp Server Generator** - Python support
7. **Go Mcp Server Generator** - Go support
8. **Java Mcp Server Generator** - Java support
9. **Mcp Cli** - MCP management CLI
10. **Make Skill Template** - Skill generation

### Phase 3: Developer Experience (Week 5-6)

11. **Draw Io Diagram Generator** - Architecture diagrams
12. **Chrome Devtools** - Browser automation
13. **First Ask** - Task clarification
14. **Prompt Builder** - Prompt engineering
15. **Model Recommendation** - Model selection

### Phase 4: Advanced Features (Week 7-8)

16. **Qdrant integration** - Vector DB for RAG
17. **Cloud Design Patterns** - Architecture patterns
18. **Integrate Context Matic** - API integration
19. **Automate This** - Video-to-automation
20. **Lsp Setup** - LSP configuration

---

## 📈 Metrics for Success

| Metric               | Current | Target | Timeline |
| -------------------- | ------- | ------ | -------- |
| **Total Skills**     | 30      | 50     | 8 weeks  |
| **Security Skills**  | 1       | 5      | 2 weeks  |
| **MCP Generators**   | 1       | 5      | 4 weeks  |
| **Evaluation Tools** | 0       | 3      | 2 weeks  |
| **Diagram Tools**    | 1       | 3      | 6 weeks  |

---

## 🎯 Next Actions

1. **Today**: Create Mcp Security Audit skill
2. **This Week**: Implement top 5 security skills
3. **Next Week**: Start MCP expansion phase
4. **Month**: Complete 20 new skills

---

**Summary**: 308 skills analyzed, 25 high-priority skills identified for implementation. Focus on security, MCP expansion, and developer experience.

**Repository**: https://github.com/TaimoorSiddiquiOfficial/HopCode  
**Skills Source**: https://awesome-copilot.github.com/skills/
