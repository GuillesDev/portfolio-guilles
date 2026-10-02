import { readdir, readFile, writeFile } from 'node:fs/promises';

// Astro 4's Vercel adapter only recognizes Node 18/20. Align its generated
// functions with the supported Node version declared for this deployment.
const { engines } = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));
if (!/^\d+\.x$/.test(engines.node)) throw new Error('Declare a Node major version in engines.node');
const runtime = `nodejs${engines.node}`;

async function alignRuntime(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = new URL(entry.name + (entry.isDirectory() ? '/' : ''), directory);
    if (entry.isDirectory()) await alignRuntime(path);
    else if (entry.name === '.vc-config.json') {
      const config = JSON.parse(await readFile(path, 'utf8'));
      if (config.runtime?.startsWith('nodejs')) {
        config.runtime = runtime;
        await writeFile(path, JSON.stringify(config, null, 2) + '\n');
        console.log(`Vercel function runtime: ${runtime}`);
      }
    }
  }
}

await alignRuntime(new URL('../.vercel/output/functions/', import.meta.url));
