import './index.scss';
import withDoorGuard from '@/common/hoc';
import { View } from '@tarojs/components';
import { useState, useEffect } from 'react';
import Picture from '@/common/components/Picture';
import useActiveInfoStore from '@/store/activeInfoStore';
import isChecking from '@/common/assets/isChecking/isChecking1.png';
import alPost from '@/common/assets/isChecking/alPost.png';
import falPost from '@/common/assets/isChecking/falPost.png';
import { ScrollView } from '@tarojs/components';
import { get } from '@/common/api/request';
import NoticePageNull from '@/modules/EmptyComponent/components/noticepagenull';
import { activeColor, holdertype } from '@/common/const/Formconst';
import { NavigationBarBack } from '@/common/components/NavigationBar';

export interface ActiveItem {
  title: string;
  introduce: string;
  type: string;
  isChecking: string;
  holderType: string;
  ifRegister: string;
  showImg: string[];
}

const Index = () => {
  const { labelform } = useActiveInfoStore((state) => state);
  let signText = '无需报名';
  if (labelform.ifRegister === '是') signText = '需要报名';

  const [activeList, setActiveList] = useState<ActiveItem[]>([]);
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const res = await get('/act/own');
        console.log(res.data);
        setActiveList(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.log(err);
        setActiveList([]);
      }
    };

    fetchActivities();
  }, []);
  function getImg(items: String) {
    if (items === 'pending') return isChecking;
    if (items === 'rejected') return falPost;
    return alPost;
  }
  const activestatus = new Map([
    ['pending', ['审核中', '#BBBCBE']],
    ['approved', ['发布成功', '#9DDB85']],
    ['rejected', ['发布失败', '#F66565']],
  ]);
  return (
    <>
      <NavigationBarBack backgroundColor="#F9F8FC" title="详情" url="/pages/mineHome/index" />
      <View className="reviewPage">
        <ScrollView scrollY={true} style={{ height: '100vh' }}>
          {activeList.length > 0 ? (
            activeList.map((item, index) => (
              <View key={index}>
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
