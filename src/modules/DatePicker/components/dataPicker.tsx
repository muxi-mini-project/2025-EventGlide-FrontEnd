import { View, PageContainer, ScrollView} from "@tarojs/components";
import React, { useState, useEffect, memo } from "react";
import "./style.scss";
import classnames from "classnames";

interface DateItem {
  label: string;
  subLabel: string;
  value: string;
  isToday?: boolean;
  isAll?: boolean;
}
interface CalendarDay {
  date: Date;
  day: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  dateString: string;
}

const generateTimeSlots = (): string[] => {
  const slots: string[] = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      slots.push(timeString);
    }
  }
  return slots;
};

const formatDateToYMD = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const parseYMDString = (dateString: string): Date => {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day);
};

const generateDateList = (selectedDate?: string, isInitial: boolean = false): DateItem[] => {
  const dates: DateItem[] = [];
  const baseDate = selectedDate ? parseYMDString(selectedDate) : new Date();
  
  const formatDateToYMD = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  if (isInitial) {
    for (let i = 0; i < 7; i++) {
      const date = new Date(baseDate);
      date.setDate(baseDate.getDate() + i);
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const weekDay = ['天', '一', '二', '三', '四', '五', '六'][date.getDay()];
      
      dates.push({
        label: `${month}-${day}`,
        subLabel: i === 0 ? '今天' : `星期${weekDay}`,
        value: formatDateToYMD(date),
        isToday: i === 0
      });
    }
  } else {
    const centerDate = selectedDate ? parseYMDString(selectedDate) : new Date();
    
    for (let i = -3; i <= 3; i++) {
      const date = new Date(centerDate);
      date.setDate(centerDate.getDate() + i);
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const weekDay = ['天', '一', '二', '三', '四', '五', '六'][date.getDay()];
      
      const isToday = formatDateToYMD(date) === formatDateToYMD(new Date());
      
      dates.push({
        label: `${month}-${day}`,
        subLabel: isToday ? '今天' : `星期${weekDay}`,
        value: formatDateToYMD(date),
        isToday: isToday
      });
    }
  }
  
  return dates;
};

const generateCalendar = (year: number, month: number, selectedDate: string): CalendarDay[] => {
  const days: CalendarDay[] = [];
  
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const firstDayOfWeek = firstDay.getDay();
  const prevMonthLastDay = new Date(year, month, 0).getDate();
  
  const today = new Date();
  const todayString = formatDateToYMD(today);

  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const date = new Date(year, month - 1, prevMonthLastDay - i);
    days.push({
      date,
      day: prevMonthLastDay - i,
      isCurrentMonth: false,
      isToday: false,
      isSelected: formatDateToYMD(date) === selectedDate,
      dateString: formatDateToYMD(date)
    });
  }

  for (let i = 1; i <= lastDay.getDate(); i++) {
    const date = new Date(year, month, i);
    const dateString = formatDateToYMD(date);
    days.push({
      date,
      day: i,
      isCurrentMonth: true,
      isToday: dateString === todayString,
      isSelected: dateString === selectedDate,
      dateString
    });
  }
  
  const totalCells = 42;
  const nextMonthDays = totalCells - days.length;
  for (let i = 1; i <= nextMonthDays; i++) {
    const date = new Date(year, month + 1, i);
    days.push({
      date,
      day: i,
      isCurrentMonth: false,
      isToday: false,
      isSelected: formatDateToYMD(date) === selectedDate,
      dateString: formatDateToYMD(date)
    });
  }
  
  return days;
};

const DatePicker: React.FC<any> = memo(
  ({
    isVisiable,
    setIsVisiable,
    handleConfirm,
  }) => {
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [selectedTime, setSelectedTime] = useState<string>('');
    const [showFullDatePicker, setShowFullDatePicker] = useState<boolean>(false);
    const [dateList, setDateList] = useState<DateItem[]>([]);
    const [timeSlots, setTimeSlots] = useState<string[]>([]);
    const [fullDateValue, setFullDateValue] = useState<string>('');
    const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear());
    const [currentMonth, setCurrentMonth] = useState<number>(new Date().getMonth());
    const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([]);

    useEffect(() => {
      setDateList(generateDateList(undefined, true));
      setTimeSlots(generateTimeSlots());
      
      const today = new Date().toISOString().split('T')[0];
      setSelectedDate(today);
      setFullDateValue(today);
      setSelectedTime('00:00');
      const now = new Date();
      setCurrentYear(now.getFullYear());
      setCurrentMonth(now.getMonth());
    }, []);


    useEffect(() => {
      if (showFullDatePicker) {
        const days = generateCalendar(currentYear, currentMonth, fullDateValue);
        setCalendarDays(days);
      }
    }, [currentYear, currentMonth, fullDateValue, showFullDatePicker]);

    const handleDateSelect = (date: DateItem) => {
      setSelectedDate(date.value);
    };

    const handleTimeSelect = (time: string) => {
      setSelectedTime(time);
    };

    const handleFullDateConfirm = () => {
      const newSelectedDate = fullDateValue;
      setSelectedDate(newSelectedDate);
      
      const today = new Date();
      const initialEndDate = new Date();
      initialEndDate.setDate(today.getDate() + 6);
      const selectedDateObj = new Date(newSelectedDate);
      
      const shouldUseInitialList = selectedDateObj >= today && selectedDateObj <= initialEndDate;
      const newDateList = generateDateList(
        shouldUseInitialList ? undefined : newSelectedDate, 
        shouldUseInitialList
      );
      setDateList(newDateList);
      
      setShowFullDatePicker(false);
    };

    const goToPrevMonth = () => {
      if (currentMonth === 0) {
        setCurrentYear(currentYear - 1);
        setCurrentMonth(11);
      } else {
        setCurrentMonth(currentMonth - 1);
      }
    };

    const goToNextMonth = () => {
      if (currentMonth === 11) {
        setCurrentYear(currentYear + 1);
        setCurrentMonth(0);
      } else {
        setCurrentMonth(currentMonth + 1);
      }
    };

    const selectCalendarDate = (dateString: string) => {
      setFullDateValue(dateString);
    };

    const onConfirm = () => {
      handleConfirm({
        date: selectedDate,
        time: selectedTime,
      });
      setIsVisiable(false);
    };

    const monthNames = [
      '一月', '二月', '三月', '四月', '五月', '六月',
      '七月', '八月', '九月', '十月', '十一月', '十二月'
    ];

    const weekDays = ['日', '一', '二', '三', '四', '五', '六'];

    return (
      <>
        <PageContainer
          show={isVisiable}
          overlay={true}
          customStyle="background-color:transparent;"
          onLeave={() => setIsVisiable(false)}
        >
          <View className="scrolled-title">
            <View className="scrolled-title-text">选择时间</View>
          </View>
          
          <View className="date-picker-layer">
            <ScrollView 
              scrollX 
              className="date-scroll-view"
              enhanced
              showScrollbar={false}
            >
              <View className="date-list">
                {dateList.map((date, index) => (
                  <View
                    key={index}
                    className={classnames('date-item', {
                      'active': selectedDate === date.value
                    })}
                    onClick={() => handleDateSelect(date)}
                  >
                   {date.subLabel && (
                      <View className="date-sublabel">{date.subLabel}</View>
                    )}
                    <View className="date-label">{date.label}</View>
                  </View>
                ))}
              </View>
            </ScrollView>
            <View 
              className="all-date"
              onClick={() => setShowFullDatePicker(true)}
            >
              <View className="all-date-label">全部日期</View>
            </View>
          </View>

          <View className="time-picker-layer">
            <View className="time-grid">
              {timeSlots.map((time, index) => (
                <View
                  key={index}
                  className={classnames('time-slot', {
                    'active': selectedTime === time
                  })}
                  onClick={() => handleTimeSelect(time)}
                >
                  {time}
                </View>
              ))}
            </View>
          </View>

          <View className="confirm">
            <View
              className="confirm-btn"
              onClick={onConfirm}
            >
                确定
            </View>            
          </View>
        </PageContainer>
        
        {showFullDatePicker && (
          <View className="full-date-picker">
            <View className="scrolled-title">
              <View
                className="scrolled-title-text1"
                onClick={() => setShowFullDatePicker(false)}
              >
                取消
              </View>
              <View className="scrolled-title-text2">选择日期</View>
              <View
                className="scrolled-title-text3"
                onClick={handleFullDateConfirm}
              >
                确定
              </View>
            </View>
            
            <View className="calendar-header">
              <View className="nav-button prev" onClick={goToPrevMonth}>
                &lt;
              </View>
              <View className="month-year">
                {currentYear}年 {monthNames[currentMonth]}
              </View>
              <View className="nav-button next" onClick={goToNextMonth}>
                &gt;
              </View>
            </View>
            
            <View className="week-days">
              {weekDays.map((day, index) => (
                <View key={index} className="week-day">
                  {day}
                </View>
              ))}
            </View>
            
            <View className="calendar-days">
              {calendarDays.map((day, index) => (
                <View
                  key={index}
                  className={classnames('calendar-day', {
                    'current-month': day.isCurrentMonth,
                    'today': day.isToday,
                    'selected': day.isSelected
                  })}
                  onClick={() => selectCalendarDate(day.dateString)}
                >
                  <View className="day-number">{day.day}</View>
                  {day.isToday && <View className="today-indicator"></View>}
                </View>
              ))}
            </View>
          </View>          
        )
        }
      </>
    );
  },
);

export default DatePicker;