import { PresignedUrlApi, Configuration } from '@/api';
import type { GetPresignedUrlResponse } from '@/api';
import { authData } from '@/modules/auth';

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
