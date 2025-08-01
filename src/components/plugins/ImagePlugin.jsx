import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getSelection, $isRangeSelection } from 'lexical';
import { useCallback } from 'react';
import { INSERT_IMAGE_COMMAND, $createImageNode } from './ImageNode.jsx';

export default function ImagePlugin() {
  const [editor] = useLexicalComposerContext();

  const insertImage = useCallback(
    (src, altText = '') => {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          const imageNode = $createImageNode(src, altText, undefined, undefined, 1000);
          selection.insertNodes([imageNode]);
        }
      });
    },
    [editor],
  );

  const handleImageUpload = useCallback(
    (files) => {
      if (files.length > 0) {
        const file = files[0];
        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = (e) => {
            const src = e.target.result;
            insertImage(src, file.name);
          };
          reader.readAsDataURL(file);
        }
      }
    },
    [insertImage],
  );

  editor.registerCommand(
    INSERT_IMAGE_COMMAND,
    (payload) => {
      const { src, altText } = payload;
      insertImage(src, altText);
      return true;
    },
    1,
  );

  return null;
}

export { INSERT_IMAGE_COMMAND }; 