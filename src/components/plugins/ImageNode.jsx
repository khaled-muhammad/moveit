import {
  $getNodeByKey,
  $getSelection,
  $isNodeSelection,
  $isRangeSelection,
  CLICK_COMMAND,
  COMMAND_PRIORITY_CRITICAL,
  createCommand,
  DecoratorNode,
  KEY_ENTER_COMMAND,
  KEY_ESCAPE_COMMAND,
  SELECTION_CHANGE_COMMAND,
} from 'lexical';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { mergeRegister } from '@lexical/utils';
import { useCallback, useEffect, useRef, useState } from 'react';

export const INSERT_IMAGE_COMMAND = createCommand('INSERT_IMAGE_COMMAND');

export class ImageNode extends DecoratorNode {
  __src;
  __altText;
  __width;
  __height;
  __maxWidth;

  static getType() {
    return 'image';
  }

  static clone(node) {
    return new ImageNode(
      node.__src,
      node.__altText,
      node.__width,
      node.__height,
      node.__maxWidth,
      node.__key,
    );
  }

  constructor(src, altText, width, height, maxWidth, key) {
    super(key);
    this.__src = src;
    this.__altText = altText;
    this.__width = width;
    this.__height = height;
    this.__maxWidth = maxWidth;
  }

  createDOM() {
    const div = document.createElement('div');
    div.style.display = 'contents';
    return div;
  }

  updateDOM() {
    return false;
  }

  static importJSON(serializedNode) {
    const node = $createImageNode(
      serializedNode.src,
      serializedNode.altText,
      serializedNode.width,
      serializedNode.height,
      serializedNode.maxWidth,
    );
    return node;
  }

  exportJSON() {
    return {
      ...super.exportJSON(),
      altText: this.__altText,
      height: this.__height,
      maxWidth: this.__maxWidth,
      src: this.__src,
      type: 'image',
      version: 1,
      width: this.__width,
    };
  }

  static importDOM() {
    return {
      img: (node) => ({
        conversion: convertImageElement,
        priority: 0,
      }),
    };
  }

  exportDOM() {
    const element = document.createElement('img');
    element.setAttribute('src', this.__src);
    element.setAttribute('alt', this.__altText);
    element.setAttribute('width', this.__width);
    element.setAttribute('height', this.__height);
    return { element };
  }

  setWidthAndHeight(width, height) {
    const writable = this.getWritable();
    writable.__width = width;
    writable.__height = height;
  }

  setSrc(src) {
    const writable = this.getWritable();
    writable.__src = src;
  }

  setAltText(altText) {
    const writable = this.getWritable();
    writable.__altText = altText;
  }

  // View
  decorate() {
    return (
      <ImageComponent
        src={this.__src}
        altText={this.__altText}
        width={this.__width}
        height={this.__height}
        maxWidth={this.__maxWidth}
        nodeKey={this.getKey()}
        resizable={true}
      />
    );
  }
}

function convertImageElement(domNode) {
  if (domNode instanceof HTMLImageElement) {
    const { alt: altText, src, width, height } = domNode;
    const node = $createImageNode(
      altText,
      height === 0 ? undefined : height,
      1000,
      src,
      width === 0 ? undefined : width,
    );
    return { node };
  }
  return null;
}

function $createImageNode(src, altText, width, height, maxWidth) {
  return new ImageNode(src, altText, width, height, maxWidth);
}

function $isImageNode(node) {
  return node instanceof ImageNode;
}

function ImageComponent({
  src,
  altText,
  width,
  height,
  maxWidth,
  nodeKey,
  resizable,
}) {
  const [isSelected, setIsSelected] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [selection, setSelection] = useState(null);
  const [showDeleteButton, setShowDeleteButton] = useState(false);
  const [editor] = useLexicalComposerContext();
  const imageRef = useRef(null);
  const buttonRef = useRef(null);
  
  const isReadOnly = editor.isEditable() === false;

  const onDelete = useCallback(
    (event) => {
      event.preventDefault();
      event.stopPropagation();
      editor.update(() => {
        const node = $getNodeByKey(nodeKey);
        if ($isImageNode(node)) {
          node.remove();
        }
      });
      setIsSelected(false);
    },
    [editor, nodeKey],
  );

  const onEnter = useCallback(
    (event) => {
      if (event.ctrlKey || event.metaKey) {
        event.preventDefault();
        const imageElement = imageRef.current;
        if (imageElement === null) {
          return;
        }
        const { width, height } = imageElement;
        editor.update(() => {
          const node = $getNodeByKey(nodeKey);
          if ($isImageNode(node)) {
            node.setWidthAndHeight(
              Math.round(width),
              Math.round(height),
            );
          }
        });
      }
      return false;
    },
    [editor, nodeKey],
  );

  const onEscape = useCallback(
    (event) => {
      const node = $getNodeByKey(nodeKey);
      if ($isImageNode(node)) {
        setIsSelected(false);
      }
      return false;
    },
    [nodeKey],
  );

  const onClick = useCallback(
    (event) => {
      if (isReadOnly) return;
      event.preventDefault();
      setIsSelected(true);
    },
    [isReadOnly],
  );

  const onResizeMouseDown = useCallback(
    (event) => {
      event.preventDefault();
      event.stopPropagation();
      setIsResizing(true);
    },
    [],
  );

  const onResizeMouseMove = useCallback(
    (event) => {
      if (isResizing) {
        const imageElement = imageRef.current;
        if (imageElement === null) {
          return;
        }
        const rect = imageElement.getBoundingClientRect();
        const newWidth = Math.max(50, event.clientX - rect.left);
        const newHeight = Math.max(50, event.clientY - rect.top);
        
        editor.update(() => {
          const node = $getNodeByKey(nodeKey);
          if ($isImageNode(node)) {
            node.setWidthAndHeight(Math.round(newWidth), Math.round(newHeight));
          }
        });
      }
    },
    [editor, isResizing, nodeKey],
  );

  const onResizeMouseUp = useCallback(() => {
    setIsResizing(false);
  }, []);

  const onLoad = useCallback((event) => {
    const { naturalWidth, naturalHeight } = event.target;
    if (naturalWidth !== 0 && naturalHeight !== 0) {
      const node = $getNodeByKey(nodeKey);
      if ($isImageNode(node)) {
        node.setWidthAndHeight(naturalWidth, naturalHeight);
      }
    }
  }, [nodeKey]);

  useEffect(() => {
    let isMounted = true;
    const unregister = mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        if (isMounted) {
          setSelection(editorState.read(() => $getSelection()));
        }
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        (_, activeEditor) => {
          if (isMounted) {
            const currentSelection = $getSelection();
            const isNodeSelected = $isNodeSelection(currentSelection) && 
              currentSelection.has(nodeKey);
            setIsSelected(isNodeSelected);
          }
          return false;
        },
        COMMAND_PRIORITY_CRITICAL,
      ),
      editor.registerCommand(
        CLICK_COMMAND,
        (event) => {
          if (isMounted) {
            if (isSelected && $isNodeSelection(selection)) {
              setIsSelected(false);
              return true;
            }
          }
          return false;
        },
        COMMAND_PRIORITY_CRITICAL,
      ),
      editor.registerCommand(
        KEY_ENTER_COMMAND,
        onEnter,
        COMMAND_PRIORITY_CRITICAL,
      ),
      editor.registerCommand(
        KEY_ESCAPE_COMMAND,
        onEscape,
        COMMAND_PRIORITY_CRITICAL,
      ),
    );
    return () => {
      isMounted = false;
      unregister();
    };
  }, [editor, isSelected, onEnter, onEscape, selection]);

  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', onResizeMouseMove);
      document.addEventListener('mouseup', onResizeMouseUp);
      return () => {
        document.removeEventListener('mousemove', onResizeMouseMove);
        document.removeEventListener('mouseup', onResizeMouseUp);
      };
    }
  }, [isResizing, onResizeMouseMove, onResizeMouseUp]);

  const draggable = isSelected && $isNodeSelection(selection);
  const isFocused = isSelected;

  return (
    <div 
      draggable={draggable}
      style={{ display: 'inline-block', maxWidth: '100%' }}
    >
      <div
        className={`image-node ${isFocused ? 'focused' : ''}`}
        style={{
          display: 'inline-block',
          position: 'relative',
          cursor: 'default',
          outline: isFocused ? '2px solid #7F5AF0' : 'none',
        }}
        onClick={onClick}
        onMouseEnter={() => !isReadOnly && setShowDeleteButton(true)}
        onMouseLeave={() => !isReadOnly && setShowDeleteButton(false)}
      >
        <img
          className="image"
          src={src}
          alt={altText}
          ref={imageRef}
          style={{
            display: 'block',
            maxWidth: '100%',
            width: width,
            height: height,
          }}
          draggable={false}
          onLoad={onLoad}
        />
        {!isReadOnly && (isFocused || showDeleteButton) && (
          <>
            <button
              className="image-edit-button"
              ref={buttonRef}
              onClick={onDelete}
              onMouseDown={(e) => e.stopPropagation()}
              style={{
                background: 'rgba(0, 0, 0, 0.8)',
                border: 'none',
                borderRadius: '4px',
                color: 'white',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: 'bold',
                padding: '4px 8px',
                position: 'absolute',
                right: '4px',
                top: '4px',
                zIndex: 10,
                transition: 'all 0.2s ease',
              }}
            >
              Delete
            </button>
            <button
              className="image-edit-button"
              onClick={() => {
                const newAltText = prompt('Enter alt text for image:', altText || '');
                if (newAltText !== null) {
                  editor.update(() => {
                    const node = $getNodeByKey(nodeKey);
                    if ($isImageNode(node)) {
                      node.setAltText(newAltText);
                    }
                  });
                }
              }}
              onMouseDown={(e) => e.stopPropagation()}
              style={{
                background: 'rgba(0, 0, 0, 0.8)',
                border: 'none',
                borderRadius: '4px',
                color: 'white',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: 'bold',
                padding: '4px 8px',
                position: 'absolute',
                right: '4px',
                top: '32px',
                zIndex: 10,
                transition: 'all 0.2s ease',
              }}
            >
              Alt
            </button>
          </>
        )}
        {!isReadOnly && resizable && (isFocused || showDeleteButton) && (
          <div
            className="image-resizer"
            style={{
              background: 'rgba(0, 0, 0, 0.8)',
              border: '2px solid #7F5AF0',
              borderRadius: '4px',
              bottom: '-6px',
              cursor: 'se-resize',
              height: '12px',
              position: 'absolute',
              right: '-6px',
              width: '12px',
              zIndex: 10,
              transition: 'all 0.2s ease',
            }}
            onMouseDown={onResizeMouseDown}
          />
        )}
      </div>
    </div>
  );
}


export { $createImageNode, $isImageNode };