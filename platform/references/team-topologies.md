---
sidebar_position: 1
sidebar_label: Team Topologies
title: Team Topologies
---

# Team Topologies

Internal Developer Platforms are most effective when designed around the team structures and interaction patterns defined in [Team Topologies](https://teamtopologies.com/). Understanding how different team types interact with the platform ensures optimal cognitive load distribution and organizational effectiveness.

::::tip Recommended Reading
For a comprehensive, practitioner-friendly guide to team design and interactions, we highly recommend the book:

**Team Topologies: Organizing Business and Technology Teams for Fast Flow** by **Matthew Skelton** and **Manuel Pais**.  
Official book page: https://teamtopologies.com/book
::::

## Stream-Aligned Teams

Stream-aligned teams are the primary consumers of the Internal Developer Platform. The IDP enables these teams to:

- **Deploy applications independently** without waiting for other teams
- **Access standardized tooling** and infrastructure patterns
- **Focus on business value delivery** rather than infrastructure management
- **Maintain ownership** of their full application lifecycle

### Platform Capabilities for Stream-Aligned Teams

#### Self-Service Infrastructure
- Automated provisioning of development, staging, and production environments
- Standardized deployment pipelines with built-in security and compliance
- Monitoring and observability tools configured automatically
- Database and storage provisioning through simple interfaces

#### Development Workflow Integration
- Git-based workflows with automated testing and quality gates
- Container registry access with vulnerability scanning
- Secrets management integrated into deployment processes
- Feature flag and configuration management systems

#### Operational Autonomy
- Real-time application metrics and alerting
- Log aggregation and search capabilities
- Automated scaling and resource management
- Incident response tools and runbooks

## Platform Team

The platform team is responsible for curating and maintaining the Internal Developer Platform. Their key responsibilities include:

- **Curating** rather than building everything from scratch
- **Providing** a compelling internal product that teams want to use
- **Maintaining** the thinnest viable platform that meets 80% of use cases
- **Evolving** the platform based on stream-aligned team feedback

### Platform Team Focus Areas

#### Technology Curation
- Evaluating and selecting tools that provide the best developer experience
- Creating abstractions that hide complexity while maintaining flexibility
- Establishing standards and patterns for common use cases
- Managing the lifecycle of platform components and dependencies

#### Product Management
- Treating the platform as a product with clear value propositions
- Gathering feedback from stream-aligned teams to prioritize improvements
- Measuring platform adoption and effectiveness metrics
- Communicating platform capabilities and roadmap to stakeholders

#### Operational Excellence
- Ensuring platform reliability and performance meet service level objectives
- Implementing monitoring and alerting for platform components
- Managing platform security and compliance requirements
- Providing support and troubleshooting assistance to platform users

## Enabling Teams

Enabling teams work alongside platform teams to bridge gaps and provide specialized knowledge. Their role includes:

- **Help stream-aligned teams adopt** platform capabilities effectively
- **Bridge gaps** between platform offerings and team-specific needs
- **Provide specialized knowledge** for complex integrations
- **Facilitate knowledge transfer** between teams and the platform

### Enabling Team Activities

#### Onboarding and Training
- Developing training materials and workshops for platform adoption
- Providing hands-on support during team transitions to platform usage
- Creating documentation and best practice guides
- Mentoring teams on effective platform utilization

#### Gap Analysis and Solutions
- Identifying limitations in current platform offerings
- Developing custom solutions for edge cases that don't fit standard patterns
- Prototyping new capabilities before they become part of the core platform
- Acting as a feedback channel between stream-aligned teams and platform team

#### Knowledge Sharing
- Facilitating communities of practice around platform usage
- Organizing regular knowledge sharing sessions and demos
- Creating and maintaining internal wikis and knowledge bases
- Establishing communication channels for peer-to-peer support

## Team Interaction Patterns

### Collaboration Modes

#### X-as-a-Service
The primary interaction pattern between stream-aligned teams and the platform team:
- Platform provides standardized services consumed by stream-aligned teams
- Minimal direct communication required for routine operations
- Clear service boundaries and well-defined APIs
- Platform team maintains service reliability and evolution

#### Facilitating
Enabling teams facilitate adoption and knowledge transfer:
- Temporary collaboration to help teams adopt new platform capabilities
- Knowledge transfer sessions and training programs
- Assistance with complex integrations or customizations
- Gradual reduction of support as teams become self-sufficient

#### Sensing
Platform and enabling teams gather feedback from stream-aligned teams:
- Regular surveys and feedback sessions
- Usage analytics and platform metrics analysis
- Observation of team workflows and pain points
- Identification of opportunities for platform improvement

### Communication Patterns

#### Asynchronous Communication
- Self-service documentation and knowledge bases
- Automated notifications and status updates
- Issue tracking and support ticket systems
- Community forums and chat channels

#### Synchronous Communication
- Regular office hours for platform support
- Architecture review sessions for complex use cases
- Incident response and troubleshooting calls
- Quarterly business reviews and roadmap planning

## Organizational Benefits

### Cognitive Load Distribution
- Stream-aligned teams focus on business domain complexity
- Platform team handles infrastructure and operational complexity
- Enabling teams bridge knowledge gaps and facilitate adoption
- Clear separation of concerns reduces overall organizational cognitive load

### Scalability and Efficiency
- Platform capabilities scale across multiple stream-aligned teams
- Standardized patterns reduce duplication of effort
- Self-service capabilities reduce bottlenecks and dependencies
- Enabling teams provide targeted support without permanent overhead

### Innovation and Adaptability
- Platform abstractions enable experimentation with new technologies
- Stream-aligned teams can focus on business innovation
- Platform evolution driven by real user needs and feedback
- Enabling teams help identify and prototype new capabilities

## Implementation Considerations

### Team Sizing and Structure
- Platform teams typically 5-9 people for organizations with 50-200 developers
- Enabling teams are often temporary, 2-4 people focused on specific adoption goals
- Stream-aligned teams maintain their existing size and structure
- Clear role definitions prevent overlap and confusion

### Success Metrics
- Platform adoption rates across stream-aligned teams
- Developer satisfaction and productivity metrics
- Reduction in cross-team dependencies and wait times
- Platform reliability and performance indicators

### Evolution and Maturity
- Start with basic platform capabilities and expand based on demand
- Gradually increase self-service capabilities to reduce manual intervention
- Evolve team structures as platform maturity and organizational needs change
- Maintain focus on the "thinnest viable platform" principle

## Conclusion

Effective Internal Developer Platform implementation requires careful consideration of team structures and interaction patterns. By aligning platform design with Team Topologies principles, organizations can achieve optimal cognitive load distribution, improved developer experience, and sustainable platform evolution that serves the needs of all teams involved.
