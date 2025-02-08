import { memo } from "react";
import { View } from "@tarojs/components";
import "./style.scss";
import MineActivityItem from "@/modules/mineActiveItem";
import { MineActivityList } from "@/common/types/ActiveList";

const MineActivity: React.FC<{ activeIndex: 'release' | 'favourite' }> = memo(function ({ activeIndex }) {
    const activeList: MineActivityList[] = new Array(10).fill({
        title: '为了让大家更好地了解该活动，请介绍一下活动内容',
        name: '校灵通',
        favorite: 111,
        comment: 111
    });
    return (
        <View className="mine-activity-page">
            {activeList.map((item, index) => {
                return (
                    <MineActivityItem
                        key={index}
                        title={item.title}
                        name={item.name}
                        favorite={item.favorite}
                        comment={item.comment}
                    />
                )
            })}
        </View>
    )
})

export default MineActivity;