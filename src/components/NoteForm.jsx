import React, { useState, useEffect } from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';

import {
  $isTextNode,
  // DOMConversionMap,
  // DOMExportOutput,
  // DOMExportOutputMap,
  isHTMLElement,
  // Klass,
  // LexicalEditor,
  // LexicalNode,
  ParagraphNode,
  TextNode,
} from 'lexical';

import ExampleTheme from './ExampleTheme';
import ToolbarPlugin from './plugins/ToolbarPlugin';
import TreeViewPlugin from './plugins/TreeViewPlugin';
import ImagePlugin from './plugins/ImagePlugin';
import { ImageNode } from './plugins/ImageNode.jsx';
import { parseAllowedColor, parseAllowedFontSize } from './styleConfig';

const placeholder = 'Enter some rich text...';

const removeStylesExportDOM = (
  editor,
  target,
) => {
  const output = target.exportDOM(editor);
  if (output && isHTMLElement(output.element)) {
    // Remove all inline styles and classes if the element is an HTMLElement
    // Children are checked as well since TextNode can be nested
    // in i, b, and strong tags.
    for (const el of [
      output.element,
      ...output.element.querySelectorAll('[style],[class],[dir="ltr"]'),
    ]) {
      el.removeAttribute('class');
      el.removeAttribute('style');
      if (el.getAttribute('dir') === 'ltr') {
        el.removeAttribute('dir');
      }
    }
  }
  return output;
};

const exportMap = new Map([
  [ParagraphNode, removeStylesExportDOM],
  [TextNode, removeStylesExportDOM],
]);

const getExtraStyles = (element) => {
  // Parse styles from pasted input, but only if they match exactly the
  // sort of styles that would be produced by exportDOM
  let extraStyles = '';
  const fontSize = parseAllowedFontSize(element.style.fontSize);
  const backgroundColor = parseAllowedColor(element.style.backgroundColor);
  const color = parseAllowedColor(element.style.color);
  if (fontSize !== '' && fontSize !== '15px') {
    extraStyles += `font-size: ${fontSize};`;
  }
  if (backgroundColor !== '' && backgroundColor !== 'rgb(255, 255, 255)') {
    extraStyles += `background-color: ${backgroundColor};`;
  }
  if (color !== '' && color !== 'rgb(0, 0, 0)') {
    extraStyles += `color: ${color};`;
  }
  return extraStyles;
};

const constructImportMap = () => {
  const importMap = {};

  // Wrap all TextNode importers with a function that also imports
  // the custom styles implemented by the playground
  for (const [tag, fn] of Object.entries(TextNode.importDOM() || {})) {
    importMap[tag] = (importNode) => {
      const importer = fn(importNode);
      if (!importer) {
        return null;
      }
      return {
        ...importer,
        conversion: (element) => {
          const output = importer.conversion(element);
          if (
            output === null ||
            output.forChild === undefined ||
            output.after !== undefined ||
            output.node !== null
          ) {
            return output;
          }
          const extraStyles = getExtraStyles(element);
          if (extraStyles) {
            const { forChild } = output;
            return {
              ...output,
              forChild: (child, parent) => {
                const textNode = forChild(child, parent);
                if ($isTextNode(textNode)) {
                  textNode.setStyle(textNode.getStyle() + extraStyles);
                }
                return textNode;
              },
            };
          }
          return output;
        },
      };
    };
  }

  return importMap;
};

const editorConfig = {
  html: {
    export: exportMap,
    import: constructImportMap(),
  },
  namespace: 'React.js Demo',
  nodes: [ParagraphNode, TextNode, ImageNode],
  onError(error) {
    throw error;
  },
  theme: ExampleTheme,
};

function MyOnChangePlugin({ onChange }) {
  const [editor] = useLexicalComposerContext();
  useEffect(() => {
    return editor.registerUpdateListener(({editorState}) => {
      onChange(editorState);
    });
  }, [editor, onChange]);
  return null;
}

const NoteForm = ({ onSave, onCancel, initialNote = null }) => {
  const [title, setTitle] = useState(initialNote?.title || '');
  const [content, setContent] = useState(null);

  const handleSave = () => {
    onSave({ title, content });
  };

  function onChange(editorState) {
    setContent(editorState);
  }

  return (
    <div className="p-6">
    <h2 className="text-xl font-bold mb-4 text-white">
        {initialNote ? 'Edit Note' : 'Create New Note'}
    </h2>
    
    <div className="mb-4">
        <label className="block text-sm font-medium text-gray-300 mb-2">
        Title
        </label>
        <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-2 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
        placeholder="Enter note title..."
        />
    </div>

    <div className="mb-4">
        <label className="block text-sm font-medium text-gray-300 mb-2">
        Content
        </label>
        <div className="rounded">
        <LexicalComposer initialConfig={editorConfig}>
            <div className="editor-container">
            <ToolbarPlugin />
            <div className="editor-inner">
                <RichTextPlugin
                contentEditable={
                    <ContentEditable
                    className="editor-input"
                    aria-placeholder={placeholder}
                    placeholder={
                        <div className="editor-placeholder">{placeholder}</div>
                    }
                    />
                }
                ErrorBoundary={LexicalErrorBoundary}
                />
                <HistoryPlugin />
                <AutoFocusPlugin />
                <TreeViewPlugin />
                <ImagePlugin />
                <MyOnChangePlugin onChange={onChange}/>
            </div>
            </div>
        </LexicalComposer>
        </div>
    </div>

    <div className="flex justify-end space-x-3">
        <button
        onClick={onCancel}
        className="brain-boom-btn"
        >
        Cancel
        </button>
        <button
        onClick={handleSave}
        className="brain-boom-btn"
        >
        {initialNote ? 'Update' : 'Save'}
        </button>
    </div>
    </div>
  );
};

export default NoteForm;