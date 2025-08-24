---
sidebar_position: 2
sidebar_label: Success Metrics
title: Success Metrics
---

# Success Metrics

An effective IDP should demonstrate:

## Why Metrics Matter (Business Case)
- **Baseline and targets**: Establish a pre-platform baseline to quantify improvements.
- **Investment justification**: Tie platform outcomes to business KPIs (time-to-market, reliability, cost).
- **Prioritization**: Use data to choose which capabilities deliver the highest impact next.
- **Accountability**: Make value explicit across quarters to sustain funding and stakeholder confidence.

## Developer Productivity
- **Lead time**: Time from code commit to production deployment
- **Deployment frequency**: How often teams can safely deploy
- **Mean time to recovery**: Speed of incident resolution
- **Change failure rate**: Percentage of deployments causing issues

## DORA Metrics and the Platform’s Role
The four DORA metrics are the industry baseline for software delivery performance. Platforms materially influence each:
- **Deployment Frequency (DF)**: Self-service pipelines, golden paths, and safe-by-default templates increase DF.
- **Lead Time for Changes (LT)**: Standardized CI/CD, paved paths, and fast feedback reduce LT.
- **Change Failure Rate (CFR)**: Built-in testing, policy, and progressive delivery lower CFR.
- **Mean Time to Recovery (MTTR)**: Observability, rollbacks, and automated remediation accelerate recovery.

::::caution Avoid harmful legacy metrics
Deprecated, output-centric metrics often backfire:
- Lines of code written, story points burned, ticket counts, or server CPU utilization targets.
- These drive the wrong behaviors, mask systemic issues, and don’t correlate with flow or reliability.
Prefer outcome metrics like DORA, user happiness, and business impact.
::::

## Platform Adoption
- **Self-service usage**: Percentage of tasks completed without platform team intervention
- **Developer satisfaction**: Regular surveys and feedback collection
- **Platform reliability**: Uptime and performance metrics
- **Time to onboard**: How quickly new teams can become productive

### Why adoption metrics matter
- **Cross-team impact**: Platform benefits land in product teams’ outcomes (e.g., DF, LT, CFR, MTTR), not just within the platform team. You must measure and attribute these improvements.
- **Behavioral change**: Adoption shows that golden paths and paved roads are actually used, not just available.
- **Quality of experience**: DevEx measures (survey scores, NPS, qualitative feedback) reveal friction sources the platform should remove.

### What to track (examples)
- Adoption coverage: % of services on paved paths/templates; % using centralized CI/CD and shared runtime baselines.
- Self-service rate: % of common ops tasks executed via portal/CLI/API without tickets.
- Time-to-first-deploy: For new teams/services; onboarding throughput per month/quarter.
- Golden-path conformance: Policy-as-code pass rates; drift over time.
- Developer happiness: Quarterly DevEx/NPS surveys, task success rate in usability tests.
- Support signals: Ticket volume per engineer, mean time-to-answer, and deflection via docs.

## Measurement Practices (Making It Work)
- **Automate collection**: Pull from VCS, CI/CD, incident systems, and observability tools. Avoid manual spreadsheets.
- **Segment results**: Compare teams on and off the platform; run cohort analysis during rollouts.
- **Set realistic targets**: Improve trends quarter-over-quarter; focus on directional movement over vanity numbers.
- **Share dashboards**: Publish platform impact dashboards to leadership and product teams.
- **Close the loop**: Use findings to prioritize platform backlog and validate ROI.
