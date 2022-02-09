/* tslint:disable */
/* eslint-disable */
/**
 * SMART KITCHEN API
 * SMART KITCHEN用API
 *
 * The version of the OpenAPI document: 1.0.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


import { Configuration } from './configuration';
import globalAxios, { AxiosPromise, AxiosInstance, AxiosRequestConfig } from 'axios';
// Some imports not used depending on template conditions
// @ts-ignore
import { DUMMY_BASE_URL, assertParamExists, setApiKeyToObject, setBasicAuthToObject, setBearerAuthToObject, setOAuthToObject, setSearchParams, serializeDataIfNeeded, toPathString, createRequestFunction } from './common';
// @ts-ignore
import { BASE_PATH, COLLECTION_FORMATS, RequestArgs, BaseAPI, RequiredError } from './base';

/**
 * 新規登録するレシピ情報
 * @export
 * @interface CreateRecipeRequest
 */
export interface CreateRecipeRequest {
    /**
     * レシピのタイトル
     * @type {string}
     * @memberof CreateRecipeRequest
     */
    'title': string;
    /**
     * コメント
     * @type {string}
     * @memberof CreateRecipeRequest
     */
    'comment': string;
    /**
     * レシピの分量
     * @type {number}
     * @memberof CreateRecipeRequest
     */
    'amount': number;
    /**
     * レシピの一人分のカロリー
     * @type {number}
     * @memberof CreateRecipeRequest
     */
    'calorie': number;
    /**
     * メインの食材
     * @type {string}
     * @memberof CreateRecipeRequest
     */
    'main_ingredient': string;
    /**
     * カテゴリー
     * @type {string}
     * @memberof CreateRecipeRequest
     */
    'category': string;
    /**
     * コツ・ポイント
     * @type {string}
     * @memberof CreateRecipeRequest
     */
    'tips': string;
    /**
     * メイン画像のURL
     * @type {string}
     * @memberof CreateRecipeRequest
     */
    'image_url': string | null;
    /**
     * メイン画像のkey
     * @type {string}
     * @memberof CreateRecipeRequest
     */
    'image_key': string | null;
    /**
     * レシピで使用する材料
     * @type {Array<CreateRecipeRequestIngredients>}
     * @memberof CreateRecipeRequest
     */
    'ingredients': Array<CreateRecipeRequestIngredients>;
    /**
     * 手順
     * @type {Array<CreateRecipeRequestProcedures>}
     * @memberof CreateRecipeRequest
     */
    'procedures': Array<CreateRecipeRequestProcedures>;
}
/**
 * 
 * @export
 * @interface CreateRecipeRequestIngredients
 */
export interface CreateRecipeRequestIngredients {
    /**
     * 食材の並び順
     * @type {number}
     * @memberof CreateRecipeRequestIngredients
     */
    'index': number;
    /**
     * 材料名
     * @type {string}
     * @memberof CreateRecipeRequestIngredients
     */
    'name': string;
    /**
     * 分量
     * @type {string}
     * @memberof CreateRecipeRequestIngredients
     */
    'amount': string;
}
/**
 * 
 * @export
 * @interface CreateRecipeRequestProcedures
 */
export interface CreateRecipeRequestProcedures {
    /**
     * 手順の並び順
     * @type {number}
     * @memberof CreateRecipeRequestProcedures
     */
    'index': number;
    /**
     * 手順の詳細
     * @type {string}
     * @memberof CreateRecipeRequestProcedures
     */
    'description': string;
    /**
     * 手順の画像のURL
     * @type {string}
     * @memberof CreateRecipeRequestProcedures
     */
    'image_url': string | null;
    /**
     * 手順の画像のkey
     * @type {string}
     * @memberof CreateRecipeRequestProcedures
     */
    'image_key': string | null;
}
/**
 * 登録が成功した場合のレスポンス
 * @export
 * @interface CreateResponse
 */
export interface CreateResponse {
    /**
     * 登録したリソースのID
     * @type {number}
     * @memberof CreateResponse
     */
    'id': number;
}
/**
 * ログイン中のユーザー情報のルートプロパティ
 * @export
 * @interface CurrentUserResponse
 */
export interface CurrentUserResponse {
    /**
     * 
     * @type {CurrentUserResponseUser}
     * @memberof CurrentUserResponse
     */
    'user': CurrentUserResponseUser;
}
/**
 * ログイン中のユーザー情報
 * @export
 * @interface CurrentUserResponseUser
 */
export interface CurrentUserResponseUser {
    /**
     * ユーザーID
     * @type {number}
     * @memberof CurrentUserResponseUser
     */
    'id': number;
    /**
     * ユーザー名
     * @type {string}
     * @memberof CurrentUserResponseUser
     */
    'name': string;
    /**
     * 一言コメント
     * @type {string}
     * @memberof CurrentUserResponseUser
     */
    'comment': string | null;
    /**
     * ユーザーの画像のURL
     * @type {string}
     * @memberof CurrentUserResponseUser
     */
    'image_url': string | null;
}
/**
 * 署名付きURL情報
 * @export
 * @interface GetPresignedUrlResponse
 */
export interface GetPresignedUrlResponse {
    /**
     * ファイルのアップロードに使用する署名付きURL
     * @type {string}
     * @memberof GetPresignedUrlResponse
     */
    'url': string;
    /**
     * ファイルのバケットのルートからのパス
     * @type {string}
     * @memberof GetPresignedUrlResponse
     */
    'key': string;
}
/**
 * 単一のレシピ情報のルートプロパティ
 * @export
 * @interface GetRecipeResponse
 */
export interface GetRecipeResponse {
    /**
     * 
     * @type {GetRecipeResponseRecipe}
     * @memberof GetRecipeResponse
     */
    'recipe': GetRecipeResponseRecipe;
}
/**
 * 単一のレシピ情報
 * @export
 * @interface GetRecipeResponseRecipe
 */
export interface GetRecipeResponseRecipe {
    /**
     * レシピのID
     * @type {number}
     * @memberof GetRecipeResponseRecipe
     */
    'id': number;
    /**
     * レシピのタイトル
     * @type {string}
     * @memberof GetRecipeResponseRecipe
     */
    'title': string;
    /**
     * コメント
     * @type {string}
     * @memberof GetRecipeResponseRecipe
     */
    'comment': string;
    /**
     * レシピの分量
     * @type {number}
     * @memberof GetRecipeResponseRecipe
     */
    'amount': number;
    /**
     * レシピの一人分のカロリー
     * @type {number}
     * @memberof GetRecipeResponseRecipe
     */
    'calorie': number;
    /**
     * メインの食材
     * @type {string}
     * @memberof GetRecipeResponseRecipe
     */
    'main_ingredient': string;
    /**
     * カテゴリー
     * @type {string}
     * @memberof GetRecipeResponseRecipe
     */
    'category': string;
    /**
     * コツ・ポイント
     * @type {string}
     * @memberof GetRecipeResponseRecipe
     */
    'tips': string;
    /**
     * メイン画像のURL
     * @type {string}
     * @memberof GetRecipeResponseRecipe
     */
    'image_url': string | null;
    /**
     * 
     * @type {GetRecipeResponseRecipeUser}
     * @memberof GetRecipeResponseRecipe
     */
    'user': GetRecipeResponseRecipeUser;
    /**
     * レシピで使用する材料
     * @type {Array<CreateRecipeRequestIngredients>}
     * @memberof GetRecipeResponseRecipe
     */
    'ingredients': Array<CreateRecipeRequestIngredients>;
    /**
     * 手順
     * @type {Array<GetRecipeResponseRecipeProcedures>}
     * @memberof GetRecipeResponseRecipe
     */
    'procedures': Array<GetRecipeResponseRecipeProcedures>;
}
/**
 * 
 * @export
 * @interface GetRecipeResponseRecipeProcedures
 */
export interface GetRecipeResponseRecipeProcedures {
    /**
     * 手順の並び順
     * @type {number}
     * @memberof GetRecipeResponseRecipeProcedures
     */
    'index': number;
    /**
     * 手順の詳細
     * @type {string}
     * @memberof GetRecipeResponseRecipeProcedures
     */
    'description': string;
    /**
     * 手順の画像のURL
     * @type {string}
     * @memberof GetRecipeResponseRecipeProcedures
     */
    'image_url': string | null;
}
/**
 * レシピを作成したユーザー情報
 * @export
 * @interface GetRecipeResponseRecipeUser
 */
export interface GetRecipeResponseRecipeUser {
    /**
     * ユーザーのID
     * @type {number}
     * @memberof GetRecipeResponseRecipeUser
     */
    'id': number;
    /**
     * ユーザー名
     * @type {string}
     * @memberof GetRecipeResponseRecipeUser
     */
    'name': string;
    /**
     * 一言コメント
     * @type {string}
     * @memberof GetRecipeResponseRecipeUser
     */
    'comment': string;
    /**
     * ユーザーの画像のURL
     * @type {string}
     * @memberof GetRecipeResponseRecipeUser
     */
    'image_url': string | null;
}
/**
 * 更新するユーザー情報
 * @export
 * @interface UpdateCurrentUserRequest
 */
export interface UpdateCurrentUserRequest {
    /**
     * ユーザー名
     * @type {string}
     * @memberof UpdateCurrentUserRequest
     */
    'name'?: string;
    /**
     * 一言コメント
     * @type {string}
     * @memberof UpdateCurrentUserRequest
     */
    'comment'?: string;
    /**
     * ユーザーの画像のURL
     * @type {string}
     * @memberof UpdateCurrentUserRequest
     */
    'image_url'?: string;
    /**
     * ユーザーの画像のkey
     * @type {string}
     * @memberof UpdateCurrentUserRequest
     */
    'image_key'?: string;
}

/**
 * CurrentUserApi - axios parameter creator
 * @export
 */
export const CurrentUserApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * ログイン中のユーザー情報を取得する
         * @summary ログイン中のユーザー情報を取得する
         * @param {string} uid devise-token-auth用のuid
         * @param {string} accessToken devise-token-auth用のaccess-token
         * @param {string} client devise-token-auth用のclient
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getCurrentUser: async (uid: string, accessToken: string, client: string, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'uid' is not null or undefined
            assertParamExists('getCurrentUser', 'uid', uid)
            // verify required parameter 'accessToken' is not null or undefined
            assertParamExists('getCurrentUser', 'accessToken', accessToken)
            // verify required parameter 'client' is not null or undefined
            assertParamExists('getCurrentUser', 'client', client)
            const localVarPath = `/auth/sessions`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            if (uid !== undefined && uid !== null) {
                localVarHeaderParameter['uid'] = String(uid);
            }

            if (accessToken !== undefined && accessToken !== null) {
                localVarHeaderParameter['access-token'] = String(accessToken);
            }

            if (client !== undefined && client !== null) {
                localVarHeaderParameter['client'] = String(client);
            }


    
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * ログイン中のユーザー情報を更新する
         * @summary ログイン中のユーザー情報を更新する
         * @param {string} uid devise-token-auth用のuid
         * @param {string} accessToken devise-token-auth用のaccess-token
         * @param {string} client devise-token-auth用のclient
         * @param {number} userId ログイン中のユーザーのID
         * @param {UpdateCurrentUserRequest} updateCurrentUserRequest 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        updateCurrentUser: async (uid: string, accessToken: string, client: string, userId: number, updateCurrentUserRequest: UpdateCurrentUserRequest, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'uid' is not null or undefined
            assertParamExists('updateCurrentUser', 'uid', uid)
            // verify required parameter 'accessToken' is not null or undefined
            assertParamExists('updateCurrentUser', 'accessToken', accessToken)
            // verify required parameter 'client' is not null or undefined
            assertParamExists('updateCurrentUser', 'client', client)
            // verify required parameter 'userId' is not null or undefined
            assertParamExists('updateCurrentUser', 'userId', userId)
            // verify required parameter 'updateCurrentUserRequest' is not null or undefined
            assertParamExists('updateCurrentUser', 'updateCurrentUserRequest', updateCurrentUserRequest)
            const localVarPath = `/users/{userId}`
                .replace(`{${"userId"}}`, encodeURIComponent(String(userId)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'PATCH', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            if (uid !== undefined && uid !== null) {
                localVarHeaderParameter['uid'] = String(uid);
            }

            if (accessToken !== undefined && accessToken !== null) {
                localVarHeaderParameter['access-token'] = String(accessToken);
            }

            if (client !== undefined && client !== null) {
                localVarHeaderParameter['client'] = String(client);
            }


    
            localVarHeaderParameter['Content-Type'] = 'application/json';

            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
            localVarRequestOptions.data = serializeDataIfNeeded(updateCurrentUserRequest, localVarRequestOptions, configuration)

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
    }
};

/**
 * CurrentUserApi - functional programming interface
 * @export
 */
export const CurrentUserApiFp = function(configuration?: Configuration) {
    const localVarAxiosParamCreator = CurrentUserApiAxiosParamCreator(configuration)
    return {
        /**
         * ログイン中のユーザー情報を取得する
         * @summary ログイン中のユーザー情報を取得する
         * @param {string} uid devise-token-auth用のuid
         * @param {string} accessToken devise-token-auth用のaccess-token
         * @param {string} client devise-token-auth用のclient
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getCurrentUser(uid: string, accessToken: string, client: string, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<CurrentUserResponse>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.getCurrentUser(uid, accessToken, client, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
        /**
         * ログイン中のユーザー情報を更新する
         * @summary ログイン中のユーザー情報を更新する
         * @param {string} uid devise-token-auth用のuid
         * @param {string} accessToken devise-token-auth用のaccess-token
         * @param {string} client devise-token-auth用のclient
         * @param {number} userId ログイン中のユーザーのID
         * @param {UpdateCurrentUserRequest} updateCurrentUserRequest 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async updateCurrentUser(uid: string, accessToken: string, client: string, userId: number, updateCurrentUserRequest: UpdateCurrentUserRequest, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<CurrentUserResponse>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.updateCurrentUser(uid, accessToken, client, userId, updateCurrentUserRequest, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
    }
};

/**
 * CurrentUserApi - factory interface
 * @export
 */
export const CurrentUserApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
    const localVarFp = CurrentUserApiFp(configuration)
    return {
        /**
         * ログイン中のユーザー情報を取得する
         * @summary ログイン中のユーザー情報を取得する
         * @param {string} uid devise-token-auth用のuid
         * @param {string} accessToken devise-token-auth用のaccess-token
         * @param {string} client devise-token-auth用のclient
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getCurrentUser(uid: string, accessToken: string, client: string, options?: any): AxiosPromise<CurrentUserResponse> {
            return localVarFp.getCurrentUser(uid, accessToken, client, options).then((request) => request(axios, basePath));
        },
        /**
         * ログイン中のユーザー情報を更新する
         * @summary ログイン中のユーザー情報を更新する
         * @param {string} uid devise-token-auth用のuid
         * @param {string} accessToken devise-token-auth用のaccess-token
         * @param {string} client devise-token-auth用のclient
         * @param {number} userId ログイン中のユーザーのID
         * @param {UpdateCurrentUserRequest} updateCurrentUserRequest 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        updateCurrentUser(uid: string, accessToken: string, client: string, userId: number, updateCurrentUserRequest: UpdateCurrentUserRequest, options?: any): AxiosPromise<CurrentUserResponse> {
            return localVarFp.updateCurrentUser(uid, accessToken, client, userId, updateCurrentUserRequest, options).then((request) => request(axios, basePath));
        },
    };
};

/**
 * CurrentUserApi - object-oriented interface
 * @export
 * @class CurrentUserApi
 * @extends {BaseAPI}
 */
export class CurrentUserApi extends BaseAPI {
    /**
     * ログイン中のユーザー情報を取得する
     * @summary ログイン中のユーザー情報を取得する
     * @param {string} uid devise-token-auth用のuid
     * @param {string} accessToken devise-token-auth用のaccess-token
     * @param {string} client devise-token-auth用のclient
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof CurrentUserApi
     */
    public getCurrentUser(uid: string, accessToken: string, client: string, options?: AxiosRequestConfig) {
        return CurrentUserApiFp(this.configuration).getCurrentUser(uid, accessToken, client, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * ログイン中のユーザー情報を更新する
     * @summary ログイン中のユーザー情報を更新する
     * @param {string} uid devise-token-auth用のuid
     * @param {string} accessToken devise-token-auth用のaccess-token
     * @param {string} client devise-token-auth用のclient
     * @param {number} userId ログイン中のユーザーのID
     * @param {UpdateCurrentUserRequest} updateCurrentUserRequest 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof CurrentUserApi
     */
    public updateCurrentUser(uid: string, accessToken: string, client: string, userId: number, updateCurrentUserRequest: UpdateCurrentUserRequest, options?: AxiosRequestConfig) {
        return CurrentUserApiFp(this.configuration).updateCurrentUser(uid, accessToken, client, userId, updateCurrentUserRequest, options).then((request) => request(this.axios, this.basePath));
    }
}


/**
 * PresignedUrlApi - axios parameter creator
 * @export
 */
export const PresignedUrlApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * S3の署名付きURLを取得する
         * @summary S3の署名付きURLを取得する
         * @param {string} uid devise-token-auth用のuid
         * @param {string} accessToken devise-token-auth用のaccess-token
         * @param {string} client devise-token-auth用のclient
         * @param {number} userId ログイン中のユーザーのID
         * @param {string} fileName S3にアップロードする予定のファイルの名前
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getPresignedUrl: async (uid: string, accessToken: string, client: string, userId: number, fileName: string, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'uid' is not null or undefined
            assertParamExists('getPresignedUrl', 'uid', uid)
            // verify required parameter 'accessToken' is not null or undefined
            assertParamExists('getPresignedUrl', 'accessToken', accessToken)
            // verify required parameter 'client' is not null or undefined
            assertParamExists('getPresignedUrl', 'client', client)
            // verify required parameter 'userId' is not null or undefined
            assertParamExists('getPresignedUrl', 'userId', userId)
            // verify required parameter 'fileName' is not null or undefined
            assertParamExists('getPresignedUrl', 'fileName', fileName)
            const localVarPath = `/presigned-url`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            if (userId !== undefined) {
                localVarQueryParameter['userId'] = userId;
            }

            if (fileName !== undefined) {
                localVarQueryParameter['fileName'] = fileName;
            }

            if (uid !== undefined && uid !== null) {
                localVarHeaderParameter['uid'] = String(uid);
            }

            if (accessToken !== undefined && accessToken !== null) {
                localVarHeaderParameter['access-token'] = String(accessToken);
            }

            if (client !== undefined && client !== null) {
                localVarHeaderParameter['client'] = String(client);
            }


    
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
    }
};

/**
 * PresignedUrlApi - functional programming interface
 * @export
 */
export const PresignedUrlApiFp = function(configuration?: Configuration) {
    const localVarAxiosParamCreator = PresignedUrlApiAxiosParamCreator(configuration)
    return {
        /**
         * S3の署名付きURLを取得する
         * @summary S3の署名付きURLを取得する
         * @param {string} uid devise-token-auth用のuid
         * @param {string} accessToken devise-token-auth用のaccess-token
         * @param {string} client devise-token-auth用のclient
         * @param {number} userId ログイン中のユーザーのID
         * @param {string} fileName S3にアップロードする予定のファイルの名前
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getPresignedUrl(uid: string, accessToken: string, client: string, userId: number, fileName: string, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<GetPresignedUrlResponse>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.getPresignedUrl(uid, accessToken, client, userId, fileName, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
    }
};

/**
 * PresignedUrlApi - factory interface
 * @export
 */
export const PresignedUrlApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
    const localVarFp = PresignedUrlApiFp(configuration)
    return {
        /**
         * S3の署名付きURLを取得する
         * @summary S3の署名付きURLを取得する
         * @param {string} uid devise-token-auth用のuid
         * @param {string} accessToken devise-token-auth用のaccess-token
         * @param {string} client devise-token-auth用のclient
         * @param {number} userId ログイン中のユーザーのID
         * @param {string} fileName S3にアップロードする予定のファイルの名前
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getPresignedUrl(uid: string, accessToken: string, client: string, userId: number, fileName: string, options?: any): AxiosPromise<GetPresignedUrlResponse> {
            return localVarFp.getPresignedUrl(uid, accessToken, client, userId, fileName, options).then((request) => request(axios, basePath));
        },
    };
};

/**
 * PresignedUrlApi - object-oriented interface
 * @export
 * @class PresignedUrlApi
 * @extends {BaseAPI}
 */
export class PresignedUrlApi extends BaseAPI {
    /**
     * S3の署名付きURLを取得する
     * @summary S3の署名付きURLを取得する
     * @param {string} uid devise-token-auth用のuid
     * @param {string} accessToken devise-token-auth用のaccess-token
     * @param {string} client devise-token-auth用のclient
     * @param {number} userId ログイン中のユーザーのID
     * @param {string} fileName S3にアップロードする予定のファイルの名前
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof PresignedUrlApi
     */
    public getPresignedUrl(uid: string, accessToken: string, client: string, userId: number, fileName: string, options?: AxiosRequestConfig) {
        return PresignedUrlApiFp(this.configuration).getPresignedUrl(uid, accessToken, client, userId, fileName, options).then((request) => request(this.axios, this.basePath));
    }
}


/**
 * RecipesApi - axios parameter creator
 * @export
 */
export const RecipesApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * レシピ情報を登録する
         * @summary レシピ情報を登録する
         * @param {string} uid devise-token-auth用のuid
         * @param {string} accessToken devise-token-auth用のaccess-token
         * @param {string} client devise-token-auth用のclient
         * @param {CreateRecipeRequest} createRecipeRequest 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        createRecipe: async (uid: string, accessToken: string, client: string, createRecipeRequest: CreateRecipeRequest, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'uid' is not null or undefined
            assertParamExists('createRecipe', 'uid', uid)
            // verify required parameter 'accessToken' is not null or undefined
            assertParamExists('createRecipe', 'accessToken', accessToken)
            // verify required parameter 'client' is not null or undefined
            assertParamExists('createRecipe', 'client', client)
            // verify required parameter 'createRecipeRequest' is not null or undefined
            assertParamExists('createRecipe', 'createRecipeRequest', createRecipeRequest)
            const localVarPath = `/recipes`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'POST', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            if (uid !== undefined && uid !== null) {
                localVarHeaderParameter['uid'] = String(uid);
            }

            if (accessToken !== undefined && accessToken !== null) {
                localVarHeaderParameter['access-token'] = String(accessToken);
            }

            if (client !== undefined && client !== null) {
                localVarHeaderParameter['client'] = String(client);
            }


    
            localVarHeaderParameter['Content-Type'] = 'application/json';

            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
            localVarRequestOptions.data = serializeDataIfNeeded(createRecipeRequest, localVarRequestOptions, configuration)

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * 単一のレシピ情報を取得する
         * @summary 単一のレシピ情報を取得する
         * @param {number} recipeId レシピのID
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getRecipe: async (recipeId: number, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'recipeId' is not null or undefined
            assertParamExists('getRecipe', 'recipeId', recipeId)
            const localVarPath = `/recipes/{recipeId}`
                .replace(`{${"recipeId"}}`, encodeURIComponent(String(recipeId)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;


    
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
    }
};

/**
 * RecipesApi - functional programming interface
 * @export
 */
export const RecipesApiFp = function(configuration?: Configuration) {
    const localVarAxiosParamCreator = RecipesApiAxiosParamCreator(configuration)
    return {
        /**
         * レシピ情報を登録する
         * @summary レシピ情報を登録する
         * @param {string} uid devise-token-auth用のuid
         * @param {string} accessToken devise-token-auth用のaccess-token
         * @param {string} client devise-token-auth用のclient
         * @param {CreateRecipeRequest} createRecipeRequest 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async createRecipe(uid: string, accessToken: string, client: string, createRecipeRequest: CreateRecipeRequest, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<CreateResponse>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.createRecipe(uid, accessToken, client, createRecipeRequest, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
        /**
         * 単一のレシピ情報を取得する
         * @summary 単一のレシピ情報を取得する
         * @param {number} recipeId レシピのID
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getRecipe(recipeId: number, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<GetRecipeResponse>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.getRecipe(recipeId, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
    }
};

/**
 * RecipesApi - factory interface
 * @export
 */
export const RecipesApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
    const localVarFp = RecipesApiFp(configuration)
    return {
        /**
         * レシピ情報を登録する
         * @summary レシピ情報を登録する
         * @param {string} uid devise-token-auth用のuid
         * @param {string} accessToken devise-token-auth用のaccess-token
         * @param {string} client devise-token-auth用のclient
         * @param {CreateRecipeRequest} createRecipeRequest 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        createRecipe(uid: string, accessToken: string, client: string, createRecipeRequest: CreateRecipeRequest, options?: any): AxiosPromise<CreateResponse> {
            return localVarFp.createRecipe(uid, accessToken, client, createRecipeRequest, options).then((request) => request(axios, basePath));
        },
        /**
         * 単一のレシピ情報を取得する
         * @summary 単一のレシピ情報を取得する
         * @param {number} recipeId レシピのID
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getRecipe(recipeId: number, options?: any): AxiosPromise<GetRecipeResponse> {
            return localVarFp.getRecipe(recipeId, options).then((request) => request(axios, basePath));
        },
    };
};

/**
 * RecipesApi - object-oriented interface
 * @export
 * @class RecipesApi
 * @extends {BaseAPI}
 */
export class RecipesApi extends BaseAPI {
    /**
     * レシピ情報を登録する
     * @summary レシピ情報を登録する
     * @param {string} uid devise-token-auth用のuid
     * @param {string} accessToken devise-token-auth用のaccess-token
     * @param {string} client devise-token-auth用のclient
     * @param {CreateRecipeRequest} createRecipeRequest 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof RecipesApi
     */
    public createRecipe(uid: string, accessToken: string, client: string, createRecipeRequest: CreateRecipeRequest, options?: AxiosRequestConfig) {
        return RecipesApiFp(this.configuration).createRecipe(uid, accessToken, client, createRecipeRequest, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * 単一のレシピ情報を取得する
     * @summary 単一のレシピ情報を取得する
     * @param {number} recipeId レシピのID
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof RecipesApi
     */
    public getRecipe(recipeId: number, options?: AxiosRequestConfig) {
        return RecipesApiFp(this.configuration).getRecipe(recipeId, options).then((request) => request(this.axios, this.basePath));
    }
}


