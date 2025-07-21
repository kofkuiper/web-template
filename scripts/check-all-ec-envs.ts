import { existsSync, readFileSync } from "fs";
import { execSync } from "child_process";

const checkEnv = (filename: string) => {
  if (!existsSync(filename)) return;
  const stagedFiles = execSync("git diff --cached --name-only")
    .toString()
    .split("\n");
  const isEnvStaged = stagedFiles.includes(filename);
  if (!isEnvStaged) return;

  const envContent = readFileSync(filename, "utf8");
  const encrypted = envContent.includes("encrypted:");

  if (!encrypted) {
    console.error(`❌ Missing required encrypted ${filename}`);
    console.error(`Make sure your ${filename} file is correctly encrypted.\n`);
    console.log("===================================================\n");
    console.log(`\x1b[32m🔥 Please run 'pnpm run env:all:ec'\n\x1b[0m`);
    console.log("===================================================\n");
    process.exit(1);
  }
};

console.log("🔍 Checking env encryption...");
checkEnv(".env");
checkEnv(".env.uat");
checkEnv(".env.prod");
console.log("✅ all env files looks valid.");
