import { Editor } from 'react-draft-wysiwyg';
import { useFeature } from './useFeature';
import { uploadImageCallBack } from '../supabase-server';

import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import './ReactDraftWysiwyg.css';

export const ReactDraftWysiwyg = () => {
  const {
    controlDraftMode,
    editorState,
    onEditorStateChange,
    handleSaveDraftClick,
    handleControlDraftModeChange,
  } = useFeature();

  return (
    <div>
      <button className={'save-draft'} onClick={handleSaveDraftClick}>
        SAVE DRAFT
      </button>
      {/* <input type={'checkbox'} value={isAutoSave} /> */}
      <div className={'controlDraftModes'}>
        <input
          type={'radio'}
          id={'localstorage'}
          name={'controlDraftMode'}
          value={'localstorageMode'}
          checked={controlDraftMode === 'localstorageMode'}
          onChange={handleControlDraftModeChange}
        />
        <label htmlFor={'localstorage'}>LocalStorage</label>
        <input
          type={'radio'}
          id={'supabase'}
          name={'controlDraftMode'}
          value={'supabaseMode'}
          checked={controlDraftMode === 'supabaseMode'}
          onChange={handleControlDraftModeChange}
        />
        <label htmlFor={'supabase'}>SupaBase</label>
        <input
          type={'radio'}
          id={'strapi'}
          name={'controlDraftMode'}
          value={'strapiMode'}
          checked={controlDraftMode === 'strapiMode'}
          onChange={handleControlDraftModeChange}
        />
        <label htmlFor={'strapi'}>Strapi</label>
      </div>
      {editorState && (
        <>
          {controlDraftMode !== 'localstorageMode' && (
            <Editor
              editorState={editorState}
              onEditorStateChange={onEditorStateChange}
              wrapperClassName={'demo-wrapper'}
              toolbarClassName={'demo-toolbar'}
              editorClassName={'demo-editor'}
              toolbar={{
                image: {
                  popupClassName: 'demo-toolbar-image',
                  uploadCallback: uploadImageCallBack,
                  alt: { present: true, mandatory: false },
                },
                embedded: {
                  embedCallback: (...data) => {
                    console.log(data);
                  },
                },
              }}
            />
          )}
          {controlDraftMode === 'localstorageMode' && (
            <Editor
              editorState={editorState}
              onEditorStateChange={onEditorStateChange}
              wrapperClassName={'demo-wrapper'}
              toolbarClassName={'demo-toolbar'}
              editorClassName={'demo-editor'}
            />
          )}
        </>
      )}
    </div>
  );
};
