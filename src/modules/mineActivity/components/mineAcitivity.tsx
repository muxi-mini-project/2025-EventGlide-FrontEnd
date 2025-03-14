import { memo, useEffect, useState } from "react";
import { View } from "@tarojs/components";
import "./style.scss";
import MineActivityItem from "@/modules/mineActiveItem";
import { MineActivityList } from "@/common/types/ActiveList";
import get from "@/common/api/get";
import post from "@/common/api/post";
import useUserStore from "@/store/userStore";

const MineActivity: React.FC<{
  activeIndex: "release" | "favourite";
  activePage: "activity" | "post";
}> = memo(function ({ activeIndex, activePage }) {
  // const { studentid } = useUserStore();
  const studentid = "2023214563";
  const [activeList, setActiveList] = useState<MineActivityList[]>([]);
  useEffect(() => {
    if (activeIndex === "release") {
      get(`/act/own/${studentid}`)
        .then((res) => {
          const newActiveList: MineActivityList[] = [];
          res.data.forEach((item) => {
            newActiveList.push({
              avatar: item.userInfo.avatar,
              title: item.title,
              name: item.userInfo.username,
              likes: item.likeNum,
              comment: item.commentNum,
              introduce: item.introduce,
              showImg: item.showImg,
              isLike: item.isLike,
              isCollect: item.isCollect,
            });
          });
          setActiveList(newActiveList);
        })
        .catch((err) => {
          console.log(err);
        });
    } else if (activeIndex === "favourite") {
      post("/user/collect/act", { studentid })
        .then((res) => {
          console.log(res);
          if (res.data === null) {
            setActiveList([]);
            return;
          }
          const newActiveList: MineActivityList[] = [];
          res.data.forEach((item) => {
            if (item.title !== "")
              newActiveList.push({
                avatar: item.userInfo.avatar,
                title: item.title,
                name: item.userInfo.username,
                likes: item.likeNum,
                comment: item.commentNum,
                introduce: item.introduce,
                showImg: item.showImg,
                isLike: item.isLike,
                isCollect: item.isCollect,
              });
          });
          setActiveList(newActiveList);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [activeIndex]);

  return (
    <View className="mine-activity-page">
      {activeList === null
        ? null
        : activeList.map((item, index) => {
            return (
              <MineActivityItem
                key={index}
                avatar={item.avatar}
                title={item.title}
                name={item.name}
                likes={item.likes}
                comment={item.comment}
                introduce={item.introduce}
                showImg={item.showImg}
                isLike={item.isLike}
                isCollect={item.isCollect}
              />
            );
          })}
    </View>
  );
});

export default MineActivity;
