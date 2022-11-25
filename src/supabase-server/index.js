import { createClient } from '@supabase/supabase-js';
import { uid } from 'uid';

const REACT_APP_SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL;
const REACT_APP_SUPABASE_KEY = process.env.REACT_APP_SUPABASE_KEY;

export const supabase = createClient(
  REACT_APP_SUPABASE_URL,
  REACT_APP_SUPABASE_KEY
);

export const uploadImageCallBack = (file) => {
  return supabase.storage
    .from('images')
    .upload(
      process.env.REACT_APP_USER_ID + '/public/' + uid() + file?.name,
      file
    )
    .then((res) => {
      return {
        data: {
          link:
            'https://folvtzaouelagubqfhkt.supabase.co/storage/v1/object/public/images/' +
            res.data.path,
        },
      };
    });
};

const supabasePublicImagesGet = async () => {
  return await supabase.storage
    .from('images')
    .list(process.env.REACT_APP_USER_ID + '/public')
    .then((res) =>
      res.data.map(
        (obj) => process.env.REACT_APP_USER_ID + '/public/' + obj.name
      )
    );
};

export const supabaseGet = async (
  { isRemoveOldImages } = { isRemoveOldImages: false }
) => {
  const { data } = await supabase
    .from('drafts')
    .select()
    .eq('id', process.env.REACT_APP_USER_ID)
    .single();

  if (isRemoveOldImages && data) {
    const savedPaths = Object.values(data.draft.entityMap).map(
      (obj) => obj.data.src
    );
    let removePaths = await supabasePublicImagesGet();
    removePaths = removePaths.filter(
      (path) => !savedPaths.find((savedPath) => savedPath.includes(path))
    );

    if (removePaths.length)
      await supabase.storage.from('images').remove(removePaths);
  }

  return data?.draft;
};

export const supabaseSave = async (data) => {
  const draft = await supabaseGet();

  if (!draft) {
    await supabase.from('drafts').insert([{ draft: data }]);
    return;
  }

  await supabase
    .from('drafts')
    .update({ draft: data })
    .eq('id', process.env.REACT_APP_USER_ID);
};
