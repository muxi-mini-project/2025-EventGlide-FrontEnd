import Taro from "@tarojs/taro";
import { switchTab } from "@tarojs/taro";
const preUrl = "https://api.inside-me.top"
import useUserStore from "@/store/userStore";
import usePostStore from "@/store/PostStore";

const handleUserLogin = async ({ params }) => {
    const { setId, setStudentId, setAvatar, setUsername, setSchool } = useUserStore.getState();
    const { setPostStudentId } = usePostStore.getState();
    const header = {
        'Content-Type': 'application/json;charset=utf-8',
    };
    const { studentid, password, setShowError } = params
    const url = `${preUrl}/user/login`
    const data = {
        studentid,
        password
    }
    const response = await Taro.request({
        method: "POST",
        url: url,
        header: header,
        data: JSON.stringify(data),
    })
    if (response.data.msg === "success") {
        console.log(response.data.data.token)
        Taro.setStorageSync('token', response.data.data.token)
        Taro.setStorageSync('sid', response.data.data.sid)
        setStudentId(response.data.data.sid)
        setId(response.data.data.Id)
        setAvatar(response.data.data.avatar)
        setUsername(response.data.data.username)
        setSchool(response.data.data.school)
        setPostStudentId(response.data.data.sid)
        switchTab({ url: '/pages/indexHome/index' })
    }
    else {
        Taro.showToast({
            title: response.data.msg,
            icon: 'none',
            duration: 2000
        })
        setShowError(true)
    }
}

export default handleUserLogin