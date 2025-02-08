import { View, PageContainer, ScrollView } from '@tarojs/components';
import React, { useState, useEffect, memo } from 'react';
import Taro from '@tarojs/taro';
import './style.scss';
import classnames from 'classnames';

const year = ["2025年", "2026年", "2027年", "2028年", "2029年", "2030年", "2031年", "2032年", "2033年", "2034年", "2035年", "2036年", "2037年", "2038年", "2039年", "2040年", "2041年", "2042年", "2043年", "2044年", "2045年", "2046年", "2047年", "2048年", "2049年", "2050年"]
const month = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
const day = ['1日', '2日', '3日', '4日', '5日', '6日', '7日', '8日', '9日', '10日', '11日', '12日', '13日', '14日', '15日', '16日', '17日', '18日', '19日', '20日', '21日', '22日', '23日', '24日', '25日', '26日', '27日', '28日', '29日', '30日', '31日']
const hour = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23']
const minute = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59']


const DatePickerItem: React.FC<any> = ({ activeIndex, setActiveIndex, px, list, type }) => {
    const handleScroll = (e) => {
        const scrollTop = e.detail.scrollTop;
        if (scrollTop % px(104) === 0) {
            setActiveIndex(Math.floor(scrollTop / px(104)));
        }
        else if (scrollTop % px(104) <= px(52)) {
            setActiveIndex(Math.floor(scrollTop / px(104)));
            Taro.nextTick(() => {
                Taro.createSelectorQuery()
                .select(`#scroll-view-${type}`)
                .node()
                .exec((res) => {
                    const scrollView = res[0].node;
                    if (scrollView) {
                        scrollView.scrollTo({
                            top: Math.floor(scrollTop / px(104)) * px(104),
                            duration: 300,
                            animated: true,
                        });
                    }
                });
            });
        }
        else if (scrollTop % px(104) > px(52) && scrollTop % px(104) < px(104)) {
            setActiveIndex(Math.floor(scrollTop / px(104)) + 1);
            Taro.nextTick(() => {
                Taro.createSelectorQuery()
                .select(`#scroll-view-${type}`)
                .node()
                .exec((res) => {
                    const scrollView = res[0].node;
                    if (scrollView) {
                        scrollView.scrollTo({
                            top: (Math.floor(scrollTop / px(104)) + 1) * px(104),
                            duration: 300,
                            animated: true,
                        });
                    }
                });
            });

        }
    };
    return (
        <ScrollView
            id={`scroll-view-${type}`}
            scrollY={true}
            className="Scrolled-content"
            usingSticky={true}
            enableFlex={true}
            scrollWithAnimation={true}
            onScroll={(e) => handleScroll(e)}
            enhanced={true}
        >
            <View className="Scrolled-snap" id="Scrolled-pos"></View>
            <View className='Scrolled-item'></View>
            {list.map((item, index) => (
                <View
                    key={index}
                    className={classnames("Scrolled-item", { "active": activeIndex === index })}
                    id={`item-${index}`}
                >
                    {item}
                </View>
            ))}
            <View className='Scrolled-item'></View>
            <View className='Scrolled-item'></View>
        </ScrollView>
    )
}

const DatePicker: React.FC<any> = memo(({isVisiable, setIsVisiable}) => {

    const [activeYearIndex, setActiveYearIndex] = useState(0);
    const [activeMonthIndex, setActiveMonthIndex] = useState(0);
    const [activeDayIndex, setActiveDayIndex] = useState(0);
    const [activeHourIndex, setActiveHourIndex] = useState(0);
    const [activeMinuteIndex, setActiveMinuteIndex] = useState(0);
    const [screenWidth, setScreenWidth] = useState(0);

    useEffect(() => {
        const systemInfo = Taro.getWindowInfo();
        setScreenWidth(systemInfo.screenWidth);
    }, []);

    const rpx = (px) => {
        if (screenWidth === 0) return 0;
        return (px / screenWidth) * 750;
    };

    const px = (rpx) => {
        if (screenWidth === 0) return 0;
        return (rpx / 750) * screenWidth;
        // return Taro.pxTransform(rpx);
    };



    return (
        <>
            <View onClick={() => setIsVisiable(true)}>打开</View>
            <PageContainer show={isVisiable} overlay={true} customStyle="background-color:transparent;"
                onLeave={() => setIsVisiable(false)}>
                <View className="Scrolled-title">
                    <View className="Scrolled-title-text1" onClick={() => setIsVisiable(false)}>取消</View>
                    <View className="Scrolled-title-text2">选择时间</View>
                    <View className="Scrolled-title-text3" onClick={() => setIsVisiable(false)}>确定</View>
                </View>
                <View className="Scrolled-container">
                    <DatePickerItem
                        activeIndex={activeYearIndex}
                        setActiveIndex={setActiveYearIndex}
                        px={px}
                        list={year}
                        type="year"
                    />
                    <DatePickerItem
                        activeIndex={activeMonthIndex}
                        setActiveIndex={setActiveMonthIndex}
                        px={px}
                        list={month}
                        type="month"
                    />
                    <DatePickerItem
                        activeIndex={activeDayIndex}
                        setActiveIndex={setActiveDayIndex}
                        px={px}
                        list={day}
                        type="day"
                    />
                    <DatePickerItem
                        activeIndex={activeHourIndex}
                        setActiveIndex={setActiveHourIndex}
                        px={px}
                        list={hour}
                        type="hour"
                    />
                    <DatePickerItem
                        activeIndex={activeMinuteIndex}
                        setActiveIndex={setActiveMinuteIndex}
                        px={px}
                        list={minute}
                        type="minute"
                    />
                </View>
            </PageContainer>
        </>
    );
});

export default DatePicker;