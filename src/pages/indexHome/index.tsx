import { View, ScrollView } from "@tarojs/components";
import Active from "@/modules/activityItem/index";
import Taro from "@tarojs/taro";
import { useDidShow } from "@tarojs/taro";
// import ActiveList from "@/common/types/ActiveList";
import "./index.scss";
import Sticky from "@/modules/index-sticky/index";
import PostWindow from "@/modules/PostWindow";
import { useState } from "react";
import useActivityStore from "@/store/ActivityStore";
import { judgeDate } from "@/common/const/DateList";
import get from "@/common/api/get";
import useUserStore from "@/store/userStore";

const Index = () => {
  const [showPostWindow, setShowPostWindow] = useState(false);
  const [activityIndex, setActivityIndex] = useState(0);
  const activityList = useActivityStore((state) => state.activeList);
  const { setActiveList,  setSelectedItem } = useActivityStore();
  const [approximateTime, setApproximateTime] = useState<string>("");
  const [type, setType] = useState<string>("");
  // const { studentid } = useUserStore();
  const studentid = "2023214563";

  useDidShow(() => {
    get(`/act/all/${studentid}`)
      .then((res) => {
        setActiveList(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  });

  return (
    <>
      <ScrollView className="active" scrollY={true}>
        <View className="sticky-header">
          <Sticky
            setApproximateTime={setApproximateTime}
            setType={setType}
          ></Sticky>
        </View>
        <View className="sticky-item">
          {activityList===null?null:activityList.map((activeItem, index) => {
            const isMatch =
              (approximateTime === "" ||
                judgeDate(approximateTime, activeItem.detailTime)) &&
              (type === "" || activeItem.type === type);
            if (isMatch) {
              return (
                <View
                  key={index}
                  onClick={() => {
                    setActivityIndex(index);
                    setSelectedItem(activeItem);
                  }}
                >
                  <Active
                    key={index}
                    activeItem={activeItem}
                    setShowPostWindow={setShowPostWindow}
                  />
                </View>
              );
            }
            return null;
          })}
        </View>
      </ScrollView>
      {showPostWindow && (
        <PostWindow
          activityIndex={activityIndex}
          WindowType="active"
          setShowPostWindow={setShowPostWindow}
        ></PostWindow>
      )}
    </>
  );
};

export default Index;
