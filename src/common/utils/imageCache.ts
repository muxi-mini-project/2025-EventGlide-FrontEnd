import Taro from '@tarojs/taro';

class ImageCache {
  private cacheKeyPrefix = 'img_cache_';
  private expireDays = 7; // 缓存有效期（天）

  /**
   * 获取图片（优先从缓存获取）
   * @param url 图片远程URL
   * @returns 本地缓存路径或原URL
   */
  async getImage(url: string): Promise<string> {
    if (!url) return '';

    try {
      // 尝试从缓存获取
      const cacheInfo = Taro.getStorageSync(this.getCacheKey(url));
      if (cacheInfo && Date.now() < cacheInfo.expireTime) {
        // 验证文件是否存在
        const fileInfo = await Taro.getFileInfo({ filePath: cacheInfo.localPath }).catch(
          () => null
        );
        if (fileInfo) {
          return cacheInfo.localPath;
        }
      }
    } catch (e) {
      console.warn('读取缓存失败:', e);
    }

    // 无缓存或过期，下载并缓存
    return this.downloadAndCache(url);
  }

  /**
   * 下载并缓存图片
   */
  private async downloadAndCache(url: string): Promise<string> {
    try {
      // 下载图片
      const downloadRes = await Taro.downloadFile({ url });
      if (downloadRes.statusCode !== 200) {
        throw new Error(`下载失败，状态码: ${downloadRes.statusCode}`);
      }

      // 保存到本地
      const saveRes = await Taro.saveFile({ tempFilePath: downloadRes.tempFilePath });

      // 类型保护：检查是否为成功结果
      if ('savedFilePath' in saveRes) {
        // 记录缓存信息
        const cacheInfo = {
          localPath: saveRes.savedFilePath,
          expireTime: Date.now() + this.expireDays * 24 * 60 * 60 * 1000,
        };
        Taro.setStorageSync(this.getCacheKey(url), cacheInfo);

        return saveRes.savedFilePath;
      } else {
        throw new Error('保存文件失败');
      }
    } catch (e) {
      console.error('缓存图片失败:', e);
      return url;
    }
  }

  /**
   * 获取缓存Key
   */
  private getCacheKey(url: string): string {
    const fileName = url.split('/').pop() || url;
    return this.cacheKeyPrefix + fileName;
  }

  /**
   * 清理过期缓存
   */
  clearExpiredCache(): void {
    try {
      const keys = Taro.getStorageInfoSync().keys;
      keys.forEach((key) => {
        if (key.startsWith(this.cacheKeyPrefix)) {
          const cacheInfo = Taro.getStorageSync(key);
          if (cacheInfo && Date.now() > cacheInfo.expireTime) {
            // 删除本地文件
            if (cacheInfo.localPath) {
              Taro.removeSavedFile({ filePath: cacheInfo.localPath }).catch(() => {});
            }
            Taro.removeStorageSync(key);
          }
        }
      });
    } catch (e) {
      console.warn('清理缓存失败:', e);
    }
  }

  /**
   * 清空所有缓存
   */
  clearAllCache(): void {
    try {
      const keys = Taro.getStorageInfoSync().keys;
      keys.forEach((key) => {
        if (key.startsWith(this.cacheKeyPrefix)) {
          const cacheInfo = Taro.getStorageSync(key);
          if (cacheInfo?.localPath) {
            Taro.removeSavedFile({ filePath: cacheInfo.localPath }).catch(() => {});
          }
          Taro.removeStorageSync(key);
        }
      });
    } catch (e) {
      console.warn('清空缓存失败:', e);
    }
  }
}

export const imageCache = new ImageCache();
