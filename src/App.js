import { useState, useEffect } from 'react';
import { EditorState, convertToRaw, convertFromRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import ls from 'local-storage';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

export const App = () => {
  const [editorState, setEditorState] = useState(
    EditorState.createWithContent(convertFromRaw(ls.get('editorStateKey'))) ||
      EditorState.createEmpty()
  );

  useEffect(() => {
    ls.set('editorStateKey', convertToRaw(editorState.getCurrentContent()));
  }, [editorState]);

  return (
    <div>
      <Editor
        editorState={editorState}
        onEditorStateChange={setEditorState}
        wrapperClassName={'demo-wrapper'}
        toolbarClassName={'demo-toolbar'}
        editorClassName={'demo-editor'}
      />
    </div>
  );
};
