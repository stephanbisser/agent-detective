import Table from 'cli-table3';
import chalk from 'chalk';
import { AgentDiscoveryResult } from '../models/Agent';

/**
 * Formats agent discovery results for different output types
 */
export class OutputFormatter {
  /**
   * Format results as a table for console output
   */
  static formatAsTable(result: AgentDiscoveryResult): string {
    const table = new Table({
      head: [
        chalk.cyan('Name'),
        chalk.cyan('Type'),
        chalk.cyan('Platform'),
        chalk.cyan('Status'),
        chalk.cyan('ID'),
      ],
      colWidths: [30, 25, 20, 15, 40],
      wordWrap: true,
    });

    for (const agent of result.agents) {
      table.push([
        agent.name,
        agent.type,
        agent.platform,
        agent.status || 'N/A',
        agent.id,
      ]);
    }

    let output = '\n' + table.toString() + '\n\n';
    output += chalk.bold(`Total agents found: ${result.totalCount}\n`);
    output += chalk.gray(`Discovered at: ${result.timestamp.toISOString()}\n`);

    if (result.errors && result.errors.length > 0) {
      output += '\n' + chalk.yellow('Errors encountered:\n');
      result.errors.forEach((error) => {
        output += chalk.red(`  - ${error}\n`);
      });
    }

    return output;
  }

  /**
   * Format results as JSON
   */
  static formatAsJson(result: AgentDiscoveryResult): string {
    return JSON.stringify(result, null, 2);
  }

  /**
   * Format results as CSV
   */
  static formatAsCsv(result: AgentDiscoveryResult): string {
    let csv = 'Name,Type,Platform,Status,ID,Description,Created,Modified\n';

    for (const agent of result.agents) {
      const row = [
        this.escapeCsv(agent.name),
        this.escapeCsv(agent.type),
        this.escapeCsv(agent.platform),
        this.escapeCsv(agent.status || ''),
        this.escapeCsv(agent.id),
        this.escapeCsv(agent.description || ''),
        agent.created ? agent.created.toISOString() : '',
        agent.modified ? agent.modified.toISOString() : '',
      ];
      csv += row.join(',') + '\n';
    }

    return csv;
  }

  /**
   * Format results as detailed text
   */
  static formatAsDetailed(result: AgentDiscoveryResult): string {
    let output = chalk.bold.cyan('\n=== Microsoft 365 Agents Discovery Report ===\n\n');
    output += chalk.gray(`Discovery Time: ${result.timestamp.toISOString()}\n`);
    output += chalk.bold(`Total Agents Found: ${result.totalCount}\n\n`);

    for (const agent of result.agents) {
      output += chalk.bold.green(`\n${agent.name}\n`);
      output += chalk.gray('─'.repeat(50)) + '\n';
      output += `  ${chalk.cyan('ID:')} ${agent.id}\n`;
      output += `  ${chalk.cyan('Type:')} ${agent.type}\n`;
      output += `  ${chalk.cyan('Platform:')} ${agent.platform}\n`;
      
      if (agent.description) {
        output += `  ${chalk.cyan('Description:')} ${agent.description}\n`;
      }
      
      if (agent.status) {
        output += `  ${chalk.cyan('Status:')} ${agent.status}\n`;
      }
      
      if (agent.owner) {
        output += `  ${chalk.cyan('Owner:')} ${agent.owner}\n`;
      }
      
      if (agent.created) {
        output += `  ${chalk.cyan('Created:')} ${agent.created.toISOString()}\n`;
      }
      
      if (agent.modified) {
        output += `  ${chalk.cyan('Modified:')} ${agent.modified.toISOString()}\n`;
      }
      
      if (agent.capabilities && agent.capabilities.length > 0) {
        output += `  ${chalk.cyan('Capabilities:')} ${agent.capabilities.join(', ')}\n`;
      }
      
      if (agent.metadata && Object.keys(agent.metadata).length > 0) {
        output += `  ${chalk.cyan('Metadata:')}\n`;
        for (const [key, value] of Object.entries(agent.metadata)) {
          output += `    - ${key}: ${JSON.stringify(value)}\n`;
        }
      }
    }

    if (result.errors && result.errors.length > 0) {
      output += '\n' + chalk.bold.yellow('\n=== Errors ===\n');
      result.errors.forEach((error) => {
        output += chalk.red(`  - ${error}\n`);
      });
    }

    return output;
  }

  /**
   * Escape CSV values
   */
  private static escapeCsv(value: string): string {
    if (value.includes(',') || value.includes('"') || value.includes('\n')) {
      return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  }

  /**
   * Get summary statistics
   */
  static getSummary(result: AgentDiscoveryResult): string {
    const summary: Record<string, number> = {};
    
    for (const agent of result.agents) {
      const key = `${agent.platform} - ${agent.type}`;
      summary[key] = (summary[key] || 0) + 1;
    }

    let output = chalk.bold.cyan('\n=== Agent Summary ===\n\n');
    output += chalk.bold(`Total Agents: ${result.totalCount}\n\n`);
    
    output += chalk.cyan('Breakdown by Platform & Type:\n');
    for (const [key, count] of Object.entries(summary)) {
      output += `  ${key}: ${count}\n`;
    }

    return output;
  }
}
