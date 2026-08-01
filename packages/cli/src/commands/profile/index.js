/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import { handleProfileInit, handleProfileList, handleProfileUse, handleProfileDelete, handleProfileShow, } from './handler.js';
const initCommand = {
    command: 'init [name]',
    describe: 'Create a new provider/model profile',
    builder: (yargs) => yargs.positional('name', {
        type: 'string',
        describe: 'Profile name',
    }),
    handler: async (argv) => {
        await handleProfileInit(argv.name);
    },
};
const listCommand = {
    command: 'list',
    aliases: ['ls'],
    describe: 'List all saved profiles',
    builder: (yargs) => yargs.version(false),
    handler: async () => {
        await handleProfileList();
    },
};
const useCommand = {
    command: 'use <name>',
    describe: 'Activate a profile',
    builder: (yargs) => yargs.positional('name', {
        type: 'string',
        describe: 'Profile name to activate',
        demandOption: true,
    }),
    handler: async (argv) => {
        await handleProfileUse(argv.name);
    },
};
const deleteCommand = {
    command: 'delete <name>',
    aliases: ['rm', 'remove'],
    describe: 'Delete a profile',
    builder: (yargs) => yargs.positional('name', {
        type: 'string',
        describe: 'Profile name to delete',
        demandOption: true,
    }),
    handler: async (argv) => {
        await handleProfileDelete(argv.name);
    },
};
const showCommand = {
    command: 'show',
    aliases: ['current'],
    describe: 'Show the currently active profile',
    builder: (yargs) => yargs.version(false),
    handler: async () => {
        await handleProfileShow();
    },
};
export const profileCommand = {
    command: 'profile',
    describe: 'Manage provider/model profiles',
    builder: (yargs) => yargs
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
//# sourceMappingURL=index.js.map