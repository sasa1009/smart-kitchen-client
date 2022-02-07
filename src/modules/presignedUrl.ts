import { PresignedUrlApi, Configuration } from '@/api';
import type { GetPresignedUrlResponse } from '@/api';
import { authData } from '@/modules/auth';
import axios from 'axios';

/**
 * バックエンドにアクセスして署名付きURLを取得する
 */
export async function getPresignedUrl(fileName: string): Promise<GetPresignedUrlResponse | undefined> {
  // ログイン確認
  if (authData.value.userId === null) throw new Error('未ログインです。');

  const configuration = new Configuration({ basePath: process.env.VUE_APP_API_BASE_URL });
  const response = await new PresignedUrlApi(configuration).getPresignedUrl(authData.value.uid, authData.value.accessToken, authData.value.client, authData.value.userId, fileName);
  if (response.status !== 200) throw new Error('署名付きURLの取得に失敗しました。');
  return response.data as GetPresignedUrlResponse;
}

/**
 * 画像ファイルをS3にアップロードする
 */
export async function uploadImageFileToS3(file: File) {
  // ログイン確認
  if (authData.value.userId === null) throw new Error('未ログインです。');

  // バックエンドから署名付きURLを取得
  const configuration = new Configuration({ basePath: process.env.VUE_APP_API_BASE_URL });
  const presignedUrlResponse = await new PresignedUrlApi(configuration).getPresignedUrl(authData.value.uid, authData.value.accessToken, authData.value.client, authData.value.userId, file.name);

  // S3にファイルをアップロード
  const uploadResponse = await axios.put(presignedUrlResponse.data.url, file);

  if (uploadResponse.status === 200) {
    return {
      image_url: presignedUrlResponse.data.url.split('?')[0],
      image_key: presignedUrlResponse.data.key
    };
  } else {
    throw new Error('ファイルのアップロードに失敗しました。');
  }
}
