import './index.scss';
import withDoorGuard from '@/common/hoc';
import { View, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useState, useEffect } from 'react';
import Picture from '@/common/components/Picture';
import { getMyActivityList } from '@/common/api/Activity';
import NoticePageNull from '@/modules/EmptyComponent/components/noticepagenull';
import { activeColor, holdertype } from '@/common/const/Formconst';
import { NavigationBarBack } from '@/common/components/NavigationBar';
import { ActivityDetailInfo } from '@/common/types';

const LIMIT = 10;
const BUFFER = 200;

const Index = () => {
  const [reviewList, setReviewList] = useState<ActivityDetailInfo[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  /*
   * 数据源用 /act/own：后端已放开它的审核过滤，返回本人「全部状态」的活动
   * （待签署 / 审核中 / 已发布 / 未通过），响应带 isChecking。
   * 之前用的 /user/checking 只返回审核中的子集，所以页面只能看到审核中的。
   */
  const fetchReviewItems = async (pageNum = 1, refresh = false) => {
    try {
      const res = await getMyActivityList('release', LIMIT, pageNum);
      const details = res.data?.details || [];
      setReviewList((prev) => (refresh ? details : [...prev, ...details]));
      setPage(pageNum);
      // /act/own 是分页返回的，按本页条数判断还有没有下一页
      setHasMore(details.length >= LIMIT);
    } catch (err) {
      console.log(err);
      if (refresh) setReviewList([]);
      setHasMore(false);
    }
  };

  useEffect(() => {
    fetchReviewItems(1, true);
  }, []);

  const loadMore = async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      await fetchReviewItems(page + 1, false);
    } finally {
      setLoading(false);
    }
  };

  const handleScroll = (e: any) => {
    const { scrollTop, scrollHeight } = e.detail;
    const windowHeight = Taro.getWindowInfo().windowHeight || 0;
    if (scrollHeight - (scrollTop + windowHeight) <= BUFFER) {
      loadMore();
    }
  };

  // 状态文案按后端对接文档映射：checking 是历史值，不再产生，并入「审核中」
  const activestatus = new Map([
    ['pending_signers', ['待签署', '#BBBCBE']],
    ['pending_auditor', ['审核中', '#BBBCBE']],
    ['checking', ['审核中', '#BBBCBE']],
    ['pass', ['已发布', '#9DDB85']],
    ['reject', ['未通过', '#F66565']],
  ]);

  return (
    <>
      <NavigationBarBack backgroundColor="#F9F8FC" title="详情" url="/pages/mineHome/index" />
      <View className="reviewPage">
        <ScrollView scrollY={true} className="reviewPage-scroll" onScroll={handleScroll}>
          {reviewList.length > 0 ? (
            reviewList.map((item) => (
              <View key={item.id}>
                <View className="reviewPage-container">
                  <View className="reviewPage-headercontainer">
                    <View className="reviewPage-header">{item.title}</View>
                    <View
                      className="reviewPage-status"
                      style={{
                        backgroundColor:
                          activestatus.get(item.isChecking || '')?.[1] || '#BBBCBE',
                      }}
                    >
                      {activestatus.get(item.isChecking || '')?.[0] || item.isChecking}
                    </View>
                  </View>
                  <View className="reviewPage-gapline1"></View>
                  <View className="reviewPage-content">{item.introduce}</View>
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
                  <View className="reviewPage-pic">
                    {(item.showImg || []).map((img, index) => (
                      <Picture
                        key={index}
                        src={img}
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