// 用户信息存储类型
export interface UserInfo {
  /** 唯一标识 */
  id?: number;
  /** 头像url */
  avatar: string;
  /** 用户名 */
  username: string;
  /** 学校 */
  school: string;
  /** 学院 */
  college: string;
  /** 学号 */
  studentId: string;
}
