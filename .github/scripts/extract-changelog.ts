import { readFileSync, appendFileSync, existsSync } from 'node:fs';
import { execSync } from 'node:child_process';

interface PackageJson {
  version?: string;
}

function getAppVersion(): string {
  const pkg = JSON.parse(readFileSync('package.json', 'utf8')) as PackageJson;
  return (pkg.version || '1.0.4').trim();
}

function extractVersionSection(markdown: string, version: string): string | null {
  const escapedVersion = version.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const headingRegex = new RegExp(`^##\\s+\\[?v?${escapedVersion}\\]?(?:\\s+-.*)?$`, 'm');
  const match = headingRegex.exec(markdown);
  if (!match) return null;

  const afterHeading = markdown.slice(match.index + match[0].length).replace(/^\r?\n/, '');
  const nextHeadingMatch = /^##\s+/m.exec(afterHeading);
  const body = nextHeadingMatch ? afterHeading.slice(0, nextHeadingMatch.index) : afterHeading;

  const trimmed = body.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function getGitCommitsSummary(): string {
  try {
    let range = '-n 10';
    try {
      const lastTag = execSync('git describe --tags --abbrev=0 HEAD^', {
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'ignore'],
      }).trim();
      if (lastTag) {
        range = `${lastTag}..HEAD`;
      }
    } catch {
      // Fallback to latest 10 commits if no previous tag exists
    }

    const log = execSync(`git log ${range} --pretty=format:"- %s (%h)" --no-merges`, {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();

    return log;
  } catch {
    return '';
  }
}

function buildReleaseBody(): string {
  const version = getAppVersion();
  const changelogPath = 'CHANGELOG.md';
  let section: string | null = null;

  if (existsSync(changelogPath)) {
    const md = readFileSync(changelogPath, 'utf8');
    section = extractVersionSection(md, version);
  }

  const gitSummary = getGitCommitsSummary();

  if (section) {
    if (gitSummary) {
      return `${section}\n\n### Commit Terbaru\n${gitSummary}`;
    }
    return section;
  }

  if (gitSummary) {
    return `### Perubahan pada v${version}\n${gitSummary}`;
  }

  return `Rilis pembaruan aplikasi versi v${version}.`;
}

const body = buildReleaseBody();
const githubOutput = process.env.GITHUB_OUTPUT;

if (githubOutput) {
  const delimiter = `CHANGELOG_EOF_${Date.now()}`;
  appendFileSync(githubOutput, `body<<${delimiter}\n${body}\n${delimiter}\n`, 'utf8');
} else {
  console.log(body);
}
