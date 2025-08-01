/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {
  $getSelection,
  $isRangeSelection,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND,
} from 'lexical';
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import {
  $getSelectionStyleValueForProperty,
  $patchStyleText,
} from '@lexical/selection';
import {mergeRegister} from '@lexical/utils';
import {useCallback, useEffect, useState, useRef} from 'react';
import {
  FaBold,
  FaItalic,
  FaUnderline,
  FaStrikethrough,
  FaCode,
  FaSubscript,
  FaSuperscript,
  FaAlignLeft,
  FaAlignCenter,
  FaAlignRight,
  FaAlignJustify,
  FaUndo,
  FaRedo,
  FaListUl,
  FaListOl,
  FaImage,
  FaVideo,
  FaMusic,
} from 'react-icons/fa';
import { INSERT_IMAGE_COMMAND } from './ImagePlugin.jsx';

const LowPriority = 1;

function Divider() {
  return <div className="toolbar-divider" />;
}

export default function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [isSubscript, setIsSubscript] = useState(false);
  const [isSuperscript, setIsSuperscript] = useState(false);
  const [isCode, setIsCode] = useState(false);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [fontSize, setFontSize] = useState('15px');

  const $updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      // Update text format
      setIsBold(selection.hasFormat('bold'));
      setIsItalic(selection.hasFormat('italic'));
      setIsUnderline(selection.hasFormat('underline'));
      setIsStrikethrough(selection.hasFormat('strikethrough'));
      setIsSubscript(selection.hasFormat('subscript'));
      setIsSuperscript(selection.hasFormat('superscript'));
      setIsCode(selection.hasFormat('code'));

      // Update font size
      setFontSize(
        $getSelectionStyleValueForProperty(selection, 'font-size', '15px'),
      );
    }
  }, []);

  useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      () => {
        $updateToolbar();
        return false;
      },
      LowPriority,
    );
  }, [editor, $updateToolbar]);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({editorState}) => {
        editorState.read(() => {
          $updateToolbar();
        });
      }),
      editor.registerCommand(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload);
          return false;
        },
        LowPriority,
      ),
      editor.registerCommand(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload);
          return false;
        },
        LowPriority,
      ),
    );
  }, [$updateToolbar, editor]);

  const applyStyleText = useCallback(
    (styles) => {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $patchStyleText(selection, styles);
        }
      });
    },
    [editor],
  );

  const handleFontSizeChange = (event) => {
    const newSize = event.target.value + 'px';
    applyStyleText({'font-size': newSize});
  };

  const handleImageInsert = () => {
    const url = prompt('Enter image URL:');
    if (url) {
      editor.dispatchCommand(INSERT_IMAGE_COMMAND, { src: url, altText: 'Image' });
    }
  };



  const handleVideoInsert = () => {
    const url = prompt('Enter video URL:');
    if (url) {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          selection.insertRawText(`[Video: ${url}]`);
        }
      });
    }
  };

  const handleAudioInsert = () => {
    const url = prompt('Enter audio URL:');
    if (url) {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          selection.insertRawText(`[Audio: ${url}]`);
        }
      });
    }
  };

  return (
    <div className="actual-toolbar">
      <button
        disabled={!canUndo}
        onClick={() => {
          editor.dispatchCommand(UNDO_COMMAND, undefined);
        }}
        title="Undo"
        type="button"
        className="toolbar-btn"
        aria-label="Undo"
      >
        <FaUndo />
      </button>
      <button
        disabled={!canRedo}
        onClick={() => {
          editor.dispatchCommand(REDO_COMMAND, undefined);
        }}
        title="Redo"
        type="button"
        className="toolbar-btn"
        aria-label="Redo"
      >
        <FaRedo />
      </button>
      
      <Divider />
      
      <select 
        value={parseInt(fontSize)}
        onChange={handleFontSizeChange}
        className="toolbar-select"
        title="Font Size"
      >
        {[10, 11, 12, 13, 14, 15, 16, 18, 20, 24, 28, 32].map(size => (
          <option key={size} value={size}>{size}px</option>
        ))}
      </select>
      
      <Divider />
      
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
        }}
        className={'toolbar-btn ' + (isBold ? 'active' : '')}
        title="Bold"
        type="button"
        aria-label="Format text as bold"
      >
        <FaBold />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
        }}
        className={'toolbar-btn ' + (isItalic ? 'active' : '')}
        title="Italic"
        type="button"
        aria-label="Format text as italics"
      >
        <FaItalic />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline');
        }}
        className={'toolbar-btn ' + (isUnderline ? 'active' : '')}
        title="Underline"
        type="button"
        aria-label="Format text to underlined"
      >
        <FaUnderline />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough');
        }}
        className={'toolbar-btn ' + (isStrikethrough ? 'active' : '')}
        title="Strikethrough"
        type="button"
        aria-label="Format text with a strikethrough"
      >
        <FaStrikethrough />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'subscript');
        }}
        className={'toolbar-btn ' + (isSubscript ? 'active' : '')}
        title="Subscript"
        type="button"
        aria-label="Format text as subscript"
      >
        <FaSubscript />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'superscript');
        }}
        className={'toolbar-btn ' + (isSuperscript ? 'active' : '')}
        title="Superscript"
        type="button"
        aria-label="Format text as superscript"
      >
        <FaSuperscript />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code');
        }}
        className={'toolbar-btn ' + (isCode ? 'active' : '')}
        title="Insert code block"
        type="button"
        aria-label="Insert code block"
      >
        <FaCode />
      </button>
      
      <Divider />
      
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left');
        }}
        className="toolbar-btn"
        title="Align Left"
        type="button"
        aria-label="Left align"
      >
        <FaAlignLeft />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center');
        }}
        className="toolbar-btn"
        title="Align Center"
        type="button"
        aria-label="Center align"
      >
        <FaAlignCenter />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right');
        }}
        className="toolbar-btn"
        title="Align Right"
        type="button"
        aria-label="Right align"
      >
        <FaAlignRight />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'justify');
        }}
        className="toolbar-btn"
        title="Justify"
        type="button"
        aria-label="Justify align"
      >
        <FaAlignJustify />
      </button>
      
      <Divider />
      
      <button
        onClick={handleImageInsert}
        className="toolbar-btn"
        title="Insert Image"
        type="button"
        aria-label="Insert image"
      >
        <FaImage />
      </button>
      <button
        onClick={handleVideoInsert}
        className="toolbar-btn"
        title="Insert Video"
        type="button"
        aria-label="Insert video"
      >
        <FaVideo />
      </button>
      <button
        onClick={handleAudioInsert}
        className="toolbar-btn"
        title="Insert Audio"
        type="button"
        aria-label="Insert audio"
      >
        <FaMusic />
      </button>
    </div>
  );
}