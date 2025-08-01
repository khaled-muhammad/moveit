/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

const FONT_SIZE_OPTIONS = [
  ['10px', '10px'],
  ['11px', '11px'],
  ['12px', '12px'],
  ['13px', '13px'],
  ['14px', '14px'],
  ['15px', '15px'],
  ['16px', '16px'],
  ['17px', '17px'],
  ['18px', '18px'],
  ['19px', '19px'],
  ['20px', '20px'],
];

const FONT_FAMILY_OPTIONS = [
  ['Arial', 'Arial'],
  ['Courier New', 'Courier New'],
  ['Georgia', 'Georgia'],
  ['Times New Roman', 'Times New Roman'],
  ['Trebuchet MS', 'Trebuchet MS'],
  ['Verdana', 'Verdana'],
];

const ELEMENT_FORMAT_OPTIONS = {
  center: 'center',
  end: 'end',
  justify: 'justify',
  left: 'left',
  right: 'right',
  start: 'start',
};

const blockTypeToBlockName = {
  bullet: 'Bulleted List',
  check: 'Check List',
  code: 'Code Block',
  h1: 'Heading 1',
  h2: 'Heading 2',
  h3: 'Heading 3',
  h4: 'Heading 4',
  h5: 'Heading 5',
  h6: 'Heading 6',
  number: 'Numbered List',
  paragraph: 'Normal',
  quote: 'Quote',
};

function parseAllowedColor(input) {
  return /^rgb\((\d{1,3}), (\d{1,3}), (\d{1,3})\)$/.test(input) ? input : '';
}

function parseAllowedFontSize(input) {
  return /^(\d{1,3})px$/.test(input) ? input : '';
}

export {
  blockTypeToBlockName,
  ELEMENT_FORMAT_OPTIONS,
  FONT_FAMILY_OPTIONS,
  FONT_SIZE_OPTIONS,
  parseAllowedColor,
  parseAllowedFontSize,
};