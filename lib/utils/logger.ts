// src/lib/utils/logger.ts
import { appendFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";

interface TokenProcessingError {
  tokenId: number;
  error: string;
  timestamp: number;
}

interface ProcessingStats {
  totalTokens: number;
  processedTokens: number;
  failedTokens: number;
  uniqueHolders: number;
  averageProcessingTime: number;
  batchesCompleted: number;
  totalBatches: number;
}

class SnapshotLogger {
  private startTime: number;
  private lastUpdateTime: number;
  private processedTokens: number;
  private failedTokens: Set<number>;
  private processingTimes: number[];
  private batchStats: Map<
    number,
    {
      startTime: number;
      endTime?: number;
      tokenCount: number;
      errors: TokenProcessingError[];
    }
  >;
  private logDir: string;
  private logFile: string;
  private errorFile: string;
  private totalTokens: number;
  private batchSize: number;

  constructor(totalTokens: number, batchSize: number) {
    this.startTime = Date.now();
    this.lastUpdateTime = Date.now();
    this.processedTokens = 0;
    this.failedTokens = new Set();
    this.processingTimes = [];
    this.batchStats = new Map();
    this.totalTokens = totalTokens;
    this.batchSize = batchSize;
    this.logDir = "logs";

    // Create logs directory if it doesn't exist
    if (!existsSync(this.logDir)) {
      mkdirSync(this.logDir, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    this.logFile = join(this.logDir, `snapshot-${timestamp}.log`);
    this.errorFile = join(this.logDir, `snapshot-errors-${timestamp}.log`);
  }

  private getElapsedTime(): string {
    const elapsed = (Date.now() - this.startTime) / 1000;
    return elapsed.toFixed(2);
  }

  private getProgress(): number {
    return (this.processedTokens / this.totalTokens) * 100;
  }

  private getEstimatedTimeRemaining(): string {
    const elapsed = Date.now() - this.startTime;
    const tokensPerMs = this.processedTokens / elapsed;
    const remainingTokens = this.totalTokens - this.processedTokens;
    const remainingMs = remainingTokens / tokensPerMs;
    const remainingMinutes = Math.ceil(remainingMs / 60000);
    return `${remainingMinutes} minutes`;
  }

  private writeToLog(message: string, isError: boolean = false): void {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}\n`;

    const file = isError ? this.errorFile : this.logFile;
    appendFileSync(file, logMessage);

    // Also log to console
    if (isError) {
      console.error(message);
    } else {
      console.log(message);
    }
  }

  logStart(): void {
    console.log("\n=== Starting Snapshot Generation ===");
    console.log(`Total Tokens to Process: ${this.totalTokens}`);
    console.log(`Batch Size: ${this.batchSize}`);
    console.log("=====================================\n");

    this.writeToLog("=== Starting Snapshot Generation ===");
    this.writeToLog(`Total Tokens to Process: ${this.totalTokens}`);
    this.writeToLog(`Batch Size: ${this.batchSize}`);
  }

  logBatchProgress(batchIndex: number, totalBatches: number): void {
    const currentTime = Date.now();
    if (currentTime - this.lastUpdateTime >= 2000) {
      // Update every 2 seconds
      const progress = this.getProgress();
      const progressMessage = `
Progress Update:
- Batch: ${batchIndex + 1}/${totalBatches}
- Processed: ${this.processedTokens}/${this.totalTokens} tokens
- Progress: ${progress.toFixed(2)}%
- Elapsed Time: ${this.getElapsedTime()}s
- Estimated Time Remaining: ${this.getEstimatedTimeRemaining()}
            `;

      console.log(progressMessage);
      this.writeToLog(progressMessage);
      this.lastUpdateTime = currentTime;
    }
  }

  logTokenProcessed(count: number = 1): void {
    this.processedTokens += count;
  }

  logHolderStats(wallets: { [address: string]: any }): void {
    const statsMessage = "\n=== Holder Statistics ===";
    console.log(statsMessage);
    this.writeToLog(statsMessage);

    const holderCount = Object.keys(wallets).length;
    console.log(`Total Unique Holders: ${holderCount}`);
    this.writeToLog(`Total Unique Holders: ${holderCount}`);

    // Calculate distribution statistics
    const tokenCounts = Object.values(wallets).map((w) => w.tokenCount);
    const maxTokens = Math.max(...tokenCounts);
    const minTokens = Math.min(...tokenCounts);
    const avgTokens =
      tokenCounts.reduce((a, b) => a + b, 0) / tokenCounts.length;

    const distributionStats = `
Distribution Stats:
- Maximum Tokens per Holder: ${maxTokens}
- Minimum Tokens per Holder: ${minTokens}
- Average Tokens per Holder: ${avgTokens.toFixed(2)}
        `;

    console.log(distributionStats);
    this.writeToLog(distributionStats);
  }

  logCompletion(): void {
    const totalTime = this.getElapsedTime();
    const completionMessage = `
=== Snapshot Generation Complete ===
Total Time: ${totalTime}s
Final Token Count: ${this.processedTokens}
====================================
        `;

    console.log(completionMessage);
    this.writeToLog(completionMessage);
  }

  logError(error: unknown): void {
    const errorMessage = "\n=== Snapshot Error ===";
    console.error(errorMessage);
    this.writeToLog(errorMessage, true);

    if (error instanceof Error) {
      console.error(`Error Type: ${error.name}`);
      console.error(`Message: ${error.message}`);
      console.error(`Stack: ${error.stack}`);

      this.writeToLog(`Error Type: ${error.name}`, true);
      this.writeToLog(`Message: ${error.message}`, true);
      this.writeToLog(`Stack: ${error.stack}`, true);
    } else {
      console.error("Unknown error:", error);
      this.writeToLog(`Unknown error: ${error}`, true);
    }

    this.writeToLog("=====================", true);
  }

  getProcessedCount(): number {
    return this.processedTokens;
  }

  getFailedTokens(): number[] {
    return Array.from(this.failedTokens);
  }
}

export { SnapshotLogger };
export type { ProcessingStats, TokenProcessingError };
