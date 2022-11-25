import { useState, useEffect, useRef } from 'react';
import { EditorState, convertToRaw, convertFromRaw } from 'draft-js';
import ls from 'local-storage';
import { supabaseGet, supabaseSave } from '../supabase-server';

const localstorageGet = async () => {
  return ls.get('editorStateKey');
};

const strapiGet = async () => {
  return;
};

const getDraft = {
  localstorageMode: localstorageGet,
  supabaseMode: supabaseGet,
  strapiMode: strapiGet,
};

const localstorageSave = (data) => {
  ls.set('editorStateKey', data);
};

const strapiSave = async (data) => {};

const saveDraft = {
  localstorageMode: localstorageSave,
  supabaseMode: supabaseSave,
  strapiMode: strapiSave,
};

export const useFeature = () => {
  const controlDraftModeOnce = useRef(
    ls.get('controlDraftMode') || 'localstorageMode'
  );
  const [controlDraftMode, setControlDraftMode] = useState(
    controlDraftModeOnce.current
  );
  const [editorState, setEditorState] = useState();

  useEffect(() => {
    getDraft[controlDraftModeOnce.current]({ isRemoveOldImages: true })
      .then((res) => {
        if (!res) return EditorState.createEmpty();

        res = convertFromRaw(res);
        return EditorState.createWithContent(res);
      })
      .then((res) => {
        setEditorState(res);
      });
  }, []);

  const handleSaveDraftClick = async (e) => {
    e.preventDefault();

    const data = convertToRaw(editorState.getCurrentContent());
    saveDraft[controlDraftMode](data);
  };

  // autosave localstorage
  // useEffect(() => {
  //   ls.set('editorStateKey', convertToRaw(editorState.getCurrentContent()));
  // }, [editorState]);

  const handleControlDraftModeChange = (e) => {
    setControlDraftMode(e.target.value);
    ls.set('controlDraftMode', e.target.value);
  };

  return {
    controlDraftMode,
    editorState,
    onEditorStateChange: setEditorState,
    handleSaveDraftClick,
    handleControlDraftModeChange,
  };
};
