/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */

import type { CommandModule, Argv } from 'yargs';
import {
  handleProfileInit,
  handleProfileList,
  handleProfileUse,
  handleProfileDelete,
  handleProfileShow,
} from './handler.js';

interface ProfileUseArgs {
  name: string;
}

interface ProfileDeleteArgs {
  name: string;
}

interface ProfileInitArgs {
  name?: string;
}

const initCommand: CommandModule<object, ProfileInitArgs> = {
  command: 'init [name]',
  describe: 'Create a new provider/model profile',
  builder: (yargs: Argv) =>
    yargs.positional('name', {
      type: 'string',
      describe: 'Profile name',
    }) as Argv<ProfileInitArgs>,
  handler: async (argv) => {
    await handleProfileInit(argv.name);
  },
};

const listCommand: CommandModule = {
  command: 'list',
  aliases: ['ls'],
  describe: 'List all saved profiles',
  builder: (yargs: Argv) => yargs.version(false),
  handler: async () => {
    await handleProfileList();
  },
};

const useCommand: CommandModule<object, ProfileUseArgs> = {
  command: 'use <name>',
  describe: 'Activate a profile',
  builder: (yargs: Argv) =>
    yargs.positional('name', {
      type: 'string',
      describe: 'Profile name to activate',
      demandOption: true,
    }) as Argv<ProfileUseArgs>,
  handler: async (argv) => {
    await handleProfileUse(argv.name);
  },
};

const deleteCommand: CommandModule<object, ProfileDeleteArgs> = {
  command: 'delete <name>',
  aliases: ['rm', 'remove'],
  describe: 'Delete a profile',
  builder: (yargs: Argv) =>
    yargs.positional('name', {
      type: 'string',
      describe: 'Profile name to delete',
      demandOption: true,
    }) as Argv<ProfileDeleteArgs>,
  handler: async (argv) => {
    await handleProfileDelete(argv.name);
  },
};

const showCommand: CommandModule = {
  command: 'show',
  aliases: ['current'],
  describe: 'Show the currently active profile',
  builder: (yargs: Argv) => yargs.version(false),
  handler: async () => {
    await handleProfileShow();
  },
};

export const profileCommand: CommandModule = {
  command: 'profile',
  describe: 'Manage provider/model profiles',
  builder: (yargs: Argv) =>
    yargs
      .command(initCommand)
      .command(listCommand)
      .command(useCommand)
      .command(deleteCommand)
      .command(showCommand)
      .demandCommand(1, 'You need at least one subcommand.')
      .version(false),
  handler: () => {
    // handled by subcommands
  },
};
