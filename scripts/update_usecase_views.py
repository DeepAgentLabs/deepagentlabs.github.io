"""Read Hits totals without incrementing; publish a same-origin index snapshot."""
import argparse
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timezone
import json
from pathlib import Path
from urllib.error import HTTPError
from urllib.request import urlopen

PATHS = [f"/usecases/{n}/" for n in range(1, 7)] + [
    f"/agentic-sidecar/usecases/{slug}/" for slug in (
        "prevent-unauthorized-refunds", "governed-customer-support-agent",
        "govern-langgraph-agent-workflows",
    )
] + [
    f"/control-tower/usecases/{slug}/" for slug in (
        "fleet-health-snapshot", "lens-failure-to-incident",
        "ecosystem-evidence-posture", "fleet-change-with-approval",
    )
] + [
    f"/agentic-evals/usecases/{slug}/" for slug in (
        "block-an-unsafe-release", "right-reply-wrong-trajectory",
        "gate-on-judge-reliability",
    )
]


def read_count(path):
    url = "https://hits.sh/api/urns/deepagentlabs.io" + path.rstrip("/")
    try:
        with urlopen(url, timeout=15) as response:
            count = json.load(response)["total"]
        if type(count) is not int or count < 0:
            raise ValueError("Invalid count")
        return path, count
    except HTTPError as error:
        if error.code == 404:
            return path, 0  # No recorded page loads yet.
    except (OSError, ValueError, KeyError):
        pass
    return path, None


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()
    with ThreadPoolExecutor(max_workers=4) as executor:
        views = dict(executor.map(read_count, PATHS))
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps({
        "updatedAt": datetime.now(timezone.utc).isoformat(), "views": views,
    }, indent=2) + "\n")
    print(f"Page-view totals: {sum(v is not None for v in views.values())}/{len(views)} available")


if __name__ == "__main__":
    main()
