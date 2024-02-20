/* export const useApi = () => {
  const api = axios.create({
    baseURL: import.meta.env.VITE_API
  })

  return { api }
}

const { api } = useApi()
api.get()
api.post('/login')
 */
// ----------------------------------------------------------------

// 定義一個名為 useApi 的 Vue Composition API 函式，用於處理 API 相關的邏輯
export const useApi = () => {
  // 創建一個名為 api 的 axios 實例，設定基本的 API 路徑為 VITE_API 環境變數的值
  const api = axios.create({
    baseURL: import.meta.env.VITE_API,
  });

  // 定義名為 login 的 API 請求，使用 POST 方法發送至 '/user/login' 路徑
  const login = api.post('/user/login');

  // 定義名為 register 的函式，用於註冊新用戶，接收一個 form 參數，使用 POST 方法發送至 '/user/register' 路徑
  const register = (form) => {
    return api.post('/user/register', form);
  };

  // 返回 login 和 register 函式，使其可以在外部被使用
  return { login, register };
};

// 使用 useApi 函式，獲取 login 和 register 函式
const { login, register } = useApi();

// 使用 register 函式發送註冊請求，傳遞一個空的物件作為註冊表單
register({});

簡而言之，這個程式碼是一個可重複使用的 API 處理工具，將 API 相關的邏輯封裝在 useApi 函式中，然後在其他地方使用 useApi 函式獲取 login 和 register 函式，以方便發送登入和註冊請求。


<!-- -------------------------------------------------- -->
這段程式碼使用了 Axios 的攔截器 (interceptors)，在每次發送請求前對請求進行設定。

// 假設 apiAuth 是一個 Axios 實例
// useUserStore() 是一個用來獲取使用者資訊的函數或方法

// 攔截器的作用是在每次發送請求前進行額外的處理
apiAuth.interceptors.request.use(config => {
  // 使用 useUserStore() 取得使用者資訊
  const user = useUserStore();

  // 在請求的 header 中添加授權信息，這裡假設使用 Bearer Token 方式
  config.headers.Authorization = 'Bearer ' + user.token;

  // 返回修改後的請求配置，使其繼續進行
  return config;
});

簡單來說，這段程式碼用來在每次發送請求前，將使用者的驗證 token 放入請求的 header 中，以確保伺服器可以驗證使用者身份。這是一種在前端應用中常見的做法，特別是當使用者需要透過驗證來訪問受保護的資源時。

config.headers.Authorization = 'Bearer ' + user.token;
這行程式碼是在 Axios 請求的配置中，將授權 (Authorization) 的標頭 (header) 設置為使用 Bearer Token 方式進行身份驗證。這通常用於需要身份驗證的 API 請求。

config.headers 是 Axios 請求配置中的標頭部分。
Authorization 是 HTTP 標頭的一部分，用於在請求中包含身份驗證信息。
'Bearer ' + user.token 是一個字串，其中 'Bearer ' 是一種通用的身份驗證標準，後接著實際的使用者令牌 (token)。
Bearer Token 是一種常見的身份驗證標準，特別用於 OAuth 2.0 身份驗證流程。當你發送這樣的請求時，伺服器會檢查該令牌以確保該請求是由合法且已驗證的使用者發送的。

<!-- --------------------------------------------------------------------------------------------------------------- -->
這段程式碼是使用 Axios 的 response 拦截器，用來處理 API 請求的回應。以下是對這段程式碼的中文解釋：

apiAuth.interceptors.response 設定了 Axios 的 response 拦截器，這將在每次 API 請求的回應被接收時執行。
apiAuth.interceptors.response((res) => {

  // 成功時直接回傳，原本是什麼就回傳什麼
  成功時，拦截器直接返回回應對象 res，保持原樣
  return res

}, (error) => {
  失敗時，拦截器會先輸出錯誤訊息到控制台 (console.log(error))
  console.log(error)

  // 如果失敗有收到回應
  如果錯誤的回應 (error.response) 存在，表示收到了從伺服器返回的錯誤訊息。
  if (error.response) {

    // 如果是 jwt 過期，且不是舊換新請求
    在這裡，程式檢查如果錯誤訊息是 "JWT 過期"，且請求不是用於換取新的 JWT（'/users/extend' 請求），則進入條件內的邏輯。
    if (error.response.data.message === 'JWT 過期' && error.config.url !== '/users/extend') {

      const user = useUserStore()

      // 傳送舊換新請求
      程式碼向伺服器發送 apiAuth.patch('/users/extend') 請求，試圖換取新的 JWT。
      return apiAuth.patch('/users/extend')

        如果換取成功，更新使用者的 token，同時更新錯誤的請求配置中的 Authorization 標頭，然後重新發送原本的請求 (axios(error.config))。
        .then(({ data }) => {
          user.token = data.result
          error.config.headers.Authorization = 'Bearer ' + user.token
          return axios(error.config)
        })

        如果換取失敗，執行使用者的登出 (user.logout())，然後拒絕原本的錯誤 (Promise.reject(error))。
        .catch(() => {
          user.logout()
          return Promise.reject(error)
        })
    }
  }
  如果錯誤的回應不是 "JWT 過期"，或者是換取新 JWT 失敗，則直接拒絕原本的錯誤 (Promise.reject(error))。
  return Promise.reject(error)
})
總的來說，這段程式碼的目的是在 JWT 過期時，自動嘗試換取新的 JWT，以延長用戶的身份驗證。

<!-- --------------------------------------------------------------------------------------------------------------- -->
