# Automation Notes

No recurring automation is active yet.

Useful future automations:

1. Weekly idea backlog
   - Planner creates 10 post briefs.
   - Curriculum QC rejects weak or vague ideas.
   - Writer drafts captions.

2. Daily production queue
   - Pick one approved brief.
   - Generate ComfyUI visual variants.
   - Render deterministic overlay.
   - Run QC.
   - Put final files into a `needs-human-review` folder.

3. Publishing reminder
   - Wake the thread when a human-approved post is ready.
   - Do not publish automatically until the channel workflow is stable.

Implementation options:

- Codex automations for reminders and recurring thread wakeups.
- Prefect for local scheduled jobs, retries, and logs.
- n8n for Telegram/TikTok handoff and approvals.
- LangGraph when agent routing becomes stateful enough to justify it.

