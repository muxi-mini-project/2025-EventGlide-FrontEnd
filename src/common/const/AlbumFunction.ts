import Taro, { navigateTo } from "@tarojs/taro";
import { fetchToQiniu } from "../api/qiniu";
import post from "../api/post";
import useUserStore from "@/store/userStore";
type AlbumFunctionProps = {
  setIsVisiable: (isVisiable: boolean) => void;
  setImgUrl: (imgUrl: string[]) => void;
  imgUrl: string[];
  count: number;
  url: string;
  isAlbum: boolean;
  isRequest?: boolean;
};

const handleChooseImage = ({
  setIsVisiable,
  setImgUrl,
  imgUrl,
  count,
  url,
  isAlbum,
  isRequest = false,
}: AlbumFunctionProps) => {
  const { studentid: studentId, setAvatar } = useUserStore.getState();
  Taro.chooseImage({
    count: count,
    sizeType: ["original", "compressed"],
    sourceType: isAlbum ? ["album"] : ["camera"],
    success: async (res) => {
      let newImgUrl: string[] = [...imgUrl];

      for (const filePath of res.tempFilePaths) {
        const qiniuUrl = await fetchToQiniu(filePath);
        if (qiniuUrl) newImgUrl.push(qiniuUrl as string);
      }

      if (isRequest) {
        newImgUrl = newImgUrl.filter((item) => !imgUrl.includes(item));
        console.log(newImgUrl[0]);
        const response = await post("/user/avatar", {
          avatar_url: newImgUrl[0],
          studentid: studentId,
        });
        if (response.msg === "success") {
          setImgUrl(newImgUrl);
          setAvatar(newImgUrl[0]);
        }
      } else setImgUrl(newImgUrl);
      setIsVisiable(false);
      console.log(url);
      if (url !== "") navigateTo({ url: url });
    },
    fail: (err) => {
      Taro.showToast({
        title: err.errMsg,
        icon: "none",
        duration: 2000,
      });
      console.error(err);
    },
  });
};

export { handleChooseImage };
