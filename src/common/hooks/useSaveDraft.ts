import { useState, useCallback } from 'react';
import Taro from '@tarojs/taro';
import { post } from '@/common/api/request';
import { SaveDraftRequest } from '../types';

interface UseDraftOptions {
  endpoint?: string; // API端点，默认为 '/act/draft'
  additionalData?: Record<string, any>; // 额外的数据字段
  onSaveSuccess?: (response: any) => void;
  onSaveError?: (error: any) => void;
}

export const useSaveDraft = (options: UseDraftOptions = {}) => {
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const saveDraft = useCallback(
    async (draftData: SaveDraftRequest) => {
      setIsSaving(true);
      setSaveError(null);

      try {
        // 合并额外数据
        const finalData = {
          ...draftData,
          ...options.additionalData,
        };
        console.log('Saving draft with data:', finalData);

        const response = await post(options.endpoint || '/act/draft', finalData);

        if (response.msg === 'success') {
          Taro.showToast({
            title: '草稿保存成功',
            icon: 'success',
            duration: 1000,
          });

          options.onSaveSuccess?.(response);
          return response;
        } else {
          throw new Error(response.msg || '保存失败');
        }
      } catch (error) {
        setSaveError(error.message || '草稿保存失败');
        Taro.showToast({
          title: error.message || '草稿保存失败',
          icon: 'none',
          duration: 2000,
        });

        options.onSaveError?.(error);
        throw error;
      } finally {
        setIsSaving(false);
      }
    },
    [options]
  );

  return {
    isSaving,
    saveError,
    saveDraft,
  };
};
