import Taro from "@tarojs/taro";
const preUrl = "https://api.inside-me.top";
// const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyMDIzMjE0NTYzIiwiZXhwIjoxNzQyMjAwMTY2LCJqdGkiOiIwZTgzNTMzMi03YTQ3LTRmMGEtOGRlZC04YjlkMmY5ODNiMTEifQ.CFFXFE4A9PkMtuuFgBtqUfgxP5SZXL0oM6bS-3kpwcM"

const get =  async (url: string) => {
  const getToken = () => {
    return new Promise((resolve, reject) => {
      void Taro.getStorage({
        key: "token",
        success: (res) => resolve(res.data),
        fail: (err) => reject(err),
      })
    })
  }
  const token = await getToken();
    const header = {
        Authorization: `Bearer ${token}`,
        'Content-Type': "application/json;charset=UTF-8"
    };
    try {
        const response = await Taro.request({
            url: `${preUrl}${url}`,
            method: "GET",
            header,
        })
      if (response.data.msg === "success") {
            return response.data;
        }
    } catch (error) {
        console.log(error);
    }

};

export default get;