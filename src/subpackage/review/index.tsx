import './index.scss';
import withDoorGuard from '@/common/hoc';
import { View } from '@tarojs/components';
import { useState, useEffect } from 'react';
import Picture from '@/common/components/Picture';
import { ScrollView } from '@tarojs/components';
import { get } from '@/common/api/request';
import NoticePageNull from '@/modules/EmptyComponent/components/noticepagenull';
import { activeColor, holdertype } from '@/common/const/Formconst';
import { NavigationBarBack } from '@/common/components/NavigationBar';

export interface ActiveItem {
  id: string;
  title: string;
  introduce: string;
  type: string;
  isChecking: string;
  holderType: string;
  ifRegister: string;
  showImg: string[];
  detailTime: {
    startTime: string;
    endTime: string;
  };
}

interface PostItem {
  id: string;
  title: string;
  introduce: string;
  isChecking: string;
  showImg: string[];
  publishTime: string;
}

type ReviewItem =
  | (ActiveItem & { reviewType: 'activity'; sortTime: number })
  | (PostItem & { reviewType: 'post'; sortTime: number });

interface CheckingResponse {
  Acts?: ActiveItem[];
  Posts?: PostItem[];
}

const getTimeStamp = (time: string) => {
  const timeStamp = new Date(time.replace(' ', 'T')).getTime();
  return Number.isNaN(timeStamp) ? 0 : timeStamp;
};

const normalizeReviewItems = (data: CheckingResponse): ReviewItem[] => {
  const activities: ReviewItem[] = (data.Acts || []).map((item) => ({
    ...item,
    reviewType: 'activity',
    sortTime: getTimeStamp(item.detailTime?.startTime || ''),
  }));
  const posts: ReviewItem[] = (data.Posts || []).map((item) => ({
    ...item,
    reviewType: 'post',
    sortTime: getTimeStamp(item.publishTime || ''),
  }));

  return [...activities, ...posts].sort((a, b) => b.sortTime - a.sortTime);
};

const Index = () => {
  const [reviewList, setReviewList] = useState<ReviewItem[]>([]);
  useEffect(() => {
    const fetchReviewItems = async () => {
      try {
        const res = await get('/user/checking');
        setReviewList(normalizeReviewItems(res.data || {}));
      } catch (err) {
        console.log(err);
        setReviewList([]);
      }
    };

    fetchReviewItems();
  }, []);
  const activestatus = new Map([
    ['pending_signers', ['待申报人同意', '#BBBCBE']],
    ['pending_auditor', ['待官方同意', '#BBBCBE']],
    ['checking', ['审核中', '#BBBCBE']],
    ['pass', ['发布成功', '#9DDB85']],
    ['reject', ['发布失败', '#F66565']],
  ]);
  return (
    <>
      <NavigationBarBack backgroundColor="#F9F8FC" title="详情" url="/pages/mineHome/index" />
      <View className="reviewPage">
        <ScrollView scrollY={true} className="reviewPage-scroll">
          {reviewList.length > 0 ? (
            reviewList.map((item) => (
              <View key={`${item.reviewType}-${item.id}`}>
                <View className="reviewPage-container">
                  <View className="reviewPage-headercontainer">
                    <View className="reviewPage-header">{item.title}</View>
                    <View
                      className="reviewPage-status"
                      style={{
                        backgroundColor: activestatus.get(item.isChecking)?.[1] || '#BBBCBE',
                      }}
                    >
                      {activestatus.get(item.isChecking)?.[0] || item.isChecking}
                    </View>
                  </View>
                  <View className="reviewPage-gapline1"></View>
                  <View className="reviewPage-content">{item.introduce}</View>
                  {item.reviewType === 'activity' && (
                    <View className="reviewPage-types">
                      <View className="reviewPage-types-holder">
                        {holdertype.get(item.holderType) || item.holderType}
                      </View>
                      <View
                        className="reviewPage-types-type"
                        style={
                          activeColor.get(item.type)
                            ? `background-color: ${activeColor.get(item.type)}`
                            : 'background-color: #bd96ee'
                        }
                      >
                        {item.type}
                      </View>
                    </View>
                  )}
                  <View className="reviewPage-pic">
                    {(item.showImg || []).map((item, index) => (
                      <Picture
                        key={index}
                        src={item}
                        isShowDelete={false}
                        imgUrl={[]}
                        setImgUrl={([]) => {}}
                      ></Picture>
                    ))}
                  </View>
                </View>
              </View>
            ))
          ) : (
            <NoticePageNull />
          )}
          <View style={{ height: '100rpx' }} />
        </ScrollView>
      </View>
    </>
  );
};

export default withDoorGuard(Index);
