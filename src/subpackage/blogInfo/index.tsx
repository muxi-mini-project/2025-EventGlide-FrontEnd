import { View, Image } from "@tarojs/components";
import { memo, useState } from "react";
import "./index.scss";
import LetterType from "@/common/types/LetterType";
import classnames from "classnames";
import get from "@/common/api/get";
import { useDidShow } from "@tarojs/taro";

const LetterListItem: React.FC<LetterType> = memo(({ ...props }) => {
  return (
    <View className="letter-list-item">
      <Image
        src={props.userInfo.avatar}
        mode="widthFix"
        className="letter-list-item-avatar"
        lazyLoad={true}
      ></Image>
      <View className="letter-list-item-content">
        <View className="letter-list-item-content-username">
          {props.userInfo.username}
        </View>
        <View className="letter-list-item-content-message">
          {props.message}
        </View>
        {/*<View className="letter-list-item-content-message">
          {props.published_at}
        </View>*/}
      </View>
      <Image
        mode="aspectFill"
        src={props.userInfo.avatar}
        className="letter-list-item-decPic"
      ></Image>
    </View>
  );
});

const Index = () => {
  const [isActive, setIsActive] = useState(true);
  const handleClick = (type: "favor" | "letter") => {
    setIsActive(!isActive);
    setShowPage(type);
  };
  const [showPage, setShowPage] = useState<"favor" | "letter">("favor");
  const [favor, setFavor] = useState<LetterType[]>([]);
  const [letter, setLetter] = useState<LetterType[]>([]);
  const [notice, setNotice] = useState(false);

  useDidShow(() => {
    get("/feed/list").then((res) => {
      console.log(res.data);
      const likes = res.data?.likes || [];
      const collects = res.data.collects || [];
      const mergedFavor = mergeSortedArrays(likes, collects);
      setFavor(mergedFavor);
      readnotice(mergedFavor);

      const comments = res.data?.comments || [];
      const ats = res.data.ats || [];
      const mergedLetter = mergeSortedArrays(comments, ats);
      setLetter(mergedLetter);
      if (mergedLetter[0] && mergedLetter[0].status === "未读") {
        setNotice(true);
      }
    }).catch((err) => {
      console.log(err);
    });
  });

  const mergeSortedArrays = (arr1: LetterType[], arr2: LetterType[]) => {
    const result: LetterType[] = [];
    let i = 0;
    let j = 0;

    while (i < arr1.length && j < arr2.length) {
      const date1 = parseDateSafely(arr1[i].published_at);
      const date2 = parseDateSafely(arr2[j].published_at);
      
      if (date1 <= date2) {
        result.push(arr1[i]);
        i++;
      } else {
        result.push(arr2[j]);
        j++;
      }
    }
    const mergedResult = result.concat(arr1.slice(i), arr2.slice(j));
    return mergedResult.reverse();
  };

  const parseDateSafely = (dateString: string): number => {
    if (!dateString || typeof dateString !== 'string') {
      return 0;
    }
    
    if (dateString.includes(' ') && dateString.match(/\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/)) {
      const safeDateString = dateString.replace(' ', 'T');
      return new Date(safeDateString).getTime();
    }
    return new Date(dateString).getTime();
  };

  const readnotice = (notices: string | any[]) => {
    for (let i = 0; i < notices.length; i++) {
      if (notices[i].status === "未读") {
        get(`/feed/read/detail/${notices[i].id}`).then((res) => {
          console.log(res.data);
        });
      }else{
        break;
      }
    }
  };

  return (
    <View className="blogInfo-page">
      <View className="blogInfo-page-header">
        <View
          onClick={() => handleClick("favor")}
          className={classnames("blogInfo-page-header-item", {
            activeItem: isActive,
          })}
        >
          赞和收藏
        </View>
        <View
          onClick={() => {
            handleClick("letter");
            setNotice(false);
            readnotice(letter);
          }}
          className={classnames("blogInfo-page-header-item", {
            activeItem: !isActive,
          })}
        >
          <View>评论和@</View>
          <View style={{
            display: notice ? "block" : "none",
            position: "absolute",
            width: "10rpx",
            height: "10rpx", 
            borderRadius: "5rpx", 
            backgroundColor: "#FF4D4F",
            right:0,
            top:0,
            marginRight: "90rpx",
            marginTop: "40rpx",
            }}/>
        </View>
      </View>
      <View className="blogInfo-page-content">
        {showPage === "favor" && 
          favor.map((item, index) => <LetterListItem key={index} {...item} />)}
        {showPage === "letter" &&
          letter.map((item, index) => <LetterListItem key={index} {...item} />)}
      </View>
    </View>
  );
};

export default Index;
