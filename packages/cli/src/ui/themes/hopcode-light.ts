/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { type ColorsTheme, Theme } from './theme.js';
import { lightSemanticColors } from './semantic-tokens.js';

const hopcodeLightColors: ColorsTheme = {
  type: 'light',
  Background: '#f8f9fa',
  Foreground: '#5c6166',
  LightBlue: '#55b4d4',
  AccentBlue: '#399ee6',
  AccentPurple: '#a37acc',
  AccentCyan: '#4cbf99',
  AccentGreen: '#86b300',
  AccentYellow: '#f2ae49',
  AccentRed: '#f07171',
  AccentYellowDim: '#8B7000',
  AccentRedDim: '#993333',
  DiffAdded: '#86b300',
  DiffRemoved: '#f07171',
  Comment: '#ABADB1',
  Gray: '#CCCFD3',
  GradientColors: ['#399ee6', '#86b300'],
};

export const HopCodeLight: Theme = new Theme(
  'HopCode Light',
  'light',
  {
    hljs: {
      display: 'block',
      overflowX: 'auto',
      padding: '0.5em',
      background: hopcodeLightColors.Background,
      color: hopcodeLightColors.Foreground,
    },
    'hljs-comment': {
      color: hopcodeLightColors.Comment,
      fontStyle: 'italic',
    },
    'hljs-quote': {
      color: hopcodeLightColors.AccentCyan,
      fontStyle: 'italic',
    },
    'hljs-string': {
      color: hopcodeLightColors.AccentGreen,
    },
    'hljs-constant': {
      color: hopcodeLightColors.AccentCyan,
    },
    'hljs-number': {
      color: hopcodeLightColors.AccentPurple,
    },
    'hljs-keyword': {
      color: hopcodeLightColors.AccentYellow,
    },
    'hljs-selector-tag': {
      color: hopcodeLightColors.AccentYellow,
    },
    'hljs-attribute': {
      color: hopcodeLightColors.AccentYellow,
    },
    'hljs-variable': {
      color: hopcodeLightColors.Foreground,
    },
    'hljs-variable.language': {
      color: hopcodeLightColors.LightBlue,
      fontStyle: 'italic',
    },
    'hljs-title': {
      color: hopcodeLightColors.AccentBlue,
    },
    'hljs-section': {
      color: hopcodeLightColors.AccentGreen,
      fontWeight: 'bold',
    },
    'hljs-type': {
      color: hopcodeLightColors.LightBlue,
    },
    'hljs-class .hljs-title': {
      color: hopcodeLightColors.AccentBlue,
    },
    'hljs-tag': {
      color: hopcodeLightColors.LightBlue,
    },
    'hljs-name': {
      color: hopcodeLightColors.AccentBlue,
    },
    'hljs-builtin-name': {
      color: hopcodeLightColors.AccentYellow,
    },
    'hljs-meta': {
      color: hopcodeLightColors.AccentYellow,
    },
    'hljs-symbol': {
      color: hopcodeLightColors.AccentRed,
    },
    'hljs-bullet': {
      color: hopcodeLightColors.AccentYellow,
    },
    'hljs-regexp': {
      color: hopcodeLightColors.AccentCyan,
    },
    'hljs-link': {
      color: hopcodeLightColors.LightBlue,
    },
    'hljs-deletion': {
      color: hopcodeLightColors.AccentRed,
    },
    'hljs-addition': {
      color: hopcodeLightColors.AccentGreen,
    },
    'hljs-emphasis': {
      fontStyle: 'italic',
    },
    'hljs-strong': {
      fontWeight: 'bold',
    },
    'hljs-literal': {
      color: hopcodeLightColors.AccentCyan,
    },
    'hljs-built_in': {
      color: hopcodeLightColors.AccentRed,
    },
    'hljs-doctag': {
      color: hopcodeLightColors.AccentRed,
    },
    'hljs-template-variable': {
      color: hopcodeLightColors.AccentCyan,
    },
    'hljs-selector-id': {
      color: hopcodeLightColors.AccentRed,
    },
  },
  hopcodeLightColors,
  lightSemanticColors,
);
